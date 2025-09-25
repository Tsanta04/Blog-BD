import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { PostCard } from '@/components/PostCard';
import { useAuth } from '@/context/AuthContext';
import { usePosts } from '@/hooks/usePosts';
import { useUser } from '@/hooks/useUser';
import { User } from '@/utils/types';

export default function UserProfileScreen() {
  const { colors } = useTheme();
  const {user} = useAuth();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowed, setIsFollowed] = useState(false);
  const [likesCount, setLikesCount] = useState(0);  
  const [followerCount, setFollowerCount] = useState(0);  
  // console.log(id);
  
  const [user_,setUser_] = useState<User>({"email": "alice@example.com", "followersCount": 0, "id": "a1111111-1111-4f11-8111-111111111111", "likesCount": 0, "name": "Alice", "posts": [], "postsCount": 0});

  const {posts, fetchPosts} = usePosts();
  const {getUser} = useUser();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const use: User = await getUser(id.toString());
      setUser_(use);
      await fetchPosts(use.id);
      setIsFollowed(use.followers?.some(u => u.id === user?.id)||false);
      setIsLiked(use.likes?.some(u => u.id === user?.id)||false);
      setFollowerCount(use.followersCount||0);
      setLikesCount(use.likesCount||0);
    } catch (error) {
      console.error('Error loading user posts:', error);
    }
  };

  useEffect (() => {
    console.log(user_);
  },[user_])
  
  const handleFollow = async () => {
    if (!user) return;
    
    try {
      // await toggleLike(post.id||0);
      setIsFollowed(!isFollowed);
      setFollowerCount(prev => isFollowed ? prev - 1 : prev + 1);
    } catch (error) {
      console.error('Error following post:', error);
    }
  };

  const handleLike = async () => {
    if (!user) return;
    
    try {
      // await toggleLike(post.id||0);
      setIsLiked(!isLiked);
      setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      {/* User Info */}
      <View style={styles.userSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user_.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.userName}>{user_.name}</Text>
        <Text style={styles.userEmail}>{user_.email}</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{followerCount}</Text>
          <Text style={styles.statLabel}>Abonnés</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{likesCount}</Text>
          <Text style={styles.statLabel}>J'aimes</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{user_.postsCount}</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <TouchableOpacity onPress={handleFollow}>
            <Text style={styles.statLabel}>S'abonner</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLike}>
            <Text style={styles.statLabel}>Aimer</Text>
        </TouchableOpacity>
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
        <Text style={styles.headerTitle}>{user_.name}</Text>
      </View> 

      <FlatList 
        data={posts}
        keyExtractor={(item) => item.id?.toString()||""}
        renderItem={({ item }) => <PostCard user_id={user?.id||""} post={item} />}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}