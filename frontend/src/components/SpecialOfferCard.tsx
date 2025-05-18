import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ImageSourcePropType } from "react-native";
import { Colors } from "@/src/constants/Colors";
import { SPACING, RADIUS } from "@/src/constants/Spacing";

interface SpecialOfferCardProps {
  id: string;
  title: string;
  description: string;
  discount: string;
  backgroundImage: ImageSourcePropType;
  onPress?: () => void;
}

const SpecialOfferCard: React.FC<SpecialOfferCardProps> = ({
  title,
  description,
  discount,
  backgroundImage,
  onPress,
}) => {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
      <ImageBackground
        source={backgroundImage}
        style={styles.container}
        imageStyle={styles.backgroundImage}
      >
        <View style={styles.overlay}>
          <View style={styles.content}>
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{discount}</Text>
            </View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{description}</Text>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 160,
    borderRadius: RADIUS.lg,
    overflow: "hidden",
    marginBottom: SPACING.md,
  },
  backgroundImage: {
    borderRadius: RADIUS.lg,
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    height: "100%",
    width: "100%",
    justifyContent: "flex-end",
  },
  content: {
    padding: SPACING.md,
  },
  discountBadge: {
    backgroundColor: Colors.dark.brand,
    alignSelf: "flex-start",
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.sm,
  },
  discountText: {
    color: Colors.dark.textHeading,
    fontSize: 14,
    fontWeight: "bold",
  },
  title: {
    color: Colors.dark.textHeading,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: SPACING.xs,
  },
  description: {
    color: Colors.dark.textBody,
    fontSize: 14,
  },
});

export default SpecialOfferCard;