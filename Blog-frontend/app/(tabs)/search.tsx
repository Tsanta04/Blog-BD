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
import { Button } from '@/components/ui/Button';
import { backgorund } from '@/data/background';
import { Post } from '@/utils/types';
import { usePosts } from '@/hooks/usePosts';

export default function SearchScreen() {
  const { colors } = useTheme();
  const { isAuthenticated,user } = useAuth();
  const {toggleLike} = usePosts();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [isLiked, setIsLiked] = useState(false);

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

  const tLike = async (postId:number) => {
    try {
      // Optimistically update UI
      setIsLiked(prev => !prev);
      await toggleLike(postId||0);
    } catch (error) {
      // Revert optimistic update on error
      // setPost(prev => {
      //   if (!prev) return prev;
      //   return {
      //     ...prev,
      //     isLiked: post.isLiked,
      //     likesCount: post.likesCount,
      //   };
      // });
      console.error('Error toggling like:', error);
    }
  };

  const handlePostPress = (post: Post, path: Href) => {
    if (typeof path === "string") {
      router.push(`${path}?id=${post.id}` as Href);
    } else {
      router.push({
        ...path,
        params: { id: post.id|| "" },
      });
    }
  };
  
  if (!isAuthenticated) {
    router.replace('/login');
  }

  return (
    <ImageBackground
      source={{ uri: backgorund }}
      style={[styles.background, styles.container]}
    >
      <FlatList
        data={posts}
        keyExtractor={item => item.id+""}
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
            user_id={user?.id||""}
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
