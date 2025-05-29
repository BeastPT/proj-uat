import { prisma } from "@/config/db.config";
import { z } from "zod";
import { createCarSchema, updateCarSchema } from "@/schemas/car.schema";

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
   * Get car by ID
   */
  async getCarById(id: string) {
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
    
    console.log("----------------------CAAR CREATED----------------------")

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
    const carData = {
      ...data,
      // Only include description if it's provided
      ...(data.description !== undefined && { description: data.description || '' }),
    };
    
    return prisma.car.update({
      where: { id },
      data: carData,
      select: CarSelect,
    });
  }

  /**
   * Delete a car
   */
  async deleteCar(id: string) {
    return prisma.car.delete({
      where: { id },
    });
  }
}

export const carService = new CarService();
