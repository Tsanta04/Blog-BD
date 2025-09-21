import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Image, Video, Music, FileText, Plus, X } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';
import { api } from '@/services/api';

export default function AddPostScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [medias, setMedias] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      const tags = await api.getTags();
      setAvailableTags(tags);
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  };

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAddNewTag = () => {
    if (newTag.trim() && !availableTags.includes(newTag.trim())) {
      const tag = newTag.trim().toLowerCase();
      setAvailableTags([...availableTags, tag]);
      setSelectedTags([...selectedTags, tag]);
      setNewTag('');
    }
  };

  const handleAddMedia = () => {
    // Simulation d'ajout de média
    const mockMediaUrl = 'https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=500';
    setMedias([...medias, mockMediaUrl]);
  };

  const handleRemoveMedia = (index: number) => {
    setMedias(medias.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir le titre et le contenu');
      return;
    }

    setLoading(true);
    try {
      await api.createPost({
        title: title.trim(),
        content: content.trim(),
        tags: selectedTags,
        medias: medias,
      });
      
      Alert.alert('Succès', 'Post créé avec succès', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      Alert.alert('Erreur', 'Erreur lors de la création du post');
    } finally {
      setLoading(false);
    }
  };

  const renderMediaItem = ({ item, index }: { item: string; index: number }) => (
    <View style={styles.mediaItem}>
      <Text style={styles.mediaText}>Média {index + 1}</Text>
      <TouchableOpacity
        style={styles.removeMediaButton}
        onPress={() => handleRemoveMedia(index)}
      >
        <X color={colors.error} size={16} />
      </TouchableOpacity>
    </View>
  );

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
    },
    publishButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 16,
    },
    publishButtonText: {
      color: colors.background,
      fontSize: 14,
      fontWeight: '600',
    },
    content: {
      flex: 1,
      padding: 16,
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
    titleInput: {
      fontSize: 18,
      fontWeight: '600',
    },
    contentInput: {
      height: 120,
      textAlignVertical: 'top',
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 12,
    },
    tag: {
      backgroundColor: colors.surface,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 16,
      marginRight: 8,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    selectedTag: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    tagText: {
      color: colors.text,
      fontSize: 14,
    },
    selectedTagText: {
      color: colors.background,
    },
    newTagContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    },
    newTagInput: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 8,
      padding: 12,
      fontSize: 14,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      marginRight: 8,
    },
    addTagButton: {
      backgroundColor: colors.primary,
      padding: 12,
      borderRadius: 8,
    },
    mediaSection: {
      marginBottom: 16,
    },
    mediaButtons: {
      flexDirection: 'row',
      marginBottom: 12,
    },
    mediaButton: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 8,
      marginRight: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    mediaButtonText: {
      color: colors.text,
      fontSize: 12,
      marginLeft: 4,
    },
    mediaList: {
      marginTop: 8,
    },
    mediaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: colors.surface,
      padding: 12,
      borderRadius: 8,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    mediaText: {
      color: colors.text,
      fontSize: 14,
    },
    removeMediaButton: {
      padding: 4,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nouveau post</Text>
        <TouchableOpacity
          style={styles.publishButton}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.publishButtonText}>
            {loading ? 'Publication...' : 'Publier'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <TextInput
          style={[styles.input, styles.titleInput]}
          placeholder="Titre du post"
          placeholderTextColor={colors.textSecondary}
          value={title}
          onChangeText={setTitle}
        />

        {/* Content */}
        <TextInput
          style={[styles.input, styles.contentInput]}
          placeholder="Écrivez votre contenu ici..."
          placeholderTextColor={colors.textSecondary}
          value={content}
          onChangeText={setContent}
          multiline
        />

        {/* Tags */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tags</Text>
          
          <View style={styles.tagsContainer}>
            {availableTags.map((tag) => (
              <TouchableOpacity
                key={tag}
                style={[
                  styles.tag,
                  selectedTags.includes(tag) && styles.selectedTag,
                ]}
                onPress={() => handleTagToggle(tag)}
              >
                <Text
                  style={[
                    styles.tagText,
                    selectedTags.includes(tag) && styles.selectedTagText,
                  ]}
                >
                  #{tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.newTagContainer}>
            <TextInput
              style={styles.newTagInput}
              placeholder="Nouveau tag"
              placeholderTextColor={colors.textSecondary}
              value={newTag}
              onChangeText={setNewTag}
            />
            <TouchableOpacity
              style={styles.addTagButton}
              onPress={handleAddNewTag}
            >
              <Plus color={colors.background} size={16} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Medias */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Médias</Text>
          
          <View style={styles.mediaButtons}>
            <TouchableOpacity style={styles.mediaButton} onPress={handleAddMedia}>
              <Image color={colors.textSecondary} size={16} />
              <Text style={styles.mediaButtonText}>Image</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.mediaButton} onPress={handleAddMedia}>
              <Video color={colors.textSecondary} size={16} />
              <Text style={styles.mediaButtonText}>Vidéo</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.mediaButton} onPress={handleAddMedia}>
              <Music color={colors.textSecondary} size={16} />
              <Text style={styles.mediaButtonText}>Audio</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.mediaButton} onPress={handleAddMedia}>
              <FileText color={colors.textSecondary} size={16} />
              <Text style={styles.mediaButtonText}>Document</Text>
            </TouchableOpacity>
          </View>

          {medias.length > 0 && (
            <FlatList
              data={medias}
              renderItem={renderMediaItem}
              keyExtractor={(item, index) => index.toString()}
              style={styles.mediaList}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}