import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export default function LoginScreen() {
  const { colors } = useTheme();
  const { signIn, isAuthenticated } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [signIn]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    const success = await signIn(email, password);
    
    if (success) {
      router.replace('/(tabs)');
    } else {
      Alert.alert('Erreur', 'Email ou mot de passe incorrect');
    }
    setLoading(false);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      justifyContent: 'center',
      padding: 20,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: colors.text,
      textAlign: 'center',
      marginBottom: 40,
    },
    input: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      fontSize: 16,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    button: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      marginTop: 20,
    },
    buttonText: {
      color: colors.background,
      fontSize: 18,
      fontWeight: '600',
    },
    signupContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 20,
    },
    signupText: {
      color: colors.textSecondary,
      fontSize: 16,
    },
    signupLink: {
      color: colors.primary,
      fontSize: 16,
      fontWeight: '600',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Connexion</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={colors.textSecondary}
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        placeholderTextColor={colors.textSecondary}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </Text>
      </TouchableOpacity>
      
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Pas de compte ? </Text>
        <TouchableOpacity onPress={() => router.push('/auth/signup')}>
          <Text style={styles.signupLink}>S'inscrire</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}