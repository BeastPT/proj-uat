import { Stack, usePathname, useRouter } from "expo-router";
import { View, StyleSheet } from "react-native";
import "react-native-reanimated";

import BottomTabBar from "@/src/components/BottomNavBar";
import { Colors } from "@/src/constants/Colors";

export default function TabsLayout() {
  const pathname = usePathname();
  const router = useRouter();

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
    router.navigate(route as any);
  };

  return (
    <View style={styles.container}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right"
        }}
        initialRouteName="index"
      />
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