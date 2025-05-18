import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageSourcePropType } from "react-native";
import { Colors } from "@/src/constants/Colors";
import { SPACING, RADIUS } from "@/src/constants/Spacing";

interface BookingCardProps {
  id: string;
  carName: string;
  carImage: ImageSourcePropType;
  startDate: string;
  endDate: string;
  status: "active" | "completed" | "cancelled";
  onPress?: () => void;
}

const BookingCard: React.FC<BookingCardProps> = ({
  carName,
  carImage,
  startDate,
  endDate,
  status,
  onPress,
}) => {
  const getStatusColor = () => {
    switch (status) {
      case "active":
        return "#4CAF50"; // Green
      case "completed":
        return Colors.dark.textMuted;
      case "cancelled":
        return "#F44336"; // Red
      default:
        return Colors.dark.textMuted;
    }
  };

  const getStatusText = () => {
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
    <TouchableOpacity style={styles.container} activeOpacity={0.8} onPress={onPress}>
      <Image source={carImage} style={styles.image} resizeMode="cover" />
      <View style={styles.infoContainer}>
        <Text style={styles.carName} numberOfLines={1}>
          {carName}
        </Text>
        <Text style={styles.dateText}>
          {startDate} - {endDate}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
          <Text style={styles.statusText}>{getStatusText()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: Colors.dark.bgElevated,
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
    color: Colors.dark.textHeading,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: SPACING.xs,
  },
  dateText: {
    color: Colors.dark.textBody,
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
    color: Colors.dark.textHeading,
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default BookingCard;