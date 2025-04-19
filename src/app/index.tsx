import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import BottomTabBar from "@/src/components/BottomNavBar"; // ajuste o caminho conforme necessário

export default function Index() {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.text}>Current tab: {activeTab}</Text>
      </View>
      <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#09090B",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontSize: 18,
  },
});