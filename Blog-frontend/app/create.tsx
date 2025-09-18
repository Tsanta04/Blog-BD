import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ImageBackground,
} from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { FloatingInput } from '@/components/atoms/FloatingInput';
import { Medias, Post } from '@/utils/types';
import { usePosts } from '@/hooks/usePosts';

export default function CreatePostScreen() {
  const { colors } = useTheme();
  const { token, user } = useAuth();
  const { create } = usePosts();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState('image'); // exemple: image, video, etc.
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const styles = StyleSheet.create({
    container: { flex: 1 },
    background: { flex: 1, resizeMode: 'cover' },
    overlay: {
      flex: 1,
      padding: 20,
    },
    content: { flexGrow: 1, justifyContent: 'center', paddingBottom: 40 },
    header: { alignItems: 'center', marginBottom: 32 },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: 8,
      textShadowColor: 'rgba(0,0,0,0.7)',
      textShadowOffset: { width: 0, height: 2 },
      textShadowRadius: 6,
    },
    subtitle: { fontSize: 16, color: '#f0f0f0', textAlign: 'center' },
    form: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 6,
      elevation: 4,
    },
    publishButton: { marginTop: 16 },
  });

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!title.trim()) newErrors.title = 'Le titre est requis';
    if (!content.trim()) newErrors.content = 'Le contenu est requis';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePublish = async () => {
    if (!validateForm()) return;

    if (!token || !user) {
      Alert.alert('Erreur', 'Vous devez être connecté pour publier.');
      return;
    }

    try {
      setLoading(true);

      // Construction du Post à envoyer
      const newPost: Post = {
        title,
        content,
        user_id: user.id||"", // vient de AuthContext
        tags: tags
          .split(',')
          .map(tag => ({ tags: tag.trim() }))
          .filter(tagObj => tagObj.tags !== ''),
        medias: mediaUrl
          ? [
              {
                path_name: mediaUrl.trim(),
                type_id: 1, // à ajuster selon ton backend
                type_: { id: 1, type_: mediaType },
              } as Medias,
            ]
          : [],
        createdAt: new Date().toISOString(),
      };

      // Appel API
      await create(newPost);

      Alert.alert('Succès', 'Article publié avec succès !');
      router.back();
    } catch (err) {
      Alert.alert(
        'Erreur',
        err instanceof Error ? err.message : 'Impossible de publier l’article.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ImageBackground
        source={{
          uri: 'https://i.pinimg.com/originals/aa/ae/e0/aaaee0993b2e9764221e19d7f1e9131f.jpg',
        }}
        style={styles.background}
      >
        <View style={styles.overlay}>
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <Text style={styles.title}>Créer un nouvel article</Text>
              <Text style={styles.subtitle}>
                Partagez vos idées avec la communauté ✍️
              </Text>
            </View>

            <View style={styles.form}>
              <FloatingInput
                label="Titre"
                value={title}
                onChangeText={setTitle}
                error={errors.title}
              />

              <FloatingInput
                label="Contenu"
                value={content}
                onChangeText={setContent}
                multiline
                error={errors.content}
              />

              <FloatingInput
                label="Tags (séparés par des virgules)"
                value={tags}
                onChangeText={setTags}
              />

              <FloatingInput
                label="URL du média"
                value={mediaUrl}
                onChangeText={setMediaUrl}
              />

              <FloatingInput
                label="Type du média (image, video, ...)"
                value={mediaType}
                onChangeText={setMediaType}
              />

              <Button
                title="Publier"
                onPress={handlePublish}
                loading={loading}
                disabled={loading}
                style={styles.publishButton}
                size="large"
              />
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}
