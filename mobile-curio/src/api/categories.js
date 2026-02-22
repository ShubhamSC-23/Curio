import api from './axios';

export const categoriesAPI = {
    getCategories: async () => {
        const response = await api.get('/categories');
        return response.data;
    },
};
