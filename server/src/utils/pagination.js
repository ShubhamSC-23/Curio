/**
 * Calculate pagination metadata
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @param {number} total - Total number of items
 * @returns {object} - Pagination metadata
 */
const getPagination = (page = 1, limit = 10, total = 0) => {
  const parsedPage = parseInt(page) || 1;
  const parsedLimit = parseInt(limit) || 10;
  const parsedTotal = parseInt(total) || 0;

  // Ensure limit doesn't exceed max
  const maxLimit = parseInt(process.env.MAX_PAGE_SIZE) || 100;
  const finalLimit = Math.min(parsedLimit, maxLimit);

  const totalPages = Math.ceil(parsedTotal / finalLimit);
  const currentPage = Math.max(1, Math.min(parsedPage, totalPages || 1));
  const offset = (currentPage - 1) * finalLimit;

  return {
    page: currentPage,
    limit: finalLimit,
    total: parsedTotal,
    totalPages,
    offset,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
    nextPage: currentPage < totalPages ? currentPage + 1 : null,
    prevPage: currentPage > 1 ? currentPage - 1 : null
  };
};

/**
 * Format paginated response
 * @param {array} data - Array of items
 * @param {object} pagination - Pagination metadata from getPagination
 * @returns {object} - Formatted response
 */
const paginatedResponse = (data, pagination) => {
  return {
    success: true,
    data,
    pagination: {
      currentPage: pagination.page,
      itemsPerPage: pagination.limit,
      totalItems: pagination.total,
      totalPages: pagination.totalPages,
      hasNextPage: pagination.hasNextPage,
      hasPrevPage: pagination.hasPrevPage,
      nextPage: pagination.nextPage,
      prevPage: pagination.prevPage
    }
  };
};

module.exports = {
  getPagination,
  paginatedResponse
};
