import { prisma } from "@/config/db.config";

const CarSelect = {
  id: true,
  brand: true,
  model: true,
  year: true,
  price: true,
  images: true,
  description: true,
  status: true,
  createdAt: true,
  updatedAt: true,
};

export class CarService {

  async getAllCars() {
    return prisma.car.findMany({
      select: CarSelect,
    });
  }


  async getCarById(id: string) {
    return prisma.car.findUnique({
      where: { id },
      select: CarSelect,
    });
  }
}

export const carService = new CarService();
