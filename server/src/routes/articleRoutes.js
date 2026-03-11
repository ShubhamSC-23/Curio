const express = require('express');
const router = express.Router();
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { createLimiter } = require('../middleware/rateLimiter');
const {
  getArticles,
  getArticle,
  createArticle,
  updateArticle,
  deleteArticle,
  likeArticle,
  bookmarkArticle,
  getFollowingFeed,
  getLikeStatus,
  reportArticle,
} = require('../controllers/articleController');

// ============================================
// PUBLIC ROUTES (with optional translation support)
// ============================================

// Get all articles with optional language parameter
// Example: GET /api/v1/articles?lang=hi
router.get('/', optionalAuth, getArticles);

// Get following feed with translation support
// Example: GET /api/v1/articles/following-feed?lang=mr
router.get('/following-feed', protect, getFollowingFeed);

// Get single article by slug with translation support
// Example: GET /api/v1/articles/my-article-slug?lang=hi
router.get('/:slug', optionalAuth, getArticle);

// ============================================
// USER INTERACTION ROUTES
// ============================================

// Get like status
router.get('/:id/like-status', protect, getLikeStatus);

// Like/Unlike article
router.post('/:id/like', protect, likeArticle);

// Bookmark/Unbookmark article
router.post('/:id/bookmark', protect, bookmarkArticle);

// Report article
router.post('/:id/report', protect, reportArticle);

// ============================================
// PROTECTED ROUTES (Authors and Admins)
// ============================================

// Create new article
router.post('/', protect, authorize('author', 'admin'), createLimiter, createArticle);

// Update article
router.put('/:id', protect, authorize('author', 'admin'), updateArticle);

// Delete article (also deletes all translations via CASCADE)
router.delete('/:slug', protect, authorize('author', 'admin'), deleteArticle);

module.exports = router;