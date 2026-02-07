const AppError = require('../utils/AppError');

/**
 * Global error handler middleware
 * Provides consistent error responses
 */
const errorHandler = (err, req, res, next) => {
    // Default values
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // Log error for debugging (not in production)
    if (process.env.NODE_ENV !== 'production') {
        console.error('Error:', err);
    }

    // Handle specific error types
    if (err.code === '23505') {
        // PostgreSQL unique constraint violation
        statusCode = 400;
        message = 'Duplicate entry found';
    }

    if (err.code === '22P02') {
        // PostgreSQL invalid UUID format
        statusCode = 400;
        message = 'Invalid ID format';
    }

    // Send response
    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
    });
};

module.exports = errorHandler;
