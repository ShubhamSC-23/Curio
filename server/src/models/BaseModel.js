const db = require('../config/database');

class BaseModel {
    constructor(table) {
        this.table = table;
    }

    async findById(id, columns = '*') {
        const [rows] = await db.query(
            `SELECT ${columns} FROM ${this.table} WHERE ${this.table.slice(0, -1)}_id = ?`,
            [id]
        );
        return rows[0];
    }

    async findAll(columns = '*', orderBy = 'created_at DESC') {
        const [rows] = await db.query(
            `SELECT ${columns} FROM ${this.table} ORDER BY ${orderBy}`
        );
        return rows;
    }

    async findOne(conditions, columns = '*') {
        const keys = Object.keys(conditions);
        const whereClause = keys.map(key => `${key} = ?`).join(' AND ');
        const values = Object.values(conditions);

        const [rows] = await db.query(
            `SELECT ${columns} FROM ${this.table} WHERE ${whereClause} LIMIT 1`,
            values
        );
        return rows[0];
    }

    async create(data) {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const placeholders = keys.map(() => '?').join(', ');

        const [result] = await db.query(
            `INSERT INTO ${this.table} (${keys.join(', ')}) VALUES (${placeholders})`,
            values
        );
        return result.insertId;
    }

    async update(id, data) {
        const keys = Object.keys(data);
        const values = Object.values(data);
        const setClause = keys.map(key => `${key} = ?`).join(', ');

        const [result] = await db.query(
            `UPDATE ${this.table} SET ${setClause} WHERE ${this.table.slice(0, -1)}_id = ?`,
            [...values, id]
        );
        return result.affectedRows > 0;
    }

    async delete(id) {
        const [result] = await db.query(
            `DELETE FROM ${this.table} WHERE ${this.table.slice(0, -1)}_id = ?`,
            [id]
        );
        return result.affectedRows > 0;
    }

    async count(conditions = {}) {
        const keys = Object.keys(conditions);
        let whereClause = '';
        let values = [];

        if (keys.length > 0) {
            whereClause = 'WHERE ' + keys.map(key => `${key} = ?`).join(' AND ');
            values = Object.values(conditions);
        }

        const [rows] = await db.query(
            `SELECT COUNT(*) as count FROM ${this.table} ${whereClause}`,
            values
        );
        return rows[0].count;
    }
}

module.exports = BaseModel;
