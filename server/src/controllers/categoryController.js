const db = require('../config/database');
const { createSlug } = require('../utils/slugify');

/**
 * @desc    Get all categories
 * @route   GET /api/v1/categories
 * @access  Public
 */
exports.getCategories = async (req, res, next) => {
  try {
    const [categories] = await db.query(
      `SELECT 
        c.*,
        COUNT(a.article_id) as article_count
      FROM categories c
      LEFT JOIN articles a ON c.category_id = a.category_id AND a.status = 'published'
      WHERE c.is_active = true
      GROUP BY c.category_id
      ORDER BY c.display_order ASC, c.name ASC`
    );

    res.json({
      success: true,
      count: categories.length,
      data: categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    next(error);
  }
};

/**
 * @desc    Get single category
 * @route   GET /api/v1/categories/:slug
 * @access  Public
 */
exports.getCategory = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const [categories] = await db.query(
      `SELECT 
        c.*,
        COUNT(a.article_id) as article_count
      FROM categories c
      LEFT JOIN articles a ON c.category_id = a.category_id AND a.status = 'published'
      WHERE c.slug = ? AND c.is_active = true
      GROUP BY c.category_id`,
      [slug]
    );

    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      data: categories[0]
    });
  } catch (error) {
    console.error('Get category error:', error);
    next(error);
  }
};

/**
 * @desc    Create category
 * @route   POST /api/v1/categories
 * @access  Private (Admin only)
 */
exports.createCategory = async (req, res, next) => {
  try {
    const { name, description, parent_category_id, icon, display_order } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required'
      });
    }

    // Generate slug
    const slug = createSlug(name);

    // Check if slug already exists
    const [existing] = await db.query(
      'SELECT category_id FROM categories WHERE slug = ?',
      [slug]
    );

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Category with this name already exists'
      });
    }

    // Insert category
    const [result] = await db.query(
      `INSERT INTO categories (name, slug, description, parent_category_id, icon, display_order)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [name, slug, description || null, parent_category_id || null, icon || null, display_order || 0]
    );

    // Get created category
    const [categories] = await db.query(
      'SELECT * FROM categories WHERE category_id = ?',
      [result.insertId]
    );

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: categories[0]
    });
  } catch (error) {
    console.error('Create category error:', error);
    next(error);
  }
};

/**
 * @desc    Update category
 * @route   PUT /api/v1/categories/:id
 * @access  Private (Admin only)
 */
exports.updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, parent_category_id, icon, display_order, is_active } = req.body;

    // Check if category exists
    const [categories] = await db.query(
      'SELECT * FROM categories WHERE category_id = ?',
      [id]
    );

    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Prepare update
    const updateFields = {};
    if (name) {
      updateFields.name = name;
      updateFields.slug = createSlug(name);
    }
    if (description !== undefined) updateFields.description = description;
    if (parent_category_id !== undefined) updateFields.parent_category_id = parent_category_id;
    if (icon !== undefined) updateFields.icon = icon;
    if (display_order !== undefined) updateFields.display_order = display_order;
    if (is_active !== undefined) updateFields.is_active = is_active;

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
      `UPDATE categories SET ${setClause} WHERE category_id = ?`,
      [...values, id]
    );

    // Get updated category
    const [updatedCategories] = await db.query(
      'SELECT * FROM categories WHERE category_id = ?',
      [id]
    );

    res.json({
      success: true,
      message: 'Category updated successfully',
      data: updatedCategories[0]
    });
  } catch (error) {
    console.error('Update category error:', error);
    next(error);
  }
};

/**
 * @desc    Delete category
 * @route   DELETE /api/v1/categories/:id
 * @access  Private (Admin only)
 */
exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if category exists
    const [categories] = await db.query(
      'SELECT * FROM categories WHERE category_id = ?',
      [id]
    );

    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    // Check if category has articles
    const [articles] = await db.query(
      'SELECT COUNT(*) as count FROM articles WHERE category_id = ?',
      [id]
    );

    if (articles[0].count > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category. It has ${articles[0].count} article(s) associated with it.`
      });
    }

    // Delete category
    await db.query('DELETE FROM categories WHERE category_id = ?', [id]);

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    next(error);
  }
};