import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput, FlatList, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Heart, MessageCircle, Share, Send } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { api } from '@/services/api';

interface Comment {
  id: number;
  content: string;
  user_name: string;
  created_at: string;
}

interface Post {
  id: number;
  title: string;
  content: string;
  user_name: string;
  user_id: string;
  created_at: string;
  likes_count: number;
  comments_count: number;
  is_liked: boolean;
  tags: string[];
  medias: Array<{
    id: number;
    path_name: string;
    type: string;
  }>;
}

export default function PostDetailScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadPost();
      loadComments();
    }
  }, [id]);

  const loadPost = async () => {
    try {
      const postData = await api.getPost(id as string);
      if (postData) {
        setPost(postData);
        setIsLiked(postData.is_liked);
        setLikesCount(postData.likes_count);
      }
    } catch (error) {
      console.error('Error loading post:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const commentsData = await api.getComments(parseInt(id as string));
      setComments(commentsData);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const handleLike = async () => {
    if (!post) return;
    
    try {
      await api.likePost(post.id);
      setIsLiked(!isLiked);
      setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !post) return;

    try {
      const comment = await api.addComment(post.id, newComment.trim());
      setComments([...comments, comment]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderComment = ({ item }: { item: Comment }) => (
    <View style={styles.commentItem}>
      <View style={styles.commentAvatar}>
        <Text style={styles.commentAvatarText}>
          {item.user_name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.commentContent}>
        <Text style={styles.commentUser}>{item.user_name}</Text>
        <Text style={styles.commentText}>{item.content}</Text>
        <Text style={styles.commentDate}>{formatDate(item.created_at)}</Text>
      </View>
    </View>
  );

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
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginLeft: 16,
    },
    content: {
      flex: 1,
    },
    postContainer: {
      padding: 16,
    },
    postHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    avatarText: {
      color: colors.background,
      fontSize: 18,
      fontWeight: 'bold',
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    postDate: {
      fontSize: 12,
      color: colors.textSecondary,
      marginTop: 2,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 12,
    },
    postContent: {
      fontSize: 16,
      color: colors.text,
      lineHeight: 24,
      marginBottom: 16,
    },
    media: {
      width: Dimensions.get('window').width - 32,
      height: 250,
      borderRadius: 8,
      marginBottom: 16,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 16,
    },
    tag: {
      backgroundColor: colors.surface,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 12,
      marginRight: 6,
      marginBottom: 6,
    },
    tagText: {
      color: colors.primary,
      fontSize: 12,
      fontWeight: '500',
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 24,
    },
    actionText: {
      color: colors.text,
      marginLeft: 6,
      fontSize: 14,
      fontWeight: '500',
    },
    commentsSection: {
      flex: 1,
    },
    commentsHeader: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    commentsTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    commentItem: {
      flexDirection: 'row',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    commentAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    commentAvatarText: {
      color: colors.background,
      fontSize: 12,
      fontWeight: 'bold',
    },
    commentContent: {
      flex: 1,
    },
    commentUser: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    commentText: {
      fontSize: 14,
      color: colors.text,
      lineHeight: 20,
      marginBottom: 4,
    },
    commentDate: {
      fontSize: 11,
      color: colors.textSecondary,
    },
    commentInput: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    input: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 10,
      marginRight: 8,
      fontSize: 14,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    sendButton: {
      padding: 8,
    },
    loadingContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    loadingText: {
      fontSize: 16,
      color: colors.textSecondary,
    },
  });

  if (loading || !post) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft color={colors.text} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Post</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Post Content */}
        <View style={styles.postContainer}>
          <View style={styles.postHeader}>
            <TouchableOpacity 
              style={styles.avatar}
              onPress={() => router.push(`/user/${post.user_id}`)}
            >
              <Text style={styles.avatarText}>
                {post.user_name.charAt(0).toUpperCase()}
              </Text>
            </TouchableOpacity>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{post.user_name}</Text>
              <Text style={styles.postDate}>{formatDate(post.created_at)}</Text>
            </View>
          </View>

          <Text style={styles.title}>{post.title}</Text>
          <Text style={styles.postContent}>{post.content}</Text>

          {/* Médias */}
          {post.medias.length > 0 && (
            <Image
              source={{ uri: post.medias[0].path_name }}
              style={styles.media}
              resizeMode="cover"
            />
          )}

          {/* Tags */}
          {post.tags.length > 0 && (
            <View style={styles.tagsContainer}>
              {post.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Actions */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
              <Heart
                color={isLiked ? colors.error : colors.textSecondary}
                size={24}
                fill={isLiked ? colors.error : 'none'}
              />
              <Text style={styles.actionText}>{likesCount}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <MessageCircle color={colors.textSecondary} size={24} />
              <Text style={styles.actionText}>{comments.length}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Share color={colors.textSecondary} size={24} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Comments Section */}
        <View style={styles.commentsSection}>
          <View style={styles.commentsHeader}>
            <Text style={styles.commentsTitle}>
              Commentaires ({comments.length})
            </Text>
          </View>

          <FlatList
            data={comments}
            renderItem={renderComment}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>

      {/* Comment Input */}
      <View style={styles.commentInput}>
        <TextInput
          style={styles.input}
          placeholder="Ajouter un commentaire..."
          placeholderTextColor={colors.textSecondary}
          value={newComment}
          onChangeText={setNewComment}
          multiline
        />
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleAddComment}
          disabled={!newComment.trim()}
        >
          <Send
            color={newComment.trim() ? colors.primary : colors.textSecondary}
            size={20}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}