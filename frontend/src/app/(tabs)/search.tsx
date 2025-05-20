import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Stack } from "expo-router";
import { SPACING, RADIUS } from "@/src/constants/Spacing";
import { useTheme } from "@/src/context/ThemeContext";
import i18n from "@/src/i18n";

import SearchBar from "@/src/components/SearchBar";
import CarCard from "@/src/components/CarCard";
import FilterModal, { FilterOptions } from "@/src/components/FilterModal";
import SortModal, { SortOption } from "@/src/components/SortModal";
import { cars } from "@/src/data/mockData";
import { Car } from "@/src/data/mockData";

export default function Search() {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [isSortModalVisible, setIsSortModalVisible] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    carType: "all",
    priceRange: [0, 500],
    seats: null,
    transmission: "all",
    fuelType: "all",
  });
  const [sortOption, setSortOption] = useState<SortOption>("priceLowToHigh");
  const [isLoading, setIsLoading] = useState(false);

  // Filter and sort cars based on search query, filters, and sort option
  const filteredCars = useMemo(() => {
    // Simulate loading
    setIsLoading(true);
    
    let filtered = [...cars];

    // Apply search query filter
    if (searchQuery) {
      filtered = filtered.filter((car) =>
        car.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply car type filter
    if (filters.carType !== "all") {
      filtered = filtered.filter((car) => car.type === filters.carType);
    }

    // Apply seats filter
    if (filters.seats !== null) {
      filtered = filtered.filter((car) => car.seats === filters.seats);
    }

    // Apply transmission filter
    if (filters.transmission !== "all") {
      filtered = filtered.filter((car) => car.transmission === filters.transmission);
    }

    // Apply fuel type filter
    if (filters.fuelType !== "all") {
      filtered = filtered.filter((car) => car.fuelType === filters.fuelType);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortOption) {
        case "priceLowToHigh":
          return a.price - b.price;
        case "priceHighToLow":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "newest":
          // In a real app, we would sort by date added
          // For now, just use the id as a proxy for "newest"
          return parseInt(b.id) - parseInt(a.id);
        default:
          return 0;
      }
    });

    // Simulate API delay
    setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return filtered;
  }, [searchQuery, filters, sortOption]);

  const handleApplyFilters = (newFilters: FilterOptions) => {
    setFilters(newFilters);
  };

  const handleSelectSortOption = (option: SortOption) => {
    setSortOption(option);
  };

  const renderCarItem = ({ item }: { item: Car }) => (
    <View style={styles.carCardContainer}>
      <CarCard
        id={item.id}
        name={item.name}
        image={item.image}
        price={item.price}
        priceUnit={item.priceUnit}
        rating={item.rating}
        location={item.location}
        onPress={() => {}}
        featured={true}
      />
    </View>
  );

  return (
    <>
      <Stack.Screen options={{ title: "Search", headerShown: false }} />
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.bgBase }}>
        <View style={[styles.container, { backgroundColor: colors.bgBase }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.textHeading }]}>
              {i18n.t("search.title")}
            </Text>
          </View>

          <View style={styles.searchContainer}>
            <SearchBar
              placeholder={i18n.t("search.searchPlaceholder")}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <View style={styles.filterSortContainer}>
            <TouchableOpacity
              style={[styles.filterButton, { backgroundColor: colors.bgElevated }]}
              onPress={() => setIsFilterModalVisible(true)}
            >
              <Text style={[styles.filterButtonText, { color: colors.textBody }]}>
                {i18n.t("search.filter")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.sortButton, { backgroundColor: colors.bgElevated }]}
              onPress={() => setIsSortModalVisible(true)}
            >
              <Text style={[styles.sortButtonText, { color: colors.textBody }]}>
                {i18n.t("search.sort")}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.resultsContainer}>
            <Text style={[styles.resultsTitle, { color: colors.textMuted }]}>
              {filteredCars.length > 0
                ? `${i18n.t("search.allCars")} (${filteredCars.length})`
                : i18n.t("search.noResults")}
            </Text>

            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.brand} />
              </View>
            ) : (
              <FlatList
                data={filteredCars}
                keyExtractor={(item) => item.id}
                renderItem={renderCarItem}
                contentContainerStyle={styles.carsList}
                showsVerticalScrollIndicator={false}
                numColumns={1} // Ensure single column layout
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                      {i18n.t("search.noResults")}
                    </Text>
                  </View>
                }
              />
            )}
          </View>

          <FilterModal
            visible={isFilterModalVisible}
            onClose={() => setIsFilterModalVisible(false)}
            onApplyFilters={handleApplyFilters}
            initialFilters={filters}
          />

          <SortModal
            visible={isSortModalVisible}
            onClose={() => setIsSortModalVisible(false)}
            onSelectOption={handleSelectSortOption}
            selectedOption={sortOption}
          />
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: SPACING.sm, // Reduced horizontal padding to use more screen width
  },
  header: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Sora",
  },
  searchContainer: {
    marginBottom: SPACING.md,
    width: '100%', // Ensure search bar uses full width
  },
  filterSortContainer: {
    flexDirection: "row",
    marginBottom: SPACING.md,
    width: '100%', // Ensure buttons container uses full width
  },
  filterButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm, // Reduced horizontal padding
    borderRadius: RADIUS.md,
    marginRight: SPACING.xs, // Reduced margin between buttons
    alignItems: "center",
  },
  filterButtonText: {
    fontSize: 14,
    fontFamily: "Inter",
  },
  sortButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm, // Reduced horizontal padding
    borderRadius: RADIUS.md,
    marginLeft: SPACING.xs, // Reduced margin between buttons
    alignItems: "center",
  },
  sortButtonText: {
    fontSize: 14,
    fontFamily: "Inter",
  },
  resultsContainer: {
    flex: 1,
    width: '100%', // Ensure results container uses full width
  },
  resultsTitle: {
    fontSize: 16,
    marginBottom: SPACING.md,
    fontFamily: "Inter",
  },
  carsList: {
    paddingBottom: SPACING.xl,
    width: '100%', // Ensure list uses full width
  },
  carCardContainer: {
    marginBottom: SPACING.md,
    width: '100%', // Ensure each card container uses full width
    paddingHorizontal: 0, // Remove any horizontal padding
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: SPACING.xl * 2,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: "Inter",
  },
});