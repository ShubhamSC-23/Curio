const db = require('../config/database');
const { createSlug, createUniqueSlug } = require('../utils/slugify');

/**
 * @desc    Get all translations for an article
 * @route   GET /api/v1/article-translations/:articleId
 * @access  Public
 */
exports.getTranslations = async (req, res, next) => {
  try {
    const { articleId } = req.params;

    // Check if article exists
    const [articles] = await db.query(
      'SELECT article_id, title FROM articles WHERE article_id = ?',
      [articleId]
    );

    if (articles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Get all translations for this article
    const [translations] = await db.query(
      `SELECT 
        translation_id,
        article_id,
        language_code,
        title,
        excerpt,
        slug,
        meta_description,
        created_at,
        updated_at
      FROM article_translations 
      WHERE article_id = ? 
      ORDER BY language_code`,
      [articleId]
    );

    res.json({
      success: true,
      data: translations
    });
  } catch (error) {
    console.error('Error fetching translations:', error);
    next(error);
  }
};

/**
 * @desc    Get single translation
 * @route   GET /api/v1/article-translations/:articleId/:languageCode
 * @access  Public
 */
exports.getTranslation = async (req, res, next) => {
  try {
    const { articleId, languageCode } = req.params;

    const [translations] = await db.query(
      'SELECT * FROM article_translations WHERE article_id = ? AND language_code = ?',
      [articleId, languageCode]
    );

    if (translations.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Translation not found'
      });
    }

    res.json({
      success: true,
      data: translations[0]
    });
  } catch (error) {
    console.error('Error fetching translation:', error);
    next(error);
  }
};

/**
 * @desc    Add or update translation
 * @route   POST /api/v1/article-translations/:articleId
 * @access  Private (Author/Admin)
 */
exports.addOrUpdateTranslation = async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const { language_code, title, excerpt, content, slug, meta_description } = req.body;

    // Validate required fields
    if (!language_code || !title || !content) {
      return res.status(400).json({
        success: false,
        message: 'Language code, title, and content are required'
      });
    }

    // Validate language code
    const validLanguages = ['hi', 'mr']; // Add more as needed
    if (!validLanguages.includes(language_code)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid language code. Supported: hi, mr'
      });
    }

    // Check if article exists
    const [articles] = await db.query(
      'SELECT author_id FROM articles WHERE article_id = ?',
      [articleId]
    );

    if (articles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Check ownership (only article owner or admin can add translations)
    if (articles[0].author_id !== req.user.user_id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add translations to this article'
      });
    }

    // Generate slug if not provided
    let finalSlug = slug;
    if (!finalSlug) {
      const baseSlug = createSlug(title);
      
      // Check if slug is unique among translations
      const checkSlugExists = async (testSlug) => {
        const [result] = await db.query(
          `SELECT translation_id FROM article_translations 
           WHERE slug = ? AND article_id != ? AND language_code = ?`,
          [testSlug, articleId, language_code]
        );
        return result.length > 0;
      };

      finalSlug = await createUniqueSlug(title, checkSlugExists);
    }

    // Check if translation already exists
    const [existing] = await db.query(
      'SELECT translation_id FROM article_translations WHERE article_id = ? AND language_code = ?',
      [articleId, language_code]
    );

    if (existing.length > 0) {
      // Update existing translation
      await db.query(
        `UPDATE article_translations 
         SET title = ?, excerpt = ?, content = ?, slug = ?, meta_description = ?, updated_at = NOW()
         WHERE article_id = ? AND language_code = ?`,
        [title, excerpt || null, content, finalSlug, meta_description || null, articleId, language_code]
      );

      res.json({
        success: true,
        message: 'Translation updated successfully'
      });
    } else {
      // Insert new translation
      await db.query(
        `INSERT INTO article_translations 
         (article_id, language_code, title, excerpt, content, slug, meta_description)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [articleId, language_code, title, excerpt || null, content, finalSlug, meta_description || null]
      );

      res.status(201).json({
        success: true,
        message: 'Translation added successfully'
      });
    }
  } catch (error) {
    console.error('Error saving translation:', error);
    
    // Handle duplicate slug error
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({
        success: false,
        message: 'A translation with this slug already exists'
      });
    }
    
    next(error);
  }
};

/**
 * @desc    Delete translation
 * @route   DELETE /api/v1/article-translations/:articleId/:languageCode
 * @access  Private (Author/Admin)
 */
exports.deleteTranslation = async (req, res, next) => {
  try {
    const { articleId, languageCode } = req.params;

    // Check article ownership
    const [articles] = await db.query(
      'SELECT author_id FROM articles WHERE article_id = ?',
      [articleId]
    );

    if (articles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    if (articles[0].author_id !== req.user.user_id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Delete translation
    const [result] = await db.query(
      'DELETE FROM article_translations WHERE article_id = ? AND language_code = ?',
      [articleId, languageCode]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Translation not found'
      });
    }

    res.json({
      success: true,
      message: 'Translation deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting translation:', error);
    next(error);
  }
};

/**
 * @desc    Check if translation exists
 * @route   GET /api/v1/article-translations/:articleId/check/:languageCode
 * @access  Public
 */
exports.checkTranslationExists = async (req, res, next) => {
  try {
    const { articleId, languageCode } = req.params;

    const [translations] = await db.query(
      'SELECT translation_id FROM article_translations WHERE article_id = ? AND language_code = ?',
      [articleId, languageCode]
    );

    res.json({
      success: true,
      exists: translations.length > 0
    });
  } catch (error) {
    console.error('Error checking translation:', error);
    next(error);
  }
};

/**
 * @desc    Get translation statistics for an article
 * @route   GET /api/v1/article-translations/:articleId/stats
 * @access  Public
 */
exports.getTranslationStats = async (req, res, next) => {
  try {
    const { articleId } = req.params;

    const [article] = await db.query(
      'SELECT article_id, title, default_language FROM articles WHERE article_id = ?',
      [articleId]
    );

    if (article.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    const [translations] = await db.query(
      'SELECT language_code, created_at, updated_at FROM article_translations WHERE article_id = ?',
      [articleId]
    );

    // Calculate statistics
    const availableLanguages = ['en', ...translations.map(t => t.language_code)];
    const totalPossibleLanguages = ['en', 'hi', 'mr']; // Extend as needed
    const translationProgress = (availableLanguages.length / totalPossibleLanguages.length) * 100;

    res.json({
      success: true,
      data: {
        article_id: article[0].article_id,
        original_title: article[0].title,
        default_language: article[0].default_language || 'en',
        available_languages: availableLanguages,
        translation_count: translations.length,
        translation_progress: Math.round(translationProgress),
        translations: translations.map(t => ({
          language: t.language_code,
          created: t.created_at,
          updated: t.updated_at
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching translation stats:', error);
    next(error);
  }
};

/**
 * @desc    Bulk import translations from JSON
 * @route   POST /api/v1/article-translations/:articleId/bulk-import
 * @access  Private (Author/Admin)
 */
exports.bulkImportTranslations = async (req, res, next) => {
  try {
    const { articleId } = req.params;
    const { translations } = req.body; // Array of translation objects

    if (!Array.isArray(translations) || translations.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Translations array is required'
      });
    }

    // Check article ownership
    const [articles] = await db.query(
      'SELECT author_id FROM articles WHERE article_id = ?',
      [articleId]
    );

    if (articles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    if (articles[0].author_id !== req.user.user_id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const results = {
      imported: 0,
      updated: 0,
      failed: 0,
      errors: []
    };

    // Process each translation
    for (const trans of translations) {
      try {
        const { language_code, title, excerpt, content, slug } = trans;

        if (!language_code || !title || !content) {
          results.failed++;
          results.errors.push(`Missing required fields for language: ${language_code || 'unknown'}`);
          continue;
        }

        // Generate slug if not provided
        const finalSlug = slug || createSlug(title);

        // Check if exists
        const [existing] = await db.query(
          'SELECT translation_id FROM article_translations WHERE article_id = ? AND language_code = ?',
          [articleId, language_code]
        );

        if (existing.length > 0) {
          // Update
          await db.query(
            `UPDATE article_translations 
             SET title = ?, excerpt = ?, content = ?, slug = ?, updated_at = NOW()
             WHERE article_id = ? AND language_code = ?`,
            [title, excerpt || null, content, finalSlug, articleId, language_code]
          );
          results.updated++;
        } else {
          // Insert
          await db.query(
            `INSERT INTO article_translations 
             (article_id, language_code, title, excerpt, content, slug)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [articleId, language_code, title, excerpt || null, content, finalSlug]
          );
          results.imported++;
        }
      } catch (error) {
        results.failed++;
        results.errors.push(`Error processing ${trans.language_code}: ${error.message}`);
      }
    }

    res.json({
      success: true,
      message: 'Bulk import completed',
      data: results
    });
  } catch (error) {
    console.error('Error bulk importing translations:', error);
    next(error);
  }
};