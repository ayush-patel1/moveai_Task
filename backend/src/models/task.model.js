const pool = require('../config/db');

class Task {
    static async create(taskData) {
        const { title, description, status = 'todo', priority = 'medium', due_date } = taskData;

        const query = `
      INSERT INTO tasks (title, description, status, priority, due_date)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

        const values = [title, description, status, priority, due_date];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async findAll(filters = {}) {
        let query = 'SELECT * FROM tasks WHERE 1=1';
        const values = [];
        let paramCount = 1;

        if (filters.status) {
            query += ` AND status = $${paramCount}`;
            values.push(filters.status);
            paramCount++;
        }

        if (filters.priority) {
            query += ` AND priority = $${paramCount}`;
            values.push(filters.priority);
            paramCount++;
        }

        // Sorting
        const sortBy = filters.sortBy || 'created_at';
        const order = filters.order === 'asc' ? 'ASC' : 'DESC';
        query += ` ORDER BY ${sortBy} ${order}`;

        const result = await pool.query(query, values);
        return result.rows;
    }

    static async findById(id) {
        const query = 'SELECT * FROM tasks WHERE id = $1';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }

    static async update(id, taskData) {
        const { title, description, status, priority, due_date } = taskData;

        const query = `
      UPDATE tasks 
      SET title = COALESCE($1, title),
          description = COALESCE($2, description),
          status = COALESCE($3, status),
          priority = COALESCE($4, priority),
          due_date = COALESCE($5, due_date),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $6
      RETURNING *
    `;

        const values = [title, description, status, priority, due_date, id];
        const result = await pool.query(query, values);
        return result.rows[0];
    }

    static async delete(id) {
        const query = 'DELETE FROM tasks WHERE id = $1 RETURNING *';
        const result = await pool.query(query, [id]);
        return result.rows[0];
    }
}

module.exports = Task;
