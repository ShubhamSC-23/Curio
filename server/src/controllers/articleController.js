const db = require('../config/database');
const { createSlug, createUniqueSlug } = require('../utils/slugify');
const { getPagination } = require('../utils/pagination');

/**
 * @desc    Get all published articles
 * @route   GET /api/v1/articles
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
      status = 'published' 
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

    // INITIALIZE params array HERE at the beginning
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

    res.json({
      success: true,
      count: articles.length,
      data: articles,
      pagination: {
        currentPage: pagination.page,
        itemsPerPage: pagination.limit,
        totalItems: total,
        totalPages: pagination.totalPages,
        hasNextPage: pagination.hasNextPage,
        hasPrevPage: pagination.hasPrevPage,
      },
    });
  } catch (error) {
    console.error('Get articles error:', error);
    next(error);
  }
};

/**
 * @desc    Get single article by slug
 * @route   GET /api/v1/articles/:slug
 * @access  Public
 */
exports.getArticle = async (req, res, next) => {
  try {
    const { slug } = req.params;

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
      WHERE a.slug = ?
      GROUP BY a.article_id`,
      [slug]
    );

    if (articles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    const article = articles[0];

    // Convert tags string to array
    article.tags = article.tags ? article.tags.split(',') : [];

    // ✅ ACCESS CONTROL LOGIC

    // If published → allow everyone
    if (article.status === 'published') {
      // Increment view count (not author)
      if (!req.user || req.user.user_id !== article.author_id) {
        await db.query(
          'UPDATE articles SET view_count = view_count + 1 WHERE article_id = ?',
          [article.article_id]
        );
      }

      return res.json({
        success: true,
        data: article
      });
    }

    // If NOT published → allow only author or admin
    if (
      req.user &&
      (req.user.user_id === article.author_id || req.user.role === 'admin')
    ) {
      return res.json({
        success: true,
        data: article
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
        (author_id, category_id, title, slug, excerpt, content, featured_image, reading_time, status, published_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        status === 'published' ? new Date() : null
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
 * @desc    Get articles from users you follow
 * @route   GET /api/v1/articles/following-feed
 * @access  Private
 */
exports.getFollowingFeed = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

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
      count: articles.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: articles,
    });
  } catch (error) {
    console.error('Get following feed error:', error);
    next(error);
  }
};


// GET /api/v1/articles/:id/like-status
// GET /api/v1/articles/:id/like-status
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



// POST /api/v1/articles/:id/report
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