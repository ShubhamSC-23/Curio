// Add these routes to your existing authRoutes.js file

const express = require('express');
const router = express.Router();
const {
  forgotPassword,
  resetPassword,
  verifyResetToken
} = require('../controllers/passwordResetController');

// Password Reset Routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/verify-reset-token/:token', verifyResetToken);

module.exports = router;
