import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { apiService } from "@/src/services/api.service";
import { Colors } from "@/src/constants/Colors";

// Car type definition based on the schema
type Car = {
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
  status: "AVAILABLE" | "RENTED" | "RESERVED" | "MAINTENANCE";
  transmission: "AUTOMATIC" | "MANUAL";
  fuel: "PETROL" | "DIESEL" | "ELECTRIC" | "HYBRID";
  category: "ECONOMY" | "COMPACT" | "SUV" | "LUXURY" | "ELECTRIC" | "VAN";
  images: string[];
  createdAt: string;
  updatedAt: string;
};

export default function ManageCarsScreen() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    brand: "",
    model: "",
    year: "",
    color: "",
    kilometers: "",
    plate: "",
    price: "",
    description: "",
    seats: "",
    doors: "",
    status: "AVAILABLE",
    transmission: "AUTOMATIC",
    fuel: "PETROL",
    category: "ECONOMY",
    images: ["https://via.placeholder.com/300x200"],
  });

  useEffect(() => {
    fetchCars();
  }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const carsData = await apiService.getCars();
      setCars(carsData);
    } catch (error: any) {
      console.error("Error fetching cars:", error);
      const errorMessage = error.response?.data?.error || "Failed to load cars";
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCar = () => {
    setIsEditing(false);
    setSelectedCar(null);
    setFormData({
      brand: "",
      model: "",
      year: "",
      color: "",
      kilometers: "",
      plate: "",
      price: "",
      description: "",
      seats: "",
      doors: "",
      status: "AVAILABLE",
      transmission: "AUTOMATIC",
      fuel: "PETROL",
      category: "ECONOMY",
      images: ["https://via.placeholder.com/300x200"],
    });
    setModalVisible(true);
  };

  const handleEditCar = (car: Car) => {
    setIsEditing(true);
    setSelectedCar(car);
    setFormData({
      brand: car.brand,
      model: car.model,
      year: car.year.toString(),
      color: car.color,
      kilometers: car.kilometers.toString(),
      plate: car.plate,
      price: car.price.toString(),
      description: car.description,
      seats: car.seats.toString(),
      doors: car.doors?.toString() || "",
      status: car.status,
      transmission: car.transmission,
      fuel: car.fuel,
      category: car.category,
      images: car.images,
    });
    setModalVisible(true);
  };

  const handleDeleteCar = (carId: string) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this car?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await apiService.deleteCar(carId);
              setCars(cars.filter(car => car.id !== carId));
              Alert.alert("Success", "Car deleted successfully");
            } catch (error: any) {
              console.error("Error deleting car:", error);
              const errorMessage = error.response?.data?.error || "Failed to delete car";
              Alert.alert("Error", errorMessage);
            }
          },
        },
      ]
    );
  };

  const handleSubmitForm = async () => {
    try {
      // Validate form data
      if (
        !formData.brand ||
        !formData.model ||
        !formData.year ||
        !formData.color ||
        !formData.kilometers ||
        !formData.plate ||
        !formData.price ||
        !formData.seats
      ) {
        Alert.alert("Error", "Please fill in all required fields");
        return;
      }

      // Convert string values to appropriate types
      const carData = {
        ...formData,
        year: parseInt(formData.year),
        kilometers: parseInt(formData.kilometers),
        price: parseFloat(formData.price),
        seats: parseInt(formData.seats),
        doors: formData.doors ? parseInt(formData.doors) : undefined,
      };

      if (isEditing && selectedCar) {
        try {
          const updatedCar = await apiService.updateCar(selectedCar.id, carData);
          
          // Update local state with the response from the server
          setCars(
            cars.map((car) =>
              car.id === selectedCar.id
                ? updatedCar
                : car
            )
          );
          Alert.alert("Success", "Car updated successfully");
        } catch (error: any) {
          console.error("Error updating car:", error);
          const errorMessage = error.response?.data?.error || "Failed to update car";
          Alert.alert("Error", errorMessage);
          return;
        }
      } else {
        try {
          const newCar = await apiService.createCar(carData);
          
          // Add the new car from the server response to local state
          setCars([...cars, newCar]);
          Alert.alert("Success", "Car added successfully");
        } catch (error: any) {
          console.error("Error creating car:", error);
          const errorMessage = error.response?.data?.error || "Failed to create car";
          Alert.alert("Error", errorMessage);
          return;
        }
      }

      setModalVisible(false);
    } catch (error) {
      console.error("Error submitting form:", error);
      Alert.alert("Error", "Failed to save car. Please try again.");
    }
  };

  const renderCarItem = ({ item }: { item: Car }) => (
    <View style={styles.carCard}>
      <View style={styles.carImageContainer}>
        {item.images && item.images.length > 0 ? (
          <Image
            source={{ uri: item.images[0] }}
            style={styles.carImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.noImagePlaceholder}>
            <Text style={styles.noImageText}>No Image</Text>
          </View>
        )}
      </View>
      <View style={styles.carDetails}>
        <Text style={styles.carTitle}>{item.brand} {item.model}</Text>
        <Text style={styles.carInfo}>Year: {item.year}</Text>
        <Text style={styles.carInfo}>Price: ${item.price}/day</Text>
        <Text style={styles.carInfo}>Status: {item.status}</Text>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => handleEditCar(item)}
          >
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDeleteCar(item.id)}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderFormField = (
    label: string,
    key: keyof typeof formData,
    placeholder: string,
    keyboardType: "default" | "numeric" = "default"
  ) => (
    <View style={styles.formField}>
      <Text style={styles.formLabel}>{label}</Text>
      <TextInput
        style={styles.formInput}
        value={formData[key].toString()}
        onChangeText={(text) => setFormData({ ...formData, [key]: text })}
        placeholder={placeholder}
        keyboardType={keyboardType}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Cars</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddCar}
        >
          <Text style={styles.addButtonText}>+ Add Car</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.light.brand} />
          <Text style={styles.loadingText}>Loading cars...</Text>
        </View>
      ) : (
        <FlatList
          data={cars}
          renderItem={renderCarItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.carsList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No cars found</Text>
              <TouchableOpacity
                style={styles.refreshButton}
                onPress={fetchCars}
              >
                <Text style={styles.refreshButtonText}>Refresh</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {isEditing ? "Edit Car" : "Add New Car"}
            </Text>
            
            <ScrollView style={styles.formContainer}>
              {renderFormField("Brand", "brand", "Enter brand")}
              {renderFormField("Model", "model", "Enter model")}
              {renderFormField("Year", "year", "Enter year", "numeric")}
              {renderFormField("Color", "color", "Enter color")}
              {renderFormField("Kilometers", "kilometers", "Enter kilometers", "numeric")}
              {renderFormField("License Plate", "plate", "Enter license plate")}
              {renderFormField("Price per day", "price", "Enter price", "numeric")}
              {renderFormField("Description", "description", "Enter description")}
              {renderFormField("Seats", "seats", "Enter number of seats", "numeric")}
              {renderFormField("Doors", "doors", "Enter number of doors (optional)", "numeric")}
              
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Status</Text>
                <View style={styles.pickerContainer}>
                  {["AVAILABLE", "RENTED", "RESERVED", "MAINTENANCE"].map((status) => (
                    <TouchableOpacity
                      key={status}
                      style={[
                        styles.pickerOption,
                        formData.status === status && styles.pickerOptionSelected,
                      ]}
                      onPress={() => setFormData({ ...formData, status })}
                    >
                      <Text
                        style={[
                          styles.pickerOptionText,
                          formData.status === status && styles.pickerOptionTextSelected,
                        ]}
                      >
                        {status}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Transmission</Text>
                <View style={styles.pickerContainer}>
                  {["AUTOMATIC", "MANUAL"].map((transmission) => (
                    <TouchableOpacity
                      key={transmission}
                      style={[
                        styles.pickerOption,
                        formData.transmission === transmission && styles.pickerOptionSelected,
                      ]}
                      onPress={() => setFormData({ ...formData, transmission })}
                    >
                      <Text
                        style={[
                          styles.pickerOptionText,
                          formData.transmission === transmission && styles.pickerOptionTextSelected,
                        ]}
                      >
                        {transmission}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Fuel Type</Text>
                <View style={styles.pickerContainer}>
                  {["PETROL", "DIESEL", "ELECTRIC", "HYBRID"].map((fuel) => (
                    <TouchableOpacity
                      key={fuel}
                      style={[
                        styles.pickerOption,
                        formData.fuel === fuel && styles.pickerOptionSelected,
                      ]}
                      onPress={() => setFormData({ ...formData, fuel })}
                    >
                      <Text
                        style={[
                          styles.pickerOptionText,
                          formData.fuel === fuel && styles.pickerOptionTextSelected,
                        ]}
                      >
                        {fuel}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Category</Text>
                <View style={styles.pickerContainer}>
                  {["ECONOMY", "COMPACT", "SUV", "LUXURY", "ELECTRIC", "VAN"].map((category) => (
                    <TouchableOpacity
                      key={category}
                      style={[
                        styles.pickerOption,
                        formData.category === category && styles.pickerOptionSelected,
                      ]}
                      onPress={() => setFormData({ ...formData, category })}
                    >
                      <Text
                        style={[
                          styles.pickerOptionText,
                          formData.category === category && styles.pickerOptionTextSelected,
                        ]}
                      >
                        {category}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.formField}>
                <Text style={styles.formLabel}>Image URL</Text>
                <TextInput
                  style={styles.formInput}
                  value={formData.images[0]}
                  onChangeText={(text) => setFormData({ ...formData, images: [text] })}
                  placeholder="Enter image URL"
                />
              </View>
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.saveButton]}
                onPress={handleSubmitForm}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.light.brand,
    padding: 15,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    color: "white",
    fontSize: 16,
  },
  addButton: {
    backgroundColor: "white",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  addButtonText: {
    color: Colors.light.brand,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  carsList: {
    padding: 15,
  },
  carCard: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 15,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  carImageContainer: {
    width: 120,
    height: 120,
  },
  carImage: {
    width: "100%",
    height: "100%",
  },
  noImagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  noImageText: {
    color: "#999",
  },
  carDetails: {
    flex: 1,
    padding: 10,
  },
  carTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  carInfo: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  actionButtons: {
    flexDirection: "row",
    marginTop: 10,
  },
  actionButton: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 5,
    marginRight: 10,
  },
  editButton: {
    backgroundColor: Colors.light.brand,
  },
  deleteButton: {
    backgroundColor: "#ff4d4d",
  },
  buttonText: {
    color: "white",
    fontWeight: "500",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    marginBottom: 10,
  },
  refreshButton: {
    backgroundColor: Colors.light.brand,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  refreshButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  formContainer: {
    maxHeight: 500,
  },
  formField: {
    marginBottom: 15,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 5,
    color: "#333",
  },
  formInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    fontSize: 14,
  },
  pickerContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  pickerOption: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  pickerOptionSelected: {
    backgroundColor: Colors.light.brand,
    borderColor: Colors.light.brand,
  },
  pickerOptionText: {
    fontSize: 12,
    color: "#333",
  },
  pickerOptionTextSelected: {
    color: "white",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
    marginRight: 10,
  },
  cancelButtonText: {
    color: "#333",
    fontWeight: "500",
  },
  saveButton: {
    backgroundColor: Colors.light.brand,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "500",
  },
});