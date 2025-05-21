import React from "react";
import { View, Text, StyleSheet, Switch } from "react-native";
import { useTheme } from "@/src/context/ThemeContext";
import { SPACING } from "@/src/constants/Spacing";

interface ToggleSettingProps {
  title: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const ToggleSetting: React.FC<ToggleSettingProps> = ({
  title,
  description,
  value,
  onValueChange,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.toggleContainer, { borderTopColor: colors.textMuted + "40" }]}>
      <View style={styles.toggleTextContainer}>
        <Text style={[styles.toggleTitle, { color: colors.textBody }]}>{title}</Text>
        <Text style={[styles.toggleDescription, { color: colors.textMuted }]}>
          {description}
        </Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.bgSection, true: colors.brand }}
        thumbColor={colors.bgBase}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SPACING.md,
    borderTopWidth: 1,
  },
  toggleTextContainer: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "Inter",
  },
  toggleDescription: {
    fontSize: 12,
    fontFamily: "Inter",
    marginTop: 2,
  },
});

export default ToggleSetting;