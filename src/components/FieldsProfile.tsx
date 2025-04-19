import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/src/constants/Colors";
import Pencil from "@/src/assets/svg/Pencil.svg";

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
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>{name}</Text>
        <Pencil width={20} height={20} stroke={Colors.dark.brand} />
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.dark.bgSection,
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    color: Colors.dark.textHeading,
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
    color: Colors.dark.textBody,
    fontSize: 16,
    fontWeight: "500",
  },
  valueText: {
    color: Colors.dark.textMuted,
    fontSize: 14,
    lineHeight: 20,
    textAlign: "right",
    maxWidth: "50%",
  },
});