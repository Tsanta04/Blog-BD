import { useState, useEffect } from 'react';
import { apiService } from '@/services/api/apiService';
import { useAuth } from '@/contexts/AuthContext';
import { createPost, getPost, getPostsUser } from '@/services/api/post.api';
import { Post, User } from '@/utils/types';
import { like_post, unlike_post } from '@/services/api/like_post.api';

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token,user } = useAuth();
  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedPosts = await getPostsUser(user?.id || "", token?.accessToken);
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
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (postId: number) => {
    if (!token) return;
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    try {
      setPosts(prevPosts =>
        prevPosts.map(p => {
          if (p.id === postId) {
            const alreadyLiked = p.likes?.some(u => u.id === user?.id);
            return {
              ...p,
              likes: alreadyLiked
                ? p.likes?.filter(u => u.id !== user?.id)
                : [...(p.likes ?? []), { id: user?.id } as User],
              likesCount: alreadyLiked
                ? (p.likesCount ?? 0) - 1
                : (p.likesCount ?? 0) + 1,
            };
          }
          return p;
        })
      );

      const alreadyLiked = post.likes?.some(u => u.id === user?.id);
      if (alreadyLiked) {
        await unlike_post({ post_id: postId, user_id: user?.id || "" }, token.accessToken);
      } else {
        await like_post({ post_id: postId, user_id: user?.id || "" }, token.accessToken);
      }

    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [token]);

  return {
    posts,
    create,
    fetchPost,
    getPost,
    loading,
    error,
    refetch: fetchPosts,
    toggleLike,
  };
}