import { ImageSourcePropType } from "react-native";

// Using local image for all car types
const CAR_IMAGE = require("@/src/assets/images/loadingCar.png") as ImageSourcePropType;

export interface Car {
  id: string;
  name: string;
  image: ImageSourcePropType;
  price: number;
  priceUnit: string;
  rating: number;
  location: string;
  featured?: boolean;
  type: "economy" | "luxury" | "suv" | "sports";
  seats: number;
  transmission: "automatic" | "manual";
  fuelType: "gasoline" | "diesel" | "electric" | "hybrid";
}

export interface Booking {
  id: string;
  carId: string;
  carName: string;
  carImage: ImageSourcePropType;
  startDate: string;
  endDate: string;
  status: "active" | "completed" | "cancelled";
  totalPrice: number;
}

export interface SpecialOffer {
  id: string;
  title: string;
  description: string;
  discount: string;
  backgroundImage: ImageSourcePropType;
  validUntil: string;
}

export const cars: Car[] = [
  {
    id: "1",
    name: "Toyota Camry",
    image: CAR_IMAGE,
    price: 45,
    priceUnit: "day",
    rating: 4.8,
    location: "New York City",
    featured: true,
    type: "economy",
    seats: 5,
    transmission: "automatic",
    fuelType: "gasoline",
  },
  {
    id: "2",
    name: "Mercedes-Benz S-Class",
    image: CAR_IMAGE,
    price: 120,
    priceUnit: "day",
    rating: 4.9,
    location: "Los Angeles",
    type: "luxury",
    seats: 5,
    transmission: "automatic",
    fuelType: "gasoline",
  },
  {
    id: "3",
    name: "BMW X5",
    image: CAR_IMAGE,
    price: 95,
    priceUnit: "day",
    rating: 4.7,
    location: "Chicago",
    type: "suv",
    seats: 7,
    transmission: "automatic",
    fuelType: "diesel",
  },
  {
    id: "4",
    name: "Porsche 911",
    image: CAR_IMAGE,
    price: 180,
    priceUnit: "day",
    rating: 4.9,
    location: "Miami",
    type: "sports",
    seats: 2,
    transmission: "automatic",
    fuelType: "gasoline",
  },
  {
    id: "5",
    name: "Honda Civic",
    image: CAR_IMAGE,
    price: 35,
    priceUnit: "day",
    rating: 4.6,
    location: "San Francisco",
    type: "economy",
    seats: 5,
    transmission: "automatic",
    fuelType: "gasoline",
  },
];

export const bookings: Booking[] = [
  {
    id: "1",
    carId: "2",
    carName: "Mercedes-Benz S-Class",
    carImage: CAR_IMAGE,
    startDate: "May 15, 2025",
    endDate: "May 20, 2025",
    status: "active",
    totalPrice: 600,
  },
  {
    id: "2",
    carId: "4",
    carName: "Porsche 911",
    carImage: CAR_IMAGE,
    startDate: "Apr 10, 2025",
    endDate: "Apr 12, 2025",
    status: "completed",
    totalPrice: 360,
  },
];

export const specialOffers: SpecialOffer[] = [
  {
    id: "1",
    title: "Weekend Special",
    description: "Get special rates on weekend rentals",
    discount: "20% OFF",
    backgroundImage: CAR_IMAGE,
    validUntil: "June 30, 2025",
  },
  {
    id: "2",
    title: "Summer Holiday Deal",
    description: "Long-term rentals at discounted prices",
    discount: "15% OFF",
    backgroundImage: CAR_IMAGE,
    validUntil: "August 31, 2025",
  },
];