import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "@/src/context/ThemeContext";
import { useAuth } from "@/src/context/AuthContext";
import { SPACING } from "@/src/constants/Spacing";
import i18n from "@/src/i18n";

// SVG Icons
import Avatar from "@/src/assets/svg/Avatar.svg";
import Logout from "@/src/assets/svg/Logout.svg";

interface ProfileHeaderProps {
  userName?: string;
  userEmail?: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ userName, userEmail }) => {
  const { colors } = useTheme();
  const { signOut } = useAuth();

  return (
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
          {userName || "User Name"}
        </Text>
        <Text
          style={[styles.userEmail, { color: colors.textMuted }]}
          numberOfLines={1}
          adjustsFontSizeToFit
          ellipsizeMode="tail"
        >
          {userEmail || "user@example.com"}
        </Text>
      </View>
      <TouchableOpacity style={styles.logoutContainer} onPress={signOut}>
        <Logout width={32} height={32} stroke={colors.brand} />
        <Text style={[styles.logoutText, { color: colors.brand }]}>
          {i18n.t("profile.logout")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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
  avatarIcon: {},
  userInfo: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: SPACING.md,
  },
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
  logoutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    marginTop: SPACING.lg,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: SPACING.sm,
    fontFamily: 'Inter',
    textAlign: 'center',
  },
});

export default ProfileHeader;