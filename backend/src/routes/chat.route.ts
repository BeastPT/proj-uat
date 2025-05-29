import { FastifyTypedInstance } from '@/types';
import { chatController } from '@/controllers/chat.controller';
import { chatRouteSchemas } from '@/schemas/chat.schema';
import { prisma } from '@/config/db.config';

export default async function (app: FastifyTypedInstance) {
  app.register(
    async (router: FastifyTypedInstance) => {
      // Get all chats (admin only)
      router.get(
        '/',
        {
          schema: chatRouteSchemas.getAll,
          preHandler: [router.authenticate, router.isAdmin]
        },
        chatController.getAllChats
      );

      // Get chats for a specific user
      router.get(
        '/user/:userId',
        {
          schema: {
            tags: ['chats'],
            params: {
              type: 'object',
              properties: {
                userId: { type: 'string' },
              },
              required: ['userId'],
            },
            response: {
              200: chatRouteSchemas.getAll.response[200],
            },
          },
          preHandler: [router.authenticate],
          onRequest: async (request, reply) => {
            // Check if user is admin or the user is requesting their own chats
            const params = request.params as { userId: string };
            if (
              !request.user ||
              (!request.user.isAdmin && request.user.id !== params.userId)
            ) {
              return reply.code(403).send({ error: 'Unauthorized' });
            }
          },
        },
        chatController.getUserChats
      );

      // Get a single chat by ID
      router.get(
        '/:id',
        {
          schema: chatRouteSchemas.getById,
          preHandler: [router.authenticate],
          onRequest: async (request, reply) => {
            // Check if user is admin or the chat belongs to the user
            const params = request.params as { id: string };
            const chat = await prisma.chat.findUnique({
              where: { id: params.id },
              select: { userId: true },
            });

            if (
              !chat ||
              !request.user ||
              (!request.user.isAdmin && request.user.id !== chat.userId)
            ) {
              return reply.code(403).send({ error: 'Unauthorized' });
            }
          },
        },
        chatController.getChatById
      );

      // Create a new chat
      router.post(
        '/',
        {
          schema: chatRouteSchemas.create,
          preHandler: [router.authenticate],
          onRequest: async (request, reply) => {
            // Check if user is admin or creating a chat for themselves
            const body = request.body as { userId: string };
            if (
              !request.user ||
              (!request.user.isAdmin && request.user.id !== body.userId)
            ) {
              return reply.code(403).send({ error: 'Unauthorized' });
            }
          },
        },
        chatController.createChat
      );

      // Get messages for a chat
      router.get(
        '/:id/messages',
        {
          schema: chatRouteSchemas.getMessages,
          preHandler: [router.authenticate],
          onRequest: async (request, reply) => {
            // Check if user is admin or the chat belongs to the user
            const params = request.params as { id: string };
            const chat = await prisma.chat.findUnique({
              where: { id: params.id },
              select: { userId: true },
            });

            if (
              !chat ||
              !request.user ||
              (!request.user.isAdmin && request.user.id !== chat.userId)
            ) {
              return reply.code(403).send({ error: 'Unauthorized' });
            }
          },
        },
        chatController.getChatMessages
      );

      // Add a message to a chat
      router.post(
        '/:id/messages',
        {
          schema: chatRouteSchemas.createMessage,
          preHandler: [router.authenticate],
          onRequest: async (request, reply) => {
            // Check if user is admin or the chat belongs to the user
            const params = request.params as { id: string };
            const chat = await prisma.chat.findUnique({
              where: { id: params.id },
              select: { userId: true },
            });

            if (!chat || !request.user) {
              return reply.code(403).send({ error: 'Unauthorized' });
            }

            // If the user is not an admin and trying to send an admin message, reject
            const body = request.body as { isAdmin?: boolean };
            if (body.isAdmin && !request.user.isAdmin) {
              return reply.code(403).send({ error: 'Unauthorized to send admin messages' });
            }

            // If the user is not an admin and the chat doesn't belong to them, reject
            if (!request.user.isAdmin && request.user.id !== chat.userId) {
              return reply.code(403).send({ error: 'Unauthorized' });
            }
          },
        },
        chatController.addMessage
      );

      // Close a chat (admin only)
      router.put(
        '/:id/close',
        {
          schema: {
            tags: ['chats'],
            params: {
              type: 'object',
              properties: {
                id: { type: 'string' },
              },
              required: ['id'],
            },
            response: {
              200: chatRouteSchemas.getById.response[200],
            },
          },
          preHandler: [router.authenticate, router.isAdmin]
        },
        chatController.closeChat
      );

      // Reopen a chat (admin only)
      router.put(
        '/:id/reopen',
        {
          schema: {
            tags: ['chats'],
            params: {
              type: 'object',
              properties: {
                id: { type: 'string' },
              },
              required: ['id'],
            },
            response: {
              200: chatRouteSchemas.getById.response[200],
            },
          },
          preHandler: [router.authenticate, router.isAdmin]
        },
        chatController.reopenChat
      );
    },
    { prefix: '/chats' }
  );
}