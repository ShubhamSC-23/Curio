const db = require('../config/database');

exports.getNotifications = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const { limit = 20, offset = 0, unread_only = 'false' } = req.query;

    let query = `
      SELECT 
        n.notification_id,
        n.type,
        n.title,
        n.message,
        n.link,
        n.is_read,
        n.created_at,
        n.related_id,
        n.related_type,
        u.username as actor_username,
        u.full_name as actor_name,
        u.profile_image as actor_image
      FROM notifications n
      LEFT JOIN users u ON n.actor_id = u.user_id
      WHERE n.user_id = ?
    `;

    const params = [userId];

    if (unread_only === 'true') {
      query += ' AND n.is_read = 0';
    }

    query += ' ORDER BY n.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [notifications] = await db.query(query, params);

    res.json({
      success: true,
      count: notifications.length,
      data: notifications
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    next(error);
  }
};

exports.getUnreadCount = async (req, res, next) => {
  try {
    const userId = req.user.user_id;

    const [result] = await db.query(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = 0',
      [userId]
    );

    res.json({
      success: true,
      count: result[0].count
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    next(error);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;

    const [notifications] = await db.query(
      'SELECT notification_id FROM notifications WHERE notification_id = ? AND user_id = ?',
      [id, userId]
    );

    if (notifications.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    await db.query(
      'UPDATE notifications SET is_read = 1 WHERE notification_id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Notification marked as read'
    });
  } catch (error) {
    console.error('Mark as read error:', error);
    next(error);
  }
};

exports.markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user.user_id;

    await db.query(
      'UPDATE notifications SET is_read = 1 WHERE user_id = ? AND is_read = 0',
      [userId]
    );

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Mark all as read error:', error);
    next(error);
  }
};

exports.deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;

    const [notifications] = await db.query(
      'SELECT notification_id FROM notifications WHERE notification_id = ? AND user_id = ?',
      [id, userId]
    );

    if (notifications.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found'
      });
    }

    await db.query('DELETE FROM notifications WHERE notification_id = ?', [id]);

    res.json({
      success: true,
      message: 'Notification deleted'
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    next(error);
  }
};

exports.clearReadNotifications = async (req, res, next) => {
  try {
    const userId = req.user.user_id;

    await db.query(
      'DELETE FROM notifications WHERE user_id = ? AND is_read = 1',
      [userId]
    );

    res.json({
      success: true,
      message: 'Read notifications cleared'
    });
  } catch (error) {
    console.error('Clear notifications error:', error);
    next(error);
  }
};

// Helper function to create notifications
exports.createNotification = async (userId, data) => {
  try {
    const { type, title, message, link, actorId, relatedId, relatedType } = data;

    await db.query(
      `INSERT INTO notifications (
        user_id, 
        type, 
        title, 
        message, 
        link, 
        actor_id, 
        related_id, 
        related_type
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, type, title, message, link, actorId || null, relatedId || null, relatedType || null]
    );

    return { success: true };
  } catch (error) {
    console.error('Create notification error:', error);
    return { success: false, error };
  }
};

module.exports = exports;