import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { usePosts } from '@/hooks/usePosts';
import { PostCard } from '@/components/PostCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { Post } from '@/types';
import { Plus } from 'lucide-react-native';

export default function HomeScreen() {
  const { colors } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const { posts, loading, error, refetch, toggleLike } = usePosts();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    background: {
      flex: 1,
      resizeMode: 'cover',
    },
    overlay: {
      paddingBottom: '23%',
      backgroundColor: colors.background,
      padding: 9,
    },
    content: {
      flexGrow: 1,
      paddingBottom: 40,
    },
    header: {
      position:'fixed',
      top:15,
      height:95,
      margin: 15,
    },
    title: {
      fontSize: 32,
      color: colors.text,
      marginBottom: 4,
      textShadowColor: 'rgba(0,0,0,0.6)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 6,
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
      fontSize: 28,
      fontWeight: '700',
      color: '#fff',
      marginBottom: 12,
    },
    authSubtitle: {
      fontSize: 16,
      color: '#f0f0f0',
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
    fab: {
      position: 'absolute',
      bottom: 24,
      right: 24,
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: '#4CAF50', // couleur verte par exemple
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5, // pour Android
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
        <ImageBackground
          source={{
            uri: 'https://img.freepik.com/photos-gratuite/illustration-rendu-3d-boules-vertes_181624-58606.jpg?semt=ais_incoming&w=740&q=80',
          }}
          style={styles.background}
        >
          <View style={styles.overlay}>
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
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }

  if (loading && posts.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <ImageBackground
          source={{
            uri: 'https://img.freepik.com/photos-gratuite/illustration-rendu-3d-boules-vertes_181624-58606.jpg?semt=ais_incoming&w=740&q=80',
          }}
          style={styles.background}
        >
          <View style={styles.overlay}>
            <LoadingSpinner />
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <ImageBackground
          source={{
            uri: 'https://img.freepik.com/photos-gratuite/illustration-rendu-3d-boules-vertes_181624-58606.jpg?semt=ais_incoming&w=740&q=80',
          }}
          style={styles.background}
        >
          <View style={styles.overlay}>
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <Button title="Réessayer" onPress={refetch} />
            </View>
          </View>
        </ImageBackground>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/create')}
          activeOpacity={0.8}
        >
          <Plus size={28} color={colors.background} />
        </TouchableOpacity>      
      <View style={styles.header}>
        <Text style={styles.title}>
          Bonjour {user?.username} 👋
        </Text>
        <Text style={styles.subtitle}>
          Découvrez les derniers articles
        </Text>
      </View>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
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
    </View>
  );
}
