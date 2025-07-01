import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'https://blog-website-with-rich-text-input-and.onrender.com/api';

export class PostService {
  static async createPost(data) {
    try {
      const response = await axios.post(`${API_BASE_URL}/posts`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  static async getAllPosts() {
    try {
      const response = await axios.get(`${API_BASE_URL}/posts`);
      return response.data;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  }

  static async getPostBySlug(slug) {
    try {
      const response = await axios.get(`${API_BASE_URL}/posts/${slug}`);
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return null;
      }
      console.error('Error fetching post:', error);
      throw error;
    }
  }

  static async updatePost(slug, data) {
    try {
      const response = await axios.put(`${API_BASE_URL}/posts/${slug}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  }

  static async deletePost(slug) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/posts/${slug}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }
}
