import { prisma } from "@/config/db.config";
import { z } from "zod";
import { createReservationSchema, updateReservationSchema } from "@/schemas/reservation.schema";
import { CarStatus } from "@/types/car.type";

const ReservationSelect = {
  id: true,
  userId: true,
  carId: true,
  startDate: true,
  endDate: true,
  totalPrice: true,
  status: true,
  createdAt: true,
  updatedAt: true,
};

const ReservationWithCarSelect = {
  ...ReservationSelect,
  car: {
    select: {
      id: true,
      brand: true,
      model: true,
      year: true,
      color: true,
      price: true,
      images: true,
    },
  },
};

export class ReservationService {
  /**
   * Get all reservations (admin only)
   */
  async getAllReservations() {
    // Using $queryRaw until Prisma client is regenerated
    return prisma.$queryRaw`
      SELECT * FROM "Reservation"
    `;
  }

  /**
   * Get reservations for a specific user
   */
  async getUserReservations(userId: string) {
    // Using $queryRaw until Prisma client is regenerated
    return prisma.$queryRaw`
      SELECT r.*, c.brand, c.model, c.year, c.color, c.price, c.images
      FROM "Reservation" r
      JOIN "Car" c ON r."carId" = c.id
      WHERE r."userId" = ${userId}
      ORDER BY r."createdAt" DESC
    `;
  }

  /**
   * Get reservation by ID
   */
  async getReservationById(id: string) {
    // Using $queryRaw until Prisma client is regenerated
    return prisma.$queryRaw`
      SELECT r.*, c.brand, c.model, c.year, c.color, c.price, c.images
      FROM "Reservation" r
      JOIN "Car" c ON r."carId" = c.id
      WHERE r.id = ${id}
    `;
  }

  /**
   * Create a new reservation
   */
  async createReservation(userId: string, data: z.infer<typeof createReservationSchema>) {
    // Get car details to calculate total price
    const car = await prisma.car.findUnique({
      where: { id: data.carId },
      select: { price: true, status: true },
    });

    if (!car) {
      throw new Error('Car not found');
    }

    if (car.status !== 'AVAILABLE') {
      throw new Error('Car is not available for reservation');
    }

    // Calculate number of days
    const startDate = new Date(data.startDate);
    const endDate = new Date(data.endDate);
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (days < 1) {
      throw new Error('Reservation must be for at least one day');
    }

    // Calculate total price
    const totalPrice = car.price * days;

    // Create reservation and update car status in a transaction
    return prisma.$transaction(async (tx) => {
      // Create the reservation
      const reservation = await tx.reservation.create({
        data: {
          userId,
          carId: data.carId,
          startDate,
          endDate,
          totalPrice,
          status: 'PENDING',
        },
        select: ReservationSelect,
      });

      // Update car status to RESERVED
      await tx.car.update({
        where: { id: data.carId },
        data: { status: 'RESERVED' },
      });

      return reservation;
    });
  }

  /**
   * Update reservation status
   */
  async updateReservation(id: string, data: z.infer<typeof updateReservationSchema>) {
    const reservation = await prisma.reservation.findUnique({
      where: { id },
      select: { carId: true, status: true },
    });

    if (!reservation) {
      throw new Error('Reservation not found');
    }

    // Update reservation and car status in a transaction
    return prisma.$transaction(async (tx) => {
      // Update the reservation
      const updatedReservation = await tx.reservation.update({
        where: { id },
        data,
        select: ReservationSelect,
      });

      // Update car status based on reservation status
      if (data.status) {
        let carStatus: CarStatus;
        
        switch (data.status) {
          case 'CONFIRMED':
            carStatus = 'RESERVED';
            break;
          case 'CANCELLED':
            carStatus = 'AVAILABLE';
            break;
          case 'COMPLETED':
            carStatus = 'AVAILABLE';
            break;
          default:
            carStatus = 'RESERVED';
        }

        await tx.car.update({
          where: { id: reservation.carId },
          data: { status: carStatus },
        });
      }

      return updatedReservation;
    });
  }

  /**
   * Cancel a reservation
   */
  async cancelReservation(id: string) {
    const reservation = await prisma.reservation.findUnique({
      where: { id },
      select: { carId: true, status: true },
    });

    if (!reservation) {
      throw new Error('Reservation not found');
    }

    if (reservation.status === 'CANCELLED') {
      throw new Error('Reservation is already cancelled');
    }

    // Cancel reservation and update car status in a transaction
    return prisma.$transaction(async (tx) => {
      // Update the reservation status to CANCELLED
      const cancelledReservation = await tx.reservation.update({
        where: { id },
        data: { status: 'CANCELLED' },
        select: ReservationSelect,
      });

      // Update car status to AVAILABLE
      await tx.car.update({
        where: { id: reservation.carId },
        data: { status: 'AVAILABLE' },
      });

      return cancelledReservation;
    });
  }
}

export const reservationService = new ReservationService();