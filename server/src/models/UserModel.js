const db = require('../config/database');
const BaseModel = require('./BaseModel');

class UserModel extends BaseModel {
    constructor() {
        super('users');
    }

    async findByEmail(email) {
        return this.findOne({ email });
    }

    async findByUsername(username) {
        return this.findOne({ username, is_active: true });
    }

    async findWithPasswordByEmail(email) {
        // We explicitly want the password for auth checks
        const [rows] = await db.query(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return rows[0];
    }

    async updateLastLogin(userId) {
        return this.update(userId, { last_login: new Date() });
    }

    async getProfile(username) {
        const [rows] = await db.query(
            `SELECT 
        user_id, username, full_name, profile_image, bio, paypal_me_link, created_at
      FROM users
      WHERE username = ? AND is_active = true`,
            [username]
        );
        return rows[0];
    }

    async getStats(userId) {
        const query = `
      SELECT 
        u.user_id,
        u.username,
        u.created_at,
        COUNT(DISTINCT a.article_id) as articles_published,
        COALESCE(SUM(a.like_count), 0) as total_likes,
        COALESCE(SUM(a.view_count), 0) as total_views,
        COALESCE(MAX(a.view_count), 0) as max_views,
        COUNT(DISTINCT c.comment_id) as comments_made,
        COUNT(DISTINCT f1.follower_id) as followers,
        COUNT(DISTINCT f2.following_id) as following
      FROM users u
      LEFT JOIN articles a ON u.user_id = a.author_id AND a.status = 'published'
      LEFT JOIN comments c ON u.user_id = c.user_id
      LEFT JOIN user_follows f1 ON u.user_id = f1.following_id
      LEFT JOIN user_follows f2 ON u.user_id = f2.follower_id
      WHERE u.user_id = ?
      GROUP BY u.user_id
    `;
        const [rows] = await db.query(query, [userId]);
        return rows[0];
    }
}

module.exports = new UserModel();
