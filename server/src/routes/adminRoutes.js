const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getDashboard,
  getUsers,
  getPendingAuthors,
  approveAuthor,
  rejectAuthor,
  getPendingArticles,
  approveArticle,
  rejectArticle,
  toggleUserStatus,
  getReports,
  resolveReport,
  getAllArticles,
  getReportedArticles,
  dismissArticleReport,
  dismissAllArticleReports,
  deleteArticle,
  updateUserRole,
  banUser,
  unbanUser,
  deleteUser,
  getComments,
  approveComment,
  deleteComment,
  getReportedComments,
  dismissAllCommentReports,
  toggleFeatured,
} = require('../controllers/adminController');

// ===== APPLY MIDDLEWARE TO ALL ADMIN ROUTES =====
// All admin routes require authentication and admin role
router.use(protect);
router.use(authorize('admin'));

// ===== DASHBOARD =====
router.get('/dashboard', getDashboard);

// ===== USER MANAGEMENT =====
router.get('/users', getUsers);
router.put('/users/:id/toggle-status', toggleUserStatus);
router.put('/users/:id/role', updateUserRole);
router.post('/users/:id/ban', banUser);
router.post('/users/:id/unban', unbanUser);
router.delete('/users/:id', deleteUser);

// ===== AUTHOR MANAGEMENT =====
router.get('/authors/pending', getPendingAuthors);
router.put('/authors/:id/approve', approveAuthor);
router.put('/authors/:id/reject', rejectAuthor);

// ===== ARTICLE MANAGEMENT =====
router.get('/articles', getAllArticles);
router.get('/articles/pending', getPendingArticles);
router.put('/articles/:id/approve', approveArticle);
router.put('/articles/:id/reject', rejectArticle);
router.put('/articles/:id/feature', toggleFeatured);
router.delete('/articles/:id', deleteArticle);

// ===== ARTICLE REPORTS =====
router.get('/reports/articles', getReportedArticles);
router.delete('/reports/articles/:reportId', dismissArticleReport);
router.delete('/reports/articles/all/:articleId', dismissAllArticleReports);

// ===== COMMENT MANAGEMENT =====
router.get('/comments', getComments);
router.post('/comments/:id/approve', approveComment);
router.delete('/comments/:id', deleteComment);

// ===== COMMENT REPORTS =====
router.get('/reports/comments', getReportedComments);
router.delete('/reports/comments/all/:commentId', dismissAllCommentReports);

// ===== GENERAL REPORTS =====
router.get('/reports', getReports);
router.put('/reports/:id/resolve', resolveReport);

module.exports = router;