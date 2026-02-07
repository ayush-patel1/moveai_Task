const pool = require('../config/db');

class Task {
    static async create(taskData, userId) {
        const { title, description, status = 'todo', priority = 'medium', due_date } = taskData;

        const query = `
            INSERT INTO tasks (title, description, status, priority, due_date, user_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
        `;

        const values = [title, description, status, priority, due_date, userId];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async findAll(filters = {}, userId) {
        // Include is_overdue computed field
        let query = `
            SELECT *, 
                CASE 
                    WHEN status != 'done' AND due_date < CURRENT_DATE THEN true 
                    ELSE false 
                END as is_overdue
            FROM tasks WHERE user_id = $1
        `;
        const values = [userId];
        let paramCount = 2;

        // Filter by status
        if (filters.status) {
            query += ` AND status = $${paramCount}`;
            values.push(filters.status);
            paramCount++;
        }

        // Filter by priority
        if (filters.priority) {
            query += ` AND priority = $${paramCount}`;
            values.push(filters.priority);
            paramCount++;
        }

        // Filter overdue tasks only
        if (filters.overdue) {
            query += ` AND status != 'done' AND due_date < CURRENT_DATE`;
        }

        // Sorting - whitelist allowed columns to prevent SQL injection
        const allowedSortColumns = ['created_at', 'due_date', 'priority', 'status', 'title'];
        const sortBy = allowedSortColumns.includes(filters.sortBy) ? filters.sortBy : 'created_at';
        const order = filters.order === 'asc' ? 'ASC' : 'DESC';
        query += ` ORDER BY ${sortBy} ${order}`;

        const result = await pool.query(query, values);
        return result.rows;
    }

    static async findById(id, userId) {
        const query = 'SELECT * FROM tasks WHERE id = $1 AND user_id = $2';
        const result = await pool.query(query, [id, userId]);
        return result.rows[0];
    }

    static async update(id, taskData, userId) {
        const { title, description, status, priority, due_date } = taskData;

        const query = `
            UPDATE tasks 
            SET title = COALESCE($1, title),
                description = COALESCE($2, description),
                status = COALESCE($3, status),
                priority = COALESCE($4, priority),
                due_date = COALESCE($5, due_date),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $6 AND user_id = $7
            RETURNING *
        `;

        const values = [title, description, status, priority, due_date, id, userId];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async delete(id, userId) {
        const query = 'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING *';
        const result = await pool.query(query, [id, userId]);
        return result.rows[0];
    }
}

module.exports = Task;
