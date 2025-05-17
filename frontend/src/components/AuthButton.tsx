import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
} from "react-native";
import { Colors } from "@/src/constants/Colors";
import { SPACING, RADIUS } from "@/src/constants/Spacing";

interface AuthButtonProps extends TouchableOpacityProps {
  title: string;
  isLoading?: boolean;
  variant?: "primary" | "secondary";
}

const AuthButton: React.FC<AuthButtonProps> = ({
  title,
  isLoading = false,
  variant = "primary",
  style,
  ...props
}) => {
  const buttonStyle =
    variant === "primary" ? styles.primaryButton : styles.secondaryButton;
  const textStyle =
    variant === "primary" ? styles.primaryText : styles.secondaryText;

  return (
    <TouchableOpacity
      style={[styles.button, buttonStyle, style]}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator
          color={variant === "primary" ? Colors.dark.textInvert : Colors.dark.brand}
          size="small"
        />
      ) : (
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.md,
  },
  primaryButton: {
    backgroundColor: Colors.dark.brand,
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: Colors.dark.brand,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Sora",
  },
  primaryText: {
    color: Colors.dark.textInvert,
  },
  secondaryText: {
    color: Colors.dark.brand,
  },
});

export default AuthButton;