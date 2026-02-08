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
        // Build WHERE clause conditions
        let whereClause = 'WHERE user_id = $1';
        const values = [userId];
        let paramCount = 2;

        // Filter by status
        if (filters.status) {
            whereClause += ` AND status = $${paramCount}`;
            values.push(filters.status);
            paramCount++;
        }

        // Filter by priority
        if (filters.priority) {
            whereClause += ` AND priority = $${paramCount}`;
            values.push(filters.priority);
            paramCount++;
        }

        // Filter overdue tasks only
        if (filters.overdue) {
            whereClause += ` AND status != 'done' AND due_date < CURRENT_DATE`;
        }

        // Count query for pagination
        const countQuery = `SELECT COUNT(*) FROM tasks ${whereClause}`;
        const countResult = await pool.query(countQuery, values);
        const total = parseInt(countResult.rows[0].count, 10);

        // Main query with is_overdue computed field
        let query = `
            SELECT *, 
                CASE 
                    WHEN status != 'done' AND due_date < CURRENT_DATE THEN true 
                    ELSE false 
                END as is_overdue
            FROM tasks ${whereClause}
        `;

        // Sorting - whitelist allowed columns to prevent SQL injection
        const allowedSortColumns = ['created_at', 'due_date', 'priority', 'status', 'title'];
        const sortBy = allowedSortColumns.includes(filters.sortBy) ? filters.sortBy : 'created_at';
        const order = filters.order === 'asc' ? 'ASC' : 'DESC';
        query += ` ORDER BY ${sortBy} ${order}`;

        // Pagination
        const page = Math.max(1, parseInt(filters.page, 10) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(filters.limit, 10) || 10));
        const offset = (page - 1) * limit;

        query += ` LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
        values.push(limit, offset);

        const result = await pool.query(query, values);

        return {
            tasks: result.rows,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
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
