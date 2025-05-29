import { FastifyReply, FastifyRequest } from 'fastify';
import { userService } from '@/services/user.service';
import { z } from 'zod';
import {
  idParamSchema,
  registerBodySchema,
  loginBodySchema,
  updateUserBodySchema,
  updateProfileBodySchema
} from '@/schemas/user.schema';

export class UserController {
  /**
   * Get all users
   */
  async getAllUsers(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const users = await userService.getAllUsers();
      return reply.send(users);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Failed to retrieve users' });
    }
  }

  /**
   * Get user by ID
   */
  async getUserById(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params as z.infer<typeof idParamSchema>;
      const user = await userService.getUserById(id);

      if (!user) {
        return reply.status(404).send({ error: 'User not found' });
      }

      return reply.send(user);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Failed to retrieve user' });
    }
  }

  /**
   * Register a new user
   */
  async registerUser(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const { name, email, password } = request.body as z.infer<typeof registerBodySchema>;
      const user = await userService.createUser({ name, email, password });
      return reply.status(201).send({ message: 'User registered successfully' });
    } catch (error) {
      request.log.error(error);
      if ((error as any).code === 'P2002') {
        return reply.status(409).send({ error: 'Email already in use' });
      }
      return reply.status(500).send({ error: 'Failed to register user' });
    }
  }

  /**
   * Login user
   */
  async loginUser(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const { email, password } = request.body as z.infer<typeof loginBodySchema>;
      const result = await userService.authenticateUser(email, password);
      return reply.send(result);
    } catch (error) {
      request.log.error(error);
      return reply.status(401).send({ error: 'Invalid credentials' });
    }
  }

  /**
   * Update user
   */
  async updateUser(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params as z.infer<typeof idParamSchema>;
      const userData = request.body as z.infer<typeof updateUserBodySchema>;
      
      await userService.updateUser(id, userData);
      return reply.send({ message: 'User updated successfully' });
    } catch (error) {
      request.log.error(error);
      if ((error as any).code === 'P2025') {
        return reply.status(404).send({ error: 'User not found' });
      }
      return reply.status(500).send({ error: 'Failed to update user' });
    }
  }

  /**
   * Delete user
   */
  async deleteUser(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params as z.infer<typeof idParamSchema>;
      await userService.deleteUser(id);
      return reply.status(204).send();
    } catch (error) {
      request.log.error(error);
      if ((error as any).code === 'P2025') {
        return reply.status(404).send({ error: 'User not found' });
      }
      return reply.status(500).send({ error: 'Failed to delete user' });
    }
  }

  /**
   * Get current user profile
   */
  async getUserProfile(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      if (!request.user) {
        return reply.status(401).send({ error: 'Not authenticated' });
      }
      
      const user = await userService.getUserById(request.user.id);
      
      if (!user) {
        return reply.status(404).send({ error: 'User not found' });
      }

      return reply.send(user);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Failed to retrieve user profile' });
    }
  }

  /**
   * Update current user profile
   */
  async updateUserProfile(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      if (!request.user) {
        return reply.status(401).send({ error: 'Not authenticated' });
      }
      
      const userData = request.body as z.infer<typeof updateProfileBodySchema>;
      
      // Convert birthdate string to Date if provided
      const updatedUserData = {
        ...userData,
        birthdate: userData.birthdate ? new Date(userData.birthdate) : undefined
      };
      
      await userService.updateUser(request.user.id, updatedUserData);
      return reply.send({ message: 'Profile updated successfully' });
    } catch (error) {
      request.log.error(error);
      if ((error as any).code === 'P2025') {
        return reply.status(404).send({ error: 'User not found' });
      }
      return reply.status(500).send({ error: 'Failed to update user profile' });
    }
  }

  /**
   * Set user as admin
   */
  async setUserAsAdmin(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      if (!request.user || !request.user.isAdmin) {
        return reply.status(403).send({ error: 'Forbidden: Only admins can perform this action' });
      }
      
      const { id } = request.params as z.infer<typeof idParamSchema>;
      
      await userService.updateUser(id, { isAdmin: true });
      return reply.send({ message: 'User set as admin successfully' });
    } catch (error) {
      request.log.error(error);
      if ((error as any).code === 'P2025') {
        return reply.status(404).send({ error: 'User not found' });
      }
      return reply.status(500).send({ error: 'Failed to set user as admin' });
    }
  }

  /**
   * Remove admin privileges from user
   */
  async removeUserAdmin(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      if (!request.user || !request.user.isAdmin) {
        return reply.status(403).send({ error: 'Forbidden: Only admins can perform this action' });
      }
      
      const { id } = request.params as z.infer<typeof idParamSchema>;
      
      await userService.updateUser(id, { isAdmin: false });
      return reply.send({ message: 'Admin privileges removed successfully' });
    } catch (error) {
      request.log.error(error);
      if ((error as any).code === 'P2025') {
        return reply.status(404).send({ error: 'User not found' });
      }
      return reply.status(500).send({ error: 'Failed to remove admin privileges' });
    }
  }
}

export const userController = new UserController();