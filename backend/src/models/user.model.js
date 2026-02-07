const pool = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
    /**
     * Create a new user
     */
    static async create(userData) {
        const { name, email, password } = userData;

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const query = `
            INSERT INTO users (name, email, password)
            VALUES ($1, $2, $3)
            RETURNING id, name, email, created_at
        `;

        const values = [name, email, hashedPassword];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    /**
     * Find user by email
     */
    static async findByEmail(email) {
        const query = 'SELECT * FROM users WHERE email = $1';
        const result = await pool.query(query, [email]);
        return result.rows[0];
    }

    /**
     * Find user by ID
     */
    static async findById(id) {
        const query = 'SELECT id, name, email, created_at FROM users WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    /**
     * Compare password
     */
    static async comparePassword(password, hashedPassword) {
        return bcrypt.compare(password, hashedPassword);
    }
}

module.exports = User;
