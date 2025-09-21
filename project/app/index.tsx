import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function Index() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // petit délai pour laisser le layout se monter
    const timer = setTimeout(() => setReady(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!ready) {
    return null; // ou un écran de splash custom
  }

  if (false) {
    return <Redirect href="/(tabs)" />;
  } else {
    return <Redirect href="/auth/login" />;
  }
}
