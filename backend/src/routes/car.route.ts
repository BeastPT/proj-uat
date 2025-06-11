import { FastifyTypedInstance } from '@/types';
import { carController } from '@/controllers/car.controller';
import { carRouteSchemas } from '@/schemas/car.schema';

export default async function (app: FastifyTypedInstance) {
  app.register(
    async (router: FastifyTypedInstance) => {
      // Base route
      router.get('/', async (_request, reply) => {
        reply.send({ message: 'Car route' });
      });

      // Get all cars
      router.get(
        '/all',
        {
          schema: carRouteSchemas.getAll
        },
        carController.getAllCars
      );

      // Get all available cars
      router.get(
        '/available',
        {
          schema: carRouteSchemas.getAll
        },
        carController.getAvailableCars
      );

      // Get available cars near a location
      router.get(
        '/nearby',
        {
          schema: {
            tags: ['cars'],
            querystring: {
              type: 'object',
              required: ['latitude', 'longitude'],
              properties: {
                latitude: { type: 'string' },
                longitude: { type: 'string' },
                maxDistance: { type: 'string' }
              }
            },
            response: {
              200: carRouteSchemas.getAll.response[200]
            }
          }
        },
        carController.getAvailableCarsNearby
      );

      // Get car by ID
      router.get(
        '/:id',
        {
          schema: carRouteSchemas.getById
        },
        carController.getCarById
      );

      // Create a new car (admin only)
      router.post(
        '/',
        {
          schema: carRouteSchemas.create,
          preHandler: [router.authenticate, router.isAdmin]
        },
        carController.createCar
      );

      // Update a car (admin only)
      router.put(
        '/:id',
        {
          schema: carRouteSchemas.update,
          preHandler: [router.authenticate, router.isAdmin]
        },
        carController.updateCar
      );

      // Delete a car (admin only)
      router.delete(
        '/:id',
        {
          schema: carRouteSchemas.delete,
          preHandler: [router.authenticate, router.isAdmin]
        },
        carController.deleteCar
      );
    },
    { prefix: '/cars' }
  );
}