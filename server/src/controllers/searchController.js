const db = require('../config/database');
const { getPagination } = require('../utils/pagination');

/**
 * @desc    Advanced article search
 * @route   GET /api/v1/search/articles
 * @access  Public
 */
exports.searchArticles = async (req, res, next) => {
  try {
    const {
      q,              // Search query
      category,       // Category slug
      tag,            // Tag slug
      author,         // Author username
      dateFrom,       // Published after this date
      dateTo,         // Published before this date
      minViews,       // Minimum view count
      sortBy = 'published_at', // Sort field
      order = 'desc', // Sort order (asc/desc)
      page = 1,
      limit = 10
    } = req.query;

    let query = `
      SELECT 
        a.article_id, a.title, a.slug, a.excerpt, a.featured_image,
        a.reading_time, a.view_count, a.like_count, a.comment_count,
        a.published_at,
        u.username, u.full_name, u.profile_image,
        c.name as category_name, c.slug as category_slug,
        GROUP_CONCAT(DISTINCT t.name) as tags
      FROM articles a
      INNER JOIN users u ON a.author_id = u.user_id
      LEFT JOIN categories c ON a.category_id = c.category_id
      LEFT JOIN article_tags at ON a.article_id = at.article_id
      LEFT JOIN tags t ON at.tag_id = t.tag_id
      WHERE a.status = 'published'
    `;

    const params = [];

    // Full-text search
    if (q) {
      query += ` AND (
        a.title LIKE ? OR 
        a.excerpt LIKE ? OR 
        a.content LIKE ? OR
        u.full_name LIKE ?
      )`;
      const searchTerm = `%${q}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    // Category filter
    if (category) {
      query += ' AND c.slug = ?';
      params.push(category);
    }

    // Tag filter
    if (tag) {
      query += ` AND a.article_id IN (
        SELECT article_id FROM article_tags at2
        INNER JOIN tags t2 ON at2.tag_id = t2.tag_id
        WHERE t2.slug = ?
      )`;
      params.push(tag);
    }

    // Author filter
    if (author) {
      query += ' AND u.username = ?';
      params.push(author);
    }

    // Date range filters
    if (dateFrom) {
      query += ' AND a.published_at >= ?';
      params.push(dateFrom);
    }

    if (dateTo) {
      query += ' AND a.published_at <= ?';
      params.push(dateTo);
    }

    // View count filter
    if (minViews) {
      query += ' AND a.view_count >= ?';
      params.push(parseInt(minViews));
    }

    query += ' GROUP BY a.article_id';

    // Get total count before pagination
    const countQuery = `SELECT COUNT(DISTINCT a.article_id) as total FROM (${query}) as filtered`;
    const [countResult] = await db.query(countQuery, params);
    const total = countResult[0].total;

    // Sorting
    const allowedSortFields = ['published_at', 'view_count', 'like_count', 'title', 'created_at'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'published_at';
    const sortOrder = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';
    
    query += ` ORDER BY a.${sortField} ${sortOrder}`;

    // Pagination
    const pagination = getPagination(page, limit, total);
    query += ' LIMIT ? OFFSET ?';
    params.push(pagination.limit, pagination.offset);

    // Execute search
    const [articles] = await db.query(query, params);

    // Process tags
    articles.forEach(article => {
      article.tags = article.tags ? article.tags.split(',') : [];
    });

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
        hasPrevPage: pagination.hasPrevPage
      },
      filters: {
        query: q,
        category,
        tag,
        author,
        dateFrom,
        dateTo,
        sortBy: sortField,
        order: sortOrder
      }
    });
  } catch (error) {
    console.error('Search articles error:', error);
    next(error);
  }
};

/**
 * @desc    Search suggestions (autocomplete)
 * @route   GET /api/v1/search/suggestions
 * @access  Public
 */
exports.getSuggestions = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.json({
        success: true,
        data: {
          articles: [],
          authors: [],
          tags: []
        }
      });
    }

    const searchTerm = `%${q}%`;

    // Search articles
    const [articles] = await db.query(
      `SELECT article_id, title, slug
       FROM articles
       WHERE status = 'published' AND title LIKE ?
       LIMIT 5`,
      [searchTerm]
    );

    // Search authors
    const [authors] = await db.query(
      `SELECT user_id, username, full_name, profile_image
       FROM users
       WHERE role IN ('author', 'admin') 
         AND (username LIKE ? OR full_name LIKE ?)
       LIMIT 5`,
      [searchTerm, searchTerm]
    );

    // Search tags
    const [tags] = await db.query(
      `SELECT tag_id, name, slug, usage_count
       FROM tags
       WHERE name LIKE ?
       ORDER BY usage_count DESC
       LIMIT 5`,
      [searchTerm]
    );

    res.json({
      success: true,
      data: {
        articles,
        authors,
        tags
      }
    });
  } catch (error) {
    console.error('Get suggestions error:', error);
    next(error);
  }
};

/**
 * @desc    Get popular searches
 * @route   GET /api/v1/search/popular
 * @access  Public
 */
exports.getPopularSearches = async (req, res, next) => {
  try {
    // Get most used tags
    const [popularTags] = await db.query(
      `SELECT tag_id, name, slug, usage_count
       FROM tags
       ORDER BY usage_count DESC
       LIMIT 10`
    );

    // Get trending articles (most viewed in last 7 days)
    const [trendingArticles] = await db.query(
      `SELECT 
        a.article_id, a.title, a.slug,
        COUNT(av.view_id) as recent_views
      FROM articles a
      LEFT JOIN article_views av ON a.article_id = av.article_id
        AND av.viewed_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      WHERE a.status = 'published'
      GROUP BY a.article_id
      ORDER BY recent_views DESC
      LIMIT 10`
    );

    // Get popular categories
    const [popularCategories] = await db.query(
      `SELECT 
        c.category_id, c.name, c.slug,
        COUNT(a.article_id) as article_count
      FROM categories c
      LEFT JOIN articles a ON c.category_id = a.category_id AND a.status = 'published'
      WHERE c.is_active = true
      GROUP BY c.category_id
      ORDER BY article_count DESC
      LIMIT 10`
    );

    res.json({
      success: true,
      data: {
        popularTags,
        trendingArticles,
        popularCategories
      }
    });
  } catch (error) {
    console.error('Get popular searches error:', error);
    next(error);
  }
};

/**
 * @desc    Get filters metadata
 * @route   GET /api/v1/search/filters
 * @access  Public
 */
exports.getFiltersMetadata = async (req, res, next) => {
  try {
    // Get all active categories with article counts
    const [categories] = await db.query(
      `SELECT 
        c.category_id, c.name, c.slug,
        COUNT(a.article_id) as article_count
      FROM categories c
      LEFT JOIN articles a ON c.category_id = a.category_id AND a.status = 'published'
      WHERE c.is_active = true
      GROUP BY c.category_id
      HAVING article_count > 0
      ORDER BY c.display_order, c.name`
    );

    // Get all tags with article counts
    const [tags] = await db.query(
      `SELECT tag_id, name, slug, usage_count
       FROM tags
       WHERE usage_count > 0
       ORDER BY usage_count DESC
       LIMIT 50`
    );

    // Get active authors
    const [authors] = await db.query(
      `SELECT 
        u.user_id, u.username, u.full_name, u.profile_image,
        COUNT(a.article_id) as article_count
      FROM users u
      LEFT JOIN articles a ON u.user_id = a.author_id AND a.status = 'published'
      WHERE u.role IN ('author', 'admin') AND u.is_active = true
      GROUP BY u.user_id
      HAVING article_count > 0
      ORDER BY article_count DESC`
    );

    // Get date range of published articles
    const [dateRange] = await db.query(
      `SELECT 
        MIN(published_at) as earliest_date,
        MAX(published_at) as latest_date
      FROM articles
      WHERE status = 'published'`
    );

    // Get view count range
    const [viewRange] = await db.query(
      `SELECT 
        MIN(view_count) as min_views,
        MAX(view_count) as max_views
      FROM articles
      WHERE status = 'published'`
    );

    res.json({
      success: true,
      data: {
        categories,
        tags,
        authors,
        dateRange: dateRange[0],
        viewRange: viewRange[0],
        sortOptions: [
          { value: 'published_at', label: 'Most Recent' },
          { value: 'view_count', label: 'Most Viewed' },
          { value: 'like_count', label: 'Most Liked' },
          { value: 'title', label: 'Title (A-Z)' }
        ]
      }
    });
  } catch (error) {
    console.error('Get filters metadata error:', error);
    next(error);
  }
};



// GET /api/v1/reading-list/check/:id
exports.checkReadingList = async (req, res, next) => {
  try {
    const { id } = req.params; // article_id
    const userId = req.user.user_id;

    const [items] = await db.query(
      'SELECT * FROM reading_list WHERE article_id = ? AND user_id = ?',
      [id, userId]
    );

    res.json({
      success: true,
      data: {
        inReadingList: items.length > 0
      }
    });
  } catch (error) {
    next(error);
  }
};