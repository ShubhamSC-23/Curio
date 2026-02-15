const express = require('express');
const router = express.Router();
const {
  searchArticles,
  getSuggestions,
  getPopularSearches,
  getFiltersMetadata
} = require('../controllers/searchController');

// All search routes are public
router.get('/articles', searchArticles);
router.get('/suggestions', getSuggestions);
router.get('/popular', getPopularSearches);
router.get('/filters', getFiltersMetadata);

module.exports = router;