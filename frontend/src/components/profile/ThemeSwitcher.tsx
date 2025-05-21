import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme, ThemeType } from "@/src/context/ThemeContext";
import i18n from "@/src/i18n";

interface ThemeSwitcherProps {
  style?: object;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ style }) => {
  const { theme, setTheme, colors } = useTheme();

  const handleThemeChange = (newTheme: ThemeType) => {
    setTheme(newTheme);
  };

  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.title, { color: colors.textHeading }]}>
        {i18n.t("profile.theme")}
      </Text>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[
            styles.themeButton,
            { backgroundColor: colors.bgSection },
            theme === "dark" && styles.activeButton,
          ]}
          onPress={() => handleThemeChange("dark")}
        >
          <Text
            style={[
              styles.buttonText,
              { color: colors.textBody },
              theme === "dark" && styles.activeText,
            ]}
          >
            {i18n.t("profile.dark")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.themeButton,
            { backgroundColor: colors.bgSection },
            theme === "light" && styles.activeButton,
          ]}
          onPress={() => handleThemeChange("light")}
        >
          <Text
            style={[
              styles.buttonText,
              { color: colors.textBody },
              theme === "light" && styles.activeText,
            ]}
          >
            {i18n.t("profile.light")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  themeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  activeButton: {
    borderWidth: 1,
    borderColor: "#8A2BE2",
  },
  buttonText: {
    fontSize: 14,
  },
  activeText: {
    fontWeight: "bold",
  },
});

export default ThemeSwitcher;