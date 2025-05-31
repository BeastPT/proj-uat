import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Image,
} from "react-native";
import { Stack } from "expo-router";
import { SPACING, RADIUS } from "@/src/constants/Spacing";
import { useTheme } from "@/src/context/ThemeContext";
import i18n from "@/src/i18n";

import SearchBar from "@/src/components/SearchBar";
import CarCard from "@/src/components/CarCard";
import FilterModal, { FilterOptions } from "@/src/components/FilterModal";
import SortModal, { SortOption } from "@/src/components/SortModal";
import { apiService } from "@/src/services/api.service";

// Default car image
const DEFAULT_CAR_IMAGE = require("@/src/assets/images/loadingCar.png");

// Define the Car interface based on the backend structure
interface Car {
  id: string;
  brand: string;
  model: string;
  year: number;
  color: string;
  kilometers: number;
  plate: string;
  price: number;
  description: string;
  seats: number;
  doors?: number;
  status: string;
  transmission: string;
  fuel: string;
  category: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

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
  const [isLoading, setIsLoading] = useState(true);
  const [cars, setCars] = useState<Car[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch cars from API
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setIsLoading(true);
        const carsData = await apiService.getCars();
        setCars(carsData);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch cars:", err);
        setError("Failed to load cars. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCars();
  }, []);

  // Filter and sort cars based on search query, filters, and sort option
  const filteredCars = useMemo(() => {
    if (!cars.length) return [];
    
    setIsLoading(true);
    
    let filtered = [...cars];

    // Apply search query filter (search by brand and model)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((car) =>
        `${car.brand} ${car.model}`.toLowerCase().includes(query)
      );
    }

    // Apply car type filter (category in the backend)
    if (filters.carType !== "all") {
      // Convert frontend filter to backend category format
      const categoryMap: Record<string, string> = {
        economy: "ECONOMY",
        luxury: "LUXURY",
        suv: "SUV",
        sports: "LUXURY", // Map sports to LUXURY as closest match
        electric: "ELECTRIC"
      };
      
      const backendCategory = categoryMap[filters.carType];
      if (backendCategory) {
        filtered = filtered.filter((car) => car.category === backendCategory);
      }
    }

    // Apply seats filter
    if (filters.seats !== null) {
      filtered = filtered.filter((car) => car.seats === filters.seats);
    }

    // Apply transmission filter
    if (filters.transmission !== "all") {
      // Convert frontend filter to backend transmission format
      const transmissionMap: Record<string, string> = {
        automatic: "AUTOMATIC",
        manual: "MANUAL"
      };
      
      const backendTransmission = transmissionMap[filters.transmission];
      if (backendTransmission) {
        filtered = filtered.filter((car) => car.transmission === backendTransmission);
      }
    }

    // Apply fuel type filter
    if (filters.fuelType !== "all") {
      // Convert frontend filter to backend fuel format
      const fuelMap: Record<string, string> = {
        gasoline: "PETROL",
        diesel: "DIESEL",
        electric: "ELECTRIC",
        hybrid: "HYBRID"
      };
      
      const backendFuel = fuelMap[filters.fuelType];
      if (backendFuel) {
        filtered = filtered.filter((car) => car.fuel === backendFuel);
      }
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortOption) {
        case "priceLowToHigh":
          return a.price - b.price;
        case "priceHighToLow":
          return b.price - a.price;
        case "newest":
          // Sort by creation date
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    // Simulate short delay for better UX
    setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return filtered;
  }, [searchQuery, filters, sortOption, cars]);

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
        name={`${item.brand} ${item.model}`}
        image={item.images && item.images.length > 0
          ? { uri: item.images[0] }
          : DEFAULT_CAR_IMAGE}
        price={item.price}
        priceUnit="day"
        location={`${item.year} • ${item.kilometers} km`}
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
            ) : error ? (
              <View style={styles.errorContainer}>
                <Text style={[styles.errorText, { color: colors.textMuted }]}>
                  {error}
                </Text>
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
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: SPACING.xl * 2,
  },
  errorText: {
    fontSize: 16,
    fontFamily: "Inter",
    textAlign: "center",
    paddingHorizontal: SPACING.lg,
  },
});