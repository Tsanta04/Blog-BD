import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { PostCard } from '@/components/PostCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { Post } from '@/types';
import { apiService } from '@/services/apiService';

export default function PopularScreen() {
  const { colors } = useTheme();
  const { isAuthenticated, token } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      padding: 16,
    },
    header: {
      marginBottom: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      color: colors.subtext,
    },
    authPrompt: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    authTitle: {
      fontSize: 24,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
    },
    authSubtitle: {
      fontSize: 16,
      color: colors.subtext,
      textAlign: 'center',
      marginBottom: 24,
      lineHeight: 22,
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

  const fetchPopularPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedPosts = await apiService.getPopularPosts(token || undefined);
      setPosts(fetchedPosts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch popular posts');
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

  const handlePostPress = (post: Post) => {
    router.push({
      pathname: '/post/[id]',
      params: { id: post.id },
    });
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchPopularPosts();
    }
  }, [isAuthenticated, token]);

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.authPrompt}>
          <Text style={styles.authTitle}>Articles Populaires</Text>
          <Text style={styles.authSubtitle}>
            Connectez-vous pour découvrir les articles les plus populaires
          </Text>
          <Button
            title="Se connecter"
            onPress={() => router.push('/login')}
            size="large"
          />
        </View>
      </SafeAreaView>
    );
  }

  if (loading && posts.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button title="Réessayer" onPress={fetchPopularPosts} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <Text style={styles.title}>Articles Populaires 🔥</Text>
            <Text style={styles.subtitle}>
              Les articles les plus likés et commentés
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onPress={() => handlePostPress(item)}
            onLike={toggleLike}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchPopularPosts}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}