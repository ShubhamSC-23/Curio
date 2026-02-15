const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

/**
 * Configure storage for file uploads
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine upload path based on file type
    let uploadPath = 'uploads/media';
    
    if (file.fieldname === 'profileImage') {
      uploadPath = 'uploads/profiles';
    } else if (file.fieldname === 'featuredImage' || file.fieldname === 'articleImage') {
      uploadPath = 'uploads/articles';
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

/**
 * File filter to validate file types
 */
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = process.env.ALLOWED_IMAGE_TYPES 
    ? process.env.ALLOWED_IMAGE_TYPES.split(',')
    : ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`), false);
  }
};

/**
 * Configure multer upload
 */
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880 // 5MB default
  },
  fileFilter: fileFilter
});

/**
 * Upload configurations for different scenarios
 */
const uploadConfigs = {
  // Single profile image
  profileImage: upload.single('profileImage'),
  
  // Single featured image for articles
  featuredImage: upload.single('featuredImage'),
  
  // Multiple images for article content
  articleImages: upload.array('images', 10),
  
  // Single image for any purpose
  singleImage: upload.single('image'),
  
  // Multiple files (mixed types)
  multipleFiles: upload.array('files', 10)
};

/**
 * Handle multer errors
 */
const handleUploadError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field'
      });
    }
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  next();
};

module.exports = {
  upload,
  uploadConfigs,
  handleUploadError
};
