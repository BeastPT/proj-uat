import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@/src/context/ThemeContext";
import Pencil from "@/src/assets/svg/Pencil.svg";
import EditProfileForm from "./profile/EditProfileForm";

type Field = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

export default function AccountInfo({
  name,
  fields,
}: {
  name: string;
  fields: Field[];
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [isEditing, setIsEditing] = useState(false);

  const handleEditPress = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  return (
    <View style={styles.container}>
      {isEditing ? (
        <EditProfileForm onCancel={handleCancelEdit} />
      ) : (
        <>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerText}>{name}</Text>
            <TouchableOpacity onPress={handleEditPress}>
              <Pencil width={20} height={20} stroke={colors.brand} />
            </TouchableOpacity>
          </View>

          {/* Info Rows */}
          {fields.map((field, index) => (
            <InfoRow
              key={index}
              icon={field.icon}
              label={field.label}
              value={field.value}
            />
          ))}
        </>
      )}
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <View style={styles.row}>
      <View style={styles.labelContainer}>
        {icon}
        <Text style={styles.labelText}>{label}</Text>
      </View>
      <Text style={styles.valueText}>{value}</Text>
    </View>
  );
}

// Create styles function that takes colors as a parameter
const createStyles = (colors: any) => StyleSheet.create({
  container: {
    backgroundColor: colors.bgSection,
    borderRadius: 12,
    padding: 16,
    gap: 16,
    borderColor: "#A1A1AA80",
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    color: colors.textHeading,
    fontSize: 18,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopColor: "#A1A1AA80", // 50% transparent border
    borderTopWidth: 1,
    paddingTop: 8,
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexShrink: 1,
  },
  labelText: {
    color: colors.textBody,
    fontSize: 16,
    fontWeight: "500",
  },
  valueText: {
    color: colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "right",
    maxWidth: "50%",
  },
});