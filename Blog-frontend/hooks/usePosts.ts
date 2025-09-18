import { useState, useEffect } from 'react';
import { Post } from '@/types';
import { apiService } from '@/services__/apiService';
import { useAuth } from '@/contexts/AuthContext';

export function usePosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedPosts = await apiService.getPosts(token || undefined);
      setPosts(fetchedPosts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (postId: string) => {
    if (!token) return;

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    try {
      // Optimistically update UI
      setPosts(prevPosts =>
        prevPosts.map(p =>
          p.id === postId
            ? {
                ...p,
                isLiked: !p.isLiked,
                likesCount: p.isLiked ? p.likesCount - 1 : p.likesCount + 1,
              }
            : p
        )
      );

      // Make API call
      if (post.isLiked) {
        await apiService.unlikePost(postId, token);
      } else {
        await apiService.likePost(postId, token);
      }
    } catch (error) {
      // Revert optimistic update on error
      setPosts(prevPosts =>
        prevPosts.map(p =>
          p.id === postId
            ? {
                ...p,
                isLiked: post.isLiked,
                likesCount: post.likesCount,
              }
            : p
        )
      );
      console.error('Error toggling like:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [token]);

  return {
    posts,
    loading,
    error,
    refetch: fetchPosts,
    toggleLike,
  };
}