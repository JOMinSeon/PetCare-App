import api from '../api/client';

export const communityService = {
  getPosts: async (options = {}) => {
    const params = new URLSearchParams(options).toString();
    const response = await api.get(`/community/posts?${params}`);
    return response.data;
  },
  getPostById: async (id) => {
    const response = await api.get(`/community/posts/${id}`);
    return response.data;
  },
  createPost: async (postData) => {
    const response = await api.post('/community/posts', postData);
    return response.data;
  },
  updatePost: async (id, postData) => {
    const response = await api.put(`/community/posts/${id}`, postData);
    return response.data;
  },
  deletePost: async (id) => {
    const response = await api.delete(`/community/posts/${id}`);
    return response.data;
  },
  likePost: async (id) => {
    const response = await api.post(`/community/posts/${id}/like`);
    return response.data;
  },
  getComments: async (postId) => {
    const response = await api.get(`/community/posts/${postId}/comments`);
    return response.data;
  },
  addComment: async (postId, content, parentId = null) => {
    const response = await api.post(`/community/posts/${postId}/comments`, { content, parentId });
    return response.data;
  },
  deleteComment: async (id) => {
    const response = await api.delete(`/community/comments/${id}`);
    return response.data;
  },
};

export default communityService;