import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { PostCard } from '@/components/PostCard';
import { api } from '@/servicesBp/api';

export default function UserProfileScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [user] = useState({
    id: id,
    name: 'Marie Claire',
    email: 'marie@example.com',
  });
  const [posts, setPosts] = useState([]);
  const [stats] = useState({
    followers: 892,
    likes: 2341,
    posts: 15,
  });

  useEffect(() => {
    loadUserPosts();
  }, []);

  const loadUserPosts = async () => {
    try {
      const allPosts = await api.getPosts();
      // Simuler les posts de cet utilisateur
      const userPosts = allPosts.filter(() => Math.random() > 0.5);
      setPosts(userPosts);
    } catch (error) {
      console.error('Error loading user posts:', error);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      {/* User Info */}
      <View style={styles.userSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.userName}>{user.name}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.followers}</Text>
          <Text style={styles.statLabel}>Abonnés</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.likes}</Text>
          <Text style={styles.statLabel}>J'aimes</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.posts}</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
      </View>

      {/* Posts Title */}
      <View style={styles.postsHeader}>
        <Text style={styles.postsTitle}>Publications</Text>
      </View>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    topHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginLeft: 16,
    },
    header: {
      paddingBottom: 20,
    },
    userSection: {
      alignItems: 'center',
      paddingVertical: 20,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    avatarText: {
      color: colors.background,
      fontSize: 32,
      fontWeight: 'bold',
    },
    userName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },
    userEmail: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    statsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingHorizontal: 20,
      paddingVertical: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    statItem: {
      alignItems: 'center',
    },
    statNumber: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    postsHeader: {
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    postsTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 10,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Navigation Header */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{user.name}</Text>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <PostCard post={item} />}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}