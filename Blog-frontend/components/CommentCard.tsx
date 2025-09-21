import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Comments } from '@/utils/types';

interface CommentCardProps {
  comment: Comments;
}

export function CommentCard({ comment }: CommentCardProps) {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      padding: 12,
      borderRadius: 8,
      marginBottom: 12,
      borderLeftWidth: 3,
      borderLeftColor: colors.primary,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    avatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    avatarText: {
      color: '#FFFFFF',
      fontWeight: '600',
      fontSize: 14,
    },
    authorInfo: {
      flex: 1,
    },
    authorName: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
    },
    date: {
      fontSize: 12,
      color: colors.subtext,
    },
    content: {
      fontSize: 14,
      color: colors.text,
      lineHeight: 20,
    },
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) {
      return `Il y a ${minutes}m`;
    } else if (hours < 24) {
      return `Il y a ${hours}h`;
    } else if (days < 7) {
      return `Il y a ${days}j`;
    } else {
      return date.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
      });
    }
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
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {getInitials(comment.user?.name || "U")}
          </Text>
        </View>
        <View style={styles.authorInfo}>
          <Text style={styles.authorName}>{comment.user?.name}</Text>
          <Text style={styles.date}>{formatDate(comment.createdAt)}</Text>
        </View>
      </View>
      <Text style={styles.content}>{comment.content}</Text>
    </View>
  );
}