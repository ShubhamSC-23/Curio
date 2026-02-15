export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // Already a full URL or blob
  if (imagePath.startsWith('http') || imagePath.startsWith('blob:') || imagePath.startsWith('data:')) {
    return imagePath;
  }
  
  // For uploaded images, use direct server URL without /api/v1
  const SERVER_URL = process.env.REACT_APP_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';
  
  // Make sure path starts with /
  const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  return `${SERVER_URL}${path}`;
};