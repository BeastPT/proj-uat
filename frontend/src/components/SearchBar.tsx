import React from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Colors } from "@/src/constants/Colors";
import { SPACING, RADIUS } from "@/src/constants/Spacing";
import SearchIcon from "@/src/assets/svg/Magnifying-Glass.svg";

interface SearchBarProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder,
  value,
  onChangeText,
  onSubmit,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchIcon
          width={20}
          height={20}
          stroke={Colors.dark.textMuted}
          fill="none"
          style={styles.icon}
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={Colors.dark.textMuted}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmit}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.dark.bgElevated,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  icon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    color: Colors.dark.textBody,
    fontSize: 16,
    fontFamily: "Inter",
    padding: 0,
  },
});

export default SearchBar;