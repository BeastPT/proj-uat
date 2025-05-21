import { Slot } from "expo-router";
import { AuthProvider } from "@/src/context/AuthContext";
import { ThemeProvider } from "@/src/context/ThemeContext";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { loadSavedLanguage } from "@/src/i18n";

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Load fonts
  const [loaded] = useFonts({
    SpaceMono: require("@/src/assets/fonts/SpaceMono-Regular.ttf"),
    Sora: require("@/src/assets/fonts/Sora-Regular.ttf"),
    Inter: require("@/src/assets/fonts/Inter-Regular.ttf"),
  });

  // Hide the splash screen once fonts are loaded and load saved language
  useEffect(() => {
    if (loaded) {
      // Load saved language preference
      loadSavedLanguage();
      
      // Hide splash screen
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  // Return null until fonts are loaded
  if (!loaded) {
    return null;
  }

  // Wrap the app with the AuthProvider and ThemeProvider
  return (
    <AuthProvider>
      <ThemeProvider>
        <Slot />
      </ThemeProvider>
    </AuthProvider>
  );
}