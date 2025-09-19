import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Alert,
  ImageBackground,
  RefreshControl,
  FlatList,
} from 'react-native';
import { Href, router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/Button';
import { backgorund } from '@/data/background';
import { PostCard } from '@/components/PostCard';
import { usePosts } from '@/hooks/usePosts';
import { Post } from '@/utils/types';


export default function ProfileScreen() {
  const { colors } = useTheme();
  const { isAuthenticated, user, signOut } = useAuth();
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
    profileHeader: {
      alignItems: 'center',
      marginBottom: 24,
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
    },
    avatarText: {
      color: '#FFFFFF',
      fontWeight: '700',
      fontSize: 36,
    },
    username: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 4,
    },
    email: {
      fontSize: 16,
      color: colors.subtext,
      marginBottom: 16,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 24,
    },
    statBox: {
      alignItems: 'center',
    },
    statNumber: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
    },
    statLabel: {
      fontSize: 14,
      color: colors.subtext,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    menuIcon: {
      marginRight: 16,
    },
    menuText: {
      fontSize: 16,
      color: colors.text,
      flex: 1,
    },
    logoutButton: {
      marginTop: 32,
    },
    addButton: {
      position: 'absolute',
      bottom: 24,
      right: 24,
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5,
    },
  });

  const getInitials = (username: string) => {
    return username
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

    const handlePostPress = (post: Post, path: Href) => {
    if (typeof path === "string") {
        router.push(`${path}?id=${post.id}` as Href);
    } else {
        router.push({
        ...path,
        params: { id: post.id||0 },
        });
    }
    };
  
  if (!isAuthenticated) {
    router.replace('/login');
  }

  return (
      <ImageBackground
        source={{ uri: backgorund }}
        style={[styles.content]}
      > 
      {/* Header profil */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user ? getInitials(user.name) : 'U'}
            </Text>
          </View>
          <Text style={styles.username}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        {/* Statistiques */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{user?.postsCount ?? 0}</Text>
            <Text style={styles.statLabel}>Articles</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{user?.likesCount ?? 0}</Text>
            <Text style={styles.statLabel}>Likes</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>{user?.followersCount ?? 0}</Text>
            <Text style={styles.statLabel}>Abonnés</Text>
          </View>
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
      </ImageBackground>
  );
}
