const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const { validateCreate, validateUpdate } = require('../middlewares/validateTask');

/**
 * Task Routes
 * Base path: /api/tasks
 */

// Create a new task
router.post('/', validateCreate, taskController.createTask);

// Get all tasks (with filtering and sorting)
router.get('/', taskController.getAllTasks);

// Get a single task by ID
router.get('/:id', taskController.getTaskById);

// Update a task
router.put('/:id', validateUpdate, taskController.updateTask);

// Delete a task
router.delete('/:id', taskController.deleteTask);

module.exports = router;
