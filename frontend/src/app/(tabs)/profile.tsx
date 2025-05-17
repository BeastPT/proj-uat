import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Stack } from "expo-router";
import { Colors } from "@/src/constants/Colors";

import Avatar from "@/src/assets/svg/Avatar.svg";
import Logout from "@/src/assets/svg/Logout.svg";
import AccountInfo from "@/src/components/FieldsProfile";
import { useAuth } from "@/src/context/AuthContext";

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
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <AccountInfo name="Account Info" fields={fields} />
            <AccountInfo name="Account Info" fields={fields} />
            <AccountInfo name="Account Info" fields={fields} />
            <AccountInfo name="Account Info" fields={fields} />
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
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    gap: 12,
  },
  avatarWrapper: {
    alignItems: "flex-start",
  },
  userInfo: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 16,
  },
  logoutContainer: {
    alignItems: "flex-end",
    justifyContent: "center",
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
    fontFamily: "Inter",
    fontSize: 8,
    fontWeight: "600",
    textTransform: "uppercase",
    color: Colors.dark.brand,
    marginTop: 2,
    letterSpacing: -0.5,
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 186,
    gap: 16,
  },
});
