import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  SafeAreaView,
  ImageBackground,
  TextInput,
} from 'react-native';
import { Href, router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { PostCard } from '@/components/PostCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { Post } from '@/types';
import { apiService } from '@/services__/apiService';
import { backgorund } from '@/data/background';

export default function SearchScreen() {
  const { colors } = useTheme();
  const { isAuthenticated, token } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

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
      marginBottom: 12,
    },
    searchInput: {
      backgroundColor: colors.card,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      color: colors.text,
      marginBottom: 16,
    },
    subtitle: {
      fontSize: 16,
      color: colors.subtext,
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
    background: {
      flex: 1,
      resizeMode: 'cover',
    },
  });

  const searchPosts = async () => {
    if (!query.trim()) {
      setPosts([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      // const results = await apiService.searchPosts(query, token || undefined);
      // setPosts(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la recherche');
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (postId: string) => {
    if (!token) return;

    const post = posts.find(p => p.id === postId);
    if (!post) return;

    try {
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

      if (post.isLiked) {
        await apiService.unlikePost(postId, token);
      } else {
        await apiService.likePost(postId, token);
      }
    } catch (error) {
      setPosts(prevPosts =>
        prevPosts.map(p =>
          p.id === postId
            ? { ...p, isLiked: post.isLiked, likesCount: post.likesCount }
            : p
        )
      );
    }
  };

  const handlePostPress = (post: Post, path: Href) => {
    if (typeof path === "string") {
      router.push(`${path}?id=${post.id}` as Href);
    } else {
      router.push({
        ...path,
        params: { id: post.id },
      });
    }
  };


  if (!isAuthenticated) {
    return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Connectez-vous pour rechercher des articles
          </Text>
          <Button
            title="Se connecter"
            onPress={() => router.push('/login')}
            size="large"
          />
        </View>
    );
  }

  return (
    <ImageBackground
      source={{ uri: backgorund }}
      style={[styles.background, styles.container]}
    >
      <FlatList
        data={posts}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <Text style={styles.title}>Recherche 🔎</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher un article..."
              placeholderTextColor={colors.subtext}
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={searchPosts}
              returnKeyType="search"
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>
        )}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onPress2={() => handlePostPress(item,'/post/[id]')}
            onPress1={() => handlePostPress(item,'/profile/[id]')}
            onLike={toggleLike}
          />
        )}
        ListEmptyComponent={
          !loading && query.trim() ? (
            <Text style={styles.subtitle}>Aucun résultat trouvé</Text>
          ) : null
        }
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={searchPosts}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </ImageBackground>
  );
}
