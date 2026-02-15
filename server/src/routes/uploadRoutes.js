const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const { uploadConfigs, handleUploadError } = require('../middleware/upload');
const { uploadLimiter } = require('../middleware/rateLimiter');
const {
  uploadProfilePicture,
  uploadArticleImage,
  uploadMultipleImages,
  getUserMedia,
  deleteMedia,
  updateMediaMetadata
} = require('../controllers/uploadController');

// Profile picture upload (all authenticated users)
router.post(
  '/profile',
  protect,
  uploadLimiter,
  uploadConfigs.profileImage,
  handleUploadError,
  uploadProfilePicture
);

// Article image uploads (authors and admins only)
router.post(
  '/article',
  protect,
  authorize('author', 'admin'),
  uploadLimiter,
  uploadConfigs.featuredImage,
  handleUploadError,
  uploadArticleImage
);

router.post(
  '/article/multiple',
  protect,
  authorize('author', 'admin'),
  uploadLimiter,
  uploadConfigs.articleImages,
  handleUploadError,
  uploadMultipleImages
);

// Media library management
router.get('/media', protect, getUserMedia);
router.delete('/media/:id', protect, deleteMedia);
router.put('/media/:id', protect, updateMediaMetadata);

module.exports = router;