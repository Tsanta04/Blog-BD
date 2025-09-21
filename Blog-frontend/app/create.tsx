import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  FlatList,
} from "react-native";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { Video } from "expo-av";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/Button";
import { usePosts } from "@/hooks/usePosts";
import { Plus } from "lucide-react-native";
import { backgorund } from "@/data/background";
import { Post, Tags } from "@/utils/types";

// Mock tags existants (remplace par fetch réel si besoin)
const allTagsMock = [{
  id:1,
  tags:"Economie",
}]

export default function CreatePostScreen() {
  const { colors } = useTheme();
  const { user, token } = useAuth();
  const { create } = usePosts();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [allTags, setAllTags] = useState<Tags[]>([]);
  const [tagsInput, setTagsInput] = useState("");
  const [selectedTags, setSelectedTags] = useState<Tags[]>([]);

  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [pdfs, setPdfs] = useState<string[]>([]);
  const [audios, setAudios] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simule récupération depuis API
    setAllTags(allTagsMock);
  }, []);

  const toggleTag = (tag: Tags) => {
    setSelectedTags((prev) =>
      prev.some((t) => t.tags === tag.tags && t.id === tag.id)
        ? prev.filter((t) => t.tags !== tag.tags && t.id !== tag.id)
        : [...prev, tag]
    );
  };

  const addNewTag = () => {
    const t = tagsInput.trim();
    if (!t) return;
    if (!allTags.map((v)=>v.tags).includes(t)) setAllTags((prev) => [...prev, {tags:t}]);
    if (!selectedTags.map((v)=>v.tags).includes(t)) setSelectedTags((prev) => [...prev, {tags:t}]);
    setTagsInput("");
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
          const uris = result.assets.map((asset) => asset.uri);
          if (type === "image") setImages((prev) => [...prev, ...uris]);
          if (type === "video") setVideos((prev) => [...prev, ...uris]);
        }
      } else {
        const result = await DocumentPicker.getDocumentAsync({
          type: type === "pdf" ? "application/pdf" : "audio/*",
          multiple: true,
        });

        if (!result.canceled) {
          const uris = result.assets.map((asset) => asset.uri);
          if (type === "pdf") setPdfs((prev) => [...prev, ...uris]);
          if (type === "audio") setAudios((prev) => [...prev, ...uris]);
        }
      }
    } catch (e) {
      console.error("Erreur sélection média:", e);
      Alert.alert("Erreur", "Impossible de sélectionner le fichier.");
    }
  };

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert("Erreur", "Titre et contenu requis.");
      return;
    }
    if (!token || !user) {
      Alert.alert("Erreur", "Vous devez être connecté.");
      return;
    }

    setLoading(true);
    try {
      const medias = [
        ...images.map((path_name) => ({ path_name, type_id: 1 })), // image
        ...videos.map((path_name) => ({ path_name, type_id: 2 })), // video
        ...pdfs.map((path_name) => ({ path_name, type_id: 3 })), // pdf
        ...audios.map((path_name) => ({ path_name, type_id: 4 })), // audio
      ];

      const postData: Post = {
        title,
        content,
        user_id: user.id||"",
        tags: selectedTags,
        medias,
        createdAt: new Date().toISOString(),
      };
      console.log("Post data:", postData);

      await create(postData);
      Alert.alert("Succès", "Post publié !");
      router.back();
    } catch (err) {
      Alert.alert("Erreur", err instanceof Error ? err.message : "Impossible de publier.");
    } finally {
      setLoading(false);
    }
  };

  const filteredTags = tagsInput.trim()
    ? allTags.filter((tag) => tag.tags.toLowerCase().includes(tagsInput.toLowerCase()))
    : [];

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      <Image source={{ uri: backgorund }} style={styles.bgImage} />
      <View style={[styles.overlay, { backgroundColor: colors.background }]}>
        <Text style={[styles.pageTitle, { color: colors.text }]}>Créer un nouvel article</Text>

        <TextInput
          style={[styles.input, { color: colors.text, backgroundColor: colors.card }]}
          placeholder="Titre"
          placeholderTextColor={colors.subtext}
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={[styles.input, { height: 100, color: colors.text, backgroundColor: colors.card }]}
          placeholder="Contenu"
          placeholderTextColor={colors.subtext}
          value={content}
          onChangeText={setContent}
          multiline
        />

        {/* TAGS */}
        <TextInput
          style={[styles.input, { color: colors.text, backgroundColor: colors.card }]}
          placeholder="Rechercher ou créer un tag"
          placeholderTextColor={colors.subtext}
          value={tagsInput}
          onChangeText={setTagsInput}
        />

        {/* Selected tags badges */}
        {selectedTags.length > 0 && (
          <View style={styles.selectedTagsWrap}>
            {selectedTags.map((t) => (
              <View key={t.tags} style={[styles.tagBadge, { backgroundColor: colors.card }]}>
                <Text style={{ color: colors.text }}>{t.tags}</Text>
                <TouchableOpacity onPress={() => toggleTag(t)} style={styles.tagBadgeRemove}>
                  <Text style={{ color: colors.subtext }}>✕</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {tagsInput.length > 0 && (
          <View style={{ marginVertical: 8 }}>
            {filteredTags.length > 0 ? (
              filteredTags.map((tag,index) => {
                const isSelected = selectedTags.includes({id: tag.id, tags:tag.tags});
                return (
                  <TouchableOpacity
                    key={index+""}
                    onPress={() => toggleTag(tag)}
                    style={[styles.tagRow, { alignItems: "center" }]}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        isSelected ? { backgroundColor: colors.primary } : { borderColor: colors.text },
                      ]}
                    />
                    <Text style={{ color: colors.text, marginLeft: 8 }}>{tag.tags}</Text>
                  </TouchableOpacity>
                );
              })
            ) : (
              <Button title={`Ajouter "${tagsInput}"`} onPress={addNewTag} />
            )}
          </View>
        )}

        {/* MEDIA PICKERS + PREVIEWS */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>📷 Images</Text>
        <TouchableOpacity
          style={[styles.mediaBtn, { backgroundColor: colors.card }]}
          onPress={() => pickMedia("image")}
        >
          <Text style={{ color: colors.text }}>Ajouter des images</Text>
        </TouchableOpacity>
        {images.length > 0 && (
          <FlatList
            data={images}
            horizontal
            keyExtractor={(item, idx) => item + idx}
            contentContainerStyle={{ paddingVertical: 8 }}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.previewImage} />
            )}
            showsHorizontalScrollIndicator={false}
          />
        )}

        <Text style={[styles.sectionTitle, { color: colors.text }]}>🎥 Vidéos</Text>
        <TouchableOpacity
          style={[styles.mediaBtn, { backgroundColor: colors.card }]}
          onPress={() => pickMedia("video")}
        >
          <Text style={{ color: colors.text }}>Ajouter des vidéos</Text>
        </TouchableOpacity>
        {videos.length > 0 && (
          <FlatList
            data={videos}
            horizontal
            keyExtractor={(item, idx) => item + idx}
            contentContainerStyle={{ paddingVertical: 8 }}
            renderItem={({ item }) => (
              <Video
                source={{ uri: item }}
                style={styles.previewVideo}
                useNativeControls
                // resizeMode="cover"
              />
            )}
            showsHorizontalScrollIndicator={false}
          />
        )}

        <Text style={[styles.sectionTitle, { color: colors.text }]}>📄 PDFs</Text>
        <TouchableOpacity
          style={[styles.mediaBtn, { backgroundColor: colors.card }]}
          onPress={() => pickMedia("pdf")}
        >
          <Text style={{ color: colors.text }}>Ajouter des PDFs</Text>
        </TouchableOpacity>
        {pdfs.map((uri, idx) => (
          <Text key={idx} style={{ color: colors.subtext, marginTop: 6 }}>
            📑 {uri.split("/").pop()}
          </Text>
        ))}

        <Text style={[styles.sectionTitle, { color: colors.text }]}>🎵 Audios</Text>
        <TouchableOpacity
          style={[styles.mediaBtn, { backgroundColor: colors.card }]}
          onPress={() => pickMedia("audio")}
        >
          <Text style={{ color: colors.text }}>Ajouter des audios</Text>
        </TouchableOpacity>
        {audios.map((uri, idx) => (
          <Text key={idx} style={{ color: colors.subtext, marginTop: 6 }}>
            🎶 {uri.split("/").pop()}
          </Text>
        ))}

        <Button title="Publier" onPress={handlePublish} loading={loading} style={{ marginTop: 20 }} />
      </View>

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary ?? "#4CAF50" }]}
        onPress={handlePublish}
      >
        <Plus size={28} color={colors.background} />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 40,
  },
  bgImage: {
    width: "100%",
    height: 160,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    opacity: 0.08,
  },
  overlay: {
    padding: 16,
    paddingTop: 24,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
  },
  mediaBtn: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 10,
    padding: 12,
    marginTop: 8,
    alignItems: "center",
  },
  previewImage: {
    width: 100,
    height: 100,
    marginRight: 8,
    borderRadius: 8,
  },
  previewVideo: {
    width: 140,
    height: 100,
    marginRight: 8,
    borderRadius: 8,
    overflow: "hidden",
  },
  sectionTitle: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "600",
  },
  fab: {
    position: "absolute",
    bottom: 18,
    right: 18,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 6,
  },
  selectedTagsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 8,
  },
  tagBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  tagBadgeRemove: {
    marginLeft: 8,
  },
  tagRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 6,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 4,
  },
});
