import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, Moon, Sun, LogOut } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'expo-router';
import { PostCard } from '@/components/PostCard';
import { api } from '@/servicesBp/api';
import { LineChart } from "react-native-chart-kit";
import { usePosts } from '@/hooks/usePosts';
import { useUser } from '@/hooks/useUser';
import { Stat, User } from '@/utils/types';

const mockedData: Stat[] = [
  {
    day: "Mon",
    num: 12
  },
  {
    day: "Tue",
    num: 10
  },
  {
    day: "Wen",
    num: 2
  },
  {
    day: "Thu",
    num: 5
  }
]

const screenWidth = Dimensions.get('window').width;
export default function ProfileScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const { signOut } = useAuth();
  const {getUser} = useUser();
  const [user,setUser] = useState<User>({"email": "alice@example.com", "followersCount": 0, "id": "a1111111-1111-4f11-8111-111111111111", "likesCount": 0, "name": "Alice", "posts": [], "postsCount": 0});
  const [stat,setStat] = useState<Stat[]>(mockedData);
  const router = useRouter();
  const {posts, fetchPosts, fetchPostStat} = usePosts();

  useEffect(() => {
    loadUserPosts();
  }, []);

  const loadUserPosts = async () => {
    try {      
      if (user) {
        const data = await getUser();
        setUser(data);
        await fetchPosts();
        const st = await fetchPostStat();
        if(st!=undefined && st.length>0)
          setStat(st||mockedData);
        }
    } catch (error) {
      console.error('Error loading user posts:', error);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.replace('/auth/login');
  };

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Avatar et info utilisateur */}
      <View style={styles.userSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.userName}>{user?.name}</Text>
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      {/* Statistiques */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{user?.followersCount}</Text>
          <Text style={styles.statLabel}>Abonnés</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{user?.likesCount}</Text>
          <Text style={styles.statLabel}>J'aimes</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{user?.postsCount}</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
      </View>

      {/* Graphique des publications (placeholder) */}
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Publications des 5 derniers jours</Text>
          <LineChart
            data={{
              labels: stat.map((elt)=>elt.day),
              datasets: [
                {
                  data: stat.map((elt)=>elt.num),
                  color: (opacity = 1) => colors.primary, // Likes
                  strokeWidth: 2,
                },
              ],
              legend: ["Posts"]
            }}
            width={screenWidth - 80}
            height={220}
            chartConfig={{
              backgroundGradientFrom: colors.surface,
              backgroundGradientTo: colors.surface,
              decimalPlaces: 0,
              color: () => "transparent",
              labelColor: () => colors.textSecondary,
              propsForDots: {
                r: "5",
                strokeWidth: "2",
                stroke: colors.primary,
              },
            }}
            bezier
            style={styles.chart}
          />
      </View>

      {/* Actions */}
      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={toggleTheme}>
          {isDark ? (
            <Sun color={colors.textSecondary} size={20} />
          ) : (
            <Moon color={colors.textSecondary} size={20} />
          )}
          <Text style={styles.actionText}>
            {isDark ? 'Mode clair' : 'Mode sombre'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
          <LogOut color={colors.error} size={20} />
          <Text style={[styles.actionText, { color: colors.error }]}>
            Déconnexion
          </Text>
        </TouchableOpacity>
      </View>

      {/* Titre des publications */}
      <View style={styles.postsHeader}>
        <Text style={styles.postsTitle}>Mes publications</Text>
      </View>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
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
    chart: {
      borderRadius: 16,
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
    chartContainer: {
      margin: 20,
      padding: 20,
      backgroundColor: colors.surface,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.border,
    },
    chartTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 16,
    },
    chartPlaceholder: {
      height: 120,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      borderStyle: 'dashed',
    },
    chartText: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    chartSubtext: {
      fontSize: 12,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    actionsContainer: {
      paddingHorizontal: 20,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    actionButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
    },
    actionText: {
      marginLeft: 12,
      fontSize: 16,
      color: colors.text,
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