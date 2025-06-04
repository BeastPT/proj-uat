import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageSourcePropType } from "react-native";
import { SPACING, RADIUS } from "@/src/constants/Spacing";
import { useTheme } from "@/src/context/ThemeContext";
import i18n from "@/src/i18n";

interface BookingCardProps {
  id: string;
  carName: string;
  carImage: ImageSourcePropType;
  startDate: string;
  endDate: string;
  status: "active" | "completed" | "cancelled";
  isPending?: boolean;
  onPress?: () => void;
}

const BookingCard: React.FC<BookingCardProps> = ({
  carName,
  carImage,
  startDate,
  endDate,
  status,
  isPending,
  onPress,
}) => {
  const { colors } = useTheme();
  
  const getStatusColor = () => {
    if (status === "active" && isPending) {
      return "#FFA726"; // Orange for pending
    }
    
    switch (status) {
      case "active":
        return "#4CAF50"; // Green
      case "completed":
        return colors.textMuted;
      case "cancelled":
        return "#F44336"; // Red
      default:
        return colors.textMuted;
    }
  };
  const getStatusText = () => {
    if (status === "active" && isPending) {
      return i18n.t("home.pendingStatus") || "Pending";
    }
    
    switch (status) {
      case "active":
        return "Active";
      case "completed":
        return "Completed";
      case "cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.bgElevated }]}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Image source={carImage} style={styles.image} resizeMode="cover" />
      <View style={styles.infoContainer}>
        <Text style={[styles.carName, { color: colors.textHeading }]} numberOfLines={1}>
          {carName}
        </Text>
        <Text style={[styles.dateText, { color: colors.textBody }]}>
          {startDate} - {endDate}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={[styles.statusText, { color: colors.textHeading }]}>{getStatusText()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: RADIUS.md,
    overflow: "hidden",
    marginBottom: SPACING.md,
  },
  image: {
    width: 100,
    height: 100,
  },
  infoContainer: {
    flex: 1,
    padding: SPACING.md,
    justifyContent: "space-between",
  },
  carName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: SPACING.xs,
  },
  dateText: {
    fontSize: 14,
    marginBottom: SPACING.sm,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default BookingCard;