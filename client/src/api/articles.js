import api from './axios';

export const articlesAPI = {
  getArticles: async (params = {}) => {
    const response = await api.get('/articles', { params });
    return response.data;
  },

  getArticle: async (slug) => {
    const response = await api.get(`/articles/${slug}`);
    return response.data;
  },

  createArticle: async (data) => {
    const response = await api.post('/articles', data);
    return response.data;
  },

  likeArticle: async (id) => {
    const response = await api.post(`/articles/${id}/like`);
    return response.data;
  },

  bookmarkArticle: async (id) => {
    const response = await api.post(`/articles/${id}/bookmark`);
    return response.data;
  },

  // ✅ NEW ENDPOINTS
  getLikeStatus: async (id) => {
    const response = await api.get(`/articles/${id}/like-status`);
    return response.data;
  },

  getBookmarkStatus: async (id) => {
    const response = await api.get(`/bookmarks/check/${id}`);
    return response.data;
  },

  getReadingListStatus: async (id) => {
    const response = await api.get(`/reading-list/check/${id}`);
    return response.data;
  },

  addToReadingList: async (id) => {
    const response = await api.post('/reading-list', { article_id: id });
    return response.data;
  },

  removeFromReadingList: async (id) => {
    const response = await api.delete(`/reading-list/${id}`);
    return response.data;
  },

  reportArticle: async (id, reason) => {
    const response = await api.post(`/articles/${id}/report`, { reason });
    return response.data;
  },
};