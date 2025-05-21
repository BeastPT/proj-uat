import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SPACING } from "@/src/constants/Spacing";
import { useTheme } from "@/src/context/ThemeContext";

interface SectionHeaderProps {
  title: string;
  actionText?: string;
  onActionPress?: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  actionText,
  onActionPress,
}) => {
  const { colors } = useTheme();
  
  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.textHeading }]}>{title}</Text>
      {actionText && onActionPress && (
        <TouchableOpacity onPress={onActionPress}>
          <Text style={[styles.actionText, { color: colors.brand }]}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Sora",
  },
  actionText: {
    fontSize: 14,
    fontFamily: "Inter",
  },
});

export default SectionHeader;