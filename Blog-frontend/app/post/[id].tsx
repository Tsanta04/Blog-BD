import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Heart, MessageCircle, Eye } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useComments } from '@/hooks/useComments';
import { Post } from '@/types';
import { apiService } from '@/services/apiService';
import { CommentCard } from '@/components/CommentCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function PostDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme();
  const { token } = useAuth();
  const { comments, loading: commentsLoading, addComment, submitting } = useComments(id || '');
  
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.card,
    },
    backButton: {
      marginRight: 16,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
    },
    content: {
      flex: 1,
    },
    postContent: {
      padding: 16,
    },
    postHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    avatarText: {
      color: '#FFFFFF',
      fontWeight: '600',
      fontSize: 18,
    },
    authorInfo: {
      flex: 1,
    },
    authorName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    date: {
      fontSize: 14,
      color: colors.subtext,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 16,
      lineHeight: 32,
    },
    postText: {
      fontSize: 16,
      color: colors.text,
      lineHeight: 24,
      marginBottom: 16,
    },
    tags: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 16,
    },
    tag: {
      backgroundColor: colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      marginRight: 8,
      marginBottom: 8,
    },
    tagText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '500',
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderTopColor: colors.border,
      borderBottomColor: colors.border,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 24,
    },
    actionText: {
      marginLeft: 6,
      fontSize: 14,
      color: colors.subtext,
      fontWeight: '500',
    },
    likedText: {
      color: colors.error,
    },
    commentsSection: {
      padding: 16,
    },
    commentsTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 16,
    },
    commentForm: {
      marginBottom: 20,
    },
    commentInput: {
      marginBottom: 12,
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    errorText: {
      fontSize: 16,
      color: colors.error,
      textAlign: 'center',
      marginBottom: 16,
    },
  });

  const fetchPost = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const fetchedPost = await apiService.getPost(id, token || undefined);
      setPost(fetchedPost);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch post');
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async () => {
    if (!post || !token) return;

    try {
      // Optimistically update UI
      setPost(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          isLiked: !prev.isLiked,
          likesCount: prev.isLiked ? prev.likesCount - 1 : prev.likesCount + 1,
        };
      });

      // Make API call
      if (post.isLiked) {
        await apiService.unlikePost(post.id, token);
      } else {
        await apiService.likePost(post.id, token);
      }
    } catch (error) {
      // Revert optimistic update on error
      setPost(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          isLiked: post.isLiked,
          likesCount: post.likesCount,
        };
      });
      console.error('Error toggling like:', error);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      await addComment(commentText.trim());
      setCommentText('');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'ajouter le commentaire');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getInitials = (username: string) => {
    return username
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  useEffect(() => {
    fetchPost();
  }, [id, token]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Article</Text>
        </View>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  if (error || !post) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Erreur</Text>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {error || 'Article non trouvé'}
          </Text>
          <Button title="Retour" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Article</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <ScrollView>
          <View style={styles.postContent}>
            <View style={styles.postHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {getInitials(post.author.username)}
                </Text>
              </View>
              <View style={styles.authorInfo}>
                <Text style={styles.authorName}>{post.author.username}</Text>
                <Text style={styles.date}>{formatDate(post.createdAt)}</Text>
              </View>
            </View>

            <Text style={styles.title}>{post.title}</Text>
            <Text style={styles.postText}>{post.content}</Text>
              <Image
                    source={{
                      uri: "https://recoverit.wondershare.com/uploads/best-3d-wallpaper-android-05.jpg",
                    }}
                    style={{
                      width: '100%',
                      marginBottom: 16,
                      height: 200, // fixe une hauteur ou adapte dynamiquement
                    }}
                    resizeMode="cover"
                  />
            {post.tags.length > 0 && (
              <View style={styles.tags}>
                {post.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>#{tag}</Text>
                  </View>
                ))}
              </View>
            )}

            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={toggleLike}
                activeOpacity={0.7}
              >
                <Heart
                  size={20}
                  color={post.isLiked ? colors.error : colors.subtext}
                  fill={post.isLiked ? colors.error : 'transparent'}
                />
                <Text
                  style={[
                    styles.actionText,
                    post.isLiked && styles.likedText,
                  ]}
                >
                  {post.likesCount}
                </Text>
              </TouchableOpacity>

              <View style={styles.actionButton}>
                <MessageCircle size={20} color={colors.subtext} />
                <Text style={styles.actionText}>{comments.length}</Text>
              </View>

              <View style={styles.actionButton}>
                <Eye size={20} color={colors.subtext} />
                <Text style={styles.actionText}>{post.viewsCount}</Text>
              </View>
            </View>
          </View>

          <View style={styles.commentsSection}>
            <Text style={styles.commentsTitle}>
              Commentaires ({comments.length})
            </Text>

            {token && (
              <View style={styles.commentForm}>
                <Input
                  placeholder="Écrivez votre commentaire..."
                  value={commentText}
                  onChangeText={setCommentText}
                  multiline
                  numberOfLines={3}
                  style={styles.commentInput}
                />
                <Button
                  title="Commenter"
                  onPress={handleAddComment}
                  loading={submitting}
                  disabled={!commentText.trim()}
                />
              </View>
            )}

            {commentsLoading ? (
              <LoadingSpinner size="small" />
            ) : (
              comments.map(comment => (
                <CommentCard key={comment.id} comment={comment} />
              ))
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}