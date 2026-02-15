const path = require('path');
const fs = require('fs').promises;
const db = require('../config/database');

/**
 * @desc    Upload profile picture
 * @route   POST /api/v1/upload/profile
 * @access  Private
 */
exports.uploadProfilePicture = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file'
      });
    }

    // File path relative to uploads directory
    const filePath = `/uploads/profiles/${req.file.filename}`;

    // Update user profile
    await db.query(
      'UPDATE users SET profile_image = ? WHERE user_id = ?',
      [filePath, req.user.user_id]
    );

    res.json({
      success: true,
      message: 'Profile picture uploaded successfully',
      data: {
        filename: req.file.filename,
        path: filePath,
        url: `${req.protocol}://${req.get('host')}${filePath}`
      }
    });
  } catch (error) {
    // Delete uploaded file if database update fails
    if (req.file) {
      await fs.unlink(req.file.path).catch(console.error);
    }
    console.error('Upload profile picture error:', error);
    next(error);
  }
};

/**
 * @desc    Upload article image
 * @route   POST /api/v1/upload/article
 * @access  Private (Author/Admin)
 */
exports.uploadArticleImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file'
      });
    }

    // File path relative to uploads directory
    const filePath = `/uploads/articles/${req.file.filename}`;

    // Store in media library
    const [result] = await db.query(
      `INSERT INTO media 
        (uploaded_by, file_name, file_path, file_type, file_size, mime_type)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        req.user.user_id,
        req.file.originalname,
        filePath,
        'image',
        req.file.size,
        req.file.mimetype
      ]
    );

    res.json({
      success: true,
      message: 'Article image uploaded successfully',
      data: {
        media_id: result.insertId,
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: filePath,
        url: `${req.protocol}://${req.get('host')}${filePath}`,
        size: req.file.size,
        mimetype: req.file.mimetype
      }
    });
  } catch (error) {
    // Delete uploaded file if database insert fails
    if (req.file) {
      await fs.unlink(req.file.path).catch(console.error);
    }
    console.error('Upload article image error:', error);
    next(error);
  }
};

/**
 * @desc    Upload multiple article images
 * @route   POST /api/v1/upload/article/multiple
 * @access  Private (Author/Admin)
 */
exports.uploadMultipleImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload at least one image'
      });
    }

    const uploadedFiles = [];

    for (const file of req.files) {
      const filePath = `/uploads/articles/${file.filename}`;

      // Store in media library
      const [result] = await db.query(
        `INSERT INTO media 
          (uploaded_by, file_name, file_path, file_type, file_size, mime_type)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          req.user.user_id,
          file.originalname,
          filePath,
          'image',
          file.size,
          file.mimetype
        ]
      );

      uploadedFiles.push({
        media_id: result.insertId,
        filename: file.filename,
        originalName: file.originalname,
        path: filePath,
        url: `${req.protocol}://${req.get('host')}${filePath}`,
        size: file.size
      });
    }

    res.json({
      success: true,
      message: `${uploadedFiles.length} image(s) uploaded successfully`,
      count: uploadedFiles.length,
      data: uploadedFiles
    });
  } catch (error) {
    // Delete uploaded files if error occurs
    if (req.files) {
      for (const file of req.files) {
        await fs.unlink(file.path).catch(console.error);
      }
    }
    console.error('Upload multiple images error:', error);
    next(error);
  }
};

/**
 * @desc    Get user's uploaded media
 * @route   GET /api/v1/upload/media
 * @access  Private
 */
exports.getUserMedia = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const offset = (page - 1) * limit;

    const [media] = await db.query(
      `SELECT * FROM media
       WHERE uploaded_by = ?
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [req.user.user_id, parseInt(limit), offset]
    );

    // Get total count
    const [count] = await db.query(
      'SELECT COUNT(*) as total FROM media WHERE uploaded_by = ?',
      [req.user.user_id]
    );

    // Add full URLs
    media.forEach(item => {
      item.url = `${req.protocol}://${req.get('host')}${item.file_path}`;
    });

    res.json({
      success: true,
      count: media.length,
      total: count[0].total,
      data: media
    });
  } catch (error) {
    console.error('Get user media error:', error);
    next(error);
  }
};

/**
 * @desc    Delete uploaded media
 * @route   DELETE /api/v1/upload/media/:id
 * @access  Private
 */
exports.deleteMedia = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get media info
    const [media] = await db.query(
      'SELECT * FROM media WHERE media_id = ? AND uploaded_by = ?',
      [id, req.user.user_id]
    );

    if (media.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Media not found or you do not have permission to delete it'
      });
    }

    // Delete file from filesystem
    const fullPath = path.join(__dirname, '../../', media[0].file_path);
    await fs.unlink(fullPath).catch(err => {
      console.error('Error deleting file:', err);
    });

    // Delete from database
    await db.query('DELETE FROM media WHERE media_id = ?', [id]);

    res.json({
      success: true,
      message: 'Media deleted successfully'
    });
  } catch (error) {
    console.error('Delete media error:', error);
    next(error);
  }
};

/**
 * @desc    Update media metadata
 * @route   PUT /api/v1/upload/media/:id
 * @access  Private
 */
exports.updateMediaMetadata = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { alt_text, caption } = req.body;

    // Check if media belongs to user
    const [media] = await db.query(
      'SELECT * FROM media WHERE media_id = ? AND uploaded_by = ?',
      [id, req.user.user_id]
    );

    if (media.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Media not found or you do not have permission'
      });
    }

    // Update metadata
    await db.query(
      'UPDATE media SET alt_text = ?, caption = ? WHERE media_id = ?',
      [alt_text || null, caption || null, id]
    );

    res.json({
      success: true,
      message: 'Media metadata updated successfully'
    });
  } catch (error) {
    console.error('Update media metadata error:', error);
    next(error);
  }
};