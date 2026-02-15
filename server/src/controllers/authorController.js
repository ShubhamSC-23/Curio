const db = require('../config/database');
const { getPagination } = require('../utils/pagination');

/**
 * @desc    Get author dashboard statistics
 * @route   GET /api/v1/author/dashboard
 * @access  Private (Author/Admin)
 */
exports.getDashboard = async (req, res, next) => {
  try {
    // Get author's article counts by status
    const [statusCounts] = await db.query(
      `SELECT 
        status,
        COUNT(*) as count
      FROM articles
      WHERE author_id = ?
      GROUP BY status`,
      [req.user.user_id]
    );

    // Get total views, likes, and comments
    const [totals] = await db.query(
      `SELECT 
        SUM(view_count) as total_views,
        SUM(like_count) as total_likes,
        SUM(comment_count) as total_comments
      FROM articles
      WHERE author_id = ?`,
      [req.user.user_id]
    );

    // Get recent activity (last 7 days)
    const [recentViews] = await db.query(
      `SELECT 
        DATE(av.viewed_at) as date,
        COUNT(*) as views
      FROM article_views av
      INNER JOIN articles a ON av.article_id = a.article_id
      WHERE a.author_id = ? 
        AND av.viewed_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY DATE(av.viewed_at)
      ORDER BY date DESC`,
      [req.user.user_id]
    );

    // Get top performing articles
    const [topArticles] = await db.query(
      `SELECT 
        article_id, title, slug, view_count, like_count, comment_count, published_at
      FROM articles
      WHERE author_id = ? AND status = 'published'
      ORDER BY view_count DESC
      LIMIT 5`,
      [req.user.user_id]
    );

    // Organize status counts
    const statistics = {
      total: 0,
      published: 0,
      draft: 0,
      pending: 0,
      rejected: 0
    };

    statusCounts.forEach(item => {
      statistics[item.status] = item.count;
      statistics.total += item.count;
    });

    res.json({
      success: true,
      data: {
        statistics: {
          ...statistics,
          totalViews: totals[0].total_views || 0,
          totalLikes: totals[0].total_likes || 0,
          totalComments: totals[0].total_comments || 0
        },
        recentViews,
        topArticles
      }
    });
  } catch (error) {
    console.error('Get author dashboard error:', error);
    next(error);
  }
};

/**
 * @desc    Get author's articles
 * @route   GET /api/v1/author/articles
 * @access  Private (Author/Admin)
 */
exports.getMyArticles = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;

    let query = `
      SELECT 
        a.article_id, a.title, a.slug, a.excerpt, a.featured_image,
        a.status, a.view_count, a.like_count, a.comment_count,
        a.created_at, a.updated_at, a.published_at,
        c.name as category_name
      FROM articles a
      LEFT JOIN categories c ON a.category_id = c.category_id
      WHERE a.author_id = ?
    `;

    const params = [req.user.user_id];

    if (status) {
      query += ' AND a.status = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND (a.title LIKE ? OR a.excerpt LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    // Get total count
    // Build count query separately (SAFE)
let countQuery = `
  SELECT COUNT(*) as total
  FROM articles a
  WHERE a.author_id = ?
`;

const countParams = [req.user.user_id];

if (status) {
  countQuery += ' AND a.status = ?';
  countParams.push(status);
}

if (search) {
  countQuery += ' AND (a.title LIKE ? OR a.excerpt LIKE ?)';
  countParams.push(`%${search}%`, `%${search}%`);
}

const [countResult] = await db.query(countQuery, countParams);
const total = countResult?.[0]?.total ?? 0;


    // Add pagination
    const pagination = getPagination(page, limit, total);
    query += ' ORDER BY a.created_at DESC LIMIT ? OFFSET ?';
    params.push(pagination.limit, pagination.offset);

    const [articles] = await db.query(query, params);

    res.json({
      success: true,
      data: articles,
      pagination: {
        currentPage: pagination.page,
        itemsPerPage: pagination.limit,
        totalItems: total,
        totalPages: pagination.totalPages,
        hasNextPage: pagination.hasNextPage,
        hasPrevPage: pagination.hasPrevPage
      }
    });
  } catch (error) {
    console.error('Get my articles error:', error);
    next(error);
  }
};

/**
 * @desc    Get article statistics
 * @route   GET /api/v1/author/articles/:id/stats
 * @access  Private (Author/Admin - own articles)
 */
exports.getArticleStats = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if article belongs to author
    const [articles] = await db.query(
      'SELECT * FROM articles WHERE article_id = ? AND author_id = ?',
      [id, req.user.user_id]
    );

    if (articles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Article not found or you do not have access'
      });
    }

    // Get views over time (last 30 days)
    const [viewsOverTime] = await db.query(
      `SELECT 
        DATE(viewed_at) as date,
        COUNT(*) as views
      FROM article_views
      WHERE article_id = ? 
        AND viewed_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(viewed_at)
      ORDER BY date ASC`,
      [id]
    );

    // Get total unique viewers
    const [uniqueViewers] = await db.query(
      `SELECT COUNT(DISTINCT COALESCE(user_id, ip_address)) as count
       FROM article_views
       WHERE article_id = ?`,
      [id]
    );

    // Get comments count
    const [commentsCount] = await db.query(
      'SELECT COUNT(*) as count FROM comments WHERE article_id = ? AND is_approved = true',
      [id]
    );

    // Get likes count
    const [likesCount] = await db.query(
      'SELECT COUNT(*) as count FROM article_likes WHERE article_id = ?',
      [id]
    );

    // Get bookmarks count
    const [bookmarksCount] = await db.query(
      'SELECT COUNT(*) as count FROM bookmarks WHERE article_id = ?',
      [id]
    );

    // Get engagement rate (likes + comments per view)
    const totalViews = articles[0].view_count || 1;
    const engagementRate = ((likesCount[0].count + commentsCount[0].count) / totalViews * 100).toFixed(2);

    res.json({
      success: true,
      data: {
        article: {
          article_id: articles[0].article_id,
          title: articles[0].title,
          status: articles[0].status,
          published_at: articles[0].published_at
        },
        statistics: {
          totalViews: articles[0].view_count,
          uniqueViewers: uniqueViewers[0].count,
          totalLikes: likesCount[0].count,
          totalComments: commentsCount[0].count,
          totalBookmarks: bookmarksCount[0].count,
          engagementRate: parseFloat(engagementRate)
        },
        viewsOverTime
      }
    });
  } catch (error) {
    console.error('Get article stats error:', error);
    next(error);
  }
};

/**
 * @desc    Get author profile
 * @route   GET /api/v1/author/profile
 * @access  Private (Author/Admin)
 */
exports.getProfile = async (req, res, next) => {
  try {
    // Get author profile
    const [profiles] = await db.query(
      `SELECT 
        ap.*,
        u.username, u.full_name, u.email, u.profile_image, u.bio
      FROM author_profiles ap
      INNER JOIN users u ON ap.user_id = u.user_id
      WHERE ap.user_id = ?`,
      [req.user.user_id]
    );

    if (profiles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Author profile not found'
      });
    }

    // Parse social links if it's JSON string
    const profile = profiles[0];
    if (profile.social_links && typeof profile.social_links === 'string') {
      try {
        profile.social_links = JSON.parse(profile.social_links);
      } catch (e) {
        profile.social_links = {};
      }
    }

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Get author profile error:', error);
    next(error);
  }
};

/**
 * @desc    Update author profile
 * @route   PUT /api/v1/author/profile
 * @access  Private (Author/Admin)
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const { display_name, expertise, social_links, website_url, bio } = req.body;

    // Update user table
    if (bio !== undefined) {
      await db.query(
        'UPDATE users SET bio = ? WHERE user_id = ?',
        [bio, req.user.user_id]
      );
    }

    // Update author_profiles table
    const updateFields = {};
    if (display_name !== undefined) updateFields.display_name = display_name;
    if (expertise !== undefined) updateFields.expertise = expertise;
    if (website_url !== undefined) updateFields.website_url = website_url;
    
    if (social_links !== undefined) {
      updateFields.social_links = typeof social_links === 'string' 
        ? social_links 
        : JSON.stringify(social_links);
    }

    const updateKeys = Object.keys(updateFields);
    if (updateKeys.length > 0) {
      const setClause = updateKeys.map(key => `${key} = ?`).join(', ');
      const values = updateKeys.map(key => updateFields[key]);

      await db.query(
        `UPDATE author_profiles SET ${setClause} WHERE user_id = ?`,
        [...values, req.user.user_id]
      );
    }

    // Get updated profile
    const [profiles] = await db.query(
      `SELECT 
        ap.*,
        u.username, u.full_name, u.email, u.profile_image, u.bio
      FROM author_profiles ap
      INNER JOIN users u ON ap.user_id = u.user_id
      WHERE ap.user_id = ?`,
      [req.user.user_id]
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: profiles[0]
    });
  } catch (error) {
    console.error('Update author profile error:', error);
    next(error);
  }
};

/**
 * @desc    Apply to become an author
 * @route   POST /api/v1/author/apply
 * @access  Private (User only)
 */
exports.applyAsAuthor = async (req, res, next) => {
  try {
    // Check if user is already an author
    if (req.user.role === 'author' || req.user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'You are already an author'
      });
    }

    // Check if application already exists
    const [existing] = await db.query(
      'SELECT * FROM author_profiles WHERE user_id = ?',
      [req.user.user_id]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Author application already submitted',
        status: existing[0].author_status
      });
    }

    // Create author profile
    await db.query(
      'INSERT INTO author_profiles (user_id, author_status) VALUES (?, ?)',
      [req.user.user_id, 'pending']
    );

    // Update user role to author
    await db.query(
      'UPDATE users SET role = ? WHERE user_id = ?',
      ['author', req.user.user_id]
    );

    res.status(201).json({
      success: true,
      message: 'Author application submitted successfully. Waiting for admin approval.'
    });
  } catch (error) {
    console.error('Apply as author error:', error);
    next(error);
  }
};

/**
 * @desc    Get engagement analytics
 * @route   GET /api/v1/author/analytics/engagement
 * @access  Private (Author/Admin)
 */
exports.getEngagementAnalytics = async (req, res, next) => {
  try {
    const { days = 30 } = req.query;

    // Get daily engagement metrics
    const [dailyStats] = await db.query(
      `SELECT 
        DATE(av.viewed_at) as date,
        COUNT(DISTINCT av.view_id) as views,
        COUNT(DISTINCT al.like_id) as likes,
        COUNT(DISTINCT c.comment_id) as comments
      FROM article_views av
      LEFT JOIN articles a ON av.article_id = a.article_id
      LEFT JOIN article_likes al ON a.article_id = al.article_id 
        AND DATE(al.created_at) = DATE(av.viewed_at)
      LEFT JOIN comments c ON a.article_id = c.article_id 
        AND DATE(c.created_at) = DATE(av.viewed_at)
      WHERE a.author_id = ? 
        AND av.viewed_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY DATE(av.viewed_at)
      ORDER BY date ASC`,
      [req.user.user_id, parseInt(days)]
    );

    // Get top traffic sources (if you implement referrer tracking)
    const [topCountries] = await db.query(
      `SELECT 
        COALESCE(ip_address, 'Unknown') as source,
        COUNT(*) as views
      FROM article_views av
      INNER JOIN articles a ON av.article_id = a.article_id
      WHERE a.author_id = ? 
        AND av.viewed_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      GROUP BY source
      ORDER BY views DESC
      LIMIT 10`,
      [req.user.user_id, parseInt(days)]
    );

    res.json({
      success: true,
      data: {
        dailyStats,
        topSources: topCountries
      }
    });
  } catch (error) {
    console.error('Get engagement analytics error:', error);
    next(error);
  }
};