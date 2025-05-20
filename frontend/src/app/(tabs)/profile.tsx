import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Stack } from "expo-router";
import { SPACING, RADIUS } from "@/src/constants/Spacing";

import Avatar from "@/src/assets/svg/Avatar.svg";
import Logout from "@/src/assets/svg/Logout.svg";
import AccountInfo from "@/src/components/FieldsProfile";
import { useAuth } from "@/src/context/AuthContext";
import { useTheme } from "@/src/context/ThemeContext";
import ThemeSwitcher from "@/src/components/ThemeSwitcher";
import i18n from "@/src/i18n";

export default function Profile() {
  const { user, signOut } = useAuth();
  const { colors } = useTheme();
  
  const fields = [
    {
      icon: <Logout width={16} height={16} stroke={colors.brand} />,
      label: "Full Name",
      value: "Janrike Serão Gonçalvez",
    },
    {
      icon: <Logout width={16} height={16} stroke={colors.brand} />,
      label: "Phone Number",
      value: "+351 900000000",
    },
    {
      icon: <Logout width={16} height={16} stroke={colors.brand} />,
      label: "Date of Birth",
      value: "September 8, 2004",
    },
    {
      icon: <Logout width={16} height={16} stroke={colors.brand} />,
      label: "Driver's License",
      value: "M-12321313 1",
    },
  ];

  return (
    <>
      <Stack.Screen options={{ title: "Profile", headerShown: false }} />
      <View style={[styles.container, { backgroundColor: colors.bgBase }]}>
        {/* HEADER */}
        <View style={[styles.header, { backgroundColor: colors.bgElevated }]}>
          <View style={styles.avatarWrapper}>
            <Avatar width={80} height={80} style={styles.avatarIcon} />
          </View>
          <View style={styles.userInfo}>
            <Text
              style={[styles.userName, { color: colors.textBody }]}
              numberOfLines={1}
              adjustsFontSizeToFit
              ellipsizeMode="tail"
            >
              {user?.name || "User Name"}
            </Text>
            <Text
              style={[styles.userEmail, { color: colors.textMuted }]}
              numberOfLines={1}
              adjustsFontSizeToFit
              ellipsizeMode="tail"
            >
              {user?.email || "user@example.com"}
            </Text>
          </View>
          <TouchableOpacity style={styles.logoutContainer} onPress={signOut}>
            <Logout width={32} height={32} stroke={colors.brand} />
            <Text style={[styles.logoutText, { color: colors.brand }]}>{i18n.t("profile.logout")}</Text>
          </TouchableOpacity>
        </View>

        <View>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <ThemeSwitcher style={[styles.themeSwitcher, { backgroundColor: colors.bgElevated }]} />
            <AccountInfo name={i18n.t("profile.accountInfo")} fields={fields} />
            <AccountInfo name={i18n.t("profile.accountInfo")} fields={fields} />
            <AccountInfo name={i18n.t("profile.accountInfo")} fields={fields} />
            <AccountInfo name={i18n.t("profile.accountInfo")} fields={fields} />
          </ScrollView>
        </View>
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
  header: {
    backgroundColor: "transparent", // Will be set dynamically
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.md,
    paddingTop: 60,
    paddingBottom: SPACING.md,
    gap: SPACING.md,
  },
  avatarWrapper: {
    alignItems: "flex-start",
  },
  userInfo: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: SPACING.md,
  },
  logoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    marginTop: SPACING.lg,
  },
  avatarIcon: {},
  userName: {
    fontFamily: "Sora",
    fontSize: 18,
    fontWeight: "600",
    color: "transparent", // Will be set dynamically
    width: "100%",
  },
  userEmail: {
    fontFamily: "Inter",
    fontSize: 14,
    color: "transparent", // Will be set dynamically
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: SPACING.sm,
    fontFamily: 'Inter',
    textAlign: 'center',
  },
  scrollContainer: {
    padding: SPACING.md,
    paddingBottom: 186,
    gap: SPACING.md,
  },
  themeSwitcher: {
    marginBottom: SPACING.md,
    backgroundColor: "transparent", // Will be set dynamically
    borderRadius: RADIUS.md,
  },
});
