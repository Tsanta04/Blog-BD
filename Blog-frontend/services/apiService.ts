import { Post, Comment } from '@/types';
import { mockPosts, mockComments } from '@/data/mockData';

const API_BASE_URL = 'https://your-api-domain.com/api'; // Replace with your actual API URL

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    token?: string
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getPosts(token?: string): Promise<Post[]> {
    try {
      return await this.request<Post[]>('/posts', {}, token);
    } catch (error) {
      console.warn('API call failed, using mock data:', error);
      return mockPosts;
    }
  }

  async getPost(id: string, token?: string): Promise<Post> {
    try {
      return await this.request<Post>(`/posts/${id}`, {}, token);
    } catch (error) {
      console.warn('API call failed, using mock data:', error);
      const post = mockPosts.find(p => p.id === id);
      if (!post) {
        throw new Error('Post not found');
      }
      return post;
    }
  }

  async getComments(postId: string, token?: string): Promise<Comment[]> {
    try {
      return await this.request<Comment[]>(`/posts/${postId}/comments`, {}, token);
    } catch (error) {
      console.warn('API call failed, using mock data:', error);
      return mockComments[postId] || [];
    }
  }

  async likePost(postId: string, token: string): Promise<{ success: boolean }> {
    try {
      return await this.request<{ success: boolean }>(
        `/posts/${postId}/like`,
        { method: 'POST' },
        token
      );
    } catch (error) {
      console.warn('API call failed, using mock response:', error);
      return { success: true };
    }
  }

  async unlikePost(postId: string, token: string): Promise<{ success: boolean }> {
    try {
      return await this.request<{ success: boolean }>(
        `/posts/${postId}/unlike`,
        { method: 'POST' },
        token
      );
    } catch (error) {
      console.warn('API call failed, using mock response:', error);
      return { success: true };
    }
  }

  async addComment(
    postId: string,
    content: string,
    token: string
  ): Promise<Comment> {
    try {
      return await this.request<Comment>(
        `/posts/${postId}/comments`,
        {
          method: 'POST',
          body: JSON.stringify({ content }),
        },
        token
      );
    } catch (error) {
      console.warn('API call failed, using mock response:', error);
      // Return a mock comment
      return {
        id: Date.now().toString(),
        content,
        author: { id: '1', email: 'user@example.com', username: 'Current User', createdAt: new Date().toISOString() },
        postId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  }

  async getPopularPosts(token?: string): Promise<Post[]> {
    try {
      return await this.request<Post[]>('/posts/popular', {}, token);
    } catch (error) {
      console.warn('API call failed, using mock data:', error);
      // Return posts sorted by likes count for popular posts
      return [...mockPosts].sort((a, b) => b.likesCount - a.likesCount);
    }
  }
}

export const apiService = new ApiService();