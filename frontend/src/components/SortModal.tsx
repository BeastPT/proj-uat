import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from "react-native";
import { Colors } from "@/src/constants/Colors";
import { SPACING, RADIUS } from "@/src/constants/Spacing";
import i18n from "@/src/i18n";

export type SortOption = "priceLowToHigh" | "priceHighToLow" | "rating" | "newest";

interface SortModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectOption: (option: SortOption) => void;
  selectedOption: SortOption;
}

const SortModal: React.FC<SortModalProps> = ({
  visible,
  onClose,
  onSelectOption,
  selectedOption,
}) => {
  const sortOptions: SortOption[] = [
    "priceLowToHigh",
    "priceHighToLow",
    "rating",
    "newest",
  ];

  const handleSelect = (option: SortOption) => {
    onSelectOption(option);
    onClose();
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
            <Text style={styles.title}>{i18n.t("search.sort")}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.optionsContainer}>
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionItem,
                  selectedOption === option && styles.selectedOption,
                ]}
                onPress={() => handleSelect(option)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedOption === option && styles.selectedOptionText,
                  ]}
                >
                  {i18n.t(`search.sortOptions.${option}`)}
                </Text>
                {selectedOption === option && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
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
  optionsContainer: {
    paddingHorizontal: SPACING.lg,
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.bgElevated,
  },
  selectedOption: {
    backgroundColor: Colors.dark.bgSection,
  },
  optionText: {
    color: Colors.dark.textBody,
    fontSize: 16,
    fontFamily: "Inter",
  },
  selectedOptionText: {
    color: Colors.dark.brand,
    fontWeight: "bold",
  },
  checkmark: {
    color: Colors.dark.brand,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default SortModal;