import React, { useState, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, FlatList, SafeAreaView, Image } from "react-native";
import { Stack } from "expo-router";

import { useAuth } from "@/src/context/AuthContext";
import { useTheme } from "@/src/context/ThemeContext";
import i18n from "@/src/i18n";
import { SPACING } from "@/src/constants/Spacing";

import SearchBar from "@/src/components/SearchBar";
import SectionHeader from "@/src/components/SectionHeader";
import CarCard from "@/src/components/CarCard";
import BookingCard from "@/src/components/BookingCard";
import SpecialOfferCard from "@/src/components/SpecialOfferCard";

import { cars, bookings, specialOffers } from "@/src/data/mockData";

export default function Index() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const styles = useMemo(() => createStyles(colors), [colors]);

  const featuredCar = cars.find(car => car.featured);
  const otherCars = cars.filter(car => !car.featured);

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
          <FlatList
            data={otherCars}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <CarCard
                id={item.id}
                name={item.name}
                image={item.image}
                price={item.price}
                priceUnit={item.priceUnit}
                rating={item.rating}
                location={item.location}
                onPress={() => {}}
              />
            )}
            contentContainerStyle={styles.carsList}
          />
        </View>

        {/* Recent Bookings Section */}
        <View style={styles.section}>
          <SectionHeader
            title={i18n.t("home.recentBookings")}
            actionText={bookings.length > 0 ? i18n.t("home.viewAll") : undefined}
            onActionPress={bookings.length > 0 ? () => {} : undefined}
          />
          {bookings.length > 0 ? (
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
});
