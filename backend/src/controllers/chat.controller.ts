import { FastifyRequest, FastifyReply } from 'fastify';
import { chatService } from '@/services/chat.service';
import { createChatSchema, createMessageSchema } from '@/schemas/chat.schema';
import { z } from 'zod';

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
      const chat = await chatService.createChat(userId);
      return reply.code(201).send(chat);
    } catch (error) {
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
      const { id } = request.params;
      const { content, isAdmin } = request.body;
      
      // Get the user from the request (set by auth middleware)
      const user = request.user;
      
      // If the user is not an admin and isAdmin is true, reject the request
      if (isAdmin && (!user || !user.isAdmin)) {
        return reply.code(403).send({ error: 'Unauthorized to send admin messages' });
      }
      
      const message = await chatService.addMessage(id, content, isAdmin || false);
      return reply.code(201).send(message);
    } catch (error) {
      request.log.error(error);
      if (error instanceof Error && error.message === 'Chat not found') {
        return reply.code(404).send({ error: error.message });
      }
      return reply.code(500).send({ error: 'Failed to add message' });
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