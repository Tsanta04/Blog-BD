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

export default function SignupScreen() {
  const { colors } = useTheme();
  const { signUp, isLoading } = useAuth(); // ⚠️ Assure-toi d’avoir `signup` dans ton AuthContext
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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
    signupButton: { marginBottom: 16 },
    loginContainer: {
      marginTop: 20,
      flexDirection: 'row',
      justifyContent: 'center',
    },
    loginText: { color: '#fff', fontSize: 14 },
    loginLink: {
      marginLeft: 6,
      color: colors.primary,
      fontWeight: 'bold',
      fontSize: 14,
    },
  });

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) {
      newErrors.name = 'Le nom est requis';
    }
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
    if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;
    try {
      const result = await signUp( name.trim(), email.trim(), password );
      // if (!result.success) {
      //   Alert.alert('Erreur d’inscription', result.message || 'Une erreur est survenue');
      //   return;
      // }
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert(
        'Erreur d’inscription',
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
        source={{
          uri: 'https://img.freepik.com/photos-premium/fond-degrade-3d-blanc-vert_968517-264.jpg',
        }}
        style={styles.background}
      >
        <View style={styles.overlay}>
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <View style={styles.header}>
              <Text style={styles.title}>Inscription</Text>
              <Text style={styles.subtitle}>
                Créez un compte pour rejoindre Mini Blog
              </Text>
            </View>

            <View style={styles.form}>
              <FloatingInput
                label="Nom complet"
                value={name}
                onChangeText={setName}
                error={errors.name}
              />
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
              <FloatingInput
                label="Confirmer le mot de passe"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                error={errors.confirmPassword}
              />
            </View>

            <Button
              title="S’inscrire"
              onPress={handleSignup}
              loading={isLoading}
              style={styles.signupButton}
              size="large"
            />

            {/* Redirection vers connexion */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Vous avez déjà un compte ?</Text>
              <TouchableOpacity onPress={() => router.push('/login')}>
                <Text style={styles.loginLink}>Connectez-vous</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}
