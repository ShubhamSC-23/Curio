import api from './axios';

export const commentsAPI = {
  // Get comments for an article
  getComments: async (articleId) => {
    const response = await api.get('/comments', { 
      params: { article_id: articleId } 
    });
    return response.data;
  },

  // Create a comment
  createComment: async (data) => {
    const response = await api.post('/comments', data);
    return response.data;
  },

  // Update a comment
  updateComment: async (id, data) => {
    const response = await api.put(`/comments/${id}`, data);
    return response.data;
  },

  // Delete a comment
  deleteComment: async (id) => {
    const response = await api.delete(`/comments/${id}`);
    return response.data;
  },

  // Like a comment
  likeComment: async (id) => {
    const response = await api.post(`/comments/${id}/like`);
    return response.data;
  },
};
