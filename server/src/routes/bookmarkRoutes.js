const express = require('express');
const router = express.Router();
const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { createLimiter } = require('../middleware/rateLimiter');
const {
  checkBookmark
} = require('../controllers/bookmarkController');


router.get('/check/:id', optionalAuth, checkBookmark);

module.exports = router;