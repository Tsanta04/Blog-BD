import { useState, useEffect } from 'react';
import { Comment } from '@/types';
import { apiService } from '@/services__/apiService';
import { useAuth } from '@/contexts/AuthContext';

export function useComments(postId: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { token } = useAuth();

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedComments = await apiService.getComments(postId, token || undefined);
      setComments(fetchedComments);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch comments');
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (content: string) => {
    if (!token || !content.trim()) return;

    try {
      setSubmitting(true);
      const newComment = await apiService.addComment(postId, content, token);
      setComments(prevComments => [...prevComments, newComment]);
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (postId) {
      fetchComments();
    }
  }, [postId, token]);

  return {
    comments,
    loading,
    error,
    submitting,
    addComment,
    refetch: fetchComments,
  };
}