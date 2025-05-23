import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Stack } from "expo-router";
import { useState, useEffect, useMemo } from "react";
import { SPACING } from "@/src/constants/Spacing";

// SVG Icons
import User from "@/src/assets/svg/User.svg";
import Settings from "@/src/assets/svg/Settings.svg";
import CreditCard from "@/src/assets/svg/Credit-Card.svg";
import AdjustSettings from "@/src/assets/svg/Adjust-Settings.svg";
import Ticket from "@/src/assets/svg/Ticket.svg";
import ChatBubble from "@/src/assets/svg/Chat-Bubble.svg";

// Components and Context
import AccountInfo from "@/src/components/FieldsProfile";
import { useAuth } from "@/src/context/AuthContext";
import { useTheme } from "@/src/context/ThemeContext";
import i18n, { loadSavedLanguage, saveLanguagePreference } from "@/src/i18n";

// Profile Components
import ThemeSwitcher from "@/src/components/profile/ThemeSwitcher";
import ProfileHeader from "@/src/components/profile/ProfileHeader";
import ToggleSetting from "@/src/components/profile/ToggleSetting";
import LanguageSelector from "@/src/components/profile/LanguageSelector";
import SettingsSection from "@/src/components/profile/SettingsSection";
import ActionButton from "@/src/components/profile/ActionButton";

export default function Profile() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.locale);
  
  // Load saved language preference when component mounts
  useEffect(() => {
    const loadLanguage = async () => {
      const savedLanguage = await loadSavedLanguage();
      setCurrentLanguage(savedLanguage);
    };
    
    loadLanguage();
  }, []);
  
  // Format date of birth if available
  const formatDate = (dateString?: string): string => {
    if (!dateString) return i18n.t("profile.personalInfo.notSet") as string;
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  // Language selection handler
  const handleLanguageChange = (language: string) => {
    i18n.locale = language;
    setCurrentLanguage(language);
    // Save language preference to AsyncStorage
    saveLanguagePreference(language);
  };

  // Personal information section - using useMemo to update when user data changes
  const personalInfo = useMemo(() => {
    return [
    {
      icon: <User width={16} height={16} stroke={colors.brand} />,
      label: i18n.t("profile.personalInfo.fullName") as string,
      value: (user?.name ?? i18n.t("profile.personalInfo.notSet")) as string,
    },
    {
      icon: <ChatBubble width={16} height={16} stroke={colors.brand} />,
      label: i18n.t("profile.personalInfo.email") as string,
      value: (user?.email ?? i18n.t("profile.personalInfo.notSet")) as string,
    },
    {
      icon: <ChatBubble width={16} height={16} stroke={colors.brand} />,
      label: i18n.t("profile.personalInfo.phoneNumber") as string,
      value: (user?.phone ?? i18n.t("profile.personalInfo.notSet")) as string,
    },
    {
      icon: <Ticket width={16} height={16} stroke={colors.brand} />,
      label: i18n.t("profile.personalInfo.dateOfBirth") as string,
      value: formatDate(user?.birthdate),
    },
    {
      icon: <CreditCard width={16} height={16} stroke={colors.brand} />,
      label: i18n.t("profile.personalInfo.country") as string,
      value: (user?.country ?? i18n.t("profile.personalInfo.notSet")) as string,
    },
  ]}, [user, colors.brand, i18n.locale]); // Re-create when user data or theme changes

  return (
    <>
      <Stack.Screen options={{ title: "Profile", headerShown: false }} />
      <View style={[styles.container, { backgroundColor: colors.bgBase }]}>
        {/* Header with Avatar and User Info */}
        <ProfileHeader
          userName={user?.name}
          userEmail={user?.email}
        />

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Account Information */}
          <AccountInfo
            name={i18n.t("profile.accountInfo")}
            fields={personalInfo}
          />
          
          {/* Appearance Settings */}
          <SettingsSection
            title={i18n.t("profile.appearance")}
            icon={<AdjustSettings width={20} height={20} stroke={colors.brand} />}
          >
            <ThemeSwitcher style={styles.themeSwitcher} />
          </SettingsSection>
          
          {/* Language Settings */}
          <LanguageSelector
            currentLanguage={currentLanguage}
            onLanguageChange={handleLanguageChange}
          />
          
          {/* Notification Settings */}
          <SettingsSection
            title={i18n.t("profile.notifications.title")}
            icon={<ChatBubble width={20} height={20} stroke={colors.brand} />}
          >
            <ToggleSetting
              title={i18n.t("profile.notifications.push")}
              description={i18n.t("profile.notifications.pushDescription")}
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
            />
            <ToggleSetting
              title={i18n.t("profile.notifications.email")}
              description={i18n.t("profile.notifications.emailDescription")}
              value={emailNotificationsEnabled}
              onValueChange={setEmailNotificationsEnabled}
            />
          </SettingsSection>
          
          {/* Privacy Settings */}
          <SettingsSection
            title={i18n.t("profile.privacy_security")}
            icon={<Settings width={20} height={20} stroke={colors.brand} />}
          >
            <ToggleSetting
              title={i18n.t("profile.locationServices")}
              description={i18n.t("profile.locationServicesDescription")}
              value={locationEnabled}
              onValueChange={setLocationEnabled}
            />
            <ActionButton
              title={i18n.t("profile.privacy.privacyPolicy")}
              onPress={() => Alert.alert(i18n.t("profile.privacy.privacyPolicy"), "Privacy policy details would be shown here.")}
            />
            <ActionButton
              title={i18n.t("profile.privacy.termsOfService")}
              onPress={() => Alert.alert(i18n.t("profile.privacy.termsOfService"), "Terms of service details would be shown here.")}
            />
          </SettingsSection>
          
          {/* Help & Support */}
          <SettingsSection
            title={i18n.t("profile.help.title")}
            icon={<ChatBubble width={20} height={20} stroke={colors.brand} />}
          >
            <ActionButton
              title={i18n.t("profile.help.contactSupport")}
              onPress={() => Alert.alert(i18n.t("profile.help.contactSupport"), "Support contact information would be shown here.")}
            />
            <ActionButton
              title={i18n.t("profile.help.faq")}
              onPress={() => Alert.alert(i18n.t("profile.help.faq"), "Frequently asked questions would be shown here.")}
            />
            <ActionButton
              title={i18n.t("profile.help.about")}
              onPress={() => Alert.alert(i18n.t("profile.help.about"), "App version: 1.0.0")}
            />
          </SettingsSection>
        </ScrollView>
      </View>
    </>
  );
}

// Create styles using the current theme
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent", // Will be set dynamically
  },
  scrollContainer: {
    padding: SPACING.md,
    paddingBottom: 186,
    gap: SPACING.md,
  },
  themeSwitcher: {
    backgroundColor: "transparent", // Will be set dynamically
  },
});
