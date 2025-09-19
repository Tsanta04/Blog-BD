import React, { useEffect } from 'react';
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
import { Href, router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { usePosts } from '@/hooks/usePosts';
import { PostCard } from '@/components/PostCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/Button';
import { Moon, Plus, Sun } from 'lucide-react-native';
import { backgorund } from '@/data/background';
import { Post } from '@/utils/types';

export default function HomeScreen() {
  const { isAuthenticated, user } = useAuth();
  const { colors, isDark, toggleTheme } = useTheme();
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
      bottom: 85,
      right: 24,
      width: 60,
      height: 60,
      zIndex:200,
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

  useEffect(() => {
    // We only want to navigate away after the initial auth check is complete.
    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated]);

  if (loading && posts.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
          <View style={styles.overlay}>
            <LoadingSpinner />
          </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
          <View style={styles.overlay}>
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <Button title="Réessayer" onPress={refetch} />
            </View>
          </View>
      </SafeAreaView>
    );
  }

  return (
  <ImageBackground
    source={{ uri: backgorund }}
    style={[styles.background, styles.overlay]}
  >    
    {/* <View style={styles.overlay}> */}
        <TouchableOpacity
          style={styles.fab}
          onPress={() => router.push('/create')}
          activeOpacity={0.8}
        >
          <Plus size={28} color={colors.background} />
        </TouchableOpacity>    
      <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
        <View style={styles.header}>
          <Text style={styles.title}>
            Bonjour {user?.name} 👋
          </Text>
          <Text style={styles.subtitle}>
            Découvrez les derniers articles
          </Text>
        </View>        
        <TouchableOpacity
          onPress={toggleTheme}
          style={{ marginRight: 16 }}
          activeOpacity={0.7}
        >
          {isDark ? (
            <Sun size={24} color={colors.text} />
          ) : (
            <Moon size={24} color={colors.text} />
          )}
        </TouchableOpacity>      
      </View>
      {
        posts.length === 0 && (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id+""}
          contentContainerStyle={styles.content}
          renderItem={({ item }) => (
            <PostCard
              post={item}
              user_id={user?.id||""}
              onPress2={() => handlePostPress(item,'/post/[id]')}
              onPress1={() => handlePostPress(item,'/profile/[id]')}
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
        ) 
      }  
    {/* </View> */}
  </ImageBackground>    
  );
}
