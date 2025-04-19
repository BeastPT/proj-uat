import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, usePathname, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { View, StyleSheet } from "react-native";

import BottomTabBar from "@/src/components/BottomNavBar";
import { Colors } from "@/src/constants/Colors";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Sora: require("../assets/fonts/Sora-Regular.ttf"),
    Inter: require("../assets/fonts/Inter-Regular.ttf"),
  });

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const getTabFromPath = () => {
    if (pathname.startsWith("/search")) return "search";
    if (pathname.startsWith("/chat")) return "chat";
    if (pathname.startsWith("/profile")) return "profile";
    return "home";
  };

  const handleTabChange = (tab: string) => {
    const routeMap = {
      home: "/",
      search: "/search",
      chat: "/chat",
      profile: "/profile"
    };
    
    const route = routeMap[tab as keyof typeof routeMap] || `/${tab}`;
    router.push(route as any);
  };

  return (
    <View style={styles.container}>
      <Stack screenOptions={{ headerShown: false }} />
      <BottomTabBar activeTab={getTabFromPath()} onTabChange={handleTabChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.bgBase,
  },
});
