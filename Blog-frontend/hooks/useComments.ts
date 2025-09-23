import { useState, useEffect } from 'react';
import { commentPost, getPostComment } from '@/services/api/comment.api';
import { Comments } from '@/utils/types';
import { useAuth } from '@/context/AuthContext';

export function useComments(postId: number) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { token, user } = useAuth();

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedComments = await getPostComment(postId,token?.accessToken || "");
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
      const newComment = await commentPost({
        content: content,
        post_id: postId,
        user_id: user?.id || "",
        createdAt: new Date().toISOString(),
      }, token.accessToken);
      setComments(prevComments => [...prevComments, newComment]);
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const updateComment = async (coms: Comments) => {
    if (!token || !coms.content.trim()) return;

    try {
      setSubmitting(true);
      const newComment = await commentPost(coms, token.accessToken);
      setComments(prevComments => [...prevComments, newComment]);
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    } finally {
      setSubmitting(false);
    }
  };  

  return {
    comments,
    loading,
    error,
    submitting,
    addComment,
    updateComment,
    refetch: fetchComments,
  };
}