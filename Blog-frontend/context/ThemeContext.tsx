import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  colors: {
    background: string;
    surface: string;
    primary: string;
    text: string;
    textSecondary: string;
    border: string;
    error: string;
    success: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    setIsDark(systemColorScheme === 'dark');
  }, [systemColorScheme]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const colors = {
    background: isDark ? '#000000' : '#ffffff',
    surface: isDark ? '#1c1c1e' : '#f2f2f7',
    primary: '#e1007cff',
    text: isDark ? '#ffffff' : '#000000',
    textSecondary: isDark ? '#8e8e93' : '#6d6d70',
    border: isDark ? '#262626' : '#e0e0e0',
    error: '#ff3b30',
    success: '#30d158',
  };

  return (
    <ThemeContext.Provider value={{
      isDark,
      toggleTheme,
      colors,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};