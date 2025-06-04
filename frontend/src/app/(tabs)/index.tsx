import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Stack } from "expo-router";

import { useAuth } from "@/src/context/AuthContext";
import { useTheme } from "@/src/context/ThemeContext";
import i18n from "@/src/i18n";
import { SPACING } from "@/src/constants/Spacing";
import { apiService } from "@/src/services/api.service";

import SectionHeader from "@/src/components/SectionHeader";
import CarCard from "@/src/components/CarCard";
import BookingCard from "@/src/components/BookingCard";

export default function Index() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const [cars, setCars] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [activeBookings, setActiveBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingsError, setBookingsError] = useState<string | null>(null);
  const styles = useMemo(() => createStyles(colors), [colors]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const carsData = await apiService.getAvailableCars();
        setCars(carsData);
        setError(null);
      } catch (err) {
        setError("Failed to load cars. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const fetchUserBookings = async () => {
      try {
        setLoadingBookings(true);
        const reservationsData = await apiService.getUserReservations();

        if (
          !reservationsData ||
          !Array.isArray(reservationsData) ||
          reservationsData.length === 0
        ) {
          setBookings([]);
          setActiveBookings([]);
          setBookingsError(null);
          setLoadingBookings(false);
          return;
        }

        // Transform reservation data to match BookingCard props
        console.log("Raw reservation data:", JSON.stringify(reservationsData));

        // Identify reservations with missing car data
        const reservationsWithMissingCarData = reservationsData.filter(
          (reservation: any) =>
            reservation &&
            reservation.carId &&
            (!reservation.car || !reservation.car.brand || !reservation.car.model)
        );

        // Fetch missing car data
        if (reservationsWithMissingCarData.length > 0) {
          console.log(`Fetching details for ${reservationsWithMissingCarData.length} cars with missing data`);
          
          try {
            // Fetch car details for each reservation with missing car data
            const carDetailsPromises = reservationsWithMissingCarData.map(
              (reservation: any) => apiService.getCarById(reservation.carId)
            );
            
            const carDetails = await Promise.all(carDetailsPromises);
            
            // Update reservations with fetched car data
            reservationsWithMissingCarData.forEach((reservation: any, index: number) => {
              const carData = carDetails[index];
              if (carData) {
                reservation.car = carData;
                console.log(`Updated car data for reservation ${reservation.id}: ${carData.brand} ${carData.model}`);
              }
            });
          } catch (carFetchError) {
            console.error("Error fetching car details:", carFetchError);
          }
        }

        const formattedBookings = reservationsData
          .filter((reservation: any) => reservation && reservation.carId) // Filter out reservations without car data
          .map((reservation: any) => {
            // Format dates
            const startDate = new Date(
              reservation.startDate
            ).toLocaleDateString();
            const endDate = new Date(reservation.endDate).toLocaleDateString();

            console.log(
              `Reservation ID: ${reservation.id}, Status: ${reservation.status}`
            );

            // Map reservation status to booking status
            let status: "active" | "completed" | "cancelled";
            switch (reservation.status) {
              case "CONFIRMED":
                status = "active";
                break;
              case "PENDING":
                status = "active"; // Also set PENDING as active
                break;
              case "COMPLETED":
                status = "completed";
                break;
              case "CANCELLED":
                status = "cancelled";
                break;
              default:
                status = "active";
            }

            // Handle case where car data might still be missing after fetch attempt
            let carName = "Unknown Car";
            if (reservation.car && reservation.car.brand && reservation.car.model) {
              carName = `${reservation.car.brand} ${reservation.car.model}`;
            }

            return {
              id: reservation.id,
              carName: carName,
              carImage: require("@/src/assets/images/loadingCar.png"), // Default image
              startDate,
              endDate,
              status,
              rawStatus: reservation.status,
              isPending: reservation.status === "PENDING",
            };
          });

        // Filter active bookings (CONFIRMED or PENDING status)
        const active = formattedBookings.filter(
          booking => booking.status === "active"
        );

        // Filter recent bookings (COMPLETED or CANCELLED status)
        const recent = formattedBookings.filter(
          booking => booking.status === "completed" || booking.status === "cancelled"
        );

        console.log(`Total bookings: ${formattedBookings.length}, Active bookings: ${active.length}, Recent bookings: ${recent.length}`);
        
        setActiveBookings(active);
        setBookings(recent); // Set bookings to only completed or cancelled reservations

        setBookingsError(null);
      } catch (err) {
        console.error("Error fetching reservations:", err);
        setBookingsError("Failed to load bookings. Please try again later.");
        setBookings([]);
        setActiveBookings([]);
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchCars();
    fetchUserBookings();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ title: "Home", headerShown: false }} />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>{i18n.t("home.welcome")}</Text>
            <Text style={styles.userName}>{user?.name}</Text>
          </View>
          <View style={styles.profileImageContainer}>
            {/* This would be a user profile image in a real app */}
            <View style={styles.profileImagePlaceholder}>
              <Text style={styles.profileInitial}>{user?.name.charAt(0)}</Text>
            </View>
          </View>
        </View>

        {/* Available Cars Section */}
        <View style={styles.section}>
          <SectionHeader
            title={i18n.t("home.availableCars")}
            actionText={i18n.t("home.viewAll")}
            onActionPress={() => {}}
          />

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.brand} />
              <Text style={styles.loadingText}>Loading cars...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : (
            <FlatList
              data={cars}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <CarCard
                  id={item.id}
                  name={`${item.brand} ${item.model}`}
                  // Use a local image as fallback if no images available
                  image={require("@/src/assets/images/loadingCar.png")}
                  price={item.price}
                  priceUnit="day"
                  rating={4.5} // Default rating since backend doesn't provide it
                  location={item.category} // Use category as location for now
                  onPress={() => {}}
                />
              )}
              contentContainerStyle={styles.carsList}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No cars available</Text>
                </View>
              }
            />
          )}
        </View>

        {/* Active Reservations Section */}
        <View style={styles.section}>
          <SectionHeader
            title={i18n.t("home.activeReservations") || "Active Reservations"}
            actionText={
              activeBookings.length > 0 ? i18n.t("home.viewAll") : undefined
            }
            onActionPress={activeBookings.length > 0 ? () => {} : undefined}
          />

          {loadingBookings ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.brand} />
              <Text style={styles.loadingText}>Loading reservations...</Text>
            </View>
          ) : bookingsError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{bookingsError}</Text>
            </View>
          ) : activeBookings.length > 0 ? (
            activeBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                id={booking.id}
                carName={booking.carName}
                carImage={booking.carImage}
                startDate={booking.startDate}
                endDate={booking.endDate}
                status={booking.status}
                isPending={booking.isPending}
                onPress={() => {}}
              />
            ))
          ) : (
            <View style={styles.emptyBookings}>
              <Text style={styles.emptyBookingsText}>
                {i18n.t("home.noActiveReservations") ||
                  "No active reservations"}
              </Text>
            </View>
          )}
        </View>

        {/* Recent Bookings Section */}
        <View style={styles.section}>
          <SectionHeader
            title={i18n.t("home.recentBookings") || "Recent Bookings"}
            actionText={
              bookings.length > 0 ? i18n.t("home.viewAll") : undefined
            }
            onActionPress={bookings.length > 0 ? () => {} : undefined}
          />

          {loadingBookings ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.brand} />
              <Text style={styles.loadingText}>Loading bookings...</Text>
            </View>
          ) : bookingsError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{bookingsError}</Text>
            </View>
          ) : bookings.length > 0 ? (
            bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                id={booking.id}
                carName={booking.carName}
                carImage={booking.carImage}
                startDate={booking.startDate}
                endDate={booking.endDate}
                status={booking.status}
                isPending={booking.isPending}
                onPress={() => {}}
              />
            ))
          ) : (
            <View style={styles.emptyBookings}>
              <Text style={styles.emptyBookingsText}>
                {i18n.t("home.noBookings")}
              </Text>
            </View>
          )}
        </View>

        {/* Bottom padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Create styles function that takes colors as a parameter
const createStyles = (colors: any) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.bgBase,
    },
    container: {
      flex: 1,
      backgroundColor: colors.bgBase,
      paddingHorizontal: SPACING.md,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: SPACING.xl,
      marginBottom: SPACING.lg,
    },
    welcomeText: {
      color: colors.textMuted,
      fontSize: 14,
      marginBottom: SPACING.xs,
      fontFamily: "Inter",
    },
    userName: {
      color: colors.textHeading,
      fontSize: 20,
      fontWeight: "bold",
      fontFamily: "Sora",
    },
    profileImageContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      overflow: "hidden",
    },
    profileImagePlaceholder: {
      width: "100%",
      height: "100%",
      backgroundColor: colors.brand,
      justifyContent: "center",
      alignItems: "center",
    },
    profileInitial: {
      color: colors.textHeading,
      fontSize: 18,
      fontWeight: "bold",
    },
    section: {
      marginBottom: SPACING.xl,
    },
    carsList: {
      paddingRight: SPACING.md,
    },
    emptyBookings: {
      backgroundColor: colors.bgElevated,
      padding: SPACING.lg,
      borderRadius: 8,
      alignItems: "center",
    },
    emptyBookingsText: {
      color: colors.textMuted,
      fontSize: 14,
      fontFamily: "Inter",
    },
    bottomPadding: {
      height: SPACING.xl,
    },
    loadingContainer: {
      padding: SPACING.lg,
      alignItems: "center",
      justifyContent: "center",
    },
    loadingText: {
      color: colors.textMuted,
      fontSize: 14,
      marginTop: SPACING.sm,
      fontFamily: "Inter",
    },
    errorContainer: {
      backgroundColor: colors.bgElevated,
      padding: SPACING.lg,
      borderRadius: 8,
      alignItems: "center",
    },
    errorText: {
      color: "red",
      fontSize: 14,
      fontFamily: "Inter",
    },
    emptyContainer: {
      width: 220,
      backgroundColor: colors.bgElevated,
      padding: SPACING.lg,
      borderRadius: 8,
      alignItems: "center",
      justifyContent: "center",
      height: 150,
    },
    emptyText: {
      color: colors.textMuted,
      fontSize: 14,
      fontFamily: "Inter",
    },
  });
