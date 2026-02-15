/**
 * Format number with commas for thousands
 * @param {number} num - Number to format
 * @returns {string} - Formatted number
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  
  // Convert to number if string
  const number = typeof num === 'string' ? parseFloat(num) : num;
  
  if (isNaN(number)) return '0';
  
  // Format with commas
  return number.toLocaleString();
};

/**
 * Format number in short form (K, M, B)
 * @param {number} num - Number to format
 * @returns {string} - Formatted number
 */
export const formatNumberShort = (num) => {
  if (num === null || num === undefined) return '0';
  
  const number = typeof num === 'string' ? parseFloat(num) : num;
  
  if (isNaN(number)) return '0';
  
  if (number >= 1000000000) {
    return (number / 1000000000).toFixed(1) + 'B';
  }
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + 'M';
  }
  if (number >= 1000) {
    return (number / 1000).toFixed(1) + 'K';
  }
  return number.toString();
};
