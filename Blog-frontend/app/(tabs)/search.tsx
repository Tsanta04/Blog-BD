import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search as SearchIcon } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';
import { PostCard } from '@/components/PostCard';
import { useAuth } from '@/context/AuthContext';
import { usePosts } from '@/hooks/usePosts';
import { useUser } from '@/hooks/useUser';

export default function SearchScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'posts' | 'users'>('posts');
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const {posts, searchPosts} = usePosts();
  const {users, searchUsers} = useUser();

  const handleSearch = async (searchQuery: string) => {
    // console.log('Search query:', searchQuery);
    
    if (!searchQuery.trim()) {
      return;
    }

    setLoading(true);
    try {
      if (activeTab === 'posts') {        
        await searchPosts(searchQuery);        
      } else {
        await searchUsers(searchQuery);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab: 'posts' | 'users') => {
    setActiveTab(tab);
    if (query) {
      handleSearch(query);
      console.log(users);
    }
  };

  const renderUser = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => router.push(`/user/${item.id}`)}
    >
      <View style={styles.userAvatar}>
        <Text style={styles.userAvatarText}>
          {item.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
    </TouchableOpacity>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      margin: 16,
      backgroundColor: colors.surface,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    searchInput: {
      flex: 1,
      marginLeft: 12,
      fontSize: 16,
      color: colors.text,
    },
    tabContainer: {
      flexDirection: 'row',
      paddingHorizontal: 16,
      marginBottom: 16,
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      alignItems: 'center',
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    activeTab: {
      borderBottomColor: colors.primary,
    },
    tabText: {
      fontSize: 16,
      fontWeight: '500',
      color: colors.textSecondary,
    },
    activeTabText: {
      color: colors.primary,
      fontWeight: '600',
    },
    userItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    userAvatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 16,
    },
    userAvatarText: {
      color: colors.background,
      fontSize: 18,
      fontWeight: 'bold',
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    userEmail: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
    },
    emptyText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center',
      marginTop: 16,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <SearchIcon color={colors.textSecondary} size={20} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher..."
          placeholderTextColor={colors.textSecondary}
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            handleSearch(text);
          }}
        />
      </View>

      {/* Onglets */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
          onPress={() => handleTabChange('posts')}
        >
          <Text style={[styles.tabText, activeTab === 'posts' && styles.activeTabText]}>
            Posts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'users' && styles.activeTab]}
          onPress={() => handleTabChange('users')}
        >
          <Text style={[styles.tabText, activeTab === 'users' && styles.activeTabText]}>
            Utilisateurs
          </Text>
        </TouchableOpacity>
      </View>

      {/* Résultats */}
      {activeTab === 'posts' ? (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id?.toString()||""}
          renderItem={({ item }) => <PostCard user_id={user?.id||""} post={item} />}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            query ? (
              <View style={styles.emptyState}>
                <SearchIcon color={colors.textSecondary} size={64} />
                <Text style={styles.emptyText}>
                  {loading ? 'Recherche en cours...' : 'Aucun post trouvé'}
                </Text>
              </View>
            ) : null
          }
        />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id?.toString()||""}
          renderItem={renderUser}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            query ? (
              <View style={styles.emptyState}>
                <SearchIcon color={colors.textSecondary} size={64} />
                <Text style={styles.emptyText}>
                  {loading ? 'Recherche en cours...' : 'Aucun utilisateur trouvé'}
                </Text>
              </View>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}