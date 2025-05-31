import { FastifyRequest, FastifyReply } from 'fastify';
import { chatService } from '@/services/chat.service';
import { createChatSchema, createMessageSchema } from '@/schemas/chat.schema';
import { z } from 'zod';
import { prisma } from '@/config/db.config';

export class ChatController {
  /**
   * Get all chats
   */
  async getAllChats(request: FastifyRequest, reply: FastifyReply) {
    try {
      const chats = await chatService.getAllChats();
      return reply.code(200).send(chats);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to get chats' });
    }
  }

  /**
   * Get chats for a specific user
   */
  async getUserChats(
    request: FastifyRequest<{ Params: { userId: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { userId } = request.params;
      const chats = await chatService.getUserChats(userId);
      return reply.code(200).send(chats);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to get user chats' });
    }
  }

  /**
   * Get a single chat by ID
   */
  async getChatById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const chat = await chatService.getChatById(id);
      
      if (!chat) {
        return reply.code(404).send({ error: 'Chat not found' });
      }
      
      return reply.code(200).send(chat);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to get chat' });
    }
  }

  /**
   * Create a new chat
   */
  async createChat(
    request: FastifyRequest<{ Body: z.infer<typeof createChatSchema> }>,
    reply: FastifyReply
  ) {
    try {
      const { userId } = request.body;
      
      // Check if an active chat already exists for this user
      const existingChat = await prisma.chat.findFirst({
        where: {
          userId,
          isActive: true,
        },
      });

      if (existingChat) {
        // Return 409 Conflict with the existing chat ID
        return reply.code(409).send({
          error: 'Active chat already exists for this user',
          chatId: existingChat.id
        });
      }
      
      const chat = await chatService.createChat(userId);
      return reply.code(201).send(chat);
    } catch (error) {
      console.log('----------------------------------------------------------------------Error creating chat:', error);
      request.log.error(error);
      if (error instanceof Error && error.message === 'User not found') {
        return reply.code(404).send({ error: error.message });
      }
      return reply.code(500).send({ error: 'Failed to create chat' });
    }
  }

  /**
   * Get messages for a chat
   */
  async getChatMessages(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const messages = await chatService.getChatMessages(id);
      return reply.code(200).send(messages);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to get chat messages' });
    }
  }

  /**
   * Add a message to a chat
   */
  async addMessage(
    request: FastifyRequest<{
      Params: { id: string };
      Body: z.infer<typeof createMessageSchema>;
    }>,
    reply: FastifyReply
  ) {
    try {
      // Log the full request for debugging
      request.log.info(`addMessage called with params: ${JSON.stringify(request.params)}`);
      request.log.info(`addMessage called with body: ${JSON.stringify(request.body)}`);
      
      // Ensure params and body exist
      if (!request.params) {
        request.log.error('Missing params in request');
        return reply.code(400).send({
          error: 'Invalid request',
          details: 'Missing parameters in request'
        });
      }
      
      if (!request.body) {
        request.log.error('Missing body in request');
        return reply.code(400).send({
          error: 'Invalid request',
          details: 'Missing body in request'
        });
      }
      
      const { id } = request.params;
      const { content, isAdmin } = request.body;
      
      // Log the extracted values
      request.log.info(`Extracted values - id: ${id}, content: ${content?.substring(0, 20)}${content?.length > 20 ? '...' : ''}, isAdmin: ${isAdmin}`);
      
      // Validate chat ID
      if (!id) {
        request.log.error('Missing chat ID in request params');
        return reply.code(400).send({
          error: 'Chat ID is required',
          details: 'A valid chat ID must be provided in the URL'
        });
      }
      
      // Validate message content
      if (!content || content.trim() === '') {
        request.log.error('Empty message content');
        return reply.code(400).send({
          error: 'Message content cannot be empty',
          details: 'Please provide a non-empty message'
        });
      }
      
      // Get the user from the request (set by auth middleware)
      const user = request.user;
      
      if (!user) {
        request.log.error('No authenticated user found in request');
        return reply.code(401).send({
          error: 'Authentication required',
          details: 'You must be logged in to send messages'
        });
      }
      
      request.log.info(`User ${user.id} is sending message to chat ${id}`);
      
      // If the user is not an admin and isAdmin is true, reject the request
      if (isAdmin && !user.isAdmin) {
        request.log.error(`User ${user.id} attempted to send admin message without admin privileges`);
        return reply.code(403).send({
          error: 'Unauthorized to send admin messages',
          details: 'Only administrators can send messages marked as admin'
        });
      }
      
      // Check if the chat exists and is active
      const chat = await prisma.chat.findUnique({
        where: { id },
        select: { isActive: true, userId: true },
      });
      
      if (!chat) {
        request.log.error(`Chat ${id} not found`);
        return reply.code(404).send({
          error: 'Chat not found',
          details: 'The specified chat does not exist'
        });
      }
      
      if (!chat.isActive) {
        request.log.error(`Attempted to send message to inactive chat ${id}`);
        return reply.code(400).send({
          error: 'Cannot send messages to inactive chat',
          details: 'This chat has been closed and is no longer active'
        });
      }
      
      // Verify the user has permission to send messages to this chat
      if (!user.isAdmin && user.id !== chat.userId) {
        request.log.error(`User ${user.id} attempted to send message to chat ${id} belonging to user ${chat.userId}`);
        return reply.code(403).send({
          error: 'You do not have permission to send messages to this chat',
          details: 'You can only send messages to your own chats'
        });
      }
      
      const message = await chatService.addMessage(id, content, isAdmin || false);
      request.log.info(`Message successfully added to chat ${id}, message ID: ${message.id}`);
      return reply.code(201).send(message);
    } catch (error: any) {
      // Safely log the error
      if (error) {
        request.log.error('Error in addMessage:', error);
      } else {
        request.log.error('Unknown error in addMessage (error object is undefined)');
      }
      
      // Handle specific error types
      if (error && error instanceof Error) {
        request.log.error(`Error adding message: ${error.message}`);
        
        if (error.message === 'Chat not found') {
          return reply.code(404).send({
            error: 'Chat not found',
            details: 'The specified chat does not exist'
          });
        } else if (error.message === 'Message content cannot be empty') {
          return reply.code(400).send({
            error: 'Message content cannot be empty',
            details: 'Please provide a non-empty message'
          });
        } else if (error.message === 'Cannot add messages to inactive chat') {
          return reply.code(400).send({
            error: 'Cannot send messages to inactive chat',
            details: 'This chat has been closed and is no longer active'
          });
        }
      }
      
      // Generic error response
      return reply.code(500).send({
        error: 'Failed to add message',
        details: (error && error instanceof Error) ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Close a chat
   */
  async closeChat(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const chat = await chatService.closeChat(id);
      return reply.code(200).send(chat);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to close chat' });
    }
  }

  /**
   * Reopen a chat
   */
  async reopenChat(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { id } = request.params;
      const chat = await chatService.reopenChat(id);
      return reply.code(200).send(chat);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Failed to reopen chat' });
    }
  }
}

export const chatController = new ChatController();