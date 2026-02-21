const db = require('../config/database');
const BaseModel = require('./BaseModel');

class PasswordResetModel extends BaseModel {
    constructor() {
        super('password_resets');
    }

    async findValidToken(hashedToken) {
        const [rows] = await db.query(
            `SELECT pr.reset_id, pr.user_id, u.email 
       FROM password_resets pr
       JOIN users u ON pr.user_id = u.user_id
       WHERE pr.token = ? 
       AND pr.expires_at > NOW() 
       AND pr.is_used = FALSE`,
            [hashedToken]
        );
        return rows[0];
    }

    async markAsUsed(resetId) {
        return this.update(resetId, { is_used: true });
    }
}

module.exports = new PasswordResetModel();
