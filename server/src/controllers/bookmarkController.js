const db = require('../config/database');
const { createSlug, createUniqueSlug } = require('../utils/slugify');
const { getPagination } = require('../utils/pagination');

// GET /api/v1/bookmarks/check/:id
exports.checkBookmark = async (req, res, next) => {
  try {
    const { id } = req.params; // article_id
    const userId = req.user.user_id;

    const [bookmarks] = await db.query(
      'SELECT * FROM bookmarks WHERE article_id = ? AND user_id = ?',
      [id, userId]
    );

    res.json({
      success: true,
      data: {
        isBookmarked: bookmarks.length > 0
      }
    });
  } catch (error) {
    next(error);
  }
};