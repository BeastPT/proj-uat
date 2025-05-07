import { FastifyTypedInstance } from '@/types';
import { userController } from '@/controllers/user.controller';
import { userRouteSchemas } from '@/schemas/user.schema';

export default async function (app: FastifyTypedInstance) {
  app.register(
    async (router: FastifyTypedInstance) => {
      // Base route
      router.get('/', async (_request, reply) => {
        reply.send({ message: 'User route' });
      });

      // Register a new user
      router.post(
        '/register',
        {
          schema: userRouteSchemas.register
        },
        userController.registerUser
      );

      // Login
      router.post(
        '/login',
        {
          schema: userRouteSchemas.login
        },
        userController.loginUser
      );

      // Get all users (admin)
      router.get(
        '/all',
        {
          schema: userRouteSchemas.getAll
        },
        userController.getAllUsers
      );

      // Get specific user by ID (admin)
      router.get(
        '/:id',
        {
          schema: userRouteSchemas.getById
        },
        userController.getUserById
      );

      // Update user by ID
      router.put(
        '/:id',
        {
          schema: userRouteSchemas.update
        },
        userController.updateUser
      );

      // Delete user by ID
      router.delete(
        '/:id',
        {
          schema: userRouteSchemas.delete
        },
        userController.deleteUser
      );

      // Get current user profile (requires auth)
      router.get(
        '/profile',
        {
          schema: userRouteSchemas.profile,
          preHandler: [router.authenticate],
        },
        userController.getUserProfile
      );
    },
    { prefix: '/user' }
  );
}