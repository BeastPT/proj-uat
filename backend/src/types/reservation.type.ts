import { User } from "./user.type";
import { Car } from "./car.type";

export enum ReservationStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

export enum RentalPeriodStatus {
  NOT_STARTED = "NOT_STARTED",
  ACTIVE = "ACTIVE",
  ENDED = "ENDED",
}

export interface Reservation {
  id: string;
  userId: string;
  carId: string;
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  status: ReservationStatus;
  periodStatus?: RentalPeriodStatus;
  createdAt: Date;
  updatedAt: Date;
  
  // Relations
  user?: User;
  car?: Car;
}