import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { router } from "expo-router";

export default function App() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        router.replace("/(tabs)");
      } else {
        router.replace("/login");
      }
    }, 2000); // délai de 2 secondes

    return () => clearTimeout(timer); // nettoyage du timer
  }, [isAuthenticated]);

  return null;
}
