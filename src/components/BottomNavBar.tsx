import { Text, View, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useState } from "react";

import { Colors } from "@/src/constants/Colors";

import Home from "@/src/assets/icons/Home.png";
import MagnifyingGlass from "@/src/assets/icons/Magnifying-Glass.png";
import ChatBubble from "@/src/assets/icons/Chat-Bubble.png";
import User from "@/src/assets/icons/User.png";

type Props = {
  activeTab: string;
  onTabChange: (tab: string) => void;
};


const tabs = [
  { key: "home", icon: Home },
  { key: "search", icon: MagnifyingGlass },
  { key: "chat", icon: ChatBubble },
  { key: "profile", icon: User },
];

export default function BottomTabBar({ activeTab, onTabChange }: Props) {
  return (
    <View style={styles.navBar}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          onPress={() => onTabChange(tab.key)}
          style={styles.tabButton}
          activeOpacity={0.7}
        >
          <Image
            source={tab.icon}
            style={[
              styles.icon,
              activeTab === tab.key && styles.activeIcon,
            ]}
          />
          {activeTab === tab.key && <View style={styles.activeDot} />}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 16,
    backgroundColor: Colors.dark.bgElevated, // ou o fundo que você quiser
  },
  tabButton: {
    alignItems: "center",
    minHeight: 60, // aumenta área de toque
  },
  icon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
    tintColor: Colors.dark.brandDark, // cor padrão do ícone
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.dark.brand, // sua cor de destaque
    marginTop: 4,
  },
  activeIcon: {
    tintColor: Colors.dark.brand, // opcional: deixa o ícone colorido quando ativo
  },
});