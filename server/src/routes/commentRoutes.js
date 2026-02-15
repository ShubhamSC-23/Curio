const express = require('express');
const router = express.Router();
const { protect, optionalAuth } = require('../middleware/auth');
const {
  getComments,
  createComment,
  updateComment,
  deleteComment,
  likeComment,
  reportComment
} = require('../controllers/commentController');

// Public routes
router.get('/', getComments);
router.post('/:id/report', optionalAuth, reportComment);

// Protected routes
router.post('/', protect, createComment);
router.put('/:id', protect, updateComment);
router.delete('/:id', protect, deleteComment);
router.post('/:id/like', protect, likeComment);

module.exports = router;