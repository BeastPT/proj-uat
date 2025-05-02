import { Address } from "./address.type"

export interface PaymentMethod {
  id: string
  cardHolderName: string
  cardNumber: string
  expiryMonth: number
  expiryYear: number
  billingAddress: Address
  isDefault: boolean
}