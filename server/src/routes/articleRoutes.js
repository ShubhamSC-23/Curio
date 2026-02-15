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




// Public routes
router.get('/', optionalAuth, getArticles);
router.get('/following-feed', protect, getFollowingFeed);
router.get('/:slug', optionalAuth, getArticle);



// User interaction routes
router.get('/:id/like-status', protect, getLikeStatus);
router.post('/:id/like', protect, likeArticle);
router.post('/:id/bookmark', protect, bookmarkArticle);
router.post('/:id/report', protect, reportArticle);



// Protected routes (Authors and Admins)
router.post('/', protect, authorize('author', 'admin'), createLimiter, createArticle);
router.put('/:id', protect, authorize('author', 'admin'), updateArticle);
router.delete('/:slug', protect, authorize('author', 'admin'), deleteArticle);



module.exports = router;