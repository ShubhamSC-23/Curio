const slugify = require('slugify');

/**
 * Generate a URL-friendly slug from a string
 * @param {string} text - Text to convert to slug
 * @param {object} options - Slugify options
 * @returns {string} - URL-friendly slug
 */
const createSlug = (text, options = {}) => {
  const defaultOptions = {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g
  };

  return slugify(text, { ...defaultOptions, ...options });
};

/**
 * Generate a unique slug by appending a random string if needed
 * @param {string} text - Text to convert to slug
 * @param {function} checkExists - Async function to check if slug exists
 * @returns {string} - Unique slug
 */
const createUniqueSlug = async (text, checkExists) => {
  let slug = createSlug(text);
  let counter = 1;
  
  while (await checkExists(slug)) {
    slug = `${createSlug(text)}-${counter}`;
    counter++;
  }
  
  return slug;
};

/**
 * Create slug with timestamp for guaranteed uniqueness
 * @param {string} text - Text to convert to slug
 * @returns {string} - Unique slug with timestamp
 */
const createSlugWithTimestamp = (text) => {
  const baseSlug = createSlug(text);
  const timestamp = Date.now();
  return `${baseSlug}-${timestamp}`;
};

module.exports = {
  createSlug,
  createUniqueSlug,
  createSlugWithTimestamp
};
