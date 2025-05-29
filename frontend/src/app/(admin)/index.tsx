import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import { useAuth } from "@/src/context/AuthContext";
import { router } from "expo-router";
import { Colors } from "@/src/constants/Colors";

export default function AdminDashboard() {
  const { user, signOut } = useAuth();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <Text style={styles.welcomeText}>Welcome, {user?.name}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push("/(admin)/cars")}
          >
            <Image
              source={require("@/src/assets/icons/Ticket.png")}
              style={styles.actionIcon}
            />
            <Text style={styles.actionText}>Manage Cars</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => router.push("/(admin)/chat?showChat=true")}
          >
            <Image
              source={require("@/src/assets/icons/Chat-Bubble.png")}
              style={styles.actionIcon}
            />
            <Text style={styles.actionText}>Chats</Text>
          </TouchableOpacity>

        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>System Status</Text>
        <View style={styles.statusCard}>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Active Users</Text>
            <Text style={styles.statusValue}>124</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Available Cars</Text>
            <Text style={styles.statusValue}>45</Text>
          </View>
          <View style={styles.statusItem}>
            <Text style={styles.statusLabel}>Active Bookings</Text>
            <Text style={styles.statusValue}>37</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => signOut()}
      >
        <Text style={styles.backButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: Colors.light.brand,
    padding: 20,
    paddingTop: 40,
    paddingBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 16,
    color: "white",
    opacity: 0.9,
  },
  section: {
    padding: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  actionCard: {
    width: "48%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionIcon: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },
  statusCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  statusItem: {
    alignItems: "center",
  },
  statusLabel: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
  },
  statusValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.brand,
  },
  backButton: {
    margin: 20,
    padding: 15,
    backgroundColor: Colors.light.brand,
    borderRadius: 10,
    alignItems: "center",
  },
  backButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});