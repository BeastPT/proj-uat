import { z } from 'zod';

// Request schemas
export const idParamSchema = z.object({ 
  id: z.string().uuid() 
});


export const carBasicResponseSchema = z.object({
  id: z.string(),
  brand: z.string(),
  model: z.string(),
  year: z.number().int(),
  price: z.number().positive(),
  images: z.array(z.string().url()),
  description: z.string().optional(),
  status: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const carListResponseSchema = z.array(carBasicResponseSchema);

export const carRouteSchemas = {
  getAll: {
    tags: ['user'],
    response: {
      200: carListResponseSchema,
    },
  },
  getById: {
    tags: ['user'],
    params: idParamSchema,
    response: {
      200: carBasicResponseSchema,
    },
  }
};