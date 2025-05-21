import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useTheme } from "@/src/context/ThemeContext";
import { SPACING } from "@/src/constants/Spacing";

interface ActionButtonProps {
  title: string;
  onPress: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ title, onPress }) => {
  const { colors } = useTheme();
  
  return (
    <TouchableOpacity 
      style={[styles.actionButton, { borderTopColor: colors.textMuted + "40" }]}
      onPress={onPress}
    >
      <Text style={[styles.actionButtonText, { color: colors.textBody }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  actionButton: {
    padding: SPACING.md,
    borderTopWidth: 1,
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: 'Inter',
  },
});

export default ActionButton;