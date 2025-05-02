import { prisma } from '@/config/db.config';
import { User, UserCreateInput, UserUpdateInput } from '@/models/user.model';
import { removeUndefined } from '@/utils/common.utils';

export class UserService {
  /**
   * Get all users
   */
  async getAllUsers() {
    return prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        country: true,
        phone: true,
        birthdate: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Get user by ID
   */
  async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        country: true,
        phone: true,
        birthdate: true,
        address: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Create a new user
   */
  async createUser(userData: UserCreateInput) {
    // In a real application, you would hash the password before storing it
    // const hashedPassword = await bcrypt.hash(userData.password, 10);

    return prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: userData.password, // Should be hashed in production
        country: userData.country || '', // Default values for required fields
        phone: userData.phone || '',
        birthdate: userData.birthdate || new Date(),
        address: userData.address || {
          street: '',
          city: '',
          state: '',
          country: '',
          zip: '',
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }

  /**
   * Update user by ID
   */
  async updateUser(
    id: string,
    userData: UserUpdateInput
  ) {
    // Remove undefined values to avoid overwriting with null
    const cleanedData = removeUndefined(userData);
    
    return prisma.user.update({
      where: { id },
      data: cleanedData,
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }

  /**
   * Delete user by ID
   */
  async deleteUser(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  }

  /**
   * Authenticate user (login)
   */
  async authenticateUser(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // In a real application, you would compare the hashed password
    // const isPasswordValid = await bcrypt.compare(password, user.password);
    const isPasswordValid = password === user.password; // Insecure, for demo only

    if (!isPasswordValid) {
      throw new Error('Invalid password');
    }

    // In a real application, you would generate JWT tokens here
    return {
      token: `mock-token-for-${user.id}`,
      refreshToken: `mock-refresh-token-for-${user.id}`,
    };
  }
}

export const userService = new UserService();