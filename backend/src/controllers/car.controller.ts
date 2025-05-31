import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import {
  idParamSchema,
  createCarSchema,
  updateCarSchema
} from '@/schemas/car.schema';
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
      
      // Convert Date objects to strings for serialization
      const serializedCars = cars.map(car => ({
        ...car,
        createdAt: car.createdAt.toISOString(),
        updatedAt: car.updatedAt.toISOString()
      }));
      
      return reply.send(serializedCars);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Failed to retrieve cars' });
    }
  }

  /**
   * Get all available cars
   */
  async getAvailableCars(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const cars = await carService.getAvailableCars();
      
      // Convert Date objects to strings for serialization
      const serializedCars = cars.map(car => ({
        ...car,
        createdAt: car.createdAt.toISOString(),
        updatedAt: car.updatedAt.toISOString()
      }));
      
      return reply.send(serializedCars);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Failed to retrieve available cars' });
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

      // Convert Date objects to strings for serialization
      const serializedCar = {
        ...car,
        createdAt: car.createdAt.toISOString(),
        updatedAt: car.updatedAt.toISOString()
      };

      return reply.send(serializedCar);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Failed to retrieve car' });
    }
  }

  /**
   * Create a new car
   */
  async createCar(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const data = request.body as z.infer<typeof createCarSchema>;
      const car = await carService.createCar(data);
      
      // Convert Date objects to strings for serialization
      const serializedCar = {
        ...car,
        createdAt: car.createdAt.toISOString(),
        updatedAt: car.updatedAt.toISOString()
      };
      
      return reply.status(201).send(serializedCar);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Failed to create car' });
    }
  }

  /**
   * Update an existing car
   */
  async updateCar(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params as z.infer<typeof idParamSchema>;
      const data = request.body as z.infer<typeof updateCarSchema>;
      
      // Check if car exists
      const existingCar = await carService.getCarById(id);
      if (!existingCar) {
        return reply.status(404).send({ error: 'Car not found' });
      }
      
      const updatedCar = await carService.updateCar(id, data);
      
      // Convert Date objects to strings for serialization
      const serializedCar = {
        ...updatedCar,
        createdAt: updatedCar.createdAt.toISOString(),
        updatedAt: updatedCar.updatedAt.toISOString()
      };
      
      return reply.send(serializedCar);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Failed to update car' });
    }
  }

  /**
   * Delete a car
   */
  async deleteCar(
    request: FastifyRequest,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params as z.infer<typeof idParamSchema>;
      
      // Check if car exists
      const existingCar = await carService.getCarById(id);
      if (!existingCar) {
        return reply.status(404).send({ error: 'Car not found' });
      }
      
      await carService.deleteCar(id);
      return reply.status(204).send();
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Failed to delete car' });
    }
  }
}

export const carController = new CarController();