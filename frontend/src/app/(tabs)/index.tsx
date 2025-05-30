import React, { useState, useMemo, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, FlatList, SafeAreaView, Image, ActivityIndicator } from "react-native";
import { Stack } from "expo-router";

import { useAuth } from "@/src/context/AuthContext";
import { useTheme } from "@/src/context/ThemeContext";
import i18n from "@/src/i18n";
import { SPACING } from "@/src/constants/Spacing";
import { apiService } from "@/src/services/api.service";

import SearchBar from "@/src/components/SearchBar";
import SectionHeader from "@/src/components/SectionHeader";
import CarCard from "@/src/components/CarCard";
import BookingCard from "@/src/components/BookingCard";
import SpecialOfferCard from "@/src/components/SpecialOfferCard";

import { specialOffers } from "@/src/data/mockData";

export default function Index() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [cars, setCars] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingsError, setBookingsError] = useState<string | null>(null);
  const styles = useMemo(() => createStyles(colors), [colors]);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const carsData = await apiService.getCars();
        setCars(carsData);
        setError(null);
      } catch (err) {
        console.error('Error fetching cars:', err);
        setError('Failed to load cars. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const fetchUserBookings = async () => {
      try {
        setLoadingBookings(true);
        // Since there's no bookings API yet, we'll simulate a fetch
        // In the future, this would be replaced with an actual API call
        // For example: const bookingsData = await apiService.getUserBookings();
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For now, we'll set empty bookings to show the "no bookings" message
        setBookings([]);
        setBookingsError(null);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setBookingsError('Failed to load bookings. Please try again later.');
      } finally {
        setLoadingBookings(false);
      }
    };

    fetchCars();
    fetchUserBookings();
  }, []);

  // Find a featured car (first car for demo purposes)
  const featuredCar = cars.length > 0 ? cars[0] : null;
  // Rest of the cars
  const otherCars = cars.length > 0 ? cars.slice(1) : [];

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

        {/* <SearchBar
          placeholder={i18n.t("home.searchPlaceholder")}
          value={searchQuery}
          onChangeText={setSearchQuery}
        /> */}

        {/* Featured Car Section */}
        {/* {featuredCar && (
          <View style={styles.section}>
            <SectionHeader
              title={i18n.t("home.featuredCars")}
              actionText={i18n.t("home.viewAll")}
              onActionPress={() => {}}
            />
            <CarCard
              id={featuredCar.id}
              name={featuredCar.name}
              image={featuredCar.image}
              price={featuredCar.price}
              priceUnit={featuredCar.priceUnit}
              rating={featuredCar.rating}
              location={featuredCar.location}
              featured={true}
              onPress={() => {}}
            />
          </View>
        )} */}

        {/* Special Offers Section */}
        {/* <View style={styles.section}>
          <SectionHeader
            title={i18n.t("home.specialOffers")}
            actionText={i18n.t("home.viewAll")}
            onActionPress={() => {}}
          />
          {specialOffers.map(offer => (
            <SpecialOfferCard
              key={offer.id}
              id={offer.id}
              title={offer.title}
              description={offer.description}
              discount={offer.discount}
              backgroundImage={offer.backgroundImage}
              onPress={() => {}}
            />
          ))}
        </View> */}

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
              data={otherCars}
              keyExtractor={item => item.id}
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

        {/* Recent Bookings Section */}
        <View style={styles.section}>
          <SectionHeader
            title={i18n.t("home.recentBookings")}
            actionText={bookings.length > 0 ? i18n.t("home.viewAll") : undefined}
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
            bookings.map(booking => (
              <BookingCard
                key={booking.id}
                id={booking.id}
                carName={booking.carName}
                carImage={booking.carImage}
                startDate={booking.startDate}
                endDate={booking.endDate}
                status={booking.status}
                onPress={() => {}}
              />
            ))
          ) : (
            <View style={styles.emptyBookings}>
              <Text style={styles.emptyBookingsText}>{i18n.t("home.noBookings")}</Text>
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
const createStyles = (colors: any) => StyleSheet.create({
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
