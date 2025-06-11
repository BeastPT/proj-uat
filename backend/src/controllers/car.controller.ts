import { FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';
import {
  idParamSchema,
  createCarSchema,
  updateCarSchema,
  locationSchema
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
      
      // Convert Date objects to strings for serialization and ensure location is properly formatted
      const serializedCars = cars.map(car => ({
        ...car,
        location: car.location || null,
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
      
      // Convert Date objects to strings for serialization and ensure location is properly formatted
      const serializedCars = cars.map(car => ({
        ...car,
        location: car.location || null,
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
   * Get available cars near a specific location
   */
  async getAvailableCarsNearby(
    request: FastifyRequest<{
      Querystring: {
        latitude: string;
        longitude: string;
        maxDistance?: string;
      }
    }>,
    reply: FastifyReply
  ) {
    try {
      const { latitude, longitude, maxDistance } = request.query;
      
      // Validate coordinates
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      const maxDist = maxDistance ? parseFloat(maxDistance) : 50; // Default to 50km
      
      if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
        return reply.status(400).send({ error: 'Invalid coordinates' });
      }
      
      if (isNaN(maxDist) || maxDist <= 0) {
        return reply.status(400).send({ error: 'Invalid max distance' });
      }
      
      const cars = await carService.getAvailableCarsNearby(lat, lng, maxDist);
      
      // Convert Date objects to strings for serialization and ensure location is properly formatted
      const serializedCars = cars.map(car => ({
        ...car,
        location: car.location || null,
        createdAt: car.createdAt.toISOString(),
        updatedAt: car.updatedAt.toISOString()
      }));
      
      return reply.send(serializedCars);
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: 'Failed to retrieve nearby cars' });
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

      // Convert Date objects to strings for serialization and ensure location is properly formatted
      const serializedCar = {
        ...car,
        location: car.location || null,
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

      // Convert Date objects to strings for serialization and ensure location is properly formatted
      const serializedCar = {
        ...car,
        location: car.location || null,
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
      
      // Convert Date objects to strings for serialization and ensure location is properly formatted
      const serializedCar = {
        ...updatedCar,
        location: updatedCar.location || null,
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