import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from "react-native";
import { SPACING, RADIUS } from "@/src/constants/Spacing";
import { useTheme } from "@/src/context/ThemeContext";
import i18n from "@/src/i18n";

export type SortOption = "priceLowToHigh" | "priceHighToLow" | "rating" | "newest" | "nearest";

interface SortModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectOption: (option: SortOption) => void;
  selectedOption: SortOption;
  showNearestOption?: boolean;
}

const SortModal: React.FC<SortModalProps> = ({
  visible,
  onClose,
  onSelectOption,
  selectedOption,
  showNearestOption = false,
}) => {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  
  // Include "nearest" option only if showNearestOption is true
  const sortOptions: SortOption[] = useMemo(() => {
    const options: SortOption[] = [
      "priceLowToHigh",
      "priceHighToLow",
      "rating",
      "newest",
    ];
    
    if (showNearestOption) {
      options.unshift("nearest");
    }
    
    return options;
  }, [showNearestOption]);

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

// Create styles function that takes colors as a parameter
const createStyles = (colors: any) => StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.bgBase,
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
    color: colors.textHeading,
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Sora",
  },
  closeButton: {
    color: colors.textMuted,
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
    borderBottomColor: colors.bgElevated,
  },
  selectedOption: {
    backgroundColor: colors.bgSection,
  },
  optionText: {
    color: colors.textBody,
    fontSize: 16,
    fontFamily: "Inter",
  },
  selectedOptionText: {
    color: colors.brand,
    fontWeight: "bold",
  },
  checkmark: {
    color: colors.brand,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default SortModal;