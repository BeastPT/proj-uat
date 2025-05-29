import { z } from 'zod';

// Request schemas
export const idParamSchema = z.object({ 
  id: z.string().uuid() 
});

export const registerBodySchema = z.object({
  name: z.string().min(4).max(50),
  email: z.string().email(),
  password: z.string().min(4).max(50),
});

export const loginBodySchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const updateUserBodySchema = z.object({
  name: z.string().min(1).max(50).optional(),
  email: z.string().email().optional(),
  password: z.string().min(8).max(50).optional(),
});

export const updateProfileBodySchema = z.object({
  name: z.string().min(1).max(50).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  country: z.string().optional(),
  birthdate: z.string().optional(),
});

// Response schemas
export const messageResponseSchema = z.object({ 
  message: z.string() 
});

export const authResponseSchema = z.object({ 
  token: z.string(), 
  refreshToken: z.string() 
});

export const userBasicResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  country: z.string().optional(),
  birthdate: z.date().optional(),
  isVerified: z.boolean().optional(),
  isAdmin: z.boolean().optional(),
});

export const userListResponseSchema = z.array(userBasicResponseSchema);

// Schema for route definitions
export const userRouteSchemas = {
  register: {
    tags: ['user'],
    body: registerBodySchema,
    response: {
      201: messageResponseSchema,
    },
  },
  login: {
    tags: ['user'],
    body: loginBodySchema,
    response: {
      200: authResponseSchema,
    },
  },
  getAll: {
    tags: ['user'],
    response: {
      200: userListResponseSchema,
    },
  },
  getById: {
    tags: ['user'],
    params: idParamSchema,
    response: {
      200: userBasicResponseSchema,
    },
  },
  update: {
    tags: ['user'],
    params: idParamSchema,
    body: updateUserBodySchema,
    response: {
      200: messageResponseSchema,
    },
  },
  delete: {
    tags: ['user'],
    params: idParamSchema,
    response: {
      204: z.undefined(),
    },
  },
  profile: {
    tags: ['user'],
    security: [{ bearerAuth: [] }],
    response: {
      200: userBasicResponseSchema,
    },
  },
  updateProfile: {
    tags: ['user'],
    security: [{ bearerAuth: [] }],
    body: updateProfileBodySchema,
    response: {
      200: messageResponseSchema,
    },
  },
  setAdmin: {
    tags: ['user'],
    security: [{ bearerAuth: [] }],
    params: idParamSchema,
    response: {
      200: messageResponseSchema,
      403: z.object({ error: z.string() }),
    },
  },
  removeAdmin: {
    tags: ['user'],
    security: [{ bearerAuth: [] }],
    params: idParamSchema,
    response: {
      200: messageResponseSchema,
      403: z.object({ error: z.string() }),
    },
  },
};