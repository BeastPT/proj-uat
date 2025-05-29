import { Address } from '@/types/address.type';
import { PaymentMethod } from '@/types/paymentmethod.type';

export interface DrivingLicense {
  number: string;
  issueDate?: Date;
  expiryDate: Date;
  country: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  country: string;
  phone: string;
  birthdate: Date;
  address: Address;
  drivingLicense?: DrivingLicense;
  isVerified: boolean;
  isAdmin: boolean;
  paymentMethods: PaymentMethod[];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreateInput {
  name: string;
  email: string;
  password: string;
  country?: string;
  phone?: string;
  birthdate?: Date;
  address?: Address;
  drivingLicense?: DrivingLicense;
}

export interface UserUpdateInput {
  name?: string;
  email?: string;
  password?: string;
  country?: string;
  phone?: string;
  birthdate?: Date;
  address?: Address;
  drivingLicense?: DrivingLicense;
  isVerified?: boolean;
  isAdmin?: boolean;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  country: string;
  phone: string;
  birthdate: Date;
  address: Address;
  drivingLicense?: DrivingLicense;
  isVerified: boolean;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserLoginResponse {
  token: string;
  refreshToken: string;
}