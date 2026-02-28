const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const { protect } = require('../middleware/auth');
const db = require('../config/database');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Platform commission (0-20%)
const PLATFORM_COMMISSION = parseFloat(process.env.PLATFORM_COMMISSION_PERCENT || 0);

// ============================================
// CREATE DONATION ORDER (UPDATED)
// ============================================
router.post('/create-order', protect, async (req, res) => {
  try {
    const { amount, author_id, article_id, message } = req.body;
    const donor_user_id = req.user.user_id;

    if (!amount || amount < 1000) {
      return res.status(400).json({
        success: false,
        message: 'Minimum amount is ₹10'
      });
    }

    // Get author details
    const [[author]] = await db.query(
      'SELECT user_id, username, full_name FROM users WHERE user_id = ?',
      [author_id]
    );

    if (!author) {
      return res.status(404).json({
        success: false,
        message: 'Author not found'
      });
    }

    // Calculate platform fee and author amount
    const totalAmount = amount / 100; // Convert to rupees
    const platformFee = (totalAmount * PLATFORM_COMMISSION) / 100;
    const authorAmount = totalAmount - platformFee;

    // Create Razorpay order
    const options = {
      amount: amount,
      currency: 'INR',
      receipt: `donation_${Date.now()}`,
      notes: {
        donor_user_id,
        author_id,
        article_id: article_id || null,
        platform_fee: platformFee,
        author_amount: authorAmount,
      },
    };

    const order = await razorpay.orders.create(options);

    // Save donation record
    const [result] = await db.query(
      `INSERT INTO donations 
       (donor_user_id, author_user_id, article_id, amount, platform_fee, author_amount, 
        currency, razorpay_order_id, message, status, transfer_status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        donor_user_id,
        author_id,
        article_id || null,
        totalAmount,
        platformFee,
        authorAmount,
        'INR',
        order.id,
        message || null,
        'pending',
        'pending'
      ]
    );

    res.json({
      success: true,
      data: {
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        donation_id: result.insertId,
        breakdown: {
          total: totalAmount,
          platform_fee: platformFee,
          author_receives: authorAmount,
        }
      }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order'
    });
  }
});

// ============================================
// VERIFY PAYMENT & TRANSFER TO AUTHOR (UPDATED)
// ============================================
router.post('/verify-payment', protect, async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      donation_id,
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isValid = expectedSignature === razorpay_signature;

    if (!isValid) {
      await db.query(
        `UPDATE donations SET status = 'failed' WHERE donation_id = ?`,
        [donation_id]
      );
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed',
      });
    }

    // Update donation as completed
    await db.query(
      `UPDATE donations 
       SET razorpay_payment_id = ?, status = 'completed' 
       WHERE donation_id = ?`,
      [razorpay_payment_id, donation_id]
    );

    // Get donation details
    const [[donation]] = await db.query(
      `SELECT d.*, u.username, u.full_name 
       FROM donations d
       JOIN users u ON d.author_user_id = u.user_id
       WHERE d.donation_id = ?`,
      [donation_id]
    );

    // Transfer money to author (async - don't wait)
    transferToAuthor(donation).catch(err => {
      console.error('Transfer error:', err);
    });

    res.json({
      success: true,
      message: 'Payment verified successfully',
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment'
    });
  }
});

// ============================================
// TRANSFER MONEY TO AUTHOR
// ============================================
async function transferToAuthor(donation) {
  try {
    // Skip if no amount to transfer
    if (!donation.author_amount || donation.author_amount <= 0) {
      console.log('No amount to transfer');
      return;
    }

    // Get author's bank account
    const [[bankAccount]] = await db.query(
      `SELECT * FROM author_bank_accounts 
       WHERE user_id = ? AND is_active = TRUE AND is_verified = TRUE
       LIMIT 1`,
      [donation.author_user_id]
    );

    if (!bankAccount) {
      console.log('No bank account found for author:', donation.author_user_id);
      await db.query(
        `UPDATE donations 
         SET transfer_status = 'failed' 
         WHERE donation_id = ?`,
        [donation.donation_id]
      );
      return;
    }

    // Create or get fund account in Razorpay
    let fundAccountId = bankAccount.razorpay_fund_account_id;

    if (!fundAccountId) {
      // Create fund account in Razorpay
      const fundAccount = await razorpay.fundAccount.create({
        contact_id: await getOrCreateContact(donation.author_user_id, donation),
        account_type: 'bank_account',
        bank_account: {
          name: bankAccount.account_holder_name,
          ifsc: bankAccount.ifsc_code,
          account_number: bankAccount.account_number,
        }
      });

      fundAccountId = fundAccount.id;

      // Save fund account ID
      await db.query(
        `UPDATE author_bank_accounts 
         SET razorpay_fund_account_id = ? 
         WHERE account_id = ?`,
        [fundAccountId, bankAccount.account_id]
      );
    }

    // Create payout/transfer
    const transfer = await razorpay.transfers.create({
      account: fundAccountId,
      amount: Math.round(donation.author_amount * 100), // Convert to paise
      currency: 'INR',
      notes: {
        donation_id: donation.donation_id,
        author_id: donation.author_user_id,
        donor_id: donation.donor_user_id,
      }
    });

    // Update donation with transfer details
    await db.query(
      `UPDATE donations 
       SET transfer_id = ?, transfer_status = 'processed' 
       WHERE donation_id = ?`,
      [transfer.id, donation.donation_id]
    );

    console.log('Transfer successful:', transfer.id);

  } catch (error) {
    console.error('Transfer to author error:', error);
    await db.query(
      `UPDATE donations 
       SET transfer_status = 'failed' 
       WHERE donation_id = ?`,
      [donation.donation_id]
    );
  }
}

// ============================================
// GET OR CREATE RAZORPAY CONTACT
// ============================================
async function getOrCreateContact(userId, donation) {
  try {
    // Check if contact exists in our database
    const [[existing]] = await db.query(
      `SELECT razorpay_contact_id FROM users WHERE user_id = ?`,
      [userId]
    );

    if (existing && existing.razorpay_contact_id) {
      return existing.razorpay_contact_id;
    }

    // Create new contact in Razorpay
    const contact = await razorpay.contacts.create({
      name: donation.full_name || donation.username,
      email: donation.email || `user${userId}@curio.com`,
      contact: '9999999999', // You can get this from user profile
      type: 'vendor',
      reference_id: `user_${userId}`,
      notes: {
        user_id: userId
      }
    });

    // Save contact ID
    await db.query(
      `UPDATE users SET razorpay_contact_id = ? WHERE user_id = ?`,
      [contact.id, userId]
    );

    return contact.id;
  } catch (error) {
    console.error('Create contact error:', error);
    throw error;
  }
}

// ============================================
// GET DONATION STATS BY USER ID
// ============================================
router.get('/author/:userId/stats', async (req, res) => {
  try {
    const { userId } = req.params;

    const [[stats]] = await db.query(
      `SELECT 
        COALESCE(SUM(amount), 0) as total_amount,
        COUNT(*) as total_donations,
        COUNT(DISTINCT donor_user_id) as unique_donors
       FROM donations 
       WHERE author_user_id = ? AND status = 'completed'`,
      [userId]
    );

    res.json({
      success: true,
      data: {
        total_amount: parseFloat(stats.total_amount),
        total_donations: parseInt(stats.total_donations),
        unique_donors: parseInt(stats.unique_donors),
      }
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch donation statistics'
    });
  }
});

module.exports = router;