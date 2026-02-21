const db = require('../config/database');
const BaseModel = require('./BaseModel');

class AuthorProfileModel extends BaseModel {
    constructor() {
        super('author_profiles');
    }

    async findByUserId(userId) {
        return this.findOne({ user_id: userId });
    }

    async getFullProfile(userId) {
        const [rows] = await db.query(
            `SELECT 
        ap.*,
        u.username, u.full_name, u.email, u.profile_image, u.bio
      FROM author_profiles ap
      INNER JOIN users u ON ap.user_id = u.user_id
      WHERE ap.user_id = ?`,
            [userId]
        );
        return rows[0];
    }
}

module.exports = new AuthorProfileModel();
