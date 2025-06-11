import { z } from 'zod';

// Request schemas
export const idParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId format')
});

// Car status enum
export const carStatusEnum = z.enum([
  'AVAILABLE',
  'RENTED',
  'RESERVED',
  'MAINTENANCE'
]);

// Transmission enum
export const transmissionEnum = z.enum([
  'AUTOMATIC',
  'MANUAL'
]);

// Fuel type enum
export const fuelTypeEnum = z.enum([
  'PETROL',
  'DIESEL',
  'ELECTRIC',
  'HYBRID'
]);

// Car category enum
export const carCategoryEnum = z.enum([
  'ECONOMY',
  'COMPACT',
  'SUV',
  'LUXURY',
  'ELECTRIC',
  'VAN'
]);

// Location schema
export const locationSchema = z.object({
  latitude: z.number().min(-90).max(90).refine(val => Number.isFinite(val), {
    message: "Latitude must be a valid floating-point number"
  }),
  longitude: z.number().min(-180).max(180).refine(val => Number.isFinite(val), {
    message: "Longitude must be a valid floating-point number"
  }),
  address: z.string().optional().nullable(),
}).nullable().optional();

// Create car schema
export const createCarSchema = z.object({
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  color: z.string().min(1, 'Color is required'),
  kilometers: z.number().int().min(0),
  plate: z.string().min(1, 'License plate is required'),
  price: z.number().positive(),
  description: z.string().optional(),
  seats: z.number().int().min(1).max(20),
  doors: z.number().int().min(1).max(10).optional(),
  status: carStatusEnum,
  transmission: transmissionEnum,
  fuel: fuelTypeEnum,
  category: carCategoryEnum,
  location: locationSchema.optional(),
  images: z.array(z.string().url()).min(1, 'At least one image is required'),
});

// Update car schema
export const updateCarSchema = createCarSchema.partial();

// Response schemas
export const carBasicResponseSchema = z.object({
  id: z.string(),
  brand: z.string(),
  model: z.string(),
  year: z.number().int(),
  color: z.string(),
  kilometers: z.number().int(),
  plate: z.string(),
  price: z.number().positive(),
  description: z.string().optional(),
  seats: z.number().int(),
  doors: z.number().int().optional(),
  status: carStatusEnum,
  transmission: transmissionEnum,
  fuel: fuelTypeEnum,
  category: carCategoryEnum,
  location: locationSchema.optional(),
  images: z.array(z.string().url()),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const carListResponseSchema = z.array(carBasicResponseSchema);

export const carRouteSchemas = {
  getAll: {
    tags: ['cars'],
    response: {
      200: carListResponseSchema,
    },
  },
  getById: {
    tags: ['cars'],
    params: idParamSchema,
    response: {
      200: carBasicResponseSchema,
    },
  },
  create: {
    tags: ['cars'],
    body: createCarSchema,
    response: {
      201: carBasicResponseSchema,
    },
  },
  update: {
    tags: ['cars'],
    params: idParamSchema,
    body: updateCarSchema,
    response: {
      200: carBasicResponseSchema,
    },
  },
  delete: {
    tags: ['cars'],
    params: idParamSchema,
    response: {
      204: z.null(),
    },
  }
};