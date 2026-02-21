const db = require('../config/database');
const BaseModel = require('./BaseModel');

class CategoryModel extends BaseModel {
    constructor() {
        super('categories');
    }

    async findBySlug(slug) {
        return this.findOne({ slug });
    }

    async getWithStats() {
        const query = `
      SELECT 
        c.*,
        COUNT(a.article_id) as article_count
      FROM categories c
      LEFT JOIN articles a ON c.category_id = a.category_id AND a.status = 'published'
      GROUP BY c.category_id
      ORDER BY c.name ASC
    `;
        const [rows] = await db.query(query);
        return rows;
    }
}

module.exports = new CategoryModel();
