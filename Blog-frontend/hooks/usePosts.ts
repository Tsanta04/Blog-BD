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
      const fetchedPosts = await getPostsUser(user?.id||"")
      setPosts(fetchedPosts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchPost = async (post_id:number) => {
    try {
      setLoading(true);
      setError(null);
      const fetchedPosts = await getPost(post_id)
      setPosts(fetchedPosts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };  

  const create = async (post:Post) => {
    try {
      setLoading(true);
      const newComment = await createPost({...post});

    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    } finally {
      setLoading(false)
    }    
  }  

  const toggleLike = async (postId: number) => {
    if (!token) return;

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    try {
      // Optimistically update UI
      setPosts(prevPosts =>
        prevPosts.map(p => {
          if (p.id === postId) {
            const alreadyLiked = p.likes?.some(u => u.id === user?.id);

            return {
              ...p,
              likes: alreadyLiked
                ? p.likes?.filter(u => u.id !== user?.id) // retirer le like
                : [...(p.likes ?? []), { id: user?.id } as User], // ajouter le like
              likesCount: alreadyLiked
                ? (p.likesCount ?? 0) - 1
                : (p.likesCount ?? 0) + 1,
            };
          }
          return p;
        })
      );

      // Ensuite appeler l'API en arrière-plan
      (async () => {
        const alreadyLiked = posts.find(p => p.id === postId)?.likes?.some(u => u.id === user?.id);

        try {
          if (alreadyLiked) {
            await unlike_post({ post_id: postId, user_id: user?.id || "" });
          } else {
            await like_post({ post_id: postId, user_id: user?.id || "" });
          }
        } catch (err) {
          console.error("Erreur lors du like/unlike", err);
          // éventuellement rollback l'UI si nécessaire
        }
      })();

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