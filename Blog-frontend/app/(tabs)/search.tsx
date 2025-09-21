import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  SafeAreaView,
  ImageBackground,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { Href, router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { usePosts } from '@/hooks/usePosts';
// import { useUsers } from '@/hooks/useUsers'; // hook pour récupérer les users
import { PostCard } from '@/components/PostCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Moon, Sun } from 'lucide-react-native';
import { backgorund } from '@/data/background';
import { Post, User } from '@/utils/types';

export default function SearchScreen() {
  const { isAuthenticated, user } = useAuth();
  const { colors, isDark, toggleTheme } = useTheme();
  const { searchPosts, loading: loadingPosts, posts, toggleLike } = usePosts();
  // const { searchUsers, loading: loadingUsers, users } = useUsers();

  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'Posts' | 'Users'>('Posts');

  // Déclenche la recherche à chaque changement de query avec debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (activeTab === 'Posts') {
        searchPosts(query);
      } else {
        // searchUsers(query);
      }
    }, 400); // 400ms de debounce
    return () => clearTimeout(timer);
  }, [query, activeTab]);

  const styles = StyleSheet.create({
    container: { flex: 1 },
    background: { flex: 1, resizeMode: 'cover' },
    overlay: { paddingBottom: '23%', backgroundColor: colors.background, padding: 9 },
    content: { flexGrow: 1, paddingBottom: 40 },
    header: { position: 'fixed', top: 15, height: 95, margin: 15 },
    title: { fontSize: 32, color: colors.text, marginBottom: 4, textShadowColor: 'rgba(0,0,0,0.6)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 6 },
    subtitle: { fontSize: 16, color: colors.subtext },
    searchInput: { backgroundColor: colors.card, color: colors.text, padding: 10, borderRadius: 8, width: 300, marginBottom: 12 },
    tabs: { flexDirection: 'row', marginBottom: 12 },
    tab: { flex: 1, padding: 12, alignItems: 'center', borderBottomWidth: 2 },
    tabText: { fontSize: 16 },
    errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    errorText: { fontSize: 16, color: colors.error, textAlign: 'center', marginBottom: 16 },
  });

  const handlePostPress = (post: Post, path: string) => {
    console.log(post);
    router.push(`${path}/${post.id}` as Href);
  };

  useEffect(() => {
    if (!isAuthenticated) router.replace('/login');
  }, [isAuthenticated]);

  return (
    <ImageBackground source={{ uri: backgorund }} style={[styles.background, styles.overlay]}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View>
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher..."
            placeholderTextColor={colors.subtext}
            value={query}
            onChangeText={setQuery}
          />
        </View>
        <TouchableOpacity onPress={toggleTheme} style={{ marginRight: 16 }}>
          {isDark ? <Sun size={24} color={colors.text} /> : <Moon size={24} color={colors.text} />}
        </TouchableOpacity>
      </View>
      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, { borderBottomColor: activeTab === 'Posts' ? colors.primary : 'transparent' }]}
          onPress={() => setActiveTab('Posts')}
        >
          <Text style={[styles.tabText, { color: activeTab === 'Posts' ? colors.text : colors.subtext }]}>Posts</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, { borderBottomColor: activeTab === 'Users' ? colors.primary : 'transparent' }]}
          onPress={() => setActiveTab('Users')}
        >
          <Text style={[styles.tabText, { color: activeTab === 'Users' ? colors.text : colors.subtext }]}>Users</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'Posts' ? (
        loadingPosts ? (
          <LoadingSpinner />
        ) : (
          <FlatList
            data={posts}
            keyExtractor={(item) => item.id + ""}
            contentContainerStyle={styles.content}
            renderItem={({ item }) => (
              <PostCard
                post={item}
                user_id={user?.id||""}
                onPress2={() => handlePostPress(item,'/post')}
                onPress1={() => handlePostPress(item,'/profile_users')}
                onLike={toggleLike}
              />
            )}
            refreshControl={
              <RefreshControl refreshing={loadingPosts} onRefresh={() => searchPosts(query)} colors={[colors.primary]} tintColor={colors.primary} />
            }
            showsVerticalScrollIndicator={false}
          />
        )
      ) : loadingPosts ? (
        <LoadingSpinner />
      ) : (
        <View></View>
        // <FlatList
        //   data={users}
        //   keyExtractor={(item) => item.id + ""}
        //   contentContainerStyle={styles.content}
        //   renderItem={({ item }) => (
        //     <TouchableOpacity onPress={() => handleUserPress(item)} style={{ paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        //       <Text style={{ color: colors.text, fontSize: 16 }}>{item.name}</Text>
        //       <Text style={{ color: colors.subtext, fontSize: 14 }}>@{item.username}</Text>
        //     </TouchableOpacity>
        //   )}
        //   refreshControl={
        //     <RefreshControl refreshing={loadingUsers} onRefresh={() => searchUsers(query)} colors={[colors.primary]} tintColor={colors.primary} />
        //   }
        //   showsVerticalScrollIndicator={false}
        // />
      )}
    </ImageBackground>
  );
}
