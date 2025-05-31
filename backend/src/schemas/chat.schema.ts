import { z } from 'zod';

// Request schemas
export const idParamSchema = z.object({
  id: z.string()
});

// Create chat schema
export const createChatSchema = z.object({
  userId: z.string()
});

// Create message schema
export const createMessageSchema = z.object({
  content: z.string().min(1, 'Message content is required').max(5000, 'Message content is too long'),
  isAdmin: z.boolean().optional().default(false)
});

// Response schemas
export const messageResponseSchema = z.object({
  id: z.string(),
  chatId: z.string(),
  content: z.string(),
  isAdmin: z.boolean(),
  createdAt: z.string()
});

export const chatResponseSchema = z.object({
  id: z.string(),
  userId: z.string(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  messages: z.array(messageResponseSchema).optional()
});

export const chatListResponseSchema = z.array(chatResponseSchema);
export const messageListResponseSchema = z.array(messageResponseSchema);

// Error response schema
export const errorResponseSchema = z.object({
  error: z.string(),
  details: z.string().optional(),
  chatId: z.string().optional() // For 409 conflict responses
});

export const chatRouteSchemas = {
  getAll: {
    tags: ['chats'],
    response: {
      200: chatListResponseSchema,
      400: errorResponseSchema,
      401: errorResponseSchema,
      403: errorResponseSchema,
      500: errorResponseSchema
    }
  },
  getById: {
    tags: ['chats'],
    params: idParamSchema,
    response: {
      200: chatResponseSchema,
      400: errorResponseSchema,
      401: errorResponseSchema,
      403: errorResponseSchema,
      404: errorResponseSchema,
      500: errorResponseSchema
    }
  },
  create: {
    tags: ['chats'],
    body: createChatSchema,
    response: {
      201: chatResponseSchema,
      400: errorResponseSchema,
      401: errorResponseSchema,
      404: errorResponseSchema,
      409: errorResponseSchema,
      500: errorResponseSchema
    }
  },
  getMessages: {
    tags: ['chats'],
    params: idParamSchema,
    response: {
      200: messageListResponseSchema,
      400: errorResponseSchema,
      401: errorResponseSchema,
      403: errorResponseSchema,
      404: errorResponseSchema,
      500: errorResponseSchema
    }
  },
  createMessage: {
    tags: ['chats'],
    params: idParamSchema,
    body: createMessageSchema,
    response: {
      201: messageResponseSchema,
      400: errorResponseSchema,
      401: errorResponseSchema,
      403: errorResponseSchema,
      404: errorResponseSchema,
      500: errorResponseSchema
    }
  }
};