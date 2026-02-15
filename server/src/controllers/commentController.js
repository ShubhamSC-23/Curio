const db = require('../config/database');
const { getPagination } = require('../utils/pagination');

/**
 * @desc    Get comments for an article
 * @route   GET /api/v1/comments
 * @access  Public
 */
exports.getComments = async (req, res, next) => {
  try {
    const { article_id } = req.query;

    if (!article_id) {
      return res.status(400).json({
        success: false,
        message: 'Article ID is required',
      });
    }

    const query = `
      SELECT 
        c.comment_id,
        c.article_id,
        c.parent_comment_id,
        c.content,
        c.like_count,
        c.created_at,
        c.updated_at,
        u.user_id,
        u.username,
        u.full_name,
        u.profile_image
      FROM comments c
      INNER JOIN users u ON c.user_id = u.user_id
      WHERE c.article_id = ?
      ORDER BY c.created_at ASC
    `;

    const [comments] = await db.query(query, [article_id]);

    res.json({
      success: true,
      count: comments.length,
      data: comments,
    });
  } catch (error) {
    console.error('Get comments error:', error);
    next(error);
  }
};

/**
 * @desc    Create a comment
 * @route   POST /api/v1/comments
 * @access  Private
 */
exports.createComment = async (req, res, next) => {
  try {
    const { article_id, parent_comment_id, content } = req.body;
    const user_id = req.user.user_id;

    // Validate required fields
    if (!article_id || !content) {
      return res.status(400).json({
        success: false,
        message: 'Article ID and content are required',
      });
    }

    // Check if article exists
    const [article] = await db.query(
      'SELECT article_id FROM articles WHERE article_id = ?',
      [article_id]
    );

    if (article.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Article not found',
      });
    }

    // If parent_comment_id provided, check if it exists
    if (parent_comment_id) {
      const [parentComment] = await db.query(
        'SELECT comment_id FROM comments WHERE comment_id = ? AND article_id = ?',
        [parent_comment_id, article_id]
      );

      if (parentComment.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Parent comment not found',
        });
      }
    }

    // Create comment
    const insertQuery = `
      INSERT INTO comments (article_id, user_id, parent_comment_id, content)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await db.query(insertQuery, [
      article_id,
      user_id,
      parent_comment_id || null,
      content.trim(),
    ]);

    // Get the created comment with user info
    const [newComment] = await db.query(
      `
      SELECT 
        c.comment_id,
        c.article_id,
        c.parent_comment_id,
        c.content,
        c.like_count,
        c.created_at,
        c.updated_at,
        u.user_id,
        u.username,
        u.full_name,
        u.profile_image
      FROM comments c
      INNER JOIN users u ON c.user_id = u.user_id
      WHERE c.comment_id = ?
      `,
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Comment created successfully',
      data: newComment[0],
    });
  } catch (error) {
    console.error('Create comment error:', error);
    next(error);
  }
};

/**
 * @desc    Update a comment
 * @route   PUT /api/v1/comments/:id
 * @access  Private (Comment author only)
 */
exports.updateComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const user_id = req.user.user_id;

    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Content is required',
      });
    }

    // Check if comment exists and belongs to user
    const [comment] = await db.query(
      'SELECT user_id FROM comments WHERE comment_id = ?',
      [id]
    );

    if (comment.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    if (comment[0].user_id !== user_id) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own comments',
      });
    }

    // Update comment
    await db.query(
      'UPDATE comments SET content = ?, updated_at = NOW() WHERE comment_id = ?',
      [content.trim(), id]
    );

    // Get updated comment
    const [updatedComment] = await db.query(
      `
      SELECT 
        c.comment_id,
        c.article_id,
        c.parent_comment_id,
        c.content,
        c.like_count,
        c.created_at,
        c.updated_at,
        u.user_id,
        u.username,
        u.full_name,
        u.profile_image
      FROM comments c
      INNER JOIN users u ON c.user_id = u.user_id
      WHERE c.comment_id = ?
      `,
      [id]
    );

    res.json({
      success: true,
      message: 'Comment updated successfully',
      data: updatedComment[0],
    });
  } catch (error) {
    console.error('Update comment error:', error);
    next(error);
  }
};

/**
 * @desc    Delete a comment
 * @route   DELETE /api/v1/comments/:id
 * @access  Private (Comment author, article author, or admin)
 */
exports.deleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.user_id;
    const user_role = req.user.role;

    // Get comment info
    const [comment] = await db.query(
      `
      SELECT c.user_id, c.article_id, a.author_id 
      FROM comments c
      INNER JOIN articles a ON c.article_id = a.article_id
      WHERE c.comment_id = ?
      `,
      [id]
    );

    if (comment.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    // Check permissions
    const isCommentAuthor = comment[0].user_id === user_id;
    const isArticleAuthor = comment[0].author_id === user_id;
    const isAdmin = user_role === 'admin';

    if (!isCommentAuthor && !isArticleAuthor && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to delete this comment',
      });
    }

    // Delete comment (cascade will handle replies due to ON DELETE CASCADE)
    await db.query('DELETE FROM comments WHERE comment_id = ?', [id]);

    res.json({
      success: true,
      message: 'Comment deleted successfully',
    });
  } catch (error) {
    console.error('Delete comment error:', error);
    next(error);
  }
};

/**
 * @desc    Like/Unlike a comment
 * @route   POST /api/v1/comments/:id/like
 * @access  Private
 */
exports.likeComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user_id = req.user.user_id;

    // Check if comment exists
    const [comment] = await db.query(
      'SELECT comment_id FROM comments WHERE comment_id = ?',
      [id]
    );

    if (comment.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found',
      });
    }

    // Check if already liked
    const [existingLike] = await db.query(
      'SELECT * FROM comment_likes WHERE comment_id = ? AND user_id = ?',
      [id, user_id]
    );

    if (existingLike.length > 0) {
      // Unlike - remove like
      await db.query(
        'DELETE FROM comment_likes WHERE comment_id = ? AND user_id = ?',
        [id, user_id]
      );

      return res.json({
        success: true,
        message: 'Comment unliked',
        liked: false,
      });
    } else {
      // Like - add like
      await db.query(
        'INSERT INTO comment_likes (comment_id, user_id) VALUES (?, ?)',
        [id, user_id]
      );

      return res.json({
        success: true,
        message: 'Comment liked',
        liked: true,
      });
    }
  } catch (error) {
    console.error('Like comment error:', error);
    next(error);
  }
};



// POST /api/v1/comments/:id/report
exports.reportComment = async (req, res, next) => {
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
      'SELECT * FROM comment_reports WHERE comment_id = ? AND user_id = ?',
      [id, userId]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'You have already reported this comment'
      });
    }

    // Insert report
    await db.query(
      'INSERT INTO comment_reports (comment_id, user_id, reason) VALUES (?, ?, ?)',
      [id, userId, reason.trim()]
    );

    // Mark comment as reported
    await db.query(
      'UPDATE comments SET is_reported = 1 WHERE comment_id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Comment reported successfully'
    });
  } catch (error) {
    next(error);
  }
};