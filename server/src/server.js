const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const path = require('path');
require('dotenv').config();

// Initialize Express app
const app = express();

// ========================================
// SECURITY MIDDLEWARE
// ========================================
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
); // Set security headers
app.use(compression()); // Compress responses

// ========================================
// CORS CONFIGURATION
// ========================================
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// ========================================
// BODY PARSER MIDDLEWARE
// ========================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// ========================================
// LOGGING MIDDLEWARE
// ========================================
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ========================================
// STATIC FILES
// ========================================
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ========================================
// TEST DATABASE CONNECTION
// ========================================
require('./config/database');

// ========================================
// API ROUTES
// ========================================
const API_VERSION = process.env.API_VERSION || 'v1';

// Health check route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Article Publishing Platform API',
    version: '1.0.0',
    status: 'running',
    timestamp: new Date().toISOString()
  });
});

// API health check
app.get(`/api/${API_VERSION}/health`, (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const articleRoutes = require('./routes/articleRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const commentRoutes = require('./routes/commentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const authorRoutes = require('./routes/authorRoutes');
const searchRoutes = require('./routes/searchRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const readingListRoutes = require('./routes/readingListRoutes');
const bookmarkRoutes = require('./routes/bookmarkRoutes');
const contactRoutes = require('./routes/contactRoutes');


// Mount API routes
app.use(`/api/${API_VERSION}/auth`, authRoutes);
app.use(`/api/${API_VERSION}/users`, userRoutes);
app.use(`/api/${API_VERSION}/articles`, articleRoutes);
app.use(`/api/${API_VERSION}/categories`, categoryRoutes);
app.use(`/api/${API_VERSION}/comments`, commentRoutes);
app.use(`/api/${API_VERSION}/admin`, adminRoutes);
app.use(`/api/${API_VERSION}/author`, authorRoutes);
app.use(`/api/${API_VERSION}/search`, searchRoutes);
app.use(`/api/${API_VERSION}/upload`, uploadRoutes);
app.use(`/api/${API_VERSION}/notifications`, notificationRoutes);
app.use(`/api/${API_VERSION}/reading-list`, readingListRoutes);
app.use(`/api/${API_VERSION}/bookmarks`, bookmarkRoutes);
app.use(`/api/${API_VERSION}/contact`, contactRoutes);


// ========================================
// ERROR HANDLING
// ========================================
const notFound = require('./middleware/notFound');
const errorHandler = require('./middleware/errorHandler');

app.use(notFound); // 404 handler
app.use(errorHandler); // Global error handler

// ========================================
// START SERVER
// ========================================
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log('\n========================================');
  console.log('🚀 Article Publishing Platform API');
  console.log('========================================');
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✓ API Version: ${API_VERSION}`);
  console.log(`✓ Base URL: http://localhost:${PORT}`);
  console.log(`✓ API URL: http://localhost:${PORT}/api/${API_VERSION}`);
  console.log('========================================');
  console.log('📚 Available Routes:');
  console.log('  ✓ /api/v1/auth - Authentication');
  console.log('  ✓ /api/v1/users - User Management');
  console.log('  ✓ /api/v1/articles - Articles');
  console.log('  ✓ /api/v1/categories - Categories');
  console.log('  ✓ /api/v1/comments - Comments');
  console.log('  ✓ /api/v1/admin - Admin Panel');
  console.log('  ✓ /api/v1/author - Author Dashboard');
  console.log('  ✓ /api/v1/search - Search & Filters');
  console.log('  ✓ /api/v1/upload - File Uploads');
  console.log('  ✓ /api/v1/notifications - Notifications');
  console.log('========================================\n');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err.message);
  // Close server & exit process
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err.message);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

module.exports = app;