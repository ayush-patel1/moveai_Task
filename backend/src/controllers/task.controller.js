const Task = require('../models/task.model');
const AppError = require('../utils/AppError');

/**
 * Create a new task
 * POST /api/tasks
 */
const createTask = async (req, res, next) => {
    try {
        const { title, description, priority, due_date, status } = req.body;
        const userId = req.user.id;

        const task = await Task.create({
            title: title.trim(),
            description: description?.trim() || null,
            priority,
            due_date,
            status
        }, userId);

        res.status(201).json({
            success: true,
            message: 'Task created successfully',
            data: task
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get all tasks with filtering, sorting, and pagination
 * GET /api/tasks
 */
const getAllTasks = async (req, res, next) => {
    try {
        const { status, priority, sortBy, order, overdue, page, limit } = req.query;
        const userId = req.user.id;

        const result = await Task.findAll({
            status,
            priority,
            sortBy: sortBy || 'created_at',
            order: order || 'desc',
            overdue: overdue === 'true',
            page,
            limit
        }, userId);

        res.status(200).json({
            success: true,
            count: result.tasks.length,
            pagination: result.pagination,
            data: result.tasks
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Get a single task by ID
 * GET /api/tasks/:id
 */
const getTaskById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        const task = await Task.findById(id, userId);

        if (!task) {
            return next(new AppError('Task not found', 404));
        }

        res.status(200).json({
            success: true,
            data: task
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update a task
 * PUT /api/tasks/:id
 */
const updateTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description, priority, due_date, status } = req.body;
        const userId = req.user.id;

        // Check if task exists
        const existingTask = await Task.findById(id, userId);
        if (!existingTask) {
            return next(new AppError('Task not found', 404));
        }

        const task = await Task.update(id, {
            title: title?.trim(),
            description: description?.trim(),
            priority,
            due_date,
            status
        }, userId);

        res.status(200).json({
            success: true,
            message: 'Task updated successfully',
            data: task
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete a task
 * DELETE /api/tasks/:id
 */
const deleteTask = async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const task = await Task.delete(id, userId);

        if (!task) {
            return next(new AppError('Task not found', 404));
        }

        res.status(200).json({
            success: true,
            message: 'Task deleted successfully',
            data: task
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask
};
