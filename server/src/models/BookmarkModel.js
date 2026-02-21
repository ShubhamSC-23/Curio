const db = require('../config/database');
const BaseModel = require('./BaseModel');

class BookmarkModel extends BaseModel {
    constructor() {
        super('bookmarks');
    }

    async findByUserId(userId) {
        const [rows] = await db.query(
            `SELECT 
        a.article_id, a.title, a.slug, a.excerpt, a.featured_image,
        a.reading_time, a.published_at,
        u.username, u.full_name,
        c.name as category_name,
        b.created_at as bookmarked_at
      FROM bookmarks b
      INNER JOIN articles a ON b.article_id = a.article_id
      INNER JOIN users u ON a.author_id = u.user_id
      LEFT JOIN categories c ON a.category_id = c.category_id
      WHERE b.user_id = ? AND a.status = 'published'
      ORDER BY b.created_at DESC`,
            [userId]
        );
        return rows;
    }

    async check(userId, articleId) {
        return this.findOne({ user_id: userId, article_id: articleId });
    }

    async toggle(userId, articleId) {
        const existing = await this.check(userId, articleId);
        if (existing) {
            await db.query(
                'DELETE FROM bookmarks WHERE user_id = ? AND article_id = ?',
                [userId, articleId]
            );
            return false;
        } else {
            await this.create({ user_id: userId, article_id: articleId });
            return true;
        }
    }
}

module.exports = new BookmarkModel();
