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
    return prisma.chat.findMany({
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
  }

  /**
   * Get chats for a specific user
   */
  async getUserChats(userId: string) {
    return prisma.chat.findMany({
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
  }

  /**
   * Get a single chat by ID
   */
  async getChatById(id: string) {
    return prisma.chat.findUnique({
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
  }

  /**
   * Create a new chat
   */
  async createChat(userId: string) {
    // Check if user exists
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
      return existingChat;
    }

    // Create a new chat
    return prisma.chat.create({
      data: {
        userId,
      },
      select: ChatSelect,
    });
  }

  /**
   * Get messages for a chat
   */
  async getChatMessages(chatId: string) {
    return prisma.message.findMany({
      where: {
        chatId,
      },
      select: MessageSelect,
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  /**
   * Add a message to a chat
   */
  async addMessage(chatId: string, content: string, isAdmin: boolean = false) {
    // Check if chat exists
    const chatExists = await prisma.chat.findUnique({
      where: { id: chatId },
    });

    if (!chatExists) {
      throw new Error('Chat not found');
    }

    // Create the message
    const message = await prisma.message.create({
      data: {
        chatId,
        content,
        isAdmin,
      },
      select: MessageSelect,
    });

    // Update the chat's updatedAt timestamp
    await prisma.chat.update({
      where: { id: chatId },
      data: {
        updatedAt: new Date(),
      },
    });

    return message;
  }

  /**
   * Close a chat
   */
  async closeChat(id: string) {
    return prisma.chat.update({
      where: { id },
      data: {
        isActive: false,
      },
      select: ChatSelect,
    });
  }

  /**
   * Reopen a chat
   */
  async reopenChat(id: string) {
    return prisma.chat.update({
      where: { id },
      data: {
        isActive: true,
      },
      select: ChatSelect,
    });
  }
}

export const chatService = new ChatService();