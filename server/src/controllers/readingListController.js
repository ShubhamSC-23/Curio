const db = require('../config/database');

/**
 * @desc    Get user's reading list
 * @route   GET /api/v1/users/me/reading-list
 * @access  Private
 */
exports.getReadingList = async (req, res, next) => {
  try {
    const userId = req.user.user_id;

    const query = `
      SELECT 
        rl.id, rl.is_read, rl.added_at, rl.read_at,
        a.article_id, a.title, a.slug, a.excerpt, a.featured_image,
        a.reading_time, a.published_at,
        u.username, u.full_name,
        c.name as category_name
      FROM reading_list rl
      INNER JOIN articles a ON rl.article_id = a.article_id
      INNER JOIN users u ON a.author_id = u.user_id
      LEFT JOIN categories c ON a.category_id = c.category_id
      WHERE rl.user_id = ? AND a.status = 'published'
      ORDER BY rl.added_at DESC
    `;

    const [items] = await db.query(query, [userId]);

    res.json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    console.error('Get reading list error:', error);
    next(error);
  }
};

/**
 * @desc    Add article to reading list
 * @route   POST /api/v1/reading-list/:articleId
 * @access  Private
 */
exports.addToReadingList = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { articleId } = req.params;

    // Check if article exists
    const [article] = await db.query(
      'SELECT article_id FROM articles WHERE article_id = ?',
      [articleId]
    );

    if (article.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Article not found',
      });
    }

    // Check if already in reading list
    const [existing] = await db.query(
      'SELECT id FROM reading_list WHERE user_id = ? AND article_id = ?',
      [userId, articleId]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Article already in reading list',
      });
    }

    // Add to reading list
    await db.query(
      'INSERT INTO reading_list (user_id, article_id) VALUES (?, ?)',
      [userId, articleId]
    );

    res.status(201).json({
      success: true,
      message: 'Added to reading list',
    });
  } catch (error) {
    console.error('Add to reading list error:', error);
    next(error);
  }
};

/**
 * @desc    Mark article as read/unread
 * @route   PUT /api/v1/reading-list/:articleId/mark-read
 * @access  Private
 */
exports.markAsRead = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { articleId } = req.params;

    // Get current status
    const [item] = await db.query(
      'SELECT is_read FROM reading_list WHERE user_id = ? AND article_id = ?',
      [userId, articleId]
    );

    if (item.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Article not in reading list',
      });
    }

    const newStatus = !item[0].is_read;

    // Update status
    await db.query(
      `UPDATE reading_list 
       SET is_read = ?, read_at = ${newStatus ? 'NOW()' : 'NULL'}
       WHERE user_id = ? AND article_id = ?`,
      [newStatus, userId, articleId]
    );

    res.json({
      success: true,
      message: newStatus ? 'Marked as read' : 'Marked as unread',
      is_read: newStatus,
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    next(error);
  }
};

/**
 * @desc    Remove article from reading list
 * @route   DELETE /api/v1/reading-list/:articleId
 * @access  Private
 */
exports.removeFromReadingList = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { articleId } = req.params;

    const [result] = await db.query(
      'DELETE FROM reading_list WHERE user_id = ? AND article_id = ?',
      [userId, articleId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Article not in reading list',
      });
    }

    res.json({
      success: true,
      message: 'Removed from reading list',
    });
  } catch (error) {
    console.error('Remove from reading list error:', error);
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