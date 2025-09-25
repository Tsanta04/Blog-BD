import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Pdf from "react-native-pdf";

export default function PdfViewer() {
  const {id:path } = useLocalSearchParams(); 
  const source = { uri: path.toString(), cache: true };

  return (
    <View style={styles.container}>
      <Pdf
        source={source}
        style={styles.pdf}
        onLoadComplete={(numberOfPages) => {
          console.log(`Loaded ${numberOfPages} pages`);
        }}
        onError={(error) => {
          console.log(error);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
