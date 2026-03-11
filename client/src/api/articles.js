import api from "./axios";

export const articlesAPI = {
  // Get all articles
  getArticles: async (params = {}) => {
    const response = await api.get("/articles", { params });
    return response.data;
  },

  // ✅ Get single article with language support
  getArticle: async (slug, lang = "en") => {
    const response = await api.get(`/articles/${slug}`, {
      params: { lang },
    });
    return response.data;
  },

  // Create article
  createArticle: async (data) => {
    const response = await api.post("/articles", data);
    return response.data;
  },

  // Like article
  likeArticle: async (id) => {
    const response = await api.post(`/articles/${id}/like`);
    return response.data;
  },

  // Bookmark article
  bookmarkArticle: async (id) => {
    const response = await api.post(`/articles/${id}/bookmark`);
    return response.data;
  },

  // Check like status
  getLikeStatus: async (id) => {
    const response = await api.get(`/articles/${id}/like-status`);
    return response.data;
  },

  // Check bookmark status
  getBookmarkStatus: async (id) => {
    const response = await api.get(`/bookmarks/check/${id}`);
    return response.data;
  },

  // Check reading list status
  getReadingListStatus: async (id) => {
    const response = await api.get(`/reading-list/check/${id}`);
    return response.data;
  },

  // Add to reading list
  addToReadingList: async (id) => {
    const response = await api.post("/reading-list", { article_id: id });
    return response.data;
  },

  // Remove from reading list
  removeFromReadingList: async (id) => {
    const response = await api.delete(`/reading-list/${id}`);
    return response.data;
  },

  // Report article
  reportArticle: async (id, reason) => {
    const response = await api.post(`/articles/${id}/report`, { reason });
    return response.data;
  },
};