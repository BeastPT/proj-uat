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
        async (request, reply) => {
          return chatController.getAllChats(request, reply);
        }
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
          preHandler: [
            router.authenticate,
            async (request, reply) => {
              // Check if user is admin or the user is requesting their own chats
              const params = request.params as { userId: string };
              if (
                !request.user ||
                (!request.user.isAdmin && request.user.id !== params.userId)
              ) {
                throw new Error('Unauthorized access');
              }
            }
          ],
        },
        async (request, reply) => {
          const { userId } = request.params as { userId: string };
          return chatController.getUserChats(
            { params: { userId } } as any,
            reply
          );
        }
      );

      // Get a single chat by ID
      router.get(
        '/:id',
        {
          schema: chatRouteSchemas.getById,
          preHandler: [
            router.authenticate,
            async (request, reply) => {
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
                throw new Error('Unauthorized access');
              }
            }
          ],
        },
        async (request, reply) => {
          const { id } = request.params as { id: string };
          return chatController.getChatById(
            { params: { id } } as any,
            reply
          );
        }
      );

      // Create a new chat
      router.post(
        '/',
        {
          schema: chatRouteSchemas.create,
          preHandler: router.authenticate
        },
        async (request, reply) => {
          const body = request.body as { userId: string };
          return chatController.createChat(
            { body } as any,
            reply
          );
        }
      );

      // Get messages for a chat
      router.get(
        '/:id/messages',
        {
          schema: chatRouteSchemas.getMessages,
          preHandler: [
            router.authenticate,
            async (request, reply) => {
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
                throw new Error('Unauthorized access');
              }
            }
          ],
        },
        async (request, reply) => {
          const { id } = request.params as { id: string };
          return chatController.getChatMessages(
            { params: { id } } as any,
            reply
          );
        }
      );

      // Add a message to a chat
      router.post(
        '/:id/messages',
        {
          schema: chatRouteSchemas.createMessage,
          preHandler: [
            router.authenticate,
            async (request, reply) => {
              try {
                // Check if user is authenticated
                if (!request.user) {
                  request.log.error('No authenticated user found in request');
                  return reply.code(401).send({
                    error: 'Authentication required',
                    details: 'You must be logged in to send messages'
                  });
                }
                
                // Get chat ID from params
                const params = request.params as { id: string };
                if (!params.id) {
                  request.log.error('Missing chat ID in request params');
                  return reply.code(400).send({
                    error: 'Chat ID is required',
                    details: 'A valid chat ID must be provided in the URL'
                  });
                }
                
                request.log.info(`User ${request.user.id} attempting to send message to chat ${params.id}`);
                
                // Check if chat exists and get user ID
                const chat = await prisma.chat.findUnique({
                  where: { id: params.id },
                  select: { userId: true, isActive: true },
                });

                if (!chat) {
                  request.log.error(`Chat ${params.id} not found`);
                  return reply.code(404).send({
                    error: 'Chat not found',
                    details: 'The specified chat does not exist'
                  });
                }
                
                if (!chat.isActive) {
                  request.log.error(`Attempted to send message to inactive chat ${params.id}`);
                  return reply.code(400).send({
                    error: 'Cannot send messages to inactive chat',
                    details: 'This chat has been closed and is no longer active'
                  });
                }

                // If the user is not an admin and trying to send an admin message, reject
                const body = request.body as { isAdmin?: boolean };
                if (body.isAdmin && !request.user.isAdmin) {
                  request.log.error(`User ${request.user.id} attempted to send admin message without admin privileges`);
                  return reply.code(403).send({
                    error: 'Unauthorized to send admin messages',
                    details: 'Only administrators can send messages marked as admin'
                  });
                }

                // If the user is not an admin and the chat doesn't belong to them, reject
                if (!request.user.isAdmin && request.user.id !== chat.userId) {
                  request.log.error(`User ${request.user.id} attempted to send message to chat ${params.id} belonging to user ${chat.userId}`);
                  return reply.code(403).send({
                    error: 'Unauthorized access',
                    details: 'You can only send messages to your own chats'
                  });
                }
                
                request.log.info(`User ${request.user.id} authorized to send message to chat ${params.id}`);
              } catch (error) {
                request.log.error('Error in message preHandler:', error);
                return reply.code(500).send({
                  error: 'Server error during authorization check',
                  details: error instanceof Error ? error.message : 'Unknown error'
                });
              }
            }
          ],
        },
        async (request, reply) => {
          try {
            const { id } = request.params as { id: string };
            const body = request.body;
            
            // Validate chat ID
            if (!id) {
              request.log.error('Missing chat ID in route handler');
              return reply.code(400).send({
                error: 'Chat ID is required',
                details: 'A valid chat ID must be provided in the URL'
              });
            }
            
            // Validate message content
            if (!body || !body.content || body.content.trim() === '') {
              request.log.error('Empty message content in route handler');
              return reply.code(400).send({
                error: 'Message content cannot be empty',
                details: 'Please provide a non-empty message'
              });
            }
            
            request.log.info(`Forwarding message request to controller for chat ${id}`);
            request.log.info(`Request body: ${JSON.stringify(body)}`);
            
            // Create a properly structured request object
            const chatRequest = {
              params: { id },
              body: {
                content: body.content,
                isAdmin: body.isAdmin || false
              },
              user: request.user,
              log: request.log
            };
            
            request.log.info(`Structured request for controller: ${JSON.stringify(chatRequest)}`);
            
            try {
              const result = await chatController.addMessage(
                chatRequest as any,
                reply
              );
              return result;
            } catch (controllerError: any) {
              // Safely log the error with more details
              if (controllerError) {
                request.log.error(`Error from controller: ${controllerError.message || 'No message'}`);
                if (controllerError.stack) {
                  request.log.error(`Error stack: ${controllerError.stack}`);
                }
              } else {
                request.log.error('Error from controller: undefined error object');
              }
              
              // If the controller already sent a response, don't send another one
              if (reply.sent) {
                request.log.info('Response already sent by controller');
                return;
              }
              
              // Handle specific error types
              if (controllerError && controllerError instanceof Error) {
                if (controllerError.message === 'Chat not found') {
                  return reply.code(404).send({
                    error: 'Chat not found',
                    details: 'The specified chat does not exist'
                  });
                } else if (controllerError.message === 'Message content cannot be empty') {
                  return reply.code(400).send({
                    error: 'Message content cannot be empty',
                    details: 'Please provide a non-empty message'
                  });
                }
              }
              
              // Generic error response
              return reply.code(500).send({
                error: 'Server error processing message',
                details: controllerError instanceof Error ? controllerError.message : 'Unknown error'
              });
            }
          } catch (error: any) {
            // Safely log the error
            if (error) {
              request.log.error('Error in message route handler:', error);
            } else {
              request.log.error('Unknown error in message route handler (error object is undefined)');
            }
            
            // If a response has already been sent, don't try to send another one
            if (reply.sent) {
              request.log.info('Response already sent');
              return;
            }
            
            // Send a generic error response
            return reply.code(500).send({
              error: 'Server error processing message',
              details: error instanceof Error ? error.message : 'Unknown error'
            });
          }
        }
      );

      // Close a chat (admin only)
      router.put(
        '/:id/close',
        {
          schema: chatRouteSchemas.getById,
          preHandler: [router.authenticate, router.isAdmin]
        },
        async (request, reply) => {
          const { id } = request.params as { id: string };
          return chatController.closeChat(
            { params: { id } } as any,
            reply
          );
        }
      );

      // Reopen a chat (admin only)
      router.put(
        '/:id/reopen',
        {
          schema: chatRouteSchemas.getById,
          preHandler: [router.authenticate, router.isAdmin]
        },
        async (request, reply) => {
          const { id } = request.params as { id: string };
          return chatController.reopenChat(
            { params: { id } } as any,
            reply
          );
        }
      );
    },
    { prefix: '/chats' }
  );
}