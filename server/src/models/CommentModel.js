const db = require('../config/database');
const BaseModel = require('./BaseModel');

class CommentModel extends BaseModel {
    constructor() {
        super('comments');
    }

    async findByArticleId(articleId) {
        const [rows] = await db.query(
            `SELECT 
        c.*, 
        u.username, u.full_name, u.profile_image
      FROM comments c
      INNER JOIN users u ON c.user_id = u.user_id
      WHERE c.article_id = ? AND c.is_approved = true
      ORDER BY c.created_at DESC`,
            [articleId]
        );
        return rows;
    }

    async getReported() {
        const [rows] = await db.query(
            `SELECT 
        c.*, 
        u.username, u.full_name,
        a.title as article_title, a.slug as article_slug
      FROM comments c
      INNER JOIN users u ON c.user_id = u.user_id
      INNER JOIN articles a ON c.article_id = a.article_id
      WHERE c.report_count > 0
      ORDER BY c.report_count DESC`
        );
        return rows;
    }
}

module.exports = new CommentModel();
