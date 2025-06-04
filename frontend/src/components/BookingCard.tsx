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
  isWithinPeriod?: boolean;
  onPress?: () => void;
  onCancel?: (id: string) => void;
}

const BookingCard: React.FC<BookingCardProps> = ({
  id,
  carName,
  carImage,
  startDate,
  endDate,
  status,
  isPending,
  isWithinPeriod,
  onPress,
  onCancel,
}) => {
  const { colors } = useTheme();
  
  const getStatusColor = () => {
    // If cancelled, always show red
    if (status === "cancelled") {
      return "#F44336"; // Red
    }
    
    // If pending, show orange
    if (status === "active" && isPending) {
      return "#FFA726"; // Orange for pending
    }
    
    // If completed/ended, show gray
    if (status === "completed") {
      return colors.textMuted; // Gray for ended
    }
    
    // For active status, check if it's within the rental period
    if (status === "active") {
      // If isWithinPeriod is explicitly false, it means the rental hasn't started yet
      if (isWithinPeriod === false) {
        return "#2196F3"; // Blue for not started
      }
      // Otherwise, it's active
      return "#4CAF50"; // Green for active
    }
    
    return colors.textMuted;
  };
  const getStatusText = () => {
    // If cancelled, always show cancelled
    if (status === "cancelled") {
      return "Cancelled";
    }
    
    // If pending, show pending
    if (status === "active" && isPending) {
      return i18n.t("home.pendingStatus") || "Pending";
    }
    
    // If completed/ended, show ended
    if (status === "completed") {
      return "Ended";
    }
    
    // For active status, check if it's within the rental period
    if (status === "active") {
      // If isWithinPeriod is explicitly false, it means the rental hasn't started yet
      if (isWithinPeriod === false) {
        return "Not Started";
      }
      // Otherwise, it's active
      return "Active";
    }
    
    return status;
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel(id);
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
        <View style={styles.bottomRow}>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
            <Text style={[styles.statusText, { color: colors.textHeading }]}>{getStatusText()}</Text>
          </View>
          
          {isPending && onCancel && (
            <TouchableOpacity
              style={[styles.cancelButton, { backgroundColor: "#F44336" }]}
              onPress={handleCancel}
            >
              <Text style={styles.cancelButtonText}>
                {i18n.t("home.cancelReservation") || "Cancel"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  cancelButton: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "Inter",
  },
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