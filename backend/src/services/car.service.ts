import { prisma } from "@/config/db.config";
import { z } from "zod";
import { createCarSchema, updateCarSchema, locationSchema } from "@/schemas/car.schema";
import { ReservationStatus, RentalPeriodStatus } from "@/types/reservation.type";
import { CarStatus, Location } from "@/types/car.type";
import { createErrorResponse, removeUndefined } from "@/utils/common.utils";

const CarSelect = {
  id: true,
  brand: true,
  model: true,
  year: true,
  color: true,
  kilometers: true,
  plate: true,
  price: true,
  description: true,
  seats: true,
  doors: true,
  status: true,
  transmission: true,
  fuel: true,
  category: true,
  location: true,
  images: true,
  createdAt: true,
  updatedAt: true,
};

export class CarService {
  /**
   * Get all cars
   */
  async getAllCars() {
    return prisma.car.findMany({
      select: CarSelect,
    });
  }

  /**
   * Check and update cars with ended reservations
   */
  private async updateCarsWithEndedReservations() {
    const currentDate = new Date();
    
    // Find all active reservations that have ended
    const endedReservations = await prisma.reservation.findMany({
      where: {
        endDate: {
          lt: currentDate
        },
        status: {
          in: ['CONFIRMED', 'PENDING']
        }
      },
      select: {
        id: true,
        carId: true
      }
    });
    
    // Update the status of these reservations and their cars
    for (const reservation of endedReservations) {
      try {
        await prisma.$transaction([
          // Update reservation status to COMPLETED
          prisma.reservation.update({
            where: { id: reservation.id },
            data: {
              status: ReservationStatus.COMPLETED,
              periodStatus: RentalPeriodStatus.ENDED
            }
          }),
          
          // Update car status to AVAILABLE
          prisma.car.update({
            where: { id: reservation.carId },
            data: { status: CarStatus.AVAILABLE }
          })
        ]);
      } catch (error) {
        // Log the error but continue processing other reservations
        console.error(`Failed to update reservation ${reservation.id}:`, error);
      }
    }
  }

  /**
   * Get all available cars
   */
  async getAvailableCars() {
    // First update any cars with ended reservations
    await this.updateCarsWithEndedReservations();
    
    // Then get all available cars
    return prisma.car.findMany({
      where: {
        status: "AVAILABLE"
      },
      select: CarSelect,
    });
  }

  /**
   * Calculate distance between two coordinates using the Haversine formula
   * @param lat1 Latitude of first point
   * @param lon1 Longitude of first point
   * @param lat2 Latitude of second point
   * @param lon2 Longitude of second point
   * @returns Distance in kilometers
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c; // Distance in km
    return distance;
  }

  /**
   * Convert degrees to radians
   */
  private deg2rad(deg: number): number {
    return deg * (Math.PI/180);
  }

  /**
   * Get available cars near a specific location
   * @param latitude User's latitude
   * @param longitude User's longitude
   * @param maxDistance Maximum distance in kilometers (optional, default 50km)
   */
  async getAvailableCarsNearby(latitude: number, longitude: number, maxDistance: number = 50) {
    // First update any cars with ended reservations
    await this.updateCarsWithEndedReservations();
    
    // Get all available cars
    const availableCars = await prisma.car.findMany({
      where: {
        status: "AVAILABLE"
      },
      select: CarSelect,
    });
    
    // Filter cars by distance and add distance information
    const carsWithDistance = availableCars
      .filter(car => car.location !== null && car.location !== undefined) // Only include cars with location data
      .map(car => {
        // Type assertion to help TypeScript understand the structure
        const carLocation = car.location as Location;
        
        if (!carLocation) return null;
        
        const distance = this.calculateDistance(
          latitude,
          longitude,
          carLocation.latitude,
          carLocation.longitude
        );
        
        return {
          ...car,
          distance // Add distance to the car object
        };
      })
      .filter((car): car is (typeof car & { distance: number }) =>
        car !== null && (car as any).distance <= maxDistance
      ) // Filter by max distance with type guard
      .sort((a, b) => (a.distance - b.distance)); // Sort by distance
    
    return carsWithDistance;
  }

  /**
   * Get car by ID
   */
  async getCarById(id: string) {
    // Check for ended reservations before returning the car
    await this.updateCarsWithEndedReservations();
    
    return prisma.car.findUnique({
      where: { id },
      select: CarSelect,
    });
  }

  /**
   * Create a new car
   */
  async createCar(data: z.infer<typeof createCarSchema>) {
    // Convert the data to match Prisma's expected types
    const carData = {
      ...data,
      // Ensure description is a string (not undefined)
      description: data.description || '',
    };
    
    return prisma.car.create({
      data: carData,
      select: CarSelect,
    });
  }

  /**
   * Update an existing car
   */
  async updateCar(id: string, data: z.infer<typeof updateCarSchema>) {
    // Convert the data to match Prisma's expected types
    const cleanedData = removeUndefined(data);
    const carData = {
      ...cleanedData,
      // Only include description if it's provided
      ...(data.description !== undefined && { description: data.description || '' }),
    };
    
    try {
      return prisma.car.update({
        where: { id },
        data: carData,
        select: CarSelect,
      });
    } catch (error) {
      if ((error as any).code === 'P2025') {
        throw createErrorResponse('Car not found', 'NOT_FOUND');
      }
      throw error;
    }
  }

  /**
   * Delete a car
   */
  async deleteCar(id: string) {
    try {
      // Check if car has any active reservations
      const activeReservations = await prisma.reservation.findFirst({
        where: {
          carId: id,
          status: {
            in: ['CONFIRMED', 'PENDING']
          }
        }
      });
      
      if (activeReservations) {
        throw createErrorResponse('Cannot delete car with active reservations', 'HAS_RESERVATIONS');
      }
      
      return prisma.car.delete({
        where: { id },
      });
    } catch (error) {
      if ((error as any).code === 'P2025') {
        throw createErrorResponse('Car not found', 'NOT_FOUND');
      }
      throw error;
    }
  }
}

export const carService = new CarService();
