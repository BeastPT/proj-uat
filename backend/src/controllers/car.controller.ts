import { FastifyReply, FastifyRequest } from 'fastify';
import { userService } from '@/services/user.service';
import { z } from 'zod';
import { 
  idParamSchema, 
  registerBodySchema, 
  loginBodySchema, 
  updateUserBodySchema 
} from '@/schemas/user.schema';
import { carService } from '@/services/car.service';

export class CarController {
  /**
   * Get all cars
   */
  async getAllCars(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const cars = await carService.getAllCars();
      return reply.send(cars);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Failed to retrieve cars' });
    }
  }

  /**
   * Get car by ID
   */
  async getCarById(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params as z.infer<typeof idParamSchema>;
      const car = await carService.getCarById(id);

      if (!car) {
        return reply.status(404).send({ error: 'Car not found' });
      }

      return reply.send(car);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Failed to retrieve car' });
    }
  }
}

export const carController = new CarController();