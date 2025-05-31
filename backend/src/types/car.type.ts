export interface Car {
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
  status: CarStatus;
  transmission: "automatic" | "manual";
  fuel: "petrol" | "diesel" | "electric" | "hybrid";
  category: "economy" | "compact" | "suv" | "luxury" | "electric" | "van";
  createdAt: Date;
  updatedAt: Date;
  details?: {
    [key: string]: any;
  };
  images?: string[];
}

export enum CarStatus {
  AVAILABLE = "AVAILABLE",
  RENTED = "RENTED",
  RESERVED = "RESERVED",
  MAINTENANCE = "MAINTENANCE",
}
