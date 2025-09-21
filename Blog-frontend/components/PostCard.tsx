import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { Heart, MessageCircle, Eye, FileText } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Card } from './ui/Card';
import { Post } from '@/utils/types';
import { renderMedia } from './RenderMedia';

interface PostCardProps {
  post: Post;
  user_id: string;
  onPress1: () => void;
  onPress2: () => void;
  onLike: (postId: number) => void;
}

export function PostCard({ post, user_id, onPress1, onPress2, onLike }: PostCardProps) {
  const { colors } = useTheme();
  const isLiked = post.likes?.some(u => u.id === user_id);

  const styles = StyleSheet.create({
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
    avatarText: { color: '#FFFFFF', fontWeight: '600', fontSize: 16 },
    authorInfo: { flex: 1 },
    authorName: { fontSize: 16, fontWeight: '600', color: colors.text },
    date: { fontSize: 14, color: colors.subtext },
    title: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 8 },
    excerpt: { fontSize: 14, color: colors.subtext, lineHeight: 20, marginBottom: 12 },
    tags: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
    tag: { backgroundColor: colors.primary, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, marginRight: 8, marginBottom: 4 },
    tagText: { color: '#FFFFFF', fontSize: 12, fontWeight: '500' },
    actions: { flexDirection: 'row', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border },
    actionButton: { flexDirection: 'row', alignItems: 'center', marginRight: 24 },
    actionText: { marginLeft: 6, fontSize: 14, color: colors.subtext, fontWeight: '500' },
    likedText: { color: colors.error },
    mediaContainer: { marginBottom: 16 },
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getInitials = (username: string) => {
    return username
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card>
      <TouchableOpacity onPress={onPress1} activeOpacity={0.8}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(post.user?.name || '')}</Text>
          </View>
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>{post.user?.name}</Text>
            <Text style={styles.date}>{formatDate(post.createdAt)}</Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={onPress2} activeOpacity={0.8}>
        <Text style={styles.title}>{post.title}</Text>
        <Text style={styles.excerpt}>{post.user?.email}</Text>

        {post.medias && post.medias.length > 0 && (
          <View style={styles.mediaContainer}>
            {post.medias.map(renderMedia)}
          </View>
        )}

        {post.tags && post.tags.length > 0 && (
          <View style={styles.tags}>
            {post.tags.map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag.tags}</Text>
              </View>
            ))}
          </View>
        )}
      </TouchableOpacity>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => onLike(post.id || 0)} activeOpacity={0.7}>
          <Heart size={18} color={isLiked ? colors.error : colors.subtext} fill={isLiked ? colors.error : 'transparent'} />
          <Text style={[styles.actionText, isLiked && styles.likedText]}>{post.likesCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={onPress2} activeOpacity={0.7}>
          <MessageCircle size={18} color={colors.subtext} />
          <Text style={styles.actionText}>{post.commentsCount}</Text>
        </TouchableOpacity>

        <View style={styles.actionButton}>
          <Eye size={18} color={colors.subtext} />
          <Text style={styles.actionText}>{post.viewsCount}</Text>
        </View>
      </View>
    </Card>
  );
}
