import { prisma } from "@/config/db.config";
import { User, UserCreateInput, UserUpdateInput } from "@/models/user.model";
import { removeUndefined } from "@/utils/common.utils";
import { sign } from "jsonwebtoken";


import { compare, hash } from "bcrypt";

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET

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
        isAdmin: true,
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
        isAdmin: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Create a new user
   */
  async createUser(userData: UserCreateInput) {
    const hashedPassword = await hash(userData.password, 10);

    return prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: hashedPassword,
        country: userData.country || "", // Default values for required fields
        phone: userData.phone || "",
        birthdate: userData.birthdate || new Date(),
        address: userData.address || {
          street: "",
          city: "",
          state: "",
          country: "",
          zip: "",
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
  async updateUser(id: string, userData: UserUpdateInput) {
    const cleanedData = removeUndefined(userData);

    return prisma.user.update({
      where: { id },
      data: cleanedData,
      select: {
        id: true,
        name: true,
        email: true,
        country: true,
        phone: true,
        birthdate: true,
        address: true,
        isVerified: true,
        isAdmin: true,
        createdAt: true,
        updatedAt: true,
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
    if (!JWT_SECRET || !REFRESH_TOKEN_SECRET) {
      throw new Error("JWT secret is not defined");
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid password");
    }

    const token = sign(
      {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Generate refresh token
    const refreshToken = sign({ id: user.id }, REFRESH_TOKEN_SECRET, {
      expiresIn: "7d",
    });

    return {
      token,
      refreshToken,
    };
  }
}

export const userService = new UserService();
