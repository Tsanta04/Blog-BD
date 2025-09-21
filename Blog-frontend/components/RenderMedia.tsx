import { useTheme } from "@/contexts/ThemeContext";
import { FileText } from "lucide-react-native";
import { Image, StyleSheet, Text, View } from "react-native";

export   const renderMedia = (media: any, index: number) => {
  const { colors } = useTheme();
    const styles = StyleSheet.create({
            image: { width: '100%', height: 200, marginBottom: 12, borderRadius: 8 },
            video: { width: '100%', height: 200, marginBottom: 12, borderRadius: 8, backgroundColor: '#000' },
            pdf: { flexDirection: 'row', alignItems: 'center', padding: 8, backgroundColor: colors.border, borderRadius: 6, marginBottom: 8 },
            pdfText: { marginLeft: 6, color: colors.text, fontSize: 14 },
    })
    const type = media.type.toLowerCase();
    if (type === 'image') {
      return <Image key={index} source={{ uri: media.url }} style={styles.image} resizeMode="cover" />;
    }
    if (type === 'video') {
      return (
        <View key={index} style={styles.video}>
          {/* Tu peux utiliser react-native-video ici pour la lecture */}
          <Text style={{ color: '#fff', textAlign: 'center', marginTop: 90 }}>Video</Text>
        </View>
      );
    }
    if (type === 'pdf') {
      return (
        <View key={index} style={styles.pdf}>
          <FileText size={18} color={colors.text} />
          <Text style={styles.pdfText}>{media.url.split('/').pop()}</Text>
        </View>
      );
    }
    return null;
  };