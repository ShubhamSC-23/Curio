const db = require('../config/database');
const BaseModel = require('./BaseModel');

class LikeModel extends BaseModel {
    constructor() {
        super('article_likes');
    }

    async findByUserId(userId) {
        const [rows] = await db.query(
            `SELECT 
        a.article_id, a.title, a.slug, a.excerpt, a.featured_image,
        a.reading_time, a.published_at,
        u.username, u.full_name,
        c.name as category_name,
        al.created_at as liked_at
      FROM article_likes al
      INNER JOIN articles a ON al.article_id = a.article_id
      INNER JOIN users u ON a.author_id = u.user_id
      LEFT JOIN categories c ON a.category_id = c.category_id
      WHERE al.user_id = ? AND a.status = 'published'
      ORDER BY al.created_at DESC`,
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
                'DELETE FROM article_likes WHERE user_id = ? AND article_id = ?',
                [userId, articleId]
            );
            // Decrement like count in articles table
            await db.query(
                'UPDATE articles SET like_count = GREATER(0, like_count - 1) WHERE article_id = ?',
                [articleId]
            );
            return false;
        } else {
            await this.create({ user_id: userId, article_id: articleId });
            // Increment like count in articles table
            await db.query(
                'UPDATE articles SET like_count = like_count + 1 WHERE article_id = ?',
                [articleId]
            );
            return true;
        }
    }
}

module.exports = new LikeModel();
