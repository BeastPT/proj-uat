import { Stack } from "expo-router";
import { useAuth } from "@/src/context/AuthContext";
import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function AdminLayout() {
  const { user } = useAuth();
  const router = useRouter();

  // Redirect non-admin users to the tabs
  useEffect(() => {
    if (!user?.isAdmin) {
      router.replace("/(tabs)");
    }
  }, [user]);

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Admin Dashboard",
          headerStyle: {
            backgroundColor: "#f4511e",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      />
      <Stack.Screen
        name="cars"
        options={{
          title: "Manage Cars",
          headerStyle: {
            backgroundColor: "#f4511e",
          },
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "bold",
          },
          headerShown: false, // We're using a custom header in the cars screen
        }}
      />
    </Stack>
  );
}