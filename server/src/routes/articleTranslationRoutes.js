const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getTranslations,
  getTranslation,
  addOrUpdateTranslation,
  deleteTranslation,
  checkTranslationExists,
  getTranslationStats,
  bulkImportTranslations
} = require('../controllers/articleTranslationController');

// ============================================
// PUBLIC ROUTES
// ============================================

// Get all translations for an article
// GET /api/v1/article-translations/:articleId
router.get('/:articleId', getTranslations);

// Get translation statistics
// GET /api/v1/article-translations/:articleId/stats
router.get('/:articleId/stats', getTranslationStats);

// Check if translation exists
// GET /api/v1/article-translations/:articleId/check/:languageCode
router.get('/:articleId/check/:languageCode', checkTranslationExists);

// Get single translation
// GET /api/v1/article-translations/:articleId/:languageCode
router.get('/:articleId/:languageCode', getTranslation);

// ============================================
// PROTECTED ROUTES (Author/Admin only)
// ============================================

// Add or update translation
// POST /api/v1/article-translations/:articleId
// Body: { language_code, title, excerpt, content, slug, meta_description }
router.post('/:articleId', protect, authorize('author', 'admin'), addOrUpdateTranslation);

// Bulk import translations
// POST /api/v1/article-translations/:articleId/bulk-import
// Body: { translations: [{ language_code, title, content, ... }] }
router.post('/:articleId/bulk-import', protect, authorize('author', 'admin'), bulkImportTranslations);

// Delete translation
// DELETE /api/v1/article-translations/:articleId/:languageCode
router.delete('/:articleId/:languageCode', protect, authorize('author', 'admin'), deleteTranslation);

module.exports = router;