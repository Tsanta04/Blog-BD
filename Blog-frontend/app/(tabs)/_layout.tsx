import { useTheme } from '@/context/ThemeContext';
import { Tabs } from 'expo-router';
import { Bell, MessageCircle, User, Moon, Sun, Search } from 'lucide-react-native';
import { TouchableOpacity, View, Text, StyleSheet, Animated } from 'react-native';

export default function TabsLayout() {
  const { colors, isDark, toggleTheme } = useTheme();

  const styles = StyleSheet.create({
    tabBar: {
      backgroundColor: colors.surface,
      borderTopColor: 'transparent',
      borderRadius: 32,
      marginHorizontal: 10,
      marginBottom: 15,
      height: 60,
      position: 'absolute',
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingBottom: 30,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 10,
    },
    headerLeft: {
      marginLeft: 16,
      flexDirection: 'column',
    },
    logoRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    logo: {
      fontSize: 24,
      marginRight: 8,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
    },
    headerSubtitle: {
      fontSize: 13,
      color: colors.textSecondary,
      marginTop: 2,
    },
    themeButton: {
      marginRight: 16,
      padding: 8,
      borderRadius: 50,
      backgroundColor: colors.background,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
  });

  const renderTabIcon = (Icon: any, color: string, size: number, focused: boolean) => (
    <Animated.View
      style={{
        transform: [{ scale: focused ? 1.2 : 1 }],
        backgroundColor: focused ? colors.primary + '20' : 'transparent',
        padding: 10,
        borderRadius: 50,
      }}
    >
      <Icon size={size} color={color} />
    </Animated.View>
  );

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: styles.tabBar,
        tabBarActiveBackgroundColor: colors.primary + '20',
        headerShown:false
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color, size, focused }) => renderTabIcon(Bell, color, size, focused),
        }}
      />

      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ color, size, focused }) => renderTabIcon(Search, color, size, focused),
        }}
      />

      {/* <Tabs.Screen
        name="message"
        options={{
          tabBarIcon: ({ color, size, focused }) => renderTabIcon(MessageCircle, color, size, focused),
        }}
      /> */}

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color, size, focused }) => renderTabIcon(User, color, size, focused),
        }}
      />
    </Tabs>
  );
}
