import React, { useMemo } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageSourcePropType } from "react-native";
import { useTheme } from "@/src/context/ThemeContext";
import { SPACING, RADIUS } from "@/src/constants/Spacing";

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
}

const CarCard: React.FC<CarCardProps> = ({
  name,
  image,
  price,
  priceUnit,
  rating,
  location,
  onPress,
  featured = false,
}) => {
  const { colors } = useTheme();
  
  // Create styles with the current theme colors
  const styles = useMemo(() => createStyles(colors), [colors]);
  return (
    <TouchableOpacity
      style={[styles.container, featured && styles.featuredContainer]}
      activeOpacity={0.8}
      onPress={onPress}
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
      </View>
    </TouchableOpacity>
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
});

export default CarCard;