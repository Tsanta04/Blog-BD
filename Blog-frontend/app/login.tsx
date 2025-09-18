import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/Button';
import { FloatingInput } from '@/components/atoms/FloatingInput';

export default function LoginScreen() {
  const { colors } = useTheme();
  const { login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const styles = StyleSheet.create({
    container: { flex: 1 },
    background: { flex: 1, resizeMode: 'cover', justifyContent: 'center' },
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.45)',
      padding: 20,
      justifyContent: 'center',
    },
    content: { flexGrow: 1, justifyContent: 'center' },
    header: { alignItems: 'center', marginBottom: 32 },
    title: {
      fontSize: 36,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: 8,
      textShadowColor: 'rgba(0,0,0,0.7)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 6,
    },
    subtitle: { fontSize: 16, color: '#f0f0f0', textAlign: 'center' },
    form: { marginBottom: 24 },
    loginButton: { marginBottom: 16 },
    signupContainer: {
      marginTop: 20,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    signupText: { color: '#fff', fontSize: 14 },
    signupLink: {
      marginLeft: 6,
      color: colors.primary,
      fontWeight: 'bold',
      fontSize: 14,
    },
  });

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email invalide';
    }
    if (!password.trim()) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    try {
      const result = await login({ email: email.trim(), password });
      if (!result.success) {
        Alert.alert('Erreur de connexion', result.message || 'Une erreur est survenue');
        return;
      }
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert(
        'Erreur de connexion',
        error instanceof Error ? error.message : 'Une erreur est survenue'
      );
    }
  };

  return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ImageBackground
          source={{uri: 'https://img.freepik.com/photos-gratuite/illustration-rendu-3d-boules-vertes_181624-58606.jpg?semt=ais_incoming&w=740&q=80'}}
          // source={{ uri: 'https://img.freepik.com/photos-premium/fond-degrade-3d-blanc-vert_968517-264.jpg' }}
          style={styles.background}
        >
          <View style={styles.overlay}>
            <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
              <View style={styles.header}>
                <Text style={styles.title}>Connexion</Text>
                <Text style={styles.subtitle}>
                  Connectez-vous à votre compte Mini Blog
                </Text>
              </View>

              <View style={styles.form}>
                <FloatingInput
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email}
                />
                <FloatingInput
                  label="Mot de passe"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  error={errors.password}
                />
              </View>

              <Button
                title="Se connecter"
                onPress={handleLogin}
                loading={loading}
                style={styles.loginButton}
                size="large"
              />
              {/* Redirection vers inscription */}
              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>Pas encore de compte ?</Text>
                <TouchableOpacity onPress={() => router.push('/signup')}>
                  <Text style={styles.signupLink}>Inscrivez-vous</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
  );
}
