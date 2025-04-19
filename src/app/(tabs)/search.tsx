import { View, Text, StyleSheet, TextInput } from "react-native";
import { Stack } from "expo-router";

export default function Search() {
  return (
    <>
      <Stack.Screen options={{ title: "Search", headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Search</Text>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              placeholderTextColor="#666"
            />
          </View>
          <View style={styles.resultsContainer}>
            <Text style={styles.sectionTitle}>Recent Searches</Text>
            {[1, 2, 3].map((item) => (
              <View key={item} style={styles.resultItem}>
                <View style={styles.resultIcon} />
                <View style={styles.resultInfo}>
                  <Text style={styles.resultTitle}>Search Result {item}</Text>
                  <Text style={styles.resultDescription}>
                    Brief description about this search result
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#09090B",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 40,
    marginBottom: 20,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: "#1A1A1D",
    borderRadius: 8,
    color: "#fff",
    fontSize: 16,
    padding: 12,
  },
  resultsContainer: {
    flex: 1,
  },
  sectionTitle: {
    color: "#999",
    fontSize: 16,
    marginBottom: 12,
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1D",
    borderRadius: 8,
    marginBottom: 12,
    padding: 16,
  },
  resultIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#333",
    marginRight: 12,
  },
  resultInfo: {
    flex: 1,
  },
  resultTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  resultDescription: {
    color: "#999",
    fontSize: 14,
  },
});