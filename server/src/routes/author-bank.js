const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const db = require('../config/database');

// ============================================
// ADD BANK ACCOUNT
// ============================================
router.post('/bank-account', protect, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const {
      account_holder_name,
      account_number,
      ifsc_code,
      bank_name,
      branch_name,
      upi_id
    } = req.body;

    // Validation
    if (!account_holder_name || !account_number || !ifsc_code) {
      return res.status(400).json({
        success: false,
        message: 'Account holder name, account number, and IFSC code are required'
      });
    }

    // Check if account already exists
    const [[existing]] = await db.query(
      `SELECT account_id FROM author_bank_accounts 
       WHERE user_id = ? AND account_number = ?`,
      [userId, account_number]
    );

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'This bank account is already added'
      });
    }

    // Add bank account
    const [result] = await db.query(
      `INSERT INTO author_bank_accounts 
       (user_id, account_holder_name, account_number, ifsc_code, 
        bank_name, branch_name, upi_id, is_verified) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, account_holder_name, account_number, ifsc_code,
       bank_name, branch_name, upi_id, false] // Set is_verified to false initially
    );

    res.json({
      success: true,
      message: 'Bank account added successfully. It will be verified shortly.',
      data: {
        account_id: result.insertId
      }
    });
  } catch (error) {
    console.error('Add bank account error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add bank account'
    });
  }
});

// ============================================
// GET MY BANK ACCOUNTS
// ============================================
router.get('/bank-accounts', protect, async (req, res) => {
  try {
    const userId = req.user.user_id;

    const [accounts] = await db.query(
      `SELECT account_id, account_holder_name, 
              CONCAT('****', RIGHT(account_number, 4)) as masked_account_number,
              ifsc_code, bank_name, branch_name, upi_id,
              is_verified, is_active, created_at
       FROM author_bank_accounts 
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [userId]
    );

    res.json({
      success: true,
      data: accounts
    });
  } catch (error) {
    console.error('Get bank accounts error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bank accounts'
    });
  }
});

// ============================================
// DELETE BANK ACCOUNT
// ============================================
router.delete('/bank-account/:account_id', protect, async (req, res) => {
  try {
    const userId = req.user.user_id;
    const { account_id } = req.params;

    await db.query(
      `DELETE FROM author_bank_accounts 
       WHERE account_id = ? AND user_id = ?`,
      [account_id, userId]
    );

    res.json({
      success: true,
      message: 'Bank account deleted successfully'
    });
  } catch (error) {
    console.error('Delete bank account error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete bank account'
    });
  }
});

module.exports = router;