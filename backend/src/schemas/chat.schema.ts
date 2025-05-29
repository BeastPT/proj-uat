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
  chatId: z.string(),
  content: z.string().min(1, 'Message content is required'),
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

export const chatRouteSchemas = {
  getAll: {
    tags: ['chats'],
    response: {
      200: chatListResponseSchema
    }
  },
  getById: {
    tags: ['chats'],
    params: idParamSchema,
    response: {
      200: chatResponseSchema
    }
  },
  create: {
    tags: ['chats'],
    body: createChatSchema,
    response: {
      201: chatResponseSchema
    }
  },
  getMessages: {
    tags: ['chats'],
    params: idParamSchema,
    response: {
      200: messageListResponseSchema
    }
  },
  createMessage: {
    tags: ['chats'],
    params: idParamSchema,
    body: createMessageSchema,
    response: {
      201: messageResponseSchema
    }
  }
};