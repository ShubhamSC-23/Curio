/**
 * 404 Not Found Middleware
 * Catches all unmatched routes
 */
const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    suggestion: 'Please check the API documentation for valid endpoints'
  });
};

module.exports = notFound;
