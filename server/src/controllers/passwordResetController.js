const db = require('../config/database');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { sendEmail } = require('../config/email');
const { passwordResetEmail, passwordChangedEmail } = require('../utils/emailTemplates');

/**
 * @desc    Request password reset
 * @route   POST /api/v1/auth/forgot-password
 * @access  Public
 */
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Validate email
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an email address'
      });
    }

    // Check if user exists
    const [users] = await db.query(
      'SELECT user_id, username, email FROM users WHERE email = ?',
      [email]
    );

    // Always return success message (security best practice)
    // Don't reveal if email exists or not
    if (users.length === 0) {
      return res.json({
        success: true,
        message: 'If that email exists, a password reset link has been sent'
      });
    }

    const user = users[0];

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    // Set token expiry (1 hour from now)
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    // Save reset token to database
    await db.query(
      `UPDATE users 
       SET reset_password_token = ?, 
           reset_password_expire = ? 
       WHERE user_id = ?`,
      [resetTokenHash, resetTokenExpiry, user.user_id]
    );

    // Send email
    try {
      await sendEmail({
        to: user.email,
        subject: 'Password Reset Request - Curio',
        html: passwordResetEmail(user.username, resetToken),
      });

      res.json({
        success: true,
        message: 'If that email exists, a password reset link has been sent'
      });
    } catch (emailError) {
      // If email fails, remove token from database
      await db.query(
        `UPDATE users 
         SET reset_password_token = NULL, 
             reset_password_expire = NULL 
         WHERE user_id = ?`,
        [user.user_id]
      );

      console.error('Email sending failed:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Email could not be sent. Please try again later.'
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    next(error);
  }
};

/**
 * @desc    Reset password
 * @route   POST /api/v1/auth/reset-password/:token
 * @access  Public
 */
exports.resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Validate password
    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a new password'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Hash the token from URL
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Find user with valid token
    const [users] = await db.query(
      `SELECT user_id, username, email 
       FROM users 
       WHERE reset_password_token = ? 
       AND reset_password_expire > NOW()`,
      [resetTokenHash]
    );

    if (users.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    const user = users[0];

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Update password and clear reset token
    await db.query(
      `UPDATE users 
       SET password = ?,
           reset_password_token = NULL,
           reset_password_expire = NULL
       WHERE user_id = ?`,
      [hashedPassword, user.user_id]
    );

    // Send confirmation email
    try {
      await sendEmail({
        to: user.email,
        subject: 'Password Changed Successfully - Curio',
        html: passwordChangedEmail(user.username),
      });
    } catch (emailError) {
      console.error('Confirmation email failed:', emailError);
      // Don't fail the request if confirmation email fails
    }

    res.json({
      success: true,
      message: 'Password has been reset successfully'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    next(error);
  }
};

/**
 * @desc    Verify reset token
 * @route   GET /api/v1/auth/verify-reset-token/:token
 * @access  Public
 */
exports.verifyResetToken = async (req, res, next) => {
  try {
    const { token } = req.params;

    // Hash the token
    const resetTokenHash = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    // Check if token is valid and not expired
    const [users] = await db.query(
      `SELECT user_id 
       FROM users 
       WHERE reset_password_token = ? 
       AND reset_password_expire > NOW()`,
      [resetTokenHash]
    );

    if (users.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    res.json({
      success: true,
      message: 'Token is valid'
    });
  } catch (error) {
    console.error('Verify token error:', error);
    next(error);
  }
};

module.exports = exports;
