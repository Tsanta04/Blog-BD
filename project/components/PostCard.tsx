import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { Heart, MessageCircle, Share, User } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';
import { api } from '@/servicesBp/api';
import { Post } from '@/utils/types';
import { usePosts } from '@/hooks/usePosts';

interface PostCardProps {
  post:Post;
  user_id:string;
  onUserPress?: (userId: string) => void;
}

export function PostCard({ post, user_id, onUserPress }: PostCardProps) {
  const { colors } = useTheme();
  const { toggleLike } = usePosts();
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(post.likes?.some(u => u.id === user_id));
  const [likesCount, setLikesCount] = useState(post.likesCount||0);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `il y a ${diffInHours}h`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `il y a ${diffInDays}j`;
    }
  };

  const handleLike = async () => {
    try {
      toggleLike(post.id||0);
      setIsLiked(!isLiked);
      setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    } catch (error) {
      console.error('Error liking post:', error);
      Alert.alert('Erreur', 'Impossible de liker le post');
    }
  };

  const handleUserPress = () => {
    if (onUserPress) {
      onUserPress(post.user_id);
    } else {
      router.push(`/user/${post.user_id}`);
    }
  };

  const handlePostPress = () => {
    router.push(`/post/${post.id}`);
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.background,
      marginBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    avatarText: {
      color: colors.background,
      fontSize: 16,
      fontWeight: 'bold',
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      color: colors.text,
      fontSize: 16,
      fontWeight: '600',
    },
    timeAgo: {
      color: colors.textSecondary,
      fontSize: 12,
      marginTop: 2,
    },
    content: {
      paddingHorizontal: 16,
      paddingBottom: 12,
    },
    title: {
      color: colors.text,
      fontSize: 18,
      fontWeight: '600',
      marginBottom: 8,
    },
    contentText: {
      color: colors.text,
      fontSize: 14,
      lineHeight: 20,
      marginBottom: 12,
    },
    media: {
      width: Dimensions.get('window').width - 30,
      height: 300,
      marginBottom: 12,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 12,
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
      paddingHorizontal: 16,
      paddingBottom: 16,
      alignItems: 'center',
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
  });

  return (
    <View style={styles.container}>
      {/* Header avec utilisateur */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.avatar} onPress={handleUserPress}>
          <Text style={styles.avatarText}>
            {post.user?.name.charAt(0).toUpperCase()}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.userInfo} onPress={handleUserPress}>
          <Text style={styles.userName}>{post.user?.name}</Text>
          <Text style={styles.timeAgo}>{formatDate(post.createdAt)}</Text>
        </TouchableOpacity>
      </View>

      {/* Contenu */}
      <TouchableOpacity style={styles.content} onPress={handlePostPress}>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.contentText} numberOfLines={3}>
          {post.content}
        </Text>
        
        {/* Médias */}
        {post.medias && post.medias.length > 0 && (
          <Image
            source={{ uri: post.medias[0].path_name }}
            style={styles.media}
            resizeMode="cover"
          />
        )}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {post.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag.tags}</Text>
              </View>
            ))}
          </View>
        )}
      </TouchableOpacity>

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

        <TouchableOpacity style={styles.actionButton} onPress={handlePostPress}>
          <MessageCircle color={colors.textSecondary} size={24} />
          <Text style={styles.actionText}>{post.commentsCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Share color={colors.textSecondary} size={24} />
        </TouchableOpacity>
      </View>
    </View>
  );
}