import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "@/src/constants/Colors";
import HomeIcon from "@/src/assets/svg/Home.svg";
import SearchIcon from "@/src/assets/svg/Magnifying-Glass.svg";
import ChatIcon from "@/src/assets/svg/Chat-Bubble.svg";
import UserIcon from "@/src/assets/svg/User.svg";

import test from "@/src/assets/svg/test.svg";

type Props = {
  activeTab: string;
  onTabChange: (tab: string) => void;
};

const tabs = [
  { key: "home", Icon: HomeIcon },
  { key: "search", Icon: SearchIcon },
  { key: "chat", Icon: ChatIcon },
  { key: "profile", Icon: UserIcon }
];

export default function BottomTabBar({ activeTab, onTabChange }: Props) {
  return (
    <View style={styles.navBar}>
      {tabs.map(({ key, Icon }) => (
        <TouchableOpacity
          key={key}
          onPress={() => onTabChange(key)}
          style={styles.tabButton}
          activeOpacity={0.7}
        >

          <Icon
            width={30}
            height={30}
            stroke={"#FFFFF"} //activeTab === key ? Colors.dark.brand : Colors.dark.brandDark
            fill={'none'}
          />
          {activeTab === key && <View style={styles.activeDot} />}
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
    backgroundColor: Colors.dark.bgElevated,
  },
  tabButton: {
    alignItems: "center",
    minHeight: 60,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.dark.brand,
    marginTop: 4,
  },
});