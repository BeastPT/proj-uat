import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Colors } from "@/src/constants/Colors";
import { SPACING, RADIUS } from "@/src/constants/Spacing";
import i18n from "@/src/i18n";

type CarType = "all" | "economy" | "luxury" | "suv" | "sports";
type Transmission = "all" | "automatic" | "manual";
type FuelType = "all" | "gasoline" | "diesel" | "electric" | "hybrid";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
  initialFilters: FilterOptions;
}

export interface FilterOptions {
  carType: CarType;
  priceRange: [number, number];
  seats: number | null;
  transmission: Transmission;
  fuelType: FuelType;
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApplyFilters,
  initialFilters,
}) => {
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);

  const handleReset = () => {
    setFilters({
      carType: "all",
      priceRange: [0, 500],
      seats: null,
      transmission: "all",
      fuelType: "all",
    });
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const setCarType = (type: CarType) => {
    setFilters({ ...filters, carType: type });
  };

  const setTransmission = (transmission: Transmission) => {
    setFilters({ ...filters, transmission });
  };

  const setFuelType = (fuelType: FuelType) => {
    setFilters({ ...filters, fuelType });
  };

  const setSeats = (seats: number | null) => {
    setFilters({ ...filters, seats });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>{i18n.t("search.filters.title")}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scrollView}>
            {/* Car Type Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>{i18n.t("search.filters.carType")}</Text>
              <View style={styles.optionsRow}>
                {["all", "economy", "luxury", "suv", "sports"].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.optionButton,
                      filters.carType === type && styles.selectedOption,
                    ]}
                    onPress={() => setCarType(type as CarType)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        filters.carType === type && styles.selectedOptionText,
                      ]}
                    >
                      {i18n.t(`search.carTypes.${type}`)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Seats Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>{i18n.t("search.filters.seats")}</Text>
              <View style={styles.optionsRow}>
                {[null, 2, 4, 5, 7].map((seatOption) => (
                  <TouchableOpacity
                    key={seatOption === null ? "any" : seatOption.toString()}
                    style={[
                      styles.optionButton,
                      filters.seats === seatOption && styles.selectedOption,
                    ]}
                    onPress={() => setSeats(seatOption)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        filters.seats === seatOption && styles.selectedOptionText,
                      ]}
                    >
                      {seatOption === null ? i18n.t("search.carTypes.all") : seatOption}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Transmission Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>{i18n.t("search.filters.transmission")}</Text>
              <View style={styles.optionsRow}>
                {["all", "automatic", "manual"].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.optionButton,
                      filters.transmission === type && styles.selectedOption,
                    ]}
                    onPress={() => setTransmission(type as Transmission)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        filters.transmission === type && styles.selectedOptionText,
                      ]}
                    >
                      {type === "all" 
                        ? i18n.t("search.carTypes.all") 
                        : type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Fuel Type Filter */}
            <View style={styles.filterSection}>
              <Text style={styles.filterTitle}>{i18n.t("search.filters.fuelType")}</Text>
              <View style={styles.optionsRow}>
                {["all", "gasoline", "diesel", "electric", "hybrid"].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.optionButton,
                      filters.fuelType === type && styles.selectedOption,
                    ]}
                    onPress={() => setFuelType(type as FuelType)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        filters.fuelType === type && styles.selectedOptionText,
                      ]}
                    >
                      {type === "all" 
                        ? i18n.t("search.carTypes.all") 
                        : type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
              <Text style={styles.resetButtonText}>{i18n.t("search.filters.reset")}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>{i18n.t("search.filters.apply")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: Colors.dark.bgBase,
    borderTopLeftRadius: RADIUS.xl,
    borderTopRightRadius: RADIUS.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
    height: "80%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
  },
  title: {
    color: Colors.dark.textHeading,
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Sora",
  },
  closeButton: {
    color: Colors.dark.textMuted,
    fontSize: 20,
    padding: SPACING.sm,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  filterSection: {
    marginBottom: SPACING.xl,
  },
  filterTitle: {
    color: Colors.dark.textBody,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: SPACING.md,
    fontFamily: "Inter",
  },
  optionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -SPACING.xs,
  },
  optionButton: {
    backgroundColor: Colors.dark.bgElevated,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: RADIUS.md,
    marginRight: SPACING.xs,
    marginBottom: SPACING.xs,
    borderWidth: 1,
    borderColor: "transparent",
  },
  selectedOption: {
    borderColor: Colors.dark.brand,
    backgroundColor: Colors.dark.bgSection,
  },
  optionText: {
    color: Colors.dark.textBody,
    fontSize: 14,
    fontFamily: "Inter",
  },
  selectedOptionText: {
    color: Colors.dark.brand,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: Colors.dark.bgElevated,
  },
  resetButton: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: Colors.dark.brand,
  },
  resetButtonText: {
    color: Colors.dark.brand,
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Sora",
  },
  applyButton: {
    backgroundColor: Colors.dark.brand,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.md,
  },
  applyButtonText: {
    color: Colors.dark.textInvert,
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "Sora",
  },
});

export default FilterModal;