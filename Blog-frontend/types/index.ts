export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  createdAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: User;
  createdAt: string;
  updatedAt: string;
  likesCount: number;
  viewsCount: number;
  commentsCount: number;
  tags: string[];
  isLiked?: boolean;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  postId: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  status: number;
}