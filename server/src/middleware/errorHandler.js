/**
 * Global Error Handler Middleware
 * Catches all errors and sends appropriate response
 */
const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error('Error:', err);

  // Default error
  let error = { ...err };
  error.message = err.message;

  // Mongoose/MySQL duplicate key error
  if (err.code === 'ER_DUP_ENTRY') {
    const field = err.sqlMessage.match(/for key '(.+?)'/)?.[1] || 'field';
    error.message = `Duplicate value for ${field}. Please use another value.`;
    error.statusCode = 400;
  }

  // MySQL foreign key constraint error
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    error.message = 'Referenced resource does not exist';
    error.statusCode = 400;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token. Please log in again.';
    error.statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expired. Please log in again.';
    error.statusCode = 401;
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    error.message = err.message;
    error.statusCode = 400;
  }

  // MySQL syntax errors
  if (err.code && err.code.startsWith('ER_')) {
    console.error('MySQL Error:', err.code, err.sqlMessage);
    error.message = 'Database operation failed';
    error.statusCode = 500;
  }

  // File upload errors (Multer)
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      error.message = 'File too large. Maximum size is 5MB';
      error.statusCode = 400;
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      error.message = 'Unexpected file field';
      error.statusCode = 400;
    } else {
      error.message = 'File upload error';
      error.statusCode = 400;
    }
  }

  // Send error response
  res.status(error.statusCode || err.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      details: err 
    })
  });
};

module.exports = errorHandler;
