import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
} from "react-native";
import { Colors } from "@/src/constants/Colors";
import { SPACING, RADIUS } from "@/src/constants/Spacing";

interface AuthInputProps extends TextInputProps {
  label: string;
  isPassword?: boolean;
  isPasswordVisible?: boolean;
  onTogglePasswordVisibility?: () => void;
}

const AuthInput: React.FC<AuthInputProps> = ({
  label,
  isPassword = false,
  isPasswordVisible = false,
  onTogglePasswordVisibility,
  ...props
}) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      {isPassword ? (
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, styles.passwordInput]}
            secureTextEntry={!isPasswordVisible}
            autoCapitalize="none"
            {...props}
          />
          {onTogglePasswordVisibility && (
            <TouchableOpacity
              style={styles.visibilityToggle}
              onPress={onTogglePasswordVisibility}
            >
              <Text style={styles.visibilityText}>
                {isPasswordVisible ? "Hide" : "Show"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <TextInput style={styles.input} {...props} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: 14,
    color: Colors.dark.textBody,
    marginBottom: SPACING.xs,
    fontFamily: "Inter",
  },
  input: {
    backgroundColor: Colors.dark.bgElevated,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    color: Colors.dark.textBody,
    fontSize: 16,
    fontFamily: "Inter",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.dark.bgElevated,
    borderRadius: RADIUS.md,
  },
  passwordInput: {
    flex: 1,
    backgroundColor: "transparent",
  },
  visibilityToggle: {
    paddingHorizontal: SPACING.md,
  },
  visibilityText: {
    color: Colors.dark.brand,
    fontSize: 14,
    fontFamily: "Inter",
  },
});

export default AuthInput;