import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useTheme } from "@/src/context/ThemeContext";
import { SPACING, RADIUS } from "@/src/constants/Spacing";
import i18n from "@/src/i18n";

interface LanguageSelectorProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onLanguageChange,
}) => {
  const { colors } = useTheme();

  const handleLanguageChange = (language: string) => {
    onLanguageChange(language);
    
    let languageName = "";
    switch (language) {
      case 'en':
        languageName = 'English';
        break;
      case 'pt':
        languageName = 'Portuguese';
        break;
      case 'sl':
        languageName = 'Slovenian';
        break;
      default:
        languageName = language;
    }
    
    Alert.alert(
      "Language Changed",
      `Language set to ${languageName}`
    );
  };

  return (
    <View style={[styles.languageContainer, { backgroundColor: colors.bgSection }]}>
      <Text style={[styles.sectionTitle, { color: colors.textHeading }]}>
        {i18n.t("profile.language")}
      </Text>
      <View style={styles.languageButtons}>
        <TouchableOpacity
          style={[
            styles.languageButton,
            { backgroundColor: colors.bgSection },
            currentLanguage === "en" && styles.activeButton,
          ]}
          onPress={() => handleLanguageChange("en")}
        >
          <Text
            style={[
              styles.buttonText,
              { color: colors.textBody },
              currentLanguage === "en" && { color: colors.brand, fontWeight: "600" },
            ]}
          >
            English
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.languageButton,
            { backgroundColor: colors.bgSection },
            currentLanguage === "pt" && styles.activeButton,
          ]}
          onPress={() => handleLanguageChange("pt")}
        >
          <Text
            style={[
              styles.buttonText,
              { color: colors.textBody },
              currentLanguage === "pt" && { color: colors.brand, fontWeight: "600" },
            ]}
          >
            Português
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.languageButton,
            { backgroundColor: colors.bgSection },
            currentLanguage === "sl" && styles.activeButton,
          ]}
          onPress={() => handleLanguageChange("sl")}
        >
          <Text
            style={[
              styles.buttonText,
              { color: colors.textBody },
              currentLanguage === "sl" && { color: colors.brand, fontWeight: "600" },
            ]}
          >
            Slovenščina
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  languageContainer: {
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    borderColor: "#A1A1AA80",
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Sora",
  },
  languageButtons: {
    flexDirection: "row",
    marginTop: SPACING.md,
  },
  languageButton: {
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
    fontFamily: "Inter",
  },
});

export default LanguageSelector;