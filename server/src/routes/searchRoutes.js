const express = require('express');
const router = express.Router();
const {
  searchArticles,
  getSuggestions,
  getPopularSearches,
  getFiltersMetadata,
  advancedSearch,
  getSearchSuggestions,
} = require('../controllers/searchController');

// All search routes are public
router.get('/', advancedSearch);
router.get('/articles', searchArticles);
router.get('/suggestions', getSuggestions);
router.get('/popular', getPopularSearches);
router.get('/filters', getFiltersMetadata);
router.get('/suggestions', getSearchSuggestions);

module.exports = router;