const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getDashboard,
  getMyArticles,
  getArticleStats,
  getProfile,
  updateProfile,
  applyAsAuthor,
  getEngagementAnalytics
} = require('../controllers/authorController');

// Apply as author (for regular users)
router.post('/apply', protect, authorize('user'), applyAsAuthor);

// All other routes require author or admin role
router.use(protect);
router.use(authorize('author', 'admin'));

// Dashboard & Analytics
router.get('/dashboard', getDashboard);
router.get('/analytics/engagement', getEngagementAnalytics);

// Articles management
router.get('/articles', getMyArticles);
router.get('/articles/:id/stats', getArticleStats);

// Profile management
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

module.exports = router;