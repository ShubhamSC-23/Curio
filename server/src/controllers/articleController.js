const db = require('../config/database');
const { createSlug, createUniqueSlug } = require('../utils/slugify');
const { getPagination } = require('../utils/pagination');

// ============================================
// HELPER FUNCTION: Get Article with Translation
// ============================================
async function getArticleWithTranslation(article, lang = 'en') {
  // If requesting English or no translation needed, return original
  if (lang === 'en' || !lang) {
    return {
      ...article,
      translated: false,
      translation_language: null
    };
  }

  try {
    // Try to get translation
    const [translations] = await db.query(
      'SELECT * FROM article_translations WHERE article_id = ? AND language_code = ?',
      [article.article_id, lang]
    );

    if (translations.length > 0) {
      // Translation exists - merge with original article
      const translation = translations[0];
      return {
        ...article,
        title: translation.title,
        excerpt: translation.excerpt || article.excerpt,
        content: translation.content,
        slug: translation.slug,
        meta_description: translation.meta_description || article.meta_description,
        translated: true,
        translation_language: lang,
        original_slug: article.slug,
        original_title: article.title
      };
    }

    // No translation - return original with flag
    return {
      ...article,
      translated: false,
      translation_language: null
    };
  } catch (error) {
    console.error('Translation error:', error);
    return article; // Fallback to original
  }
}

/**
 * @desc    Get all published articles (with translation support)
 * @route   GET /api/v1/articles?lang=hi
 * @access  Public
 */
exports.getArticles = async (req, res, next) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      tag, 
      author, 
      search,
      featured,
      status = 'published',
      lang = 'en' // ✅ Language parameter
    } = req.query;

    let query = `
      SELECT 
        a.article_id, a.title, a.slug, a.excerpt, a.featured_image,
        a.reading_time, a.view_count, a.like_count, a.comment_count,
        a.published_at, a.created_at,
        u.username, u.full_name, u.profile_image,
        c.name as category_name, c.slug as category_slug
      FROM articles a
      INNER JOIN users u ON a.author_id = u.user_id
      LEFT JOIN categories c ON a.category_id = c.category_id
      WHERE a.status = ?
    `;

    const params = [status];

    // Filter by category
    if (category) {
      query += ' AND c.slug = ?';
      params.push(category);
    }

    // Filter by tag
    if (tag) {
      query += ` AND a.article_id IN (
        SELECT article_id FROM article_tags at
        INNER JOIN tags t ON at.tag_id = t.tag_id
        WHERE t.slug = ?
      )`;
      params.push(tag);
    }

    // Filter by author
    if (author) {
      query += ' AND u.username = ?';
      params.push(author);
    }

    // Search in title and excerpt
    if (search) {
      query += ' AND (a.title LIKE ? OR a.excerpt LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    // Filter featured articles
    if (featured === 'true') {
      query += ' AND a.is_featured = true';
    }

    // Get total count BEFORE adding pagination
    const countQuery = `SELECT COUNT(*) as total FROM (${query}) as counted`;
    const [countResult] = await db.query(countQuery, params);
    const total = (countResult && countResult[0]) ? countResult[0].total : 0;

    // Add sorting and pagination
    query += ' ORDER BY a.published_at DESC LIMIT ? OFFSET ?';
    
    const pagination = getPagination(page, limit, total);
    params.push(pagination.limit, pagination.offset);

    // Execute main query
    const [articles] = await db.query(query, params);

    // ✅ APPLY TRANSLATIONS TO ALL ARTICLES
    const translatedArticles = await Promise.all(
      articles.map(article => getArticleWithTranslation(article, lang))
    );

    res.json({
      success: true,
      count: translatedArticles.length,
      data: translatedArticles,
      pagination: {
        currentPage: pagination.page,
        itemsPerPage: pagination.limit,
        totalItems: total,
        totalPages: pagination.totalPages,
        hasNextPage: pagination.hasNextPage,
        hasPrevPage: pagination.hasPrevPage,
      },
      language: lang // ✅ Return language used
    });
  } catch (error) {
    console.error('Get articles error:', error);
    next(error);
  }
};

/**
 * @desc    Get single article by slug (with translation support)
 * @route   GET /api/v1/articles/:slug?lang=hi
 * @access  Public
 */
/**
 * @desc    Get single article by slug (with translation support) - FIXED GROUP BY
 * @route   GET /api/v1/articles/:slug?lang=hi
 * @access  Public
 */
exports.getArticle = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const { lang = 'en' } = req.query;

    // Decode URL-encoded slug (for Hindi/Marathi characters)
    const decodedSlug = decodeURIComponent(slug);

    // ✅ FIRST: Try to find by translated slug if not English
    if (lang !== 'en') {
      const [translatedArticles] = await db.query(
        `SELECT 
          a.*, 
          u.username, u.full_name, u.profile_image, u.bio,
          c.name as category_name, c.slug as category_slug,
          tr.title as translated_title,
          tr.excerpt as translated_excerpt,
          tr.content as translated_content,
          tr.slug as translated_slug,
          tr.meta_description as translated_meta_description,
          (SELECT GROUP_CONCAT(DISTINCT t.name) 
           FROM article_tags at 
           LEFT JOIN tags t ON at.tag_id = t.tag_id 
           WHERE at.article_id = a.article_id) as tags
        FROM articles a
        INNER JOIN article_translations tr ON a.article_id = tr.article_id
        INNER JOIN users u ON a.author_id = u.user_id
        LEFT JOIN categories c ON a.category_id = c.category_id
        WHERE tr.slug = ? AND tr.language_code = ?
        LIMIT 1`,
        [decodedSlug, lang]
      );

      if (translatedArticles.length > 0) {
        const article = translatedArticles[0];
        
        // Convert tags string to array
        article.tags = article.tags ? article.tags.split(',') : [];

        // ✅ ACCESS CONTROL LOGIC
        if (article.status === 'published') {
          // Increment view count (not for author)
          if (!req.user || req.user.user_id !== article.author_id) {
            await db.query(
              'UPDATE articles SET view_count = view_count + 1 WHERE article_id = ?',
              [article.article_id]
            );
            article.view_count = (article.view_count || 0) + 1;
          }

          // Return translated version
          return res.json({
            success: true,
            data: {
              ...article,
              title: article.translated_title,
              excerpt: article.translated_excerpt,
              content: article.translated_content,
              slug: article.translated_slug,
              meta_description: article.translated_meta_description || article.meta_description,
              translated: true,
              translation_language: lang,
              original_slug: article.slug,
              original_title: article.title
            }
          });
        }

        // Not published - check access
        if (
          req.user &&
          (req.user.user_id === article.author_id || req.user.role === 'admin')
        ) {
          return res.json({
            success: true,
            data: {
              ...article,
              title: article.translated_title,
              excerpt: article.translated_excerpt,
              content: article.translated_content,
              slug: article.translated_slug,
              meta_description: article.translated_meta_description || article.meta_description,
              translated: true,
              translation_language: lang,
              original_slug: article.slug,
              original_title: article.title
            }
          });
        }

        return res.status(403).json({
          success: false,
          message: 'You are not allowed to view this article'
        });
      }
    }

    // ✅ SECOND: Try original slug (both encoded and decoded)
    const [articles] = await db.query(
      `SELECT 
        a.*, 
        u.username, u.full_name, u.profile_image, u.bio,
        c.name as category_name, c.slug as category_slug,
        GROUP_CONCAT(DISTINCT t.name) as tags
      FROM articles a
      INNER JOIN users u ON a.author_id = u.user_id
      LEFT JOIN categories c ON a.category_id = c.category_id
      LEFT JOIN article_tags at ON a.article_id = at.article_id
      LEFT JOIN tags t ON at.tag_id = t.tag_id
      WHERE (a.slug = ? OR a.slug = ?)
      GROUP BY a.article_id, u.user_id, u.username, u.full_name, u.profile_image, u.bio,
               c.category_id, c.name, c.slug`,
      [slug, decodedSlug]
    );

    if (articles.length === 0) {
      // ✅ THIRD: Try searching translated slugs with original slug - FIXED GROUP BY
      const [translatedArticles] = await db.query(
        `SELECT 
          a.*, 
          u.username, u.full_name, u.profile_image, u.bio,
          c.name as category_name, c.slug as category_slug,
          tr.title as translated_title,
          tr.excerpt as translated_excerpt,
          tr.content as translated_content,
          tr.slug as translated_slug,
          tr.language_code,
          tr.meta_description as translated_meta_description,
          (SELECT GROUP_CONCAT(DISTINCT t.name) 
           FROM article_tags at 
           LEFT JOIN tags t ON at.tag_id = t.tag_id 
           WHERE at.article_id = a.article_id) as tags
        FROM articles a
        INNER JOIN article_translations tr ON a.article_id = tr.article_id
        INNER JOIN users u ON a.author_id = u.user_id
        LEFT JOIN categories c ON a.category_id = c.category_id
        WHERE (tr.slug = ? OR tr.slug = ?)
        LIMIT 1`,
        [slug, decodedSlug]
      );

      if (translatedArticles.length > 0) {
        const article = translatedArticles[0];
        article.tags = article.tags ? article.tags.split(',') : [];

        // Check if published
        if (article.status === 'published') {
          // Increment view count
          if (!req.user || req.user.user_id !== article.author_id) {
            await db.query(
              'UPDATE articles SET view_count = view_count + 1 WHERE article_id = ?',
              [article.article_id]
            );
            article.view_count = (article.view_count || 0) + 1;
          }

          return res.json({
            success: true,
            data: {
              ...article,
              title: article.translated_title,
              excerpt: article.translated_excerpt,
              content: article.translated_content,
              slug: article.translated_slug,
              meta_description: article.translated_meta_description || article.meta_description,
              translated: true,
              translation_language: article.language_code,
              original_slug: article.slug,
              original_title: article.title
            }
          });
        }

        // Check access for unpublished
        if (req.user && (req.user.user_id === article.author_id || req.user.role === 'admin')) {
          return res.json({
            success: true,
            data: {
              ...article,
              title: article.translated_title,
              excerpt: article.translated_excerpt,
              content: article.translated_content,
              slug: article.translated_slug,
              translated: true,
              translation_language: article.language_code
            }
          });
        }

        return res.status(403).json({
          success: false,
          message: 'You are not allowed to view this article'
        });
      }

      // Not found anywhere
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    const article = articles[0];

    // Convert tags string to array
    article.tags = article.tags ? article.tags.split(',') : [];

    // ✅ ACCESS CONTROL LOGIC
    if (article.status === 'published') {
      // Increment view count (not for author)
      if (!req.user || req.user.user_id !== article.author_id) {
        await db.query(
          'UPDATE articles SET view_count = view_count + 1 WHERE article_id = ?',
          [article.article_id]
        );
        article.view_count = (article.view_count || 0) + 1;
      }

      // Get translation if requested
      const translatedArticle = await getArticleWithTranslation(article, lang);

      return res.json({
        success: true,
        data: translatedArticle
      });
    }

    // If NOT published → allow only author or admin
    if (
      req.user &&
      (req.user.user_id === article.author_id || req.user.role === 'admin')
    ) {
      const translatedArticle = await getArticleWithTranslation(article, lang);
      return res.json({
        success: true,
        data: translatedArticle
      });
    }

    // Otherwise block access
    return res.status(403).json({
      success: false,
      message: 'You are not allowed to view this article'
    });

  } catch (error) {
    console.error('Get article error:', error);
    next(error);
  }
};


/**
 * @desc    Create new article
 * @route   POST /api/v1/articles
 * @access  Private (Author/Admin)
 */
exports.createArticle = async (req, res, next) => {
  try {
    const {
      title,
      excerpt,
      content,
      category_id,
      featured_image,
      tags,
      status = 'draft'
    } = req.body;

    // Validation
    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Title and content are required'
      });
    }

    // Generate slug
    const checkSlugExists = async (slug) => {
      const [result] = await db.query(
        'SELECT article_id FROM articles WHERE slug = ?',
        [slug]
      );
      return result.length > 0;
    };

    const slug = await createUniqueSlug(title, checkSlugExists);

    // Calculate reading time (assuming 200 words per minute)
    const wordCount = content.split(/\s+/).length;
    const reading_time = Math.ceil(wordCount / 200);

    // Insert article
    const [result] = await db.query(
      `INSERT INTO articles 
        (author_id, category_id, title, slug, excerpt, content, featured_image, reading_time, status, published_at, default_language)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.user.user_id,
        category_id || null,
        title,
        slug,
        excerpt || null,
        content,
        featured_image || null,
        reading_time,
        status,
        status === 'published' ? new Date() : null,
        'en' // ✅ Default language
      ]
    );

    const articleId = result.insertId;

    // Insert tags if provided
    if (tags && Array.isArray(tags) && tags.length > 0) {
      for (const tagName of tags) {
        // Get or create tag
        let [tagResult] = await db.query(
          'SELECT tag_id FROM tags WHERE name = ?',
          [tagName]
        );

        let tagId;
        if (tagResult.length === 0) {
          const tagSlug = createSlug(tagName);
          const [newTag] = await db.query(
            'INSERT INTO tags (name, slug) VALUES (?, ?)',
            [tagName, tagSlug]
          );
          tagId = newTag.insertId;
        } else {
          tagId = tagResult[0].tag_id;
        }

        // Link tag to article
        await db.query(
          'INSERT INTO article_tags (article_id, tag_id) VALUES (?, ?)',
          [articleId, tagId]
        );
      }
    }

    // Get the created article
    const [articles] = await db.query(
      'SELECT * FROM articles WHERE article_id = ?',
      [articleId]
    );

    res.status(201).json({
      success: true,
      message: 'Article created successfully',
      data: articles[0]
    });
  } catch (error) {
    console.error('Create article error:', error);
    next(error);
  }
};

/**
 * @desc    Update article
 * @route   PUT /api/v1/articles/:id
 * @access  Private (Author/Admin - own articles only)
 */
exports.updateArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      excerpt,
      content,
      category_id,
      featured_image,
      tags,
      status
    } = req.body;

    // Check if article exists and belongs to user
    const [articles] = await db.query(
      'SELECT * FROM articles WHERE article_id = ?',
      [id]
    );

    if (articles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    const article = articles[0];

    // Check ownership (admin can edit any article)
    if (req.user.role !== 'admin' && article.author_id !== req.user.user_id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this article'
      });
    }

    // Prepare update fields
    const updateFields = {};
    if (title) updateFields.title = title;
    if (excerpt !== undefined) updateFields.excerpt = excerpt;
    if (content) updateFields.content = content;
    if (category_id !== undefined) updateFields.category_id = category_id;
    if (featured_image !== undefined) updateFields.featured_image = featured_image;
    if (status) updateFields.status = status;

    // Update slug if title changed
    if (title && title !== article.title) {
      const checkSlugExists = async (slug) => {
        const [result] = await db.query(
          'SELECT article_id FROM articles WHERE slug = ? AND article_id != ?',
          [slug, id]
        );
        return result.length > 0;
      };
      updateFields.slug = await createUniqueSlug(title, checkSlugExists);
    }

    // Recalculate reading time if content changed
    if (content) {
      const wordCount = content.split(/\s+/).length;
      updateFields.reading_time = Math.ceil(wordCount / 200);
    }

    // Set published_at if status changed to published
    if (status === 'published' && article.status !== 'published') {
      updateFields.published_at = new Date();
    }

    // Build update query
    const updateKeys = Object.keys(updateFields);
    if (updateKeys.length > 0) {
      const setClause = updateKeys.map(key => `${key} = ?`).join(', ');
      const values = updateKeys.map(key => updateFields[key]);

      await db.query(
        `UPDATE articles SET ${setClause} WHERE article_id = ?`,
        [...values, id]
      );
    }

    // Update tags if provided
    if (tags && Array.isArray(tags)) {
      // Remove old tags
      await db.query('DELETE FROM article_tags WHERE article_id = ?', [id]);

      // Add new tags
      for (const tagName of tags) {
        let [tagResult] = await db.query(
          'SELECT tag_id FROM tags WHERE name = ?',
          [tagName]
        );

        let tagId;
        if (tagResult.length === 0) {
          const tagSlug = createSlug(tagName);
          const [newTag] = await db.query(
            'INSERT INTO tags (name, slug) VALUES (?, ?)',
            [tagName, tagSlug]
          );
          tagId = newTag.insertId;
        } else {
          tagId = tagResult[0].tag_id;
        }

        await db.query(
          'INSERT INTO article_tags (article_id, tag_id) VALUES (?, ?)',
          [id, tagId]
        );
      }
    }

    // Get updated article
    const [updatedArticles] = await db.query(
      'SELECT * FROM articles WHERE article_id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Article updated successfully',
      data: updatedArticles[0]
    });
  } catch (error) {
    console.error('Update article error:', error);
    next(error);
  }
};

/**
 * @desc    Delete article
 * @route   DELETE /api/v1/articles/:slug
 * @access  Private (Author/Admin - own articles only)
 */
exports.deleteArticle = async (req, res, next) => {
  try {
    const { slug } = req.params;

    // Find article by slug
    const [articles] = await db.query(
      'SELECT * FROM articles WHERE slug = ?',
      [slug]
    );

    if (articles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    const article = articles[0];

    // Check ownership
    if (req.user.role !== 'admin' && article.author_id !== req.user.user_id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this article'
      });
    }

    // Delete using article_id internally (safer for relations)
    // ✅ Translations will cascade delete automatically
    await db.query(
      'DELETE FROM articles WHERE article_id = ?',
      [article.article_id]
    );

    res.json({
      success: true,
      message: 'Article deleted successfully'
    });

  } catch (error) {
    console.error('Delete article error:', error);
    next(error);
  }
};


/**
 * @desc    Like/Unlike article
 * @route   POST /api/v1/articles/:id/like
 * @access  Private
 */
exports.likeArticle = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if already liked
    const [existing] = await db.query(
      'SELECT * FROM article_likes WHERE article_id = ? AND user_id = ?',
      [id, req.user.user_id]
    );

    if (existing.length > 0) {
      // Unlike
      await db.query(
        'DELETE FROM article_likes WHERE article_id = ? AND user_id = ?',
        [id, req.user.user_id]
      );

      return res.json({
        success: true,
        message: 'Article unliked',
        liked: false
      });
    } else {
      // Like
      await db.query(
        'INSERT INTO article_likes (article_id, user_id) VALUES (?, ?)',
        [id, req.user.user_id]
      );

      return res.json({
        success: true,
        message: 'Article liked',
        liked: true
      });
    }
  } catch (error) {
    console.error('Like article error:', error);
    next(error);
  }
};

/**
 * @desc    Bookmark/Unbookmark article
 * @route   POST /api/v1/articles/:id/bookmark
 * @access  Private
 */
exports.bookmarkArticle = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if already bookmarked
    const [existing] = await db.query(
      'SELECT * FROM bookmarks WHERE article_id = ? AND user_id = ?',
      [id, req.user.user_id]
    );

    if (existing.length > 0) {
      // Remove bookmark
      await db.query(
        'DELETE FROM bookmarks WHERE article_id = ? AND user_id = ?',
        [id, req.user.user_id]
      );

      return res.json({
        success: true,
        message: 'Bookmark removed',
        bookmarked: false
      });
    } else {
      // Add bookmark
      await db.query(
        'INSERT INTO bookmarks (article_id, user_id) VALUES (?, ?)',
        [id, req.user.user_id]
      );

      return res.json({
        success: true,
        message: 'Article bookmarked',
        bookmarked: true
      });
    }
  } catch (error) {
    console.error('Bookmark article error:', error);
    next(error);
  }
};



/**
 * @desc    Get articles from users you follow (with translation support)
 * @route   GET /api/v1/articles/following-feed?lang=hi
 * @access  Private
 */
exports.getFollowingFeed = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;
    const lang = req.query.lang || 'en'; // ✅ Language parameter

    const query = `
      SELECT 
        a.article_id, a.title, a.slug, a.excerpt, a.featured_image,
        a.reading_time, a.view_count, a.like_count, a.published_at,
        u.user_id, u.username, u.full_name, u.profile_image,
        c.category_id, c.name as category_name, c.slug as category_slug
      FROM articles a
      INNER JOIN users u ON a.author_id = u.user_id
      INNER JOIN follows f ON a.author_id = f.following_id
      LEFT JOIN categories c ON a.category_id = c.category_id
      WHERE f.follower_id = ? AND a.status = 'published'
      ORDER BY a.published_at DESC
      LIMIT ? OFFSET ?
    `;

    const [articles] = await db.query(query, [userId, limit, offset]);

    // ✅ APPLY TRANSLATIONS
    const translatedArticles = await Promise.all(
      articles.map(article => getArticleWithTranslation(article, lang))
    );

    // Get total count
    const [countResult] = await db.query(
      `SELECT COUNT(*) as total 
       FROM articles a
       INNER JOIN follows f ON a.author_id = f.following_id
       WHERE f.follower_id = ? AND a.status = 'published'`,
      [userId]
    );

    const total = countResult[0].total;

    res.json({
      success: true,
      count: translatedArticles.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: translatedArticles,
      language: lang // ✅ Return language used
    });
  } catch (error) {
    console.error('Get following feed error:', error);
    next(error);
  }
};


/**
 * @desc    Get like status
 * @route   GET /api/v1/articles/:id/like-status
 * @access  Private
 */
exports.getLikeStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Safety check (even though route uses protect)
    if (!req.user) {
      return res.json({
        success: true,
        data: {
          isLiked: false
        }
      });
    }

    const userId = req.user.user_id;

    const [likes] = await db.query(
      'SELECT * FROM article_likes WHERE article_id = ? AND user_id = ?',
      [id, userId]
    );

    res.json({
      success: true,
      data: {
        isLiked: likes.length > 0
      }
    });

  } catch (error) {
    console.error('Get like status error:', error);
    next(error);
  }
};



/**
 * @desc    Report article
 * @route   POST /api/v1/articles/:id/report
 * @access  Private
 */
exports.reportArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const userId = req.user.user_id;

    if (!reason || !reason.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Report reason is required'
      });
    }

    // Check if already reported
    const [existing] = await db.query(
      'SELECT * FROM article_reports WHERE article_id = ? AND user_id = ?',
      [id, userId]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'You have already reported this article'
      });
    }

    // Insert report
    await db.query(
      'INSERT INTO article_reports (article_id, user_id, reason) VALUES (?, ?, ?)',
      [id, userId, reason.trim()]
    );

    res.json({
      success: true,
      message: 'Article reported successfully'
    });
  } catch (error) {
    next(error);
  }
};