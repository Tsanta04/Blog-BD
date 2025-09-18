import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthToken, User } from '../utils/types';
import { logIn, logOut, me, register, update } from '../services/api/auth.api';

interface AuthContextType {
  user: User | null;
  token: AuthToken | null;
  isLoading: boolean;
  setUser: (user: User) => void;  
  updateUser: (username: string, email: string) => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
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
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {    
    try {
      const data:User = await me();
      if(!data){
        setUser(null);
        await AsyncStorage.removeItem("user");
      }
      setUser(data);        
    } catch (error) {
      console.error("Error loading stored auth:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<void> => {
    try {
      const user: User = await logIn(email,password);

      setUser(user ?? { email });
      await AsyncStorage.setItem("user", JSON.stringify(user ?? { email }));

    } catch (error: any) {
      console.error("Sign in failed:", error);
      throw error;
    }
  };

  const signUp = async (
    username: string,
    email: string,
    password: string
  ): Promise<void> => {
    try {
      const user: User = await register(username, email, password);

      setUser(user ?? { email });
      await AsyncStorage.setItem("user", JSON.stringify(user ?? { email }));

    } catch (error: any) {
      console.error("Sign up failed:", error);
      throw error;
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      setUser(null);
      await AsyncStorage.removeItem('user');
      await logOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  
  const updateUser = async (
    username: string,
    email: string,
  ): Promise<void> => {
    if(!user)return
    try {
      setIsLoading(true);
      const user_ = await update(user?.id||"" , username , email)
      setUser(user_ ?? { email });
      await AsyncStorage.setItem("user", JSON.stringify(user_ ?? { email }));

    } catch (error: any) {
      console.error("Sign up failed:", error);
      throw error;
    } finally {
      setIsLoading(false)
    }
  };
  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        setUser,
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