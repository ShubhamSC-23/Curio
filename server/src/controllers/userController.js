const db = require('../config/database');

/**
 * @desc    Get user profile
 * @route   GET /api/v1/users/:username
 * @access  Public
 */
exports.getUserProfile = async (req, res, next) => {
  try {
    const { username } = req.params;

    // Get user basic info
    const [users] = await db.query(
      `SELECT 
        user_id, username, full_name, profile_image, bio, created_at
      FROM users
      WHERE username = ? AND is_active = true`,
      [username]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = users[0];

    // If user is an author, get author info
    if (req.user && req.user.role === 'author') {
      const [authorProfiles] = await db.query(
        `SELECT 
          display_name, expertise, social_links, website_url,
          total_articles, total_views, total_likes
        FROM author_profiles
        WHERE user_id = ? AND author_status = 'approved'`,
        [user.user_id]
      );

      if (authorProfiles.length > 0) {
        user.author_profile = authorProfiles[0];
      }
    }

    // Get user's published articles count
    const [articleCount] = await db.query(
      `SELECT COUNT(*) as count 
       FROM articles 
       WHERE author_id = ? AND status = 'published'`,
      [user.user_id]
    );

    user.article_count = articleCount[0].count;

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    next(error);
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/v1/users/profile
 * @access  Private
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const { full_name, bio, profile_image } = req.body;

    const updateFields = {};
    if (full_name) updateFields.full_name = full_name;
    if (bio !== undefined) updateFields.bio = bio;
    if (profile_image !== undefined) updateFields.profile_image = profile_image;

    const updateKeys = Object.keys(updateFields);
    if (updateKeys.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    const setClause = updateKeys.map(key => `${key} = ?`).join(', ');
    const values = updateKeys.map(key => updateFields[key]);

    await db.query(
      `UPDATE users SET ${setClause} WHERE user_id = ?`,
      [...values, req.user.user_id]
    );

    // Get updated user
    const [users] = await db.query(
      'SELECT user_id, email, username, full_name, profile_image, bio FROM users WHERE user_id = ?',
      [req.user.user_id]
    );

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: users[0]
    });
  } catch (error) {
    console.error('Update profile error:', error);
    next(error);
  }
};

/**
 * @desc    Get user's bookmarked articles
 * @route   GET /api/v1/users/bookmarks
 * @access  Private
 */
exports.getBookmarks = async (req, res, next) => {
  try {
    const [bookmarks] = await db.query(
      `SELECT 
        a.article_id, a.title, a.slug, a.excerpt, a.featured_image,
        a.reading_time, a.published_at,
        u.username, u.full_name,
        c.name as category_name,
        b.created_at as bookmarked_at
      FROM bookmarks b
      INNER JOIN articles a ON b.article_id = a.article_id
      INNER JOIN users u ON a.author_id = u.user_id
      LEFT JOIN categories c ON a.category_id = c.category_id
      WHERE b.user_id = ? AND a.status = 'published'
      ORDER BY b.created_at DESC`,
      [req.user.user_id]
    );

    res.json({
      success: true,
      count: bookmarks.length,
      data: bookmarks
    });
  } catch (error) {
    console.error('Get bookmarks error:', error);
    next(error);
  }
};

/**
 * @desc    Get user's liked articles
 * @route   GET /api/v1/users/likes
 * @access  Private
 */
exports.getLikedArticles = async (req, res, next) => {
  try {
    const [likes] = await db.query(
      `SELECT 
        a.article_id, a.title, a.slug, a.excerpt, a.featured_image,
        a.reading_time, a.published_at,
        u.username, u.full_name,
        c.name as category_name,
        al.created_at as liked_at
      FROM article_likes al
      INNER JOIN articles a ON al.article_id = a.article_id
      INNER JOIN users u ON a.author_id = u.user_id
      LEFT JOIN categories c ON a.category_id = c.category_id
      WHERE al.user_id = ? AND a.status = 'published'
      ORDER BY al.created_at DESC`,
      [req.user.user_id]
    );

    res.json({
      success: true,
      count: likes.length,
      data: likes
    });
  } catch (error) {
    console.error('Get liked articles error:', error);
    next(error);
  }
};

/**
 * @desc    Follow/Unfollow author
 * @route   POST /api/v1/users/:id/follow
 * @access  Private
 */
exports.followAuthor = async (req, res, next) => {
  try {
    const { id } = req.params; // author user_id

    // Check if target user is an author
    const [authors] = await db.query(
      `SELECT user_id FROM users WHERE user_id = ? AND role IN ('author', 'admin')`,
      [id]
    );

    if (authors.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Author not found'
      });
    }

    // Cannot follow yourself
    if (parseInt(id) === req.user.user_id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot follow yourself'
      });
    }

    // Check if already following
    const [existing] = await db.query(
      'SELECT * FROM user_follows WHERE follower_id = ? AND following_id = ?',
      [req.user.user_id, id]
    );

    if (existing.length > 0) {
      // Unfollow
      await db.query(
        'DELETE FROM user_follows WHERE follower_id = ? AND following_id = ?',
        [req.user.user_id, id]
      );

      return res.json({
        success: true,
        message: 'Unfollowed successfully',
        following: false
      });
    } else {
      // Follow
      await db.query(
        'INSERT INTO user_follows (follower_id, following_id) VALUES (?, ?)',
        [req.user.user_id, id]
      );

      return res.json({
        success: true,
        message: 'Following successfully',
        following: true
      });
    }
  } catch (error) {
    console.error('Follow author error:', error);
    next(error);
  }
};

/**
 * @desc    Get user's following list
 * @route   GET /api/v1/users/following
 * @access  Private
 */
exports.getFollowing = async (req, res, next) => {
  try {
    const [following] = await db.query(
      `SELECT 
        u.user_id, u.username, u.full_name, u.profile_image,
        uf.created_at as followed_at
      FROM user_follows uf
      INNER JOIN users u ON uf.following_id = u.user_id
      WHERE uf.follower_id = ?
      ORDER BY uf.created_at DESC`,
      [req.user.user_id]
    );

    res.json({
      success: true,
      count: following.length,
      data: following
    });
  } catch (error) {
    console.error('Get following error:', error);
    next(error);
  }
};


/**
 * @desc    Delete user account
 * @route   DELETE /api/v1/users/me
 * @access  Private
 */
exports.deleteAccount = async (req, res, next) => {
  try {
    const userId = req.user.user_id;

    // Delete user (cascade will handle related records)
    await db.query('DELETE FROM users WHERE user_id = ?', [userId]);

    res.json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    console.error('Delete account error:', error);
    next(error);
  }
};

/**
 * @desc    Get current user info
 * @route   GET /api/v1/users/me
 * @access  Private
 */
exports.getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user.user_id;

    const [users] = await db.query(
      `
      SELECT 
        user_id, username, email, full_name, bio, location,
        profile_image, role, created_at
      FROM users 
      WHERE user_id = ?
      `,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: users[0],
    });
  } catch (error) {
    console.error('Get current user error:', error);
    next(error);
  }
};



/**
 * @desc    Get user statistics for badges
 * @route   GET /api/v1/users/:userId/stats
 * @access  Public
 */
exports.getUserStats = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Get comprehensive user stats
    const query = `
      SELECT 
        u.user_id,
        u.username,
        u.created_at,
        COUNT(DISTINCT a.article_id) as articles_published,
        COALESCE(SUM(a.like_count), 0) as total_likes,
        COALESCE(SUM(a.view_count), 0) as total_views,
        COALESCE(MAX(a.view_count), 0) as max_views,
        COUNT(DISTINCT c.comment_id) as comments_made,
        COUNT(DISTINCT f1.follower_id) as followers,
        COUNT(DISTINCT f2.following_id) as following,
        0 as streak_days,
        0 as quality_score
      FROM users u
      LEFT JOIN articles a ON u.user_id = a.author_id AND a.status = 'published'
      LEFT JOIN comments c ON u.user_id = c.user_id
      LEFT JOIN user_follows f1 ON u.user_id = f1.following_id
      LEFT JOIN user_follows f2 ON u.user_id = f2.follower_id
      WHERE u.user_id = ?
      GROUP BY u.user_id
    `;

    const [stats] = await db.query(query, [userId]);

    if (stats.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      data: stats[0],
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    next(error);
  }
};

/**
 * @desc    Get user's earned badges
 * @route   GET /api/v1/users/:userId/badges
 * @access  Public
 */
exports.getUserBadges = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Get user stats
    const statsQuery = `
      SELECT 
        u.user_id,
        u.created_at,
        COUNT(DISTINCT a.article_id) as articles_published,
        COALESCE(SUM(a.like_count), 0) as total_likes,
        COALESCE(MAX(a.view_count), 0) as max_views,
        COUNT(DISTINCT c.comment_id) as comments_made,
        COUNT(DISTINCT f1.follower_id) as followers,
        COUNT(DISTINCT f2.following_id) as following
      FROM users u
      LEFT JOIN articles a ON u.user_id = a.author_id AND a.status = 'published'
      LEFT JOIN comments c ON u.user_id = c.user_id
      LEFT JOIN user_follows f1 ON u.user_id = f1.following_id
      LEFT JOIN user_follows f2 ON u.user_id = f2.follower_id
      WHERE u.user_id = ?
      GROUP BY u.user_id
    `;

    const [stats] = await db.query(statsQuery, [userId]);

    if (stats.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const userStats = stats[0];
    const earnedBadges = [];

    // Calculate earned badges
    if (userStats.articles_published >= 1) earnedBadges.push('first_article');
    if (userStats.articles_published >= 10) earnedBadges.push('prolific_writer');
    if (userStats.articles_published >= 50) earnedBadges.push('master_author');
    if (userStats.total_likes >= 100) earnedBadges.push('popular');
    if (userStats.max_views >= 1000) earnedBadges.push('viral');
    if (userStats.comments_made >= 50) earnedBadges.push('conversationalist');
    if (userStats.followers >= 100) earnedBadges.push('influencer');
    if (userStats.following >= 50) earnedBadges.push('networker');

    // Check early adopter (joined before March 2024)
    const joinedDate = new Date(userStats.created_at);
    const cutoffDate = new Date('2024-03-01');
    if (joinedDate <= cutoffDate) {
      earnedBadges.push('early_adopter');
    }

    res.json({
      success: true,
      data: {
        badges: earnedBadges,
        stats: userStats,
      },
    });
  } catch (error) {
    console.error('Get user badges error:', error);
    next(error);
  }
};




const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/profiles';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

exports.uploadProfileImage = [
  upload.single('profile_image'),
  async (req, res, next) => {
    try {
      const userId = req.user.user_id;

      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'Please upload an image',
        });
      }

      // Get old image
      const [user] = await db.query(
        'SELECT profile_image FROM users WHERE user_id = ?',
        [userId]
      );
      const oldImage = user[0].profile_image;

      // Create image URL
      const imageUrl = `/uploads/profiles/${req.file.filename}`;

      // Update database
      await db.query(
        'UPDATE users SET profile_image = ?, updated_at = NOW() WHERE user_id = ?',
        [imageUrl, userId]
      );

      // Delete old image
      if (oldImage && oldImage.startsWith('/uploads/')) {
        const oldImagePath = path.join(__dirname, '../../', oldImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      res.json({
        success: true,
        message: 'Profile image uploaded successfully',
        data: { profile_image: imageUrl },
      });
    } catch (error) {
      if (req.file) {
        const filePath = req.file.path;
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
      console.error('Upload profile image error:', error);
      next(error);
    }
  }
];

exports.removeProfileImage = async (req, res, next) => {
  try {
    const userId = req.user.user_id;

    const [user] = await db.query(
      'SELECT profile_image FROM users WHERE user_id = ?',
      [userId]
    );
    const currentImage = user[0].profile_image;

    await db.query(
      'UPDATE users SET profile_image = NULL, updated_at = NOW() WHERE user_id = ?',
      [userId]
    );

    if (currentImage && currentImage.startsWith('/uploads/')) {
      const imagePath = path.join(__dirname, '../../', currentImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.json({
      success: true,
      message: 'Profile image removed successfully',
    });
  } catch (error) {
    console.error('Remove profile image error:', error);
    next(error);
  }
};




// GET /api/v1/users/authors
exports.getAuthors = async (req, res, next) => {
  try {
    const { filter = 'all', limit = 50 } = req.query;

    let orderBy = 'u.created_at DESC'; // Default: newest first

    switch (filter) {
      case 'popular':
        orderBy = 'follower_count DESC, u.created_at DESC';
        break;
      case 'new':
        orderBy = 'u.created_at DESC';
        break;
      case 'active':
        orderBy = 'article_count DESC, u.created_at DESC';
        break;
    }

    const query = `
  SELECT 
    u.user_id,
    u.username,
    u.full_name,
    u.email,
    u.bio,
    u.profile_image,
    u.created_at,
    COUNT(DISTINCT a.article_id) as article_count,
    COUNT(DISTINCT f.follower_id) as follower_count,
    COALESCE(SUM(a.view_count), 0) as total_views
  FROM users u
  LEFT JOIN articles a ON u.user_id = a.author_id AND a.status = 'published'
  LEFT JOIN follows f ON u.user_id = f.following_id
  WHERE u.role = 'author'
  GROUP BY u.user_id
  ORDER BY ${orderBy}
  LIMIT ?
`;

    const [authors] = await db.query(query, [parseInt(limit)]);

    res.json({
      success: true,
      data: authors
    });
  } catch (error) {
    next(error);
  }
};


// POST /api/v1/users/:id/follow
exports.followUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const followerId = req.user.user_id;

    if (parseInt(id) === followerId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot follow yourself'
      });
    }

    // Check if already following
    const [existing] = await db.query(
      'SELECT * FROM follows WHERE follower_id = ? AND following_id = ?',
      [followerId, id]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Already following this user'
      });
    }

    await db.query(
      'INSERT INTO follows (follower_id, following_id) VALUES (?, ?)',
      [followerId, id]
    );

    res.json({
      success: true,
      message: 'Successfully followed user'
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/v1/users/:id/follow
exports.unfollowUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const followerId = req.user.user_id;

    await db.query(
      'DELETE FROM follows WHERE follower_id = ? AND following_id = ?',
      [followerId, id]
    );

    res.json({
      success: true,
      message: 'Successfully unfollowed user'
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/users/following
exports.getFollowing = async (req, res, next) => {
  try {
    const userId = req.user.user_id;

    const [following] = await db.query(
      `SELECT u.user_id, u.username, u.full_name, u.profile_image
       FROM follows f
       JOIN users u ON f.following_id = u.user_id
       WHERE f.follower_id = ?`,
      [userId]
    );

    res.json({
      success: true,
      data: following
    });
  } catch (error) {
    next(error);
  }
};