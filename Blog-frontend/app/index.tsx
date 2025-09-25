import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      return <Redirect href={isAuthenticated ? "/(tabs)" : "/auth/login"} />;
    }, 3000);
    return () => clearTimeout(timer);
  }, [isLoading]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.text}>Loading...</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
});
