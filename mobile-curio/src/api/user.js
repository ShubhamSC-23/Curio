import api from './axios';

export const userAPI = {
    // Get user bookmarks
    getBookmarks: async () => {
        const response = await api.get('/users/me/bookmarks');
        return response.data;
    },

    // Get user reading list
    getReadingList: async () => {
        const response = await api.get('/reading-list');
        return response.data;
    },

    // Mark article as read/unread in reading list
    markAsRead: async (articleId) => {
        const response = await api.put(`/reading-list/${articleId}/mark-read`);
        return response.data;
    },

    // Get user profile stats
    getStats: async (userId) => {
        const response = await api.get(`/users/${userId}/stats`);
        return response.data;
    },

    // Get profile by username
    getProfile: async (username) => {
        const response = await api.get(`/users/${username}`);
        return response.data;
    },

    // Follow/Unfollow user
    followUser: async (userId) => {
        const response = await api.post(`/users/${userId}/follow`);
        return response.data;
    },

    // Update user profile
    updateProfile: async (data) => {
        const response = await api.put('/users/me', data);
        return response.data;
    },

    // Delete user account
    deleteAccount: async () => {
        const response = await api.delete('/users/me');
        return response.data;
    }
};
