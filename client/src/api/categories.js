import api from './axios';

export const categoriesAPI = {
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },

  getCategory: async (slug) => {
    const response = await api.get(`/categories/${slug}`);
    return response.data;
  },
};