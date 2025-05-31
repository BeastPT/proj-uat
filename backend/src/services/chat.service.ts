import { prisma } from "@/config/db.config";

const ChatSelect = {
  id: true,
  userId: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
};

const MessageSelect = {
  id: true,
  chatId: true,
  content: true,
  isAdmin: true,
  createdAt: true,
};

export class ChatService {
  /**
   * Get all chats
   */
  async getAllChats() {
    const chats = await prisma.chat.findMany({
      select: {
        ...ChatSelect,
        messages: {
          select: MessageSelect,
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
    
    // Convert Date objects to ISO strings
    return chats.map(chat => ({
      ...chat,
      createdAt: chat.createdAt.toISOString(),
      updatedAt: chat.updatedAt.toISOString(),
      messages: chat.messages?.map(msg => ({
        ...msg,
        createdAt: msg.createdAt.toISOString()
      }))
    }));
  }

  /**
   * Get chats for a specific user
   */
  async getUserChats(userId: string) {
    const chats = await prisma.chat.findMany({
      where: {
        userId,
      },
      select: {
        ...ChatSelect,
        messages: {
          select: MessageSelect,
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
    
    // Convert Date objects to ISO strings
    return chats.map(chat => ({
      ...chat,
      createdAt: chat.createdAt.toISOString(),
      updatedAt: chat.updatedAt.toISOString(),
      messages: chat.messages?.map(msg => ({
        ...msg,
        createdAt: msg.createdAt.toISOString()
      }))
    }));
  }

  /**
   * Get a single chat by ID
   */
  async getChatById(id: string) {
    const chat = await prisma.chat.findUnique({
      where: { id },
      select: {
        ...ChatSelect,
        messages: {
          select: MessageSelect,
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });
    
    if (!chat) return null;
    
    // Convert Date objects to ISO strings
    return {
      ...chat,
      createdAt: chat.createdAt.toISOString(),
      updatedAt: chat.updatedAt.toISOString(),
      messages: chat.messages?.map(msg => ({
        ...msg,
        createdAt: msg.createdAt.toISOString()
      }))
    };
  }

  /**
   * Create a new chat
   */
  async createChat(userId: string) {
    // Check if user exists
    console.log(`Creating chat for user: ${userId}`);
    
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (!userExists) {
      throw new Error('User not found');
    }
    
    // Check if an active chat already exists for this user
    const existingChat = await prisma.chat.findFirst({
      where: {
        userId,
        isActive: true,
      },
    });
    
    if (existingChat) {
      console.log(`Chat already exists for user: ${userId}`);
      // Convert Date objects to ISO strings
      return {
        ...existingChat,
        createdAt: existingChat.createdAt.toISOString(),
        updatedAt: existingChat.updatedAt.toISOString()
      };
    }
    
    // Create a new chat
    console.log(`Chat CREATE exists for user: ${userId}`);
    const newChat = await prisma.chat.create({
      data: {
        userId,
      },
      select: ChatSelect,
    });
    
    // Convert Date objects to ISO strings
    return {
      ...newChat,
      createdAt: newChat.createdAt.toISOString(),
      updatedAt: newChat.updatedAt.toISOString()
    };
  }

  /**
   * Get messages for a chat
   */
  async getChatMessages(chatId: string) {
    const messages = await prisma.message.findMany({
      where: {
        chatId,
      },
      select: MessageSelect,
      orderBy: {
        createdAt: 'asc',
      },
    });
    
    // Convert Date objects to ISO strings
    return messages.map(msg => ({
      ...msg,
      createdAt: msg.createdAt.toISOString()
    }));
  }

  /**
   * Add a message to a chat
   */
  async addMessage(chatId: string, content: string, isAdmin: boolean = false) {
    try {
      // Log all input parameters for debugging
      console.log('addMessage called with parameters:');
      console.log(`- chatId: ${chatId}`);
      console.log(`- content: ${content?.substring(0, 20)}${content?.length > 20 ? '...' : ''}`);
      console.log(`- content length: ${content?.length || 0}`);
      console.log(`- isAdmin: ${isAdmin}`);
      
      // Input validation with detailed error messages
      if (!chatId) {
        console.error('Missing chat ID');
        throw new Error('Chat ID is required');
      }
      
      if (typeof chatId !== 'string') {
        console.error(`Invalid chat ID type: ${typeof chatId}`);
        throw new Error('Chat ID must be a string');
      }
      
      if (!content) {
        console.error('Message content is null or undefined');
        throw new Error('Message content cannot be null or undefined');
      }
      
      if (typeof content !== 'string') {
        console.error(`Invalid content type: ${typeof content}`);
        throw new Error('Message content must be a string');
      }
      
      if (content.trim() === '') {
        console.error('Empty message content');
        throw new Error('Message content cannot be empty');
      }
      
      // Check if chat exists and is active
      const chatExists = await prisma.chat.findUnique({
        where: { id: chatId },
        select: { id: true, isActive: true }
      });
  
      if (!chatExists) {
        console.error(`Chat ${chatId} not found`);
        throw new Error('Chat not found');
      }
      
      if (!chatExists.isActive) {
        console.error(`Attempted to add message to inactive chat ${chatId}`);
        throw new Error('Cannot add messages to inactive chat');
      }
  
      console.log(`Creating message in chat ${chatId}`);
      
      // Create the message
      const message = await prisma.message.create({
        data: {
          chatId,
          content,
          isAdmin,
        },
        select: MessageSelect,
      });
      
      if (!message) {
        console.error(`Failed to create message in chat ${chatId}`);
        throw new Error('Failed to create message');
      }
      
      console.log(`Message created with ID: ${message.id}`);
  
      // Update the chat's updatedAt timestamp
      await prisma.chat.update({
        where: { id: chatId },
        data: {
          updatedAt: new Date(),
        },
      });
      
      console.log(`Chat ${chatId} updatedAt timestamp updated`);
  
      // Convert Date object to ISO string
      return {
        ...message,
        createdAt: message.createdAt.toISOString()
      };
    } catch (error: any) {
      // Log the error with detailed information
      console.error(`Error adding message to chat ${chatId}:`, error);
      console.error(`Error stack: ${error?.stack || 'No stack trace available'}`);
      
      // Re-throw specific errors with clear messages
      if (error instanceof Error) {
        // Pass through known errors
        if (
          error.message === 'Chat not found' ||
          error.message === 'Message content cannot be empty' ||
          error.message === 'Cannot add messages to inactive chat' ||
          error.message === 'Chat ID is required'
        ) {
          throw error;
        }
        
        // For database or other errors, provide a generic message
        if (error.message.includes('prisma') || error.message.includes('database')) {
          console.error('Database error:', error.message);
          throw new Error('Database error occurred while adding message');
        }
        
        throw error;
      } else {
        // For non-Error objects
        throw new Error('Failed to add message to chat');
      }
    }
  }

  /**
   * Close a chat
   */
  async closeChat(id: string) {
    const chat = await prisma.chat.update({
      where: { id },
      data: {
        isActive: false,
      },
      select: ChatSelect,
    });
    
    // Convert Date objects to ISO strings
    return {
      ...chat,
      createdAt: chat.createdAt.toISOString(),
      updatedAt: chat.updatedAt.toISOString()
    };
  }

  /**
   * Reopen a chat
   */
  async reopenChat(id: string) {
    const chat = await prisma.chat.update({
      where: { id },
      data: {
        isActive: true,
      },
      select: ChatSelect,
    });
    
    // Convert Date objects to ISO strings
    return {
      ...chat,
      createdAt: chat.createdAt.toISOString(),
      updatedAt: chat.updatedAt.toISOString()
    };
  }
}

export const chatService = new ChatService();