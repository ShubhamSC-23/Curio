const express = require('express');
const router = express.Router();
const { protect, optionalAuth } = require('../middleware/auth');
const {
  getReadingList,
  addToReadingList,
  markAsRead,
  removeFromReadingList,
  checkReadingList,
} = require('../controllers/readingListController');

// All routes are protected
router.get('/check/:id', protect, checkReadingList);
router.get('/', protect, getReadingList);
router.post('/:articleId', protect, addToReadingList);
router.put('/:articleId/mark-read', protect, markAsRead);
router.delete('/:articleId', protect, removeFromReadingList);


module.exports = router;
