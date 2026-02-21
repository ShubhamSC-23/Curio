require('dotenv').config();
const mysql = require('mysql2/promise');

async function addPayPalColumn() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT,
        });

        console.log('Connected to database...');

        // Add paypal_me_link column
        await connection.query('ALTER TABLE users ADD COLUMN paypal_me_link VARCHAR(255) DEFAULT NULL;');
        console.log('Column paypal_me_link added successfully.');

        await connection.end();
    } catch (error) {
        if (error.code === 'ER_DUP_FIELDNAME') {
            console.log('Column already exists.');
        } else {
            console.error('Migration failed:', error);
        }
    }
}

addPayPalColumn();
