import { FastifyRequest, FastifyReply } from 'fastify';
import { reservationService } from '@/services/reservation.service';
import { createReservationSchema, updateReservationSchema } from '@/schemas/reservation.schema';
import { z } from 'zod';

export class ReservationController {
  /**
   * Get all reservations (admin only)
   */
  async getAllReservations(request: FastifyRequest, reply: FastifyReply) {
    try {
      const reservations = await reservationService.getAllReservations();
      
      // Convert Date objects to ISO strings for serialization
      const serializedReservations = reservations.map(reservation => ({
        ...reservation,
        startDate: reservation.startDate.toISOString(),
        endDate: reservation.endDate.toISOString(),
        createdAt: reservation.createdAt.toISOString(),
        updatedAt: reservation.updatedAt.toISOString(),
        car: {
          ...reservation.car
        },
        user: {
          ...reservation.user
        }
      }));
      
      return reply.code(200).send(serializedReservations);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to get reservations' });
    }
  }

  /**
   * Get reservations for the authenticated user
   */
  async getUserReservations(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (request.user as any).id;
      const reservations = await reservationService.getUserReservations(userId);
      
      // Convert Date objects to ISO strings for serialization
      const serializedReservations = reservations.map(reservation => ({
        ...reservation,
        startDate: reservation.startDate.toISOString(),
        endDate: reservation.endDate.toISOString(),
        createdAt: reservation.createdAt.toISOString(),
        updatedAt: reservation.updatedAt.toISOString(),
        car: {
          ...reservation.car
        }
      }));
      
      return reply.code(200).send(serializedReservations);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to get user reservations' });
    }
  }

  /**
   * Get reservation by ID
   */
  async getReservationById(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const reservation = await reservationService.getReservationById(id);
      
      if (!reservation) {
        return reply.code(404).send({ error: 'Reservation not found' });
      }
      
      // Convert Date objects to ISO strings for serialization
      const serializedReservation = {
        ...reservation,
        startDate: reservation.startDate.toISOString(),
        endDate: reservation.endDate.toISOString(),
        createdAt: reservation.createdAt.toISOString(),
        updatedAt: reservation.updatedAt.toISOString(),
        car: {
          ...reservation.car
        },
        user: {
          ...reservation.user
        }
      };
      
      return reply.code(200).send(serializedReservation);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to get reservation' });
    }
  }

  /**
   * Create a new reservation
   */
  async createReservation(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = (request.user as any).id;
      const data = createReservationSchema.parse(request.body);
      
      const reservation = await reservationService.createReservation(userId, data);
      return reply.code(201).send(reservation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({ error: error.errors });
      }
      
      request.log.error(error);
      
      if (error instanceof Error) {
        return reply.code(400).send({ error: error.message });
      }
      
      return reply.code(500).send({ error: 'Failed to create reservation' });
    }
  }

  /**
   * Update reservation status
   */
  async updateReservation(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const data = updateReservationSchema.parse(request.body);
      
      const reservation = await reservationService.updateReservation(id, data);
      return reply.code(200).send(reservation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.code(400).send({ error: error.errors });
      }
      
      request.log.error(error);
      
      if (error instanceof Error) {
        return reply.code(400).send({ error: error.message });
      }
      
      return reply.code(500).send({ error: 'Failed to update reservation' });
    }
  }

  /**
   * Cancel a reservation
   */
  async cancelReservation(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { id } = request.params as { id: string };
      const reservation = await reservationService.cancelReservation(id);
      return reply.code(200).send(reservation);
    } catch (error) {
      request.log.error(error);
      
      if (error instanceof Error) {
        return reply.code(400).send({ error: error.message });
      }
      
      return reply.code(500).send({ error: 'Failed to cancel reservation' });
    }
  }
}

export const reservationController = new ReservationController();