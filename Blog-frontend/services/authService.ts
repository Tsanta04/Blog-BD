import AsyncStorage from '@react-native-async-storage/async-storage';
import { LoginCredentials, AuthResponse } from '@/types';
import { mockAuthResponse } from '@/data/mockData';

const AUTH_STORAGE_KEY = 'auth_data';
const API_BASE_URL = 'https://your-api-domain.com/api'; // Replace with your actual API URL

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const authResponse: AuthResponse = await response.json();
      return authResponse;
    } catch (error) {
      console.warn('API call failed, using mock authentication:', error);
      // Simulate a delay for realistic behavior
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simple mock validation
      if (credentials.email && credentials.password) {
        return mockAuthResponse;
      } else {
        throw new Error('Email et mot de passe requis');
      }
    }
  }

  async logout(): Promise<void> {
    try {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
      // Optionally call logout endpoint if you have one
      // await fetch(`${API_BASE_URL}/logout`, {
      //   method: 'POST',
      //   headers: { Authorization: `Bearer ${token}` }
      // });
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  async storeAuth(authData: AuthResponse): Promise<void> {
    try {
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authData));
    } catch (error) {
      console.error('Error storing auth data:', error);
    }
  }

  async getStoredAuth(): Promise<AuthResponse | null> {
    try {
      const storedData = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      return storedData ? JSON.parse(storedData) : null;
    } catch (error) {
      console.error('Error getting stored auth:', error);
      return null;
    }
  }
}

export const authService = new AuthService();