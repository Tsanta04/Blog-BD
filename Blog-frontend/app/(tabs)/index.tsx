import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { PostCard } from '@/components/PostCard';
import { usePosts } from '@/hooks/usePosts';

export default function HomeScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const { posts, loading, error, refetch, toggleLike } = usePosts();

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleUserPress = (userId: string) => {
    router.push(`/user/${userId}`);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    list: {
      flex: 1,
    },
    fab: {
      position: 'absolute',
      bottom: 90,
      right: 20,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
    },
  });

  if (!user) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        style={styles.list}
        data={posts}
        keyExtractor={(item) => item.id?.toString()||""}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            user_id={user.id||""}
            onUserPress={handleUserPress}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      />
      
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/post/add')}
      >
        <Plus color={colors.background} size={28} strokeWidth={2} />
      </TouchableOpacity>
    </SafeAreaView>
  );
}