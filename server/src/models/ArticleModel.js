const db = require('../config/database');
const BaseModel = require('./BaseModel');

class ArticleModel extends BaseModel {
    constructor() {
        super('articles');
    }

    async findBySlug(slug) {
        const [rows] = await db.query(
            `SELECT 
        a.*, 
        u.username, u.full_name, u.profile_image,
        c.name as category_name, c.slug as category_slug
      FROM articles a
      INNER JOIN users u ON a.author_id = u.user_id
      LEFT JOIN categories c ON a.category_id = c.category_id
      WHERE a.slug = ? AND (a.status = 'published' OR a.status IS NOT NULL)`,
            [slug]
        );
        return rows[0];
    }

    async findAllPublished(options = {}) {
        const { category, tag, author, search, limit = 10, offset = 0 } = options;
        let query = `
      SELECT 
        a.article_id, a.title, a.slug, a.excerpt, a.featured_image,
        a.reading_time, a.view_count, a.like_count, a.comment_count,
        a.published_at, u.username, u.full_name, c.name as category_name
      FROM articles a
      INNER JOIN users u ON a.author_id = u.user_id
      LEFT JOIN categories c ON a.category_id = c.category_id
      WHERE a.status = 'published'
    `;
        const params = [];

        if (category) {
            query += ' AND c.slug = ?';
            params.push(category);
        }

        if (author) {
            query += ' AND u.username = ?';
            params.push(author);
        }

        if (tag) {
            query += ' AND FIND_IN_SET(?, a.tags)';
            params.push(tag);
        }

        if (search) {
            query += ' AND (a.title LIKE ? OR a.excerpt LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        query += ' ORDER BY a.published_at DESC LIMIT ? OFFSET ?';
        params.push(parseInt(limit), parseInt(offset));

        const [rows] = await db.query(query, params);
        return rows;
    }

    async incrementViews(articleId) {
        return db.query(
            'UPDATE articles SET view_count = view_count + 1 WHERE article_id = ?',
            [articleId]
        );
    }

    async getFeatured() {
        const [rows] = await db.query(
            `SELECT a.*, u.username, u.full_name 
       FROM articles a 
       JOIN users u ON a.author_id = u.user_id 
       WHERE a.is_featured = true AND a.status = 'published' 
       ORDER BY a.published_at DESC LIMIT 5`
        );
        return rows;
    }

    async countPublished(options = {}) {
        const { category, tag, author, search, featured } = options;
        let query = `
      SELECT COUNT(*) as total 
      FROM articles a
      INNER JOIN users u ON a.author_id = u.user_id
      LEFT JOIN categories c ON a.category_id = c.category_id
      WHERE a.status = 'published'
    `;
        const params = [];

        if (category) {
            query += ' AND c.slug = ?';
            params.push(category);
        }

        if (author) {
            query += ' AND u.username = ?';
            params.push(author);
        }

        if (tag) {
            query += ' AND FIND_IN_SET(?, a.tags)';
            params.push(tag);
        }

        if (search) {
            query += ' AND (a.title LIKE ? OR a.excerpt LIKE ?)';
            params.push(`%${search}%`, `%${search}%`);
        }

        if (featured) {
            query += ' AND a.is_featured = true';
        }

        const [rows] = await db.query(query, params);
        return rows[0].total;
    }

    async findFollowingFeed(userId, limit = 20, offset = 0) {
        const query = `
      SELECT 
        a.article_id, a.title, a.slug, a.excerpt, a.featured_image,
        a.reading_time, a.view_count, a.like_count, a.published_at,
        u.user_id, u.username, u.full_name, u.profile_image,
        c.category_id, c.name as category_name, c.slug as category_slug
      FROM articles a
      INNER JOIN users u ON a.author_id = u.user_id
      INNER JOIN user_follows f ON a.author_id = f.following_id
      LEFT JOIN categories c ON a.category_id = c.category_id
      WHERE f.follower_id = ? AND a.status = 'published'
      ORDER BY a.published_at DESC
      LIMIT ? OFFSET ?
    `;
        const [rows] = await db.query(query, [userId, limit, offset]);
        return rows;
    }

    async countFollowingFeed(userId) {
        const [rows] = await db.query(
            `SELECT COUNT(*) as total 
       FROM articles a
       INNER JOIN user_follows f ON a.author_id = f.following_id
       WHERE f.follower_id = ? AND a.status = 'published'`,
            [userId]
        );
        return rows[0].total;
    }
    async advancedSearch(options = {}) {
        const {
            q, category, tag, author, dateFrom, dateTo,
            minViews, sortBy = 'published_at', order = 'desc',
            limit = 10, offset = 0
        } = options;

        let query = `
      SELECT 
        a.article_id, a.title, a.slug, a.excerpt, a.featured_image,
        a.reading_time, a.view_count, a.like_count, a.comment_count,
        a.published_at,
        u.username, u.full_name, u.profile_image,
        c.name as category_name, c.slug as category_slug
      FROM articles a
      INNER JOIN users u ON a.author_id = u.user_id
      LEFT JOIN categories c ON a.category_id = c.category_id
      WHERE a.status = 'published'
    `;

        const params = [];

        if (q) {
            query += ` AND (
        a.title LIKE ? OR 
        a.excerpt LIKE ? OR 
        a.content LIKE ? OR
        u.full_name LIKE ?
      )`;
            const searchTerm = `%${q}%`;
            params.push(searchTerm, searchTerm, searchTerm, searchTerm);
        }

        if (category) {
            query += ' AND c.slug = ?';
            params.push(category);
        }

        if (tag) {
            query += ` AND a.article_id IN (
        SELECT article_id FROM article_tags at2
        INNER JOIN tags t2 ON at2.tag_id = t2.tag_id
        WHERE t2.slug = ?
      )`;
            params.push(tag);
        }

        if (author) {
            query += ' AND u.username = ?';
            params.push(author);
        }

        if (dateFrom) {
            query += ' AND a.published_at >= ?';
            params.push(dateFrom);
        }

        if (dateTo) {
            query += ' AND a.published_at <= ?';
            params.push(dateTo);
        }

        if (minViews) {
            query += ' AND a.view_count >= ?';
            params.push(parseInt(minViews));
        }

        // Sort mapping
        const allowedSortFields = {
            published_at: 'a.published_at',
            view_count: 'a.view_count',
            like_count: 'a.like_count',
            title: 'a.title',
            created_at: 'a.created_at'
        };
        const sortField = allowedSortFields[sortBy] || 'a.published_at';
        const sortOrder = order.toLowerCase() === 'asc' ? 'ASC' : 'DESC';

        query += ` ORDER BY ${sortField} ${sortOrder} LIMIT ? OFFSET ?`;
        params.push(parseInt(limit), parseInt(offset));

        const [rows] = await db.query(query, params);
        return rows;
    }
}

module.exports = new ArticleModel();
