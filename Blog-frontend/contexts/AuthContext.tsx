import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthToken, User } from '../utils/types';
import { logIn, logOut, me, register, update } from '../services/api/auth.api';

interface AuthContextType {
  user: User | null;
  token: AuthToken | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: AuthToken | null) => void;
  updateUser: (username: string, email: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (username: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<AuthToken | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Charger l'auth à l'initialisation
  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const storedToken = await AsyncStorage.getItem('token');

      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedToken) setToken(JSON.parse(storedToken));

      // Vérifier la validité du token
      if (storedToken) {
        const authToken: AuthToken = JSON.parse(storedToken);
        const data: User | null = await me(authToken.accessToken);
        if (data) setUser(data);
        else {
          setUser(null);
          setToken(null);
          await AsyncStorage.removeItem('user');
          await AsyncStorage.removeItem('token');
        }
      }
    } catch (error) {
      console.error('Error loading stored auth:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { user: loggedUser, token: authToken } = await logIn(email, password);

      setUser(loggedUser);
      setToken(authToken);

      await AsyncStorage.setItem('user', JSON.stringify(loggedUser));
      await AsyncStorage.setItem('token', JSON.stringify(authToken));
    } catch (error) {
      console.error('Sign in failed:', error);
      throw error;
    }
  };

  const signUp = async (username: string, email: string, password: string) => {
    try {
      const { user: newUser, token: authToken } = await register(username, email, password);

      setUser(newUser);
      setToken(authToken);

      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      await AsyncStorage.setItem('token', JSON.stringify(authToken));
    } catch (error) {
      console.error('Sign up failed:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setUser(null);
      setToken(null);
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('token');
      await logOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updateUser = async (username: string, email: string) => {
    if (!user || !token) return;
    try {
      setIsLoading(true);
      const updatedUser = await update(user.id||"", username, email, token.accessToken);

      setUser(updatedUser);
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Update user failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const isAuthenticated = !!user && !!token?.accessToken;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        setUser,
        setToken,
        updateUser,
        signIn,
        signUp,
        signOut,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
