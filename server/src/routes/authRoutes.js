const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Auth Controller
const { 
  register, 
  login, 
  logout, 
  getMe 
} = require('../controllers/authController');

// Password Reset Controller
const {
  forgotPassword,
  resetPassword,
  verifyResetToken
} = require('../controllers/passwordResetController');

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

// @route   POST /api/v1/auth/register
// @desc    Register new user
// @access  Public
router.post('/register', register);

// @route   POST /api/v1/auth/login
// @desc    Login user
// @access  Public
router.post('/login', login);

// @route   POST /api/v1/auth/logout
// @desc    Logout user
// @access  Private
router.post('/logout', protect, logout);

// @route   GET /api/v1/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, getMe);

// ==========================================
// PASSWORD RESET ROUTES
// ==========================================

// @route   POST /api/v1/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password', forgotPassword);

// @route   POST /api/v1/auth/reset-password/:token
// @desc    Reset password with token
// @access  Public
router.post('/reset-password/:token', resetPassword);

// @route   GET /api/v1/auth/verify-reset-token/:token
// @desc    Verify if reset token is valid
// @access  Public
router.get('/verify-reset-token/:token', verifyResetToken);

module.exports = router;