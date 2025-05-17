import { Stack } from "expo-router";
import { View, StyleSheet } from "react-native";
import { Colors } from "@/src/constants/Colors";

export default function AuthLayout() {
  return (
    <View style={styles.container}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.dark.bgBase },
          animation: "slide_from_right",
        }}
        initialRouteName="login"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.bgBase,
  },
});