import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

export default function SignupScreen() {
  const { colors } = useTheme();
  const { signUp } = useAuth();
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);
    const success = await signUp(name, email, password);
    
    if (success) {
      router.replace('/(tabs)');
    } else {
      Alert.alert('Erreur', 'Erreur lors de la création du compte');
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
    loginContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 20,
    },
    loginText: {
      color: colors.textSecondary,
      fontSize: 16,
    },
    loginLink: {
      color: colors.primary,
      fontSize: 16,
      fontWeight: '600',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Inscription</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Nom complet"
        placeholderTextColor={colors.textSecondary}
        value={name}
        onChangeText={setName}
      />
      
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
      
      <TextInput
        style={styles.input}
        placeholder="Confirmer le mot de passe"
        placeholderTextColor={colors.textSecondary}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      
      <TouchableOpacity
        style={styles.button}
        onPress={handleSignup}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Inscription...' : 'S\'inscrire'}
        </Text>
      </TouchableOpacity>
      
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Déjà un compte ? </Text>
        <TouchableOpacity onPress={() => router.push('/auth/login')}>
          <Text style={styles.loginLink}>Se connecter</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}