import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, FlatList, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Music, Video as Vid, Image as Img, FileText, Plus, X } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Medias, Post, Tags } from '@/utils/types';
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { Video } from "expo-av";
import { usePosts } from '@/hooks/usePosts';

export default function AddPostScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const { user } = useAuth();
  const { create } = usePosts();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<Tags[]>([]);
  const [availableTags, setAvailableTags] = useState<Tags[]>([]);
  const [newTag, setNewTag] = useState('');
  const [medias, setMedias] = useState<Medias[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTags();
  }, []);
  
  const loadTags = async () => {
    try {
      // const tags: Tags[] = await getTags();
      // setAvailableTags(tags);
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  };

  const handleTagToggle = (tag: Tags) => {
    if (selectedTags.find(t => t.tags === tag.tags)) {
      setSelectedTags(selectedTags.filter(t => t.tags !== tag.tags));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleAddNewTag = () => {
    if (newTag.trim() && !availableTags.find(t => t.tags === newTag.trim())) {      
      const tag: Tags = { tags: newTag.trim().toLowerCase() };
      console.log(tag);
      setAvailableTags([...availableTags, tag]);
      setSelectedTags([...selectedTags, tag]);
      setNewTag('');
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir le titre et le contenu');
      return;
    }

    setLoading(true);
    try {      
      const newP: Post = ({
        title: title.trim(),
        content: content.trim(),
        user_id: user?.id || "",
        tags: selectedTags,
        medias: medias,
        createdAt: new Date().toISOString(),
      });
      
      const success = await create(newP);
      if(success){
        Alert.alert('Succès', 'Post créé avec succès', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      }
      else{
        Alert.alert('Error', 'Post échoué', [
          { text: 'Annuler', onPress: () => router.back() }
        ]);        
      }
    } catch (error) {
      Alert.alert('Erreur', 'Erreur lors de la création du post');
    } finally {
      setLoading(false);
    }
  };

  const pickMedia = async (type: "image" | "video" | "pdf" | "audio") => {
    try {
      if (type === "image" || type === "video") {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes:
            type === "image"
              ? ImagePicker.MediaTypeOptions.Images
              : ImagePicker.MediaTypeOptions.Videos,
          allowsMultipleSelection: true,
          quality: 1,
        });

        if (!result.canceled) {
          const type_id = type === "image" ? 1 : 2;
          const uris = result.assets.map((asset: ImagePicker.ImagePickerAsset) => asset.uri);
          const media: Medias = {
            path_name: uris[0],
            type_id,
            type_: { id: type_id, type_: type },
          };
          setMedias((prev) => [...prev, media]);
        }
      } else {
        const result = await DocumentPicker.getDocumentAsync({
          type: type === "pdf" ? "application/pdf" : "audio/*",
          multiple: true,
        });

        if (!result.canceled) {
          const type_id = type === "pdf" ? 4 : 3;
          const uris = result.assets?.map((asset: DocumentPicker.DocumentPickerAsset) => asset.uri) ?? [];
          if (uris.length > 0) {
            const media: Medias = {
              path_name: uris[0],
              type_id,
              type_: { id: type_id, type_: type },
            };
            setMedias((prev) => [...prev, media]);
          }
        }
      }
    } catch (e) {
      console.error("Erreur sélection média:", e);
      Alert.alert("Erreur", "Impossible de sélectionner le fichier.");
    }
  };

  const handleRemoveMedia = (index: number) => {
    setMedias((prev) => prev.filter((_, i) => i !== index));
  };

  const renderMediaItem = ({ item, index }: { item: Medias; index: number }) => (
    <View style={styles.mediaItem}>
      {
        item.type_id == 1 ? (
          // <Text style={styles.mediaText}>TTTT</Text>
          <Image source={{ uri: item.path_name }} style={styles.mediaSection} />
        ) : item.type_id == 2 ? (
          <Video
            source={{ uri: item.path_name }}
            style={styles.mediaSection}
            useNativeControls
            // resizeMode="cover"
          />
        ) : item.type_id == 3 ? (
          <Text style={styles.mediaText}>Audio: {item.path_name.split('/').pop()}</Text>
        ) : item.type_id == 4 ? (  
          <Text style={styles.mediaText}>Document: {item.path_name.split('/').pop()}</Text>
        ) : null
      }
      <TouchableOpacity onPress={() => handleRemoveMedia(index)} style={styles.removeMediaButton}>
        <X color={colors.textSecondary} size={16} />
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
      width:200, height:200,
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
      // position:"absolute",
      // right:10,
      color: colors.primary,
      width:"90%",
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
                key={tag.tags}
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
                  #{tag.tags}
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
            <TouchableOpacity style={styles.mediaButton} onPress={() => pickMedia("image")}>
              <Img color={colors.textSecondary} size={16} />
              <Text style={styles.mediaButtonText}>Image</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.mediaButton} onPress={() => pickMedia("video")}>
              <Vid color={colors.textSecondary} size={16} />
              <Text style={styles.mediaButtonText}>Vidéo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.mediaButton} onPress={() => pickMedia("audio")}>
              <Music color={colors.textSecondary} size={16} />
              <Text style={styles.mediaButtonText}>Audio</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.mediaButton} onPress={() => pickMedia("pdf")}>
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