import { useState, useEffect } from 'react';
import { Post, Stat, User } from '@/utils/types';
import { like_post } from '@/services/api/like_post.api';
import { useAuth } from '@/context/AuthContext';
import { createPost, getAllPosts, getPost, getPostsUser, searchPostsRes, getPostStat } from '@/services/api/post.api';

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token,user } = useAuth();

  const fetchAllPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedPosts = await getAllPosts(token?.accessToken);      
      setPosts(fetchedPosts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };
  
  const fetchPosts = async (id_user?:string) => {
    if(!id_user) id_user = user?.id || "";
    try {
      setLoading(true);
      setError(null);
      const fetchedPosts = await getPostsUser(id_user, token?.accessToken);     
      setPosts(fetchedPosts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchPostStat = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedPosts: Stat[] = await getPostStat(token?.accessToken);
      return fetchedPosts;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  }

  const searchPosts = async (query: string) => {
    try {
      setLoading(true);
      setError(null);      
      const fetchedPosts = await searchPostsRes(query, token?.accessToken);
      setPosts(fetchedPosts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchPost = async (post_id: number) => {
    try {
      setLoading(true);
      setError(null);
      const fetchedPost = await getPost(post_id, token?.accessToken);
      setPosts([fetchedPost]); // remplacer ou merge selon besoin
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch post');
    } finally {
      setLoading(false);
    }
  };

  const create = async (post: Post) => {
    try {
      setLoading(true);
      const newPost = await createPost(post, token?.accessToken);
      setPosts(prev => [...prev, newPost]);
      return true;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    } finally {
      setLoading(false);
    }
    return false;
  };

  const toggleLike = async (postId: number) => {
    if (!token) return;
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    try {
      await like_post({ post_id: postId, user_id: user?.id || "" }, token.accessToken);
      return true;

    } catch (error) {
      console.error('Error toggling like:', error);
    }
    return false;
  };

  useEffect(() => {
    fetchAllPosts();
  }, [token]);

  return {
    posts,
    create,
    fetchPost,
    getPost,
    searchPosts,
    fetchPostStat,    
    loading,
    error,
    refetch: fetchAllPosts,
    fetchPosts,
    toggleLike,
  };
}