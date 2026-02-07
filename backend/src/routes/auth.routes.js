const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth');

/**
 * Auth Routes
 * Base path: /api/auth
 */

// Register a new user
router.post('/register', authController.register);

// Login user
router.post('/login', authController.login);

// Get current user (protected)
router.get('/me', protect, authController.getMe);

module.exports = router;
