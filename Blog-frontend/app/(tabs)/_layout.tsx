import { Tabs } from 'expo-router';
import { Chrome as Home, TrendingUp, User, Moon, Sun } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

export default function TabsLayout() {
  const { colors, isDark, toggleTheme } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.subtext,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          paddingTop: 8,
          paddingBottom: 8,
          height: 60,
        },
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTintColor: colors.text,
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          headerRight: () => (
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
          ),
        }}
      />
      <Tabs.Screen
        name="popular"
        options={{
          title: 'Populaire',
          tabBarIcon: ({ color, size }) => <TrendingUp size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}