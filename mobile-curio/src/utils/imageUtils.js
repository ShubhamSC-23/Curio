export const getImageUrl = (imagePath) => {
    if (!imagePath) return null;

    // Already a full URL
    if (imagePath.startsWith('http') || imagePath.startsWith('blob:') || imagePath.startsWith('data:')) {
        return imagePath;
    }

    // For uploaded images, use the computer's IP address
    // This matches the API_URL in src/api/axios.js
    const SERVER_URL = 'http://192.168.1.100:5000';

    // Make sure path starts with /
    const path = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;

    return `${SERVER_URL}${path}`;
};
