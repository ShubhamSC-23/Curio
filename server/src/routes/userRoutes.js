const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getUserProfile,
  updateProfile,
  getBookmarks,
  getLikedArticles,
  followAuthor,
  getFollowing,
  deleteAccount,      
  getCurrentUser,
  getUserStats,      
  getUserBadges,
  uploadProfileImage, 
  removeProfileImage,
  getAuthors, 
  followUser,
  unfollowUser,
} = require('../controllers/userController');

// Public routes;
router.get('/:userId/stats', getUserStats);
router.get('/:userId/badges', getUserBadges);
router.get('/authors', getAuthors);

// Protected routes
router.get('/me', protect, getCurrentUser);    
router.get('/me/following', protect, getFollowing);  
router.get('/:username', getUserProfile)     
router.put('/me', protect, updateProfile);            
router.put('/profile', protect, updateProfile);       
router.delete('/me', protect, deleteAccount);         
router.get('/me/bookmarks', protect, getBookmarks);
router.get('/me/likes', protect, getLikedArticles);
router.post('/:id/follow', protect, followUser);
router.delete('/:id/follow', protect, unfollowUser);
router.post('/:id/follow', protect, followAuthor);
router.post('/me/profile-image', protect, uploadProfileImage);
router.delete('/me/profile-image', protect, removeProfileImage);

module.exports = router;