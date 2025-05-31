import { z } from 'zod';
import { idParamSchema } from './car.schema';

// Reservation status enum
export const reservationStatusEnum = z.enum([
  'PENDING',
  'CONFIRMED',
  'CANCELLED',
  'COMPLETED'
]);

// Create reservation schema
export const createReservationSchema = z.object({
  carId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid car ID format'),
  startDate: z.string(),
  endDate: z.string(),
}).refine(
  (data) => new Date(data.startDate) < new Date(data.endDate),
  {
    message: 'End date must be after start date',
    path: ['endDate']
  }
);

// Update reservation schema
export const updateReservationSchema = z.object({
  status: reservationStatusEnum.optional(),
});

// Response schemas
export const reservationBasicResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  carId: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  totalPrice: z.number(),
  status: reservationStatusEnum,
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const reservationWithCarResponseSchema = reservationBasicResponseSchema.extend({
  car: z.object({
    id: z.string(),
    brand: z.string(),
    model: z.string(),
    year: z.number(),
    color: z.string(),
    price: z.number(),
    images: z.array(z.string()),
  }),
});

export const reservationListResponseSchema = z.array(reservationBasicResponseSchema);

export const reservationRouteSchemas = {
  getAll: {
    tags: ['reservations'],
    response: {
      200: reservationListResponseSchema,
    },
  },
  getUserReservations: {
    tags: ['reservations'],
    response: {
      200: reservationListResponseSchema,
    },
  },
  getById: {
    tags: ['reservations'],
    params: idParamSchema,
    response: {
      200: reservationWithCarResponseSchema,
    },
  },
  create: {
    tags: ['reservations'],
    body: createReservationSchema,
    response: {
      201: reservationBasicResponseSchema,
    },
  },
  update: {
    tags: ['reservations'],
    params: idParamSchema,
    body: updateReservationSchema,
    response: {
      200: reservationBasicResponseSchema,
    },
  },
  cancel: {
    tags: ['reservations'],
    params: idParamSchema,
    response: {
      200: reservationBasicResponseSchema,
    },
  },
};