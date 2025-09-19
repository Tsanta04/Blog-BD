import { useState, useEffect } from 'react';
import { Comment } from '@/types__';
import { useAuth } from '@/contexts/AuthContext';
import { commentPost, getPostComment, updateComment as apiUpdateComment } from '@/services/api/comment.api';
import { Comments } from '@/utils/types';

export function useComments(postId: number) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const { token, user } = useAuth();

  const fetchComments = async () => {
    if (!token) return; // sécuriser l'accès

    try {
      setLoading(true);
      setError(null);
      const fetchedComments = await getPostComment(postId, token.accessToken);
      setComments(fetchedComments);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch comments');
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (content: string) => {
    if (!token || !content.trim() || !user) return;

    try {
      setSubmitting(true);
      const newComment = await commentPost({
        content: content,
        post_id: postId,
        user_id: user.id||""
      }, token.accessToken);

      setComments(prevComments => [...prevComments, newComment]);
    } catch (err) {
      console.error('Error adding comment:', err);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  const updateCommentLocal = async (coms: Comments) => {
    if (!token || !coms.content.trim()) return;

    try {
      setSubmitting(true);
      const updatedComment = await apiUpdateComment(coms, token.accessToken);

      // mettre à jour le commentaire dans le tableau
      setComments(prevComments => prevComments.map(c => 
        c.id === updatedComment.id ? updatedComment : c
      ));
    } catch (err) {
      console.error('Error updating comment:', err);
      throw err;
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (postId && token) {
      fetchComments();
    }
  }, [postId, token]);

  return {
    comments,
    loading,
    error,
    submitting,
    addComment,
    updateComment: updateCommentLocal,
    refetch: fetchComments,
  };
}
