import React from 'react';
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
import { usePosts } from '@/hooks/usePosts';
import { PostCard } from '@/components/PostCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { Post } from '@/types';

export default function HomeScreen() {
  const { colors } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const { posts, loading, error, refetch, toggleLike } = usePosts();

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

  const handlePostPress = (post: Post) => {
    router.push({
      pathname: '/post/[id]',
      params: { id: post.id },
    });
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.authPrompt}>
          <Text style={styles.authTitle}>Bienvenue sur Mini Blog</Text>
          <Text style={styles.authSubtitle}>
            Connectez-vous pour découvrir les derniers articles, liker et commenter
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
          <Button title="Réessayer" onPress={refetch} />
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
            <Text style={styles.title}>
              Bonjour {user?.username} 👋
            </Text>
            <Text style={styles.subtitle}>
              Découvrez les derniers articles
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
            onRefresh={refetch}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}