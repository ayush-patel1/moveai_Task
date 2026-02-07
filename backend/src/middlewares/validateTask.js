const AppError = require('../utils/AppError');

/**
 * Allowed values for validation
 */
const VALID_STATUS = ['todo', 'in_progress', 'done'];
const VALID_PRIORITY = ['low', 'medium', 'high'];

/**
 * Validate task creation input
 */
const validateCreate = (req, res, next) => {
    const { title, priority, due_date, status } = req.body;
    const errors = [];

    // Title is required and cannot be empty
    if (!title || title.trim() === '') {
        errors.push('Title is required');
    }

    // Priority is required and must be valid
    if (!priority) {
        errors.push('Priority is required');
    } else if (!VALID_PRIORITY.includes(priority)) {
        errors.push(`Priority must be one of: ${VALID_PRIORITY.join(', ')}`);
    }

    // Due date is required
    if (!due_date) {
        errors.push('Due date is required');
    } else {
        const dueDateTime = new Date(due_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (isNaN(dueDateTime.getTime())) {
            errors.push('Due date is not a valid date');
        } else if (dueDateTime < today) {
            errors.push('Due date cannot be in the past');
        }
    }

    // Status validation (optional on create, defaults to 'todo')
    if (status && !VALID_STATUS.includes(status)) {
        errors.push(`Status must be one of: ${VALID_STATUS.join(', ')}`);
    }

    if (errors.length > 0) {
        return next(new AppError(errors.join('. '), 400));
    }

    next();
};

/**
 * Validate task update input
 */
const validateUpdate = (req, res, next) => {
    const { title, priority, status } = req.body;
    const errors = [];

    // Title cannot be empty if provided
    if (title !== undefined && title.trim() === '') {
        errors.push('Title cannot be empty');
    }

    // Validate priority if provided
    if (priority && !VALID_PRIORITY.includes(priority)) {
        errors.push(`Priority must be one of: ${VALID_PRIORITY.join(', ')}`);
    }

    // Validate status if provided
    if (status && !VALID_STATUS.includes(status)) {
        errors.push(`Status must be one of: ${VALID_STATUS.join(', ')}`);
    }

    if (errors.length > 0) {
        return next(new AppError(errors.join('. '), 400));
    }

    next();
};

module.exports = {
    validateCreate,
    validateUpdate
};
