const db = require('../config/database');

/**
 * @desc    Get admin dashboard statistics
 * @route   GET /api/v1/admin/dashboard
 * @access  Private (Admin only)
 */
exports.getDashboard = async (req, res, next) => {
  try {
    // Get total counts
    const [users] = await db.query('SELECT COUNT(*) as total FROM users');
    const [articles] = await db.query('SELECT COUNT(*) as total FROM articles');
    const [publishedArticles] = await db.query(
      'SELECT COUNT(*) as total FROM articles WHERE status = ?',
      ['published']
    );
    const [pendingArticles] = await db.query(
      'SELECT COUNT(*) as total FROM articles WHERE status = ?',
      ['pending']
    );
    const [categories] = await db.query('SELECT COUNT(*) as total FROM categories');
    const [comments] = await db.query('SELECT COUNT(*) as total FROM comments');

    // Get pending author applications
    const [pendingAuthors] = await db.query(
      'SELECT COUNT(*) as total FROM author_profiles WHERE author_status = ?',
      ['pending']
    );

    // Get recent articles
    const [recentArticles] = await db.query(
      `SELECT a.article_id, a.title, a.status, a.created_at, u.username, u.full_name
       FROM articles a
       INNER JOIN users u ON a.author_id = u.user_id
       ORDER BY a.created_at DESC
       LIMIT 5`
    );

    // Get recent users
    const [recentUsers] = await db.query(
      `SELECT user_id, username, full_name, email, role, created_at
       FROM users
       ORDER BY created_at DESC
       LIMIT 5`
    );

    res.json({
      success: true,
      data: {
        statistics: {
          totalUsers: users[0].total,
          totalArticles: articles[0].total,
          publishedArticles: publishedArticles[0].total,
          pendingArticles: pendingArticles[0].total,
          totalCategories: categories[0].total,
          totalComments: comments[0].total,
          pendingAuthors: pendingAuthors[0].total
        },
        recentArticles,
        recentUsers
      }
    });
  } catch (error) {
    console.error('Get dashboard error:', error);
    next(error);
  }
};

/**
 * @desc    Get all users
 * @route   GET /api/v1/admin/users
 * @access  Private (Admin only)
 */
exports.getUsers = async (req, res, next) => {
  try {
    const { role, status, search } = req.query;

    let query = 'SELECT user_id, email, username, full_name, role, is_active, is_verified, created_at, last_login FROM users WHERE 1=1';
    const params = [];

    if (role) {
      query += ' AND role = ?';
      params.push(role);
    }

    if (status === 'active') {
      query += ' AND is_active = true';
    } else if (status === 'inactive') {
      query += ' AND is_active = false';
    }

    if (search) {
      query += ' AND (username LIKE ? OR email LIKE ? OR full_name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY created_at DESC';

    const [users] = await db.query(query, params);

    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Get users error:', error);
    next(error);
  }
};

/**
 * @desc    Get pending author applications
 * @route   GET /api/v1/admin/authors/pending
 * @access  Private (Admin only)
 */
exports.getPendingAuthors = async (req, res, next) => {
  try {
    const [authors] = await db.query(
      `SELECT 
        u.user_id, u.username, u.full_name, u.email, u.created_at,
        ap.author_id, ap.author_status, ap.display_name, ap.expertise
      FROM author_profiles ap
      INNER JOIN users u ON ap.user_id = u.user_id
      WHERE ap.author_status = ?
      ORDER BY u.created_at DESC`,
      ['pending']
    );

    res.json({
      success: true,
      count: authors.length,
      data: authors
    });
  } catch (error) {
    console.error('Get pending authors error:', error);
    next(error);
  }
};

/**
 * @desc    Approve author application
 * @route   PUT /api/v1/admin/authors/:id/approve
 * @access  Private (Admin only)
 */
exports.approveAuthor = async (req, res, next) => {
  try {
    const { id } = req.params; // user_id

    // Check if author profile exists
    const [profiles] = await db.query(
      'SELECT * FROM author_profiles WHERE user_id = ?',
      [id]
    );

    if (profiles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Author application not found'
      });
    }

    // Update author status
    await db.query(
      `UPDATE author_profiles 
       SET author_status = ?, approved_by = ?, approved_at = NOW()
       WHERE user_id = ?`,
      ['approved', req.user.user_id, id]
    );

    res.json({
      success: true,
      message: 'Author application approved successfully'
    });
  } catch (error) {
    console.error('Approve author error:', error);
    next(error);
  }
};

/**
 * @desc    Reject author application
 * @route   PUT /api/v1/admin/authors/:id/reject
 * @access  Private (Admin only)
 */
exports.rejectAuthor = async (req, res, next) => {
  try {
    const { id } = req.params; // user_id

    // Check if author profile exists
    const [profiles] = await db.query(
      'SELECT * FROM author_profiles WHERE user_id = ?',
      [id]
    );

    if (profiles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Author application not found'
      });
    }

    // Update author status
    await db.query(
      `UPDATE author_profiles 
       SET author_status = ?
       WHERE user_id = ?`,
      ['suspended', id]
    );

    res.json({
      success: true,
      message: 'Author application rejected'
    });
  } catch (error) {
    console.error('Reject author error:', error);
    next(error);
  }
};

/**
 * @desc    Get pending articles for moderation
 * @route   GET /api/v1/admin/articles/pending
 * @access  Private (Admin only)
 */
exports.getPendingArticles = async (req, res, next) => {
  try {
    const [articles] = await db.query(
      `SELECT 
        a.article_id, a.title, a.excerpt, a.status, a.created_at,
        u.username, u.full_name,
        c.name as category_name
      FROM articles a
      INNER JOIN users u ON a.author_id = u.user_id
      LEFT JOIN categories c ON a.category_id = c.category_id
      WHERE a.status = ?
      ORDER BY a.created_at DESC`,
      ['pending']
    );

    res.json({
      success: true,
      count: articles.length,
      data: articles
    });
  } catch (error) {
    console.error('Get pending articles error:', error);
    next(error);
  }
};




/**
 * @desc    Get all articles (Admin)
 * @route   GET /api/v1/admin/articles
 * @access  Private (Admin only)
 */
exports.getAllArticles = async (req, res, next) => {
  try {
    const { status, search } = req.query;

    let query = `
      SELECT 
        a.article_id,
        a.title,
        a.slug,
        a.status,
        a.created_at,
        a.published_at,
        u.username,
        u.full_name,
        c.name AS category_name
      FROM articles a
      INNER JOIN users u ON a.author_id = u.user_id
      LEFT JOIN categories c ON a.category_id = c.category_id
      WHERE 1=1
    `;

    const params = [];

    // Filter by status
    if (status) {
      query += " AND a.status = ?";
      params.push(status);
    }

    // Search filter
    if (search) {
      query += " AND (a.title LIKE ? OR u.username LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }

    query += " ORDER BY a.created_at DESC";

    const [articles] = await db.query(query, params);

    res.json({
      success: true,
      count: articles.length,
      data: articles
    });

  } catch (error) {
    console.error("Get all articles error:", error);
    next(error);
  }
};





/**
 * @desc    Approve article
 * @route   PUT /api/v1/admin/articles/:id/approve
 * @access  Private (Admin only)
 */
exports.approveArticle = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if article exists
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

    // Update article status
    await db.query(
      `UPDATE articles 
       SET status = ?, reviewed_by = ?, reviewed_at = NOW(), published_at = NOW()
       WHERE article_id = ?`,
      ['published', req.user.user_id, id]
    );

    res.json({
      success: true,
      message: 'Article approved and published successfully'
    });
  } catch (error) {
    console.error('Approve article error:', error);
    next(error);
  }
};

/**
 * @desc    Reject article
 * @route   PUT /api/v1/admin/articles/:id/reject
 * @access  Private (Admin only)
 */
exports.rejectArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    // Check if article exists
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

    // Update article status
    await db.query(
      `UPDATE articles 
       SET status = ?, rejected_reason = ?, reviewed_by = ?, reviewed_at = NOW()
       WHERE article_id = ?`,
      ['rejected', reason || 'Does not meet quality standards', req.user.user_id, id]
    );

    res.json({
      success: true,
      message: 'Article rejected'
    });
  } catch (error) {
    console.error('Reject article error:', error);
    next(error);
  }
};

/**
 * @desc    Toggle user active status
 * @route   PUT /api/v1/admin/users/:id/toggle-status
 * @access  Private (Admin only)
 */
exports.toggleUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const [users] = await db.query(
      'SELECT user_id, is_active, role FROM users WHERE user_id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Cannot deactivate admins
    if (users[0].role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot deactivate admin users'
      });
    }

    // Toggle status
    const newStatus = !users[0].is_active;
    await db.query(
      'UPDATE users SET is_active = ? WHERE user_id = ?',
      [newStatus, id]
    );

    res.json({
      success: true,
      message: `User ${newStatus ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    console.error('Toggle user status error:', error);
    next(error);
  }
};

/**
 * @desc    Get all reports
 * @route   GET /api/v1/admin/reports
 * @access  Private (Admin only)
 */
exports.getReports = async (req, res, next) => {
  try {
    const { status = 'pending' } = req.query;

    const [reports] = await db.query(
      `SELECT 
        r.*,
        u.username as reporter_username,
        reviewer.username as reviewer_username
      FROM reports r
      INNER JOIN users u ON r.reporter_id = u.user_id
      LEFT JOIN users reviewer ON r.reviewed_by = reviewer.user_id
      WHERE r.status = ?
      ORDER BY r.created_at DESC`,
      [status]
    );

    res.json({
      success: true,
      count: reports.length,
      data: reports
    });
  } catch (error) {
    console.error('Get reports error:', error);
    next(error);
  }
};

/**
 * @desc    Resolve report
 * @route   PUT /api/v1/admin/reports/:id/resolve
 * @access  Private (Admin only)
 */
exports.resolveReport = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { resolution_note } = req.body;

    // Check if report exists
    const [reports] = await db.query(
      'SELECT * FROM reports WHERE report_id = ?',
      [id]
    );

    if (reports.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    // Update report
    await db.query(
      `UPDATE reports 
       SET status = ?, resolution_note = ?, reviewed_by = ?, resolved_at = NOW()
       WHERE report_id = ?`,
      ['resolved', resolution_note || null, req.user.user_id, id]
    );

    res.json({
      success: true,
      message: 'Report resolved successfully'
    });
  } catch (error) {
    console.error('Resolve report error:', error);
    next(error);
  }
};



/**
 * @desc    Get all comments (Admin)
 * @route   GET /api/v1/admin/comments
 * @access  Private (Admin only)
 */
exports.getAllComments = async (req, res, next) => {
  try {
    const { status, search } = req.query;

    let query = `
      SELECT 
        c.comment_id,
        c.content,
        c.is_approved,
        c.created_at,
        u.username AS user_name,
        u.profile_image AS user_profile_image,
        a.article_id,
        a.title AS article_title,
        a.slug AS article_slug,
        COUNT(cr.report_id) AS report_count
      FROM comments c
      INNER JOIN users u ON c.user_id = u.user_id
      INNER JOIN articles a ON c.article_id = a.article_id
      LEFT JOIN comment_reports cr 
        ON c.comment_id = cr.comment_id
      WHERE 1=1
    `;

    const params = [];

    if (status === "pending") {
      query += " AND c.is_approved = 0";
    }

    if (status === "approved") {
      query += " AND c.is_approved = 1";
    }

    query += `
      GROUP BY c.comment_id, u.user_id, a.article_id
    `;

    if (status === "reported") {
      query += " HAVING COUNT(cr.report_id) > 0";
    }

    query += " ORDER BY c.created_at DESC";

    const [comments] = await db.query(query, params);

    res.json({
      success: true,
      data: comments,
    });

  } catch (error) {
    console.error("Get comments error:", error);
    next(error);
  }
};






// GET /api/v1/admin/reports/articles
// Get all reported articles with report details
exports.getReportedArticles = async (req, res, next) => {
  try {
    const query = `
      SELECT 
      a.article_id,
      a.title,
      a.slug,
      a.excerpt,
      a.featured_image,
      a.status,
      a.view_count,
      a.created_at,
      u.username as author_name,
      c.name as category_name,
      COUNT(DISTINCT ar.report_id) as report_count,
      MAX(ar.created_at) as latest_reported_at,
      JSON_ARRAYAGG(
        JSON_OBJECT(
        'report_id', ar.report_id,
        'reason', ar.reason,
        'reporter_username', reporter.username,
        'reported_at', ar.created_at
        )
      ) as reports
  FROM article_reports ar
  JOIN articles a ON ar.article_id = a.article_id
  JOIN users u ON a.author_id = u.user_id
  LEFT JOIN categories c ON a.category_id = c.category_id
  JOIN users reporter ON ar.user_id = reporter.user_id
  GROUP BY 
    a.article_id,
    a.title,
    a.slug,
    a.excerpt,
    a.featured_image,
    a.status,
    a.view_count,
    a.created_at,
    u.username,
    c.name
    ORDER BY report_count DESC, latest_reported_at DESC `;

    const [articles] = await db.query(query);

    // Parse JSON reports
    const articlesWithReports = articles.map(article => ({
      ...article,
      reports:
        typeof article.reports === "string"
          ? JSON.parse(article.reports)
          : article.reports || []
    }));


    res.json({
      success: true,
      data: articlesWithReports
    });
  } catch (error) {
    console.error('Error fetching reported articles:', error);
    next(error);
  }
};

// DELETE /api/v1/admin/reports/articles/:reportId
// Dismiss a specific report
exports.dismissArticleReport = async (req, res, next) => {
  try {
    const { reportId } = req.params;

    // Delete the specific report
    await db.query(
      'DELETE FROM article_reports WHERE report_id = ?',
      [reportId]
    );

    res.json({
      success: true,
      message: 'Report dismissed successfully'
    });
  } catch (error) {
    console.error('Error dismissing report:', error);
    next(error);
  }
};

// DELETE /api/v1/admin/reports/articles/all/:articleId
// Dismiss all reports for a specific article
exports.dismissAllArticleReports = async (req, res, next) => {
  try {
    const { articleId } = req.params;

    // Delete all reports for this article
    await db.query(
      'DELETE FROM article_reports WHERE article_id = ?',
      [articleId]
    );

    res.json({
      success: true,
      message: 'All reports dismissed successfully'
    });
  } catch (error) {
    console.error('Error dismissing all reports:', error);
    next(error);
  }
};




/**
 * @desc    Toggle featured status of an article
 * @route   PUT /api/v1/admin/articles/:id/feature
 * @access  Private (Admin only)
 */
exports.toggleFeatured = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check article exists
    const [articles] = await db.query(
      'SELECT article_id, title, is_featured, status FROM articles WHERE article_id = ?',
      [id]
    );

    if (articles.length === 0) {
      return res.status(404).json({ success: false, message: 'Article not found' });
    }

    const article = articles[0];

    // Only published articles can be featured
    if (article.status !== 'published') {
      return res.status(400).json({
        success: false,
        message: 'Only published articles can be featured'
      });
    }

    const newFeatured = !article.is_featured;

    await db.query(
      'UPDATE articles SET is_featured = ? WHERE article_id = ?',
      [newFeatured, id]
    );

    res.json({
      success: true,
      message: newFeatured
        ? `"${article.title}" is now featured`
        : `"${article.title}" removed from featured`,
      data: { is_featured: newFeatured }
    });
  } catch (error) {
    console.error('Toggle featured error:', error);
    next(error);
  }
};

exports.deleteArticle = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if article exists
    const [articles] = await db.query(
      'SELECT article_id FROM articles WHERE article_id = ?',
      [id]
    );

    if (articles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Delete article
    await db.query('DELETE FROM articles WHERE article_id = ?', [id]);

    res.json({
      success: true,
      message: 'Article deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting article:', error);
    next(error);
  }
};





// GET /api/v1/admin/users
exports.getUsers = async (req, res, next) => {
  try {
    const { role, status } = req.query;

    let query = `
      SELECT 
        u.user_id,
        u.username,
        u.email,
        u.full_name,
        u.profile_image,
        u.role,
        u.is_banned,
        u.created_at,
        COUNT(DISTINCT a.article_id) as article_count
      FROM users u
      LEFT JOIN articles a ON u.user_id = a.author_id
      WHERE 1=1
    `;

    const params = [];

    // Filter by role
    if (role && role !== 'all') {
      query += ' AND u.role = ?';
      params.push(role);
    }

    // Filter by status (active/banned)
    if (status && status !== 'all') {
      if (status === 'banned') {
        query += ' AND u.is_banned = 1';
      } else if (status === 'active') {
        query += ' AND u.is_banned = 0';
      }
    }

    query += ' GROUP BY u.user_id ORDER BY u.created_at DESC';

    const [users] = await db.query(query, params);

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    next(error);
  }
};

// PUT /api/v1/admin/users/:id/role
exports.updateUserRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validate role
    if (!['user', 'author', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be: user, author, or admin'
      });
    }

    // Check if user exists
    const [users] = await db.query(
      'SELECT user_id, username FROM users WHERE user_id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update role
    await db.query(
      'UPDATE users SET role = ? WHERE user_id = ?',
      [role, id]
    );

    res.json({
      success: true,
      message: 'User role updated successfully'
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    next(error);
  }
};

// POST /api/v1/admin/users/:id/ban
exports.banUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const [users] = await db.query(
      'SELECT user_id, username FROM users WHERE user_id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Ban user
    await db.query(
      'UPDATE users SET is_banned = 1 WHERE user_id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'User banned successfully'
    });
  } catch (error) {
    console.error('Error banning user:', error);
    next(error);
  }
};

// POST /api/v1/admin/users/:id/unban
exports.unbanUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if user exists
    const [users] = await db.query(
      'SELECT user_id, username FROM users WHERE user_id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Unban user
    await db.query(
      'UPDATE users SET is_banned = 0 WHERE user_id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'User unbanned successfully'
    });
  } catch (error) {
    console.error('Error unbanning user:', error);
    next(error);
  }
};

// DELETE /api/v1/admin/users/:id
exports.deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const adminUserId = req.user.user_id;

    // Prevent deleting yourself
    if (parseInt(id) === adminUserId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    // Check if user exists
    const [users] = await db.query(
      'SELECT user_id, username FROM users WHERE user_id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete user (cascade will delete related data)
    await db.query('DELETE FROM users WHERE user_id = ?', [id]);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    next(error);
  }
};





// GET /api/v1/admin/comments
exports.getComments = async (req, res, next) => {
  try {
    const { status } = req.query;

    let query = `
      SELECT 
        c.comment_id,
        c.article_id,
        c.content,
        c.is_approved,
        c.is_reported,
        c.created_at,
        u.user_id,
        u.username as user_name,
        u.profile_image as user_profile_image,
        a.title as article_title,
        a.slug as article_slug,
        COUNT(cr.report_id) AS report_count
      FROM comments c
      INNER JOIN users u ON c.user_id = u.user_id
      INNER JOIN articles a ON c.article_id = a.article_id
      LEFT JOIN comment_reports cr ON c.comment_id = cr.comment_id
      WHERE 1=1
    `;

    const params = [];

    if (status === 'pending') {
      query += ' AND c.is_approved = 0';
    } else if (status === 'approved') {
      query += ' AND c.is_approved = 1';
    } else if (status === 'reported') {
      query += ' AND c.is_reported = 1';
    }

    query += ' GROUP BY c.comment_id ORDER BY c.created_at DESC';

    const [comments] = await db.query(query, params);

    res.json({
      success: true,
      data: comments
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    next(error);
  }
};


// POST /api/v1/admin/comments/:id/approve
exports.approveComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if comment exists
    const [comments] = await db.query(
      'SELECT comment_id FROM comments WHERE comment_id = ?',
      [id]
    );

    if (comments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Approve comment
    await db.query(
      'UPDATE comments SET is_approved = 1, is_reported = 0 WHERE comment_id = ?',
      [id]
    );

    // Clear reports
    await db.query(
      'DELETE FROM comment_reports WHERE comment_id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Comment approved successfully'
    });
  } catch (error) {
    console.error('Error approving comment:', error);
    next(error);
  }
};

// DELETE /api/v1/admin/comments/:id
exports.deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if comment exists
    const [comments] = await db.query(
      'SELECT comment_id FROM comments WHERE comment_id = ?',
      [id]
    );

    if (comments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    // Delete comment (cascade will delete replies and reports)
    await db.query('DELETE FROM comments WHERE comment_id = ?', [id]);

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    next(error);
  }
};




// GET /api/v1/admin/reports/comments
// Get all reported comments with report details
exports.getReportedComments = async (req, res, next) => {
  try {
    const query = `
      SELECT 
        c.comment_id,
        c.article_id,
        c.content,
        c.is_approved,
        c.created_at,
        u.user_id,
        u.username AS user_name,
        u.profile_image AS user_profile_image,
        a.title AS article_title,
        a.slug AS article_slug,
        COUNT(DISTINCT cr.report_id) AS report_count,
        MAX(cr.created_at) AS latest_reported_at,
        JSON_ARRAYAGG(
          JSON_OBJECT(
            'report_id', cr.report_id,
            'reason', cr.reason,
            'reporter_username', reporter.username,
            'reported_at', cr.created_at
          )
        ) AS reports
      FROM comment_reports cr
      JOIN comments c ON cr.comment_id = c.comment_id
      JOIN users u ON c.user_id = u.user_id
      JOIN articles a ON c.article_id = a.article_id
      JOIN users reporter ON cr.user_id = reporter.user_id
      GROUP BY 
        c.comment_id,
        c.article_id,
        c.content,
        c.is_approved,
        c.created_at,
        u.user_id,
        u.username,
        u.profile_image,
        a.title,
        a.slug
      ORDER BY report_count DESC, latest_reported_at DESC
    `;

    const [comments] = await db.query(query);

    const commentsWithReports = comments.map(comment => ({
      ...comment,
      reports:
        typeof comment.reports === "string"
          ? JSON.parse(comment.reports)
          : comment.reports || []
    }));

    res.json({
      success: true,
      data: commentsWithReports
    });

  } catch (error) {
    console.error("Error fetching reported comments:", error);
    next(error);
  }
};


// DELETE /api/v1/admin/reports/comments/all/:commentId
// Dismiss all reports for a specific comment
exports.dismissAllCommentReports = async (req, res, next) => {
  try {
    const { commentId } = req.params;

    // Delete all reports for this comment
    await db.query(
      'DELETE FROM comment_reports WHERE comment_id = ?',
      [commentId]
    );

    // Clear is_reported flag
    await db.query(
      'UPDATE comments SET is_reported = 0 WHERE comment_id = ?',
      [commentId]
    );

    res.json({
      success: true,
      message: 'All reports dismissed successfully'
    });
  } catch (error) {
    console.error('Error dismissing comment reports:', error);
    next(error);
  }
};