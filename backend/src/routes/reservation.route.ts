import { FastifyTypedInstance } from '@/types';
import { reservationController } from '@/controllers/reservation.controller';
import { reservationRouteSchemas } from '@/schemas/reservation.schema';

export default async function (app: FastifyTypedInstance) {
  app.register(
    async (router: FastifyTypedInstance) => {
      // Base route
      router.get('/', async (_request, reply) => {
        reply.send({ message: 'Reservation route' });
      });

      // Get all reservations (admin only)
      router.get(
        '/all',
        {
          schema: reservationRouteSchemas.getAll,
          preHandler: [router.authenticate, router.isAdmin]
        },
        reservationController.getAllReservations
      );

      // Get user's reservations
      router.get(
        '/user',
        {
          schema: reservationRouteSchemas.getUserReservations,
          preHandler: [router.authenticate]
        },
        reservationController.getUserReservations
      );

      // Get reservation by ID
      router.get(
        '/:id',
        {
          schema: reservationRouteSchemas.getById,
          preHandler: [router.authenticate]
        },
        reservationController.getReservationById
      );

      // Create a new reservation
      router.post(
        '/',
        {
          schema: reservationRouteSchemas.create,
          preHandler: [router.authenticate]
        },
        reservationController.createReservation
      );

      // Update reservation status
      router.put(
        '/:id',
        {
          schema: reservationRouteSchemas.update,
          preHandler: [router.authenticate]
        },
        reservationController.updateReservation
      );

      // Cancel a reservation
      router.put(
        '/:id/cancel',
        {
          schema: reservationRouteSchemas.cancel,
          preHandler: [router.authenticate]
        },
        reservationController.cancelReservation
      );
    },
    { prefix: '/reservations' }
  );
}