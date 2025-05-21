import React, { ReactNode } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/src/context/ThemeContext";
import { SPACING, RADIUS } from "@/src/constants/Spacing";

interface SettingsSectionProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  backgroundColor?: string;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  icon,
  children,
  backgroundColor,
}) => {
  const { colors } = useTheme();
  
  return (
    <View 
      style={[
        styles.settingsSection, 
        { backgroundColor: backgroundColor || colors.bgSection },
        { borderColor: "#A1A1AA80" }
      ]}
    >
      <View style={styles.sectionHeader}>
        {icon}
        <Text style={[styles.sectionTitle, { color: colors.textHeading }]}>
          {title}
        </Text>
      </View>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  settingsSection: {
    borderRadius: RADIUS.md,
    overflow: 'hidden',
    borderWidth: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Sora',
  },
});

export default SettingsSection;