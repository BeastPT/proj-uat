import { Redirect } from "expo-router";
import { useAuth } from "@/src/context/AuthContext";

export default function Index() {
  const { user } = useAuth();

  // Redirect based on authentication state
  // If user is authenticated, go to tabs
  // If not, go to auth flow
  return user ? <Redirect href="/(tabs)" /> : <Redirect href="/(auth)" />;
}