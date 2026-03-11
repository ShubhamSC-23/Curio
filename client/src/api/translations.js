import api from './axios';

export const translationAPI = {
  // Get all translations for an article
  getTranslations: async (articleId) => {
    const response = await api.get(`/article-translations/${articleId}`);
    return response.data;
  },

  // Get translation stats for an article
  getTranslationStats: async (articleId) => {
    const response = await api.get(`/article-translations/${articleId}/stats`);
    return response.data;
  },

  // Check if translation exists
  checkTranslationExists: async (articleId, languageCode) => {
    const response = await api.get(`/article-translations/${articleId}/check/${languageCode}`);
    return response.data;
  },

  // Get specific translation
  getTranslation: async (articleId, languageCode) => {
    const response = await api.get(`/article-translations/${articleId}/${languageCode}`);
    return response.data;
  },

  // Add or update translation
  addOrUpdateTranslation: async (articleId, data) => {
    const response = await api.post(`/article-translations/${articleId}`, data);
    return response.data;
  },

  // Delete translation
  deleteTranslation: async (articleId, languageCode) => {
    const response = await api.delete(`/article-translations/${articleId}/${languageCode}`);
    return response.data;
  },

  // Bulk import translations
  bulkImportTranslations: async (articleId, translations) => {
    const response = await api.post(`/article-translations/${articleId}/bulk-import`, {
      translations,
    });
    return response.data;
  },
};