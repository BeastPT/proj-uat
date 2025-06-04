import React, { useMemo, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageSourcePropType } from "react-native";
import { useTheme } from "@/src/context/ThemeContext";
import { SPACING, RADIUS } from "@/src/constants/Spacing";
import i18n from "@/src/i18n";
import ReservationModal from "./ReservationModal";

interface CarCardProps {
  id: string;
  name: string;
  image: ImageSourcePropType;
  price: number;
  priceUnit: string;
  rating?: number;
  location?: string;
  onPress?: () => void;
  featured?: boolean;
  onReservationSuccess?: () => void;
}

const CarCard: React.FC<CarCardProps> = ({
  id,
  name,
  image,
  price,
  priceUnit,
  rating,
  location,
  onPress,
  featured = false,
  onReservationSuccess,
}) => {
  const { colors } = useTheme();
  const [showReservationModal, setShowReservationModal] = useState(false);
  
  // Create styles with the current theme colors
  const styles = useMemo(() => createStyles(colors), [colors]);

  const handleReservePress = (e: any) => {
    e.stopPropagation();
    setShowReservationModal(true);
  };

  const handleCardPress = () => {
    if (onPress) {
      onPress();
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.container, featured && styles.featuredContainer]}
        activeOpacity={0.8}
        onPress={handleCardPress}
      >
        <View style={styles.imageContainer}>
          <Image source={image} style={styles.image} resizeMode="cover" />
          {featured && (
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredText}>Featured</Text>
            </View>
          )}
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.name} numberOfLines={1}>
            {name}
          </Text>
          {location && (
            <Text style={styles.location} numberOfLines={1}>
              {location}
            </Text>
          )}
          <View style={styles.bottomRow}>
            <Text style={styles.price}>
              ${price}
              <Text style={styles.priceUnit}> /{priceUnit}</Text>
            </Text>
            {rating !== undefined && (
              <View style={styles.ratingContainer}>
                <Text style={styles.rating}>★ {rating.toFixed(1)}</Text>
              </View>
            )}
          </View>
          <TouchableOpacity
            style={[styles.reserveButton, { backgroundColor: colors.brand }]}
            onPress={handleReservePress}
          >
            <Text style={styles.reserveButtonText}>
              {i18n.t("car.reserve")}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      <ReservationModal
        visible={showReservationModal}
        onClose={() => setShowReservationModal(false)}
        carId={id}
        carName={name}
        pricePerDay={price}
        onSuccess={() => {
          setShowReservationModal(false);
          if (onReservationSuccess) {
            onReservationSuccess();
          }
        }}
      />
    </>
  );
};

// Create styles function that takes colors as a parameter
const createStyles = (colors: any) => StyleSheet.create({
  container: {
    backgroundColor: colors.bgElevated,
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    marginBottom: SPACING.md,
    width: 220,
    marginRight: SPACING.md,
  },
  featuredContainer: {
    width: "100%",
    marginRight: 0,
  },
  imageContainer: {
    height: 140,
    width: "100%",
    position: "relative",
  },
  image: {
    height: "100%",
    width: "100%",
  },
  featuredBadge: {
    position: "absolute",
    top: SPACING.sm,
    left: SPACING.sm,
    backgroundColor: colors.brand,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
  },
  featuredText: {
    color: colors.textHeading,
    fontSize: 12,
    fontWeight: "bold",
  },
  infoContainer: {
    padding: SPACING.md,
  },
  name: {
    color: colors.textHeading,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: SPACING.xs,
  },
  location: {
    color: colors.textMuted,
    fontSize: 14,
    marginBottom: SPACING.sm,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.sm,
  },
  price: {
    color: colors.textHeading,
    fontSize: 16,
    fontWeight: "bold",
  },
  priceUnit: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: "normal",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    color: colors.brand,
    fontSize: 14,
    fontWeight: "bold",
  },
  reserveButton: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: RADIUS.md,
    alignItems: "center",
    justifyContent: "center",
    marginTop: SPACING.xs,
  },
  reserveButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "Inter",
  },
});

export default CarCard;