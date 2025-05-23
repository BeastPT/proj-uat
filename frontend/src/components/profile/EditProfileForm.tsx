import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Platform } from "react-native";
import { useTheme } from "@/src/context/ThemeContext";
import { useAuth } from "@/src/context/AuthContext";
import i18n from "@/src/i18n";

type EditProfileFormProps = {
  onCancel: () => void;
};

export default function EditProfileForm({ onCancel }: EditProfileFormProps) {
  const { colors } = useTheme();
  const { user, updateProfile } = useAuth();
  
  // Form state
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [country, setCountry] = useState(user?.country || "");
  const [birthdate, setBirthdate] = useState(
    user?.birthdate ? new Date(user.birthdate) : new Date()
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Handle date input change
  const handleDateChange = (text: string) => {
    try {
      const date = new Date(text);
      if (!isNaN(date.getTime())) {
        setBirthdate(date);
      }
    } catch (error) {
      console.error("Invalid date format", error);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Name cannot be empty");
      return;
    }

    if (!email.trim()) {
      Alert.alert("Error", "Email cannot be empty");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateProfile({
        name,
        email,
        phone,
        country,
        birthdate: birthdate.toISOString(),
      });
      Alert.alert("Success", "Profile updated successfully");
      onCancel(); // Close the form after successful update
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.error || "Failed to update profile"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bgSection }]}>
      <Text style={[styles.title, { color: colors.textHeading }]}>
        {i18n.t("profile.editProfile")}
      </Text>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.textBody }]}>
          {i18n.t("profile.personalInfo.fullName")}
        </Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.bgElevated, color: colors.textBody }]}
          value={name}
          onChangeText={setName}
          placeholder={i18n.t("profile.personalInfo.fullName") as string}
          placeholderTextColor={colors.textMuted}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.textBody }]}>
          {i18n.t("profile.personalInfo.email")}
        </Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.bgElevated, color: colors.textBody }]}
          value={email}
          onChangeText={setEmail}
          placeholder={i18n.t("profile.personalInfo.email") as string}
          placeholderTextColor={colors.textMuted}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.textBody }]}>
          {i18n.t("profile.personalInfo.phoneNumber")}
        </Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.bgElevated, color: colors.textBody }]}
          value={phone}
          onChangeText={setPhone}
          placeholder={i18n.t("profile.personalInfo.phoneNumber") as string}
          placeholderTextColor={colors.textMuted}
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.textBody }]}>
          {i18n.t("profile.personalInfo.country")}
        </Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.bgElevated, color: colors.textBody }]}
          value={country}
          onChangeText={setCountry}
          placeholder={i18n.t("profile.personalInfo.country") as string}
          placeholderTextColor={colors.textMuted}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.textBody }]}>
          {i18n.t("profile.personalInfo.dateOfBirth")}
        </Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.bgElevated, color: colors.textBody }]}
          value={formatDate(birthdate)}
          onChangeText={handleDateChange}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={colors.textMuted}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton, { backgroundColor: colors.bgElevated }]}
          onPress={onCancel}
          disabled={isSubmitting}
        >
          <Text style={[styles.buttonText, { color: colors.textBody }]}>
            {i18n.t("cancel")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.saveButton, { backgroundColor: colors.brand }]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          <Text style={[styles.buttonText, { color: colors.textInvert }]}>
            {isSubmitting ? i18n.t("saving") : i18n.t("save")}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#A1A1AA80",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  dateInput: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 12,
    justifyContent: "center",
  },
  dateText: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButton: {
    marginRight: 8,
  },
  saveButton: {
    marginLeft: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});