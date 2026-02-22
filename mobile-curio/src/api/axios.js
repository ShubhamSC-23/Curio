import axios from 'axios';
import { Platform } from 'react-native';

// Use your computer's IP address here if testing on a physical device
// For Android emulator, 10.0.2.2 usually maps to localhost
// For physical devices, use your computer's actual IP address (e.g., 192.168.1.100)
const API_URL = 'http://192.168.1.100:5000/api/v1';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    async (config) => {
        // Import useAuthStore inside the interceptor to avoid circular dependency
        const { useAuthStore } = require('../store/authStore');
        const token = useAuthStore.getState().token;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || error.message || 'Something went wrong';

        // In React Native, we use Aler.alert or a toast library
        console.error('API Error:', message);

        return Promise.reject(error);
    }
);

export default api;
