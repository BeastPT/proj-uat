import { Address } from '@/types/address.type';

export interface PaymentMethod {
  id: string;
  userId: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: Date;
  cvv: string;
  billingAddress: Address;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentMethodCreateInput {
  userId: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: Date;
  cvv: string;
  billingAddress: Address;
}

export interface PaymentMethodUpdateInput {
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: Date;
  cvv?: string;
  billingAddress?: Address;
}

export interface PaymentMethodResponse {
  id: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: Date;
  billingAddress: Address;
  createdAt: Date;
  updatedAt: Date;
}