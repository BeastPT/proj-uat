import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Stack } from "expo-router";
import { Colors } from "@/src/constants/Colors";
import { SPACING, RADIUS } from "@/src/constants/Spacing";

import Avatar from "@/src/assets/svg/Avatar.svg";
import Logout from "@/src/assets/svg/Logout.svg";
import AccountInfo from "@/src/components/FieldsProfile";
import { useAuth } from "@/src/context/AuthContext";
import i18n from "@/src/i18n";

export default function Profile() {
  const { user, signOut } = useAuth();
  const fields = [
    {
      icon: <Logout width={16} height={16} stroke={Colors.dark.brand} />,
      label: "Full Name",
      value: "Janrike Serão Gonçalvez",
    },
    {
      icon: <Logout width={16} height={16} stroke={Colors.dark.brand} />,
      label: "Phone Number",
      value: "+351 900000000",
    },
    {
      icon: <Logout width={16} height={16} stroke={Colors.dark.brand} />,
      label: "Date of Birth",
      value: "September 8, 2004",
    },
    {
      icon: <Logout width={16} height={16} stroke={Colors.dark.brand} />,
      label: "Driver’s License",
      value: "M-12321313 1",
    },
  ];

  return (
    <>
      <Stack.Screen options={{ title: "Profile", headerShown: false }} />
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.avatarWrapper}>
            <Avatar width={80} height={80} style={styles.avatarIcon} />
          </View>
          <View style={styles.userInfo}>
            <Text
              style={styles.userName}
              numberOfLines={1}
              adjustsFontSizeToFit
              ellipsizeMode="tail"
            >
              {user?.name || "User Name"}
            </Text>
            <Text
              style={styles.userEmail}
              numberOfLines={1}
              adjustsFontSizeToFit
              ellipsizeMode="tail"
            >
              {user?.email || "user@example.com"}
            </Text>
          </View>
          <TouchableOpacity style={styles.logoutContainer} onPress={signOut}>
            <Logout width={32} height={32} stroke={Colors.dark.brand} />
            <Text style={styles.logoutText}>{i18n.t("profile.logout")}</Text>
          </TouchableOpacity>
        </View>

        <View>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark.bgBase,
  },
  header: {
    backgroundColor: Colors.dark.bgElevated,
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
    justifyContent: 'center', // This centers the content horizontally
    padding: SPACING.md,
    marginTop: SPACING.lg,
  },
  avatarIcon: {},
  userName: {
    fontFamily: "Sora",
    fontSize: 18,
    fontWeight: "600",
    color: Colors.dark.textBody,
    width: "100%",
  },
  userEmail: {
    fontFamily: "Inter",
    fontSize: 14,
    color: Colors.dark.textMuted,
  },
  logoutText: {
    color: Colors.dark.brand,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: SPACING.sm,
    fontFamily: 'Inter',
    textAlign: 'center', // This centers the text within the Text component
  },
  scrollContainer: {
    padding: SPACING.md,
    paddingBottom: 186,
    gap: SPACING.md,
  },
});
