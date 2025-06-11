import { prisma } from "@/config/db.config";
import {
  createReservationSchema,
  updateReservationSchema,
} from "@/schemas/reservation.schema";
import { CarStatus } from "@/types/car.type";
import { RentalPeriodStatus } from "@/types/reservation.type";
import {
  createErrorResponse,
  dateDiffInDays,
  safeParseDate,
} from "@/utils/common.utils";
import { z } from "zod";

const ReservationSelect = {
  id: true,
  userId: true,
  carId: true,
  startDate: true,
  endDate: true,
  totalPrice: true,
  status: true,
  periodStatus: true,
  createdAt: true,
  updatedAt: true,
};

export class ReservationService {
  /**
   * Helper function to determine the rental period status based on dates
   */
  private determineRentalPeriodStatus(
    startDate: Date,
    endDate: Date
  ): RentalPeriodStatus {
    const currentDate = new Date();

    if (currentDate < startDate) {
      return RentalPeriodStatus.NOT_STARTED;
    } else if (currentDate > endDate) {
      return RentalPeriodStatus.ENDED;
    } else {
      return RentalPeriodStatus.ACTIVE;
    }
  }

  /**
   * Update reservation and car status based on current date
   */
  private async updateReservationStatusBasedOnDate(reservation: any) {
    const currentDate = new Date();
    const endDate = new Date(reservation.endDate);

    // If the reservation has ended and is not already completed or cancelled
    if (
      currentDate > endDate &&
      reservation.status !== "COMPLETED" &&
      reservation.status !== "CANCELLED"
    ) {
      // Update reservation status to COMPLETED
      await prisma.reservation.update({
        where: { id: reservation.id },
        data: {
          status: "COMPLETED",
          periodStatus: RentalPeriodStatus.ENDED,
        },
      });

      // Update car status to AVAILABLE
      await prisma.car.update({
        where: { id: reservation.carId },
        data: { status: CarStatus.AVAILABLE },
      });

      // Update the reservation object to reflect the changes
      reservation.status = "COMPLETED";
      reservation.periodStatus = RentalPeriodStatus.ENDED;
    }

    return reservation;
  }

  /**
   * Get all reservations (admin only)
   */
  async getAllReservations() {
    const reservations = await prisma.reservation.findMany({
      include: {
        car: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Update status of ended reservations
    for (const reservation of reservations) {
      await this.updateReservationStatusBasedOnDate(reservation);
    }

    return reservations;
  }

  /**
   * Get reservations for a specific user
   */
  async getUserReservations(userId: string) {
    const reservations = await prisma.reservation.findMany({
      where: {
        userId: userId,
      },
      include: {
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
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Update status of ended reservations
    for (const reservation of reservations) {
      await this.updateReservationStatusBasedOnDate(reservation);
    }

    return reservations;
  }

  /**
   * Get reservation by ID
   */
  async getReservationById(id: string) {
    const reservation = await prisma.reservation.findUnique({
      where: {
        id: id,
      },
      include: {
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
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (reservation) {
      await this.updateReservationStatusBasedOnDate(reservation);
    }

    return reservation;
  }

  /**
   * Create a new reservation
   */
  async createReservation(
    userId: string,
    data: z.infer<typeof createReservationSchema>
  ) {
    // Get car details to calculate total price
    const car = await prisma.car.findUnique({
      where: { id: data.carId },
      select: { price: true, status: true },
    });

    if (!car) {
      throw createErrorResponse("Car not found", "NOT_FOUND");
    }

    if (car.status !== "AVAILABLE") {
      throw createErrorResponse(
        "Car is not available for reservation",
        "UNAVAILABLE"
      );
    }

    // Calculate number of days
    const startDate = safeParseDate(data.startDate);
    const endDate = safeParseDate(data.endDate);
    const days = dateDiffInDays(startDate, endDate);

    if (days < 1) {
      throw createErrorResponse(
        "Reservation must be for at least one day",
        "INVALID_DURATION"
      );
    }

    // Calculate total price
    const totalPrice = car.price * days;

    // Create reservation and update car status in a transaction
    try {
      return prisma.$transaction(async (tx) => {
        // Determine the initial period status
        const periodStatus = this.determineRentalPeriodStatus(
          startDate,
          endDate
        );

        // Create the reservation
        const reservation = await tx.reservation.create({
          data: {
            userId,
            carId: data.carId,
            startDate,
            endDate,
            totalPrice,
            status: "PENDING",
            periodStatus,
          },
          select: ReservationSelect,
        });

        // Update car status to RESERVED
        await tx.car.update({
          where: { id: data.carId },
          data: { status: "RESERVED" },
        });

        // Convert dates to ISO strings to match the response schema
        return {
          ...reservation,
          startDate: reservation.startDate.toISOString(),
          endDate: reservation.endDate.toISOString(),
          createdAt: reservation.createdAt.toISOString(),
          updatedAt: reservation.updatedAt.toISOString(),
        };
      });
    } catch (error) {
      throw createErrorResponse(
        "Failed to create reservation",
        "TRANSACTION_FAILED",
        error
      );
    }
  }

  /**
   * Update reservation status
   */
  async updateReservation(
    id: string,
    data: z.infer<typeof updateReservationSchema>
  ) {
    const reservation = await prisma.reservation.findUnique({
      where: { id },
      select: { carId: true, status: true },
    });

    if (!reservation) {
      throw new Error("Reservation not found");
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
          case "CONFIRMED":
            carStatus = CarStatus.RESERVED;
            break;
          case "CANCELLED":
            carStatus = CarStatus.AVAILABLE;
            break;
          case "COMPLETED":
            carStatus = CarStatus.AVAILABLE;
            break;
          default:
            carStatus = CarStatus.RESERVED;
        }

        await tx.car.update({
          where: { id: reservation.carId },
          data: { status: carStatus },
        });
      }

      // Convert dates to ISO strings to match the response schema
      return {
        ...updatedReservation,
        startDate: updatedReservation.startDate.toISOString(),
        endDate: updatedReservation.endDate.toISOString(),
        createdAt: updatedReservation.createdAt.toISOString(),
        updatedAt: updatedReservation.updatedAt.toISOString(),
      };
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
      throw new Error("Reservation not found");
    }

    if (reservation.status === "CANCELLED") {
      throw new Error("Reservation is already cancelled");
    }

    // Cancel reservation and update car status in a transaction
    return prisma.$transaction(async (tx) => {
      // Update the reservation status to CANCELLED
      const cancelledReservation = await tx.reservation.update({
        where: { id },
        data: { status: "CANCELLED" },
        select: ReservationSelect,
      });

      // Update car status to AVAILABLE
      await tx.car.update({
        where: { id: reservation.carId },
        data: { status: "AVAILABLE" },
      });

      // Convert dates to ISO strings to match the response schema
      return {
        ...cancelledReservation,
        startDate: cancelledReservation.startDate.toISOString(),
        endDate: cancelledReservation.endDate.toISOString(),
        createdAt: cancelledReservation.createdAt.toISOString(),
        updatedAt: cancelledReservation.updatedAt.toISOString(),
      };
    });
  }
}

export const reservationService = new ReservationService();
