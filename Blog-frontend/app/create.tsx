import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { apiService } from '@/services/apiService';

export default function CreatePostScreen() {
  const { colors } = useTheme();
  const { token } = useAuth();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: colors.text,
    },
    form: {
      flex: 1,
      padding: 16,
    },
    label: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    input: {
      marginBottom: 16,
    },
  });

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Erreur', 'Le titre et le contenu sont obligatoires.');
      return;
    }

    if (!token) {
      Alert.alert('Erreur', 'Vous devez être connecté pour publier.');
      return;
    }

    try {
      setLoading(true);
    //   await apiService.createPost({
    //     title,
    //     content,
    //     tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
    //     imageUrl: imageUrl.trim() || undefined,
    //   }, token);
      Alert.alert('Succès', 'Article publié avec succès !');
      router.back(); // revenir à la liste
    } catch (err) {
      Alert.alert('Erreur', err instanceof Error ? err.message : 'Impossible de publier l’article.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Créer un nouvel article</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.form}>
          <Text style={styles.label}>Titre</Text>
          <Input
            placeholder="Titre de l'article"
            value={title}
            onChangeText={setTitle}
            style={styles.input}
          />

          <Text style={styles.label}>Contenu</Text>
          <Input
            placeholder="Contenu de l'article"
            value={content}
            onChangeText={setContent}
            multiline
            numberOfLines={6}
            style={styles.input}
          />

          <Text style={styles.label}>Tags (séparés par des virgules)</Text>
          <Input
            placeholder="ex: React, JavaScript, Mobile"
            value={tags}
            onChangeText={setTags}
            style={styles.input}
          />

          <Text style={styles.label}>URL de l'image</Text>
          <Input
            placeholder="https://exemple.com/image.jpg"
            value={imageUrl}
            onChangeText={setImageUrl}
            style={styles.input}
          />

          <Button
            title="Publier"
            onPress={handlePublish}
            loading={loading}
            disabled={loading}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
