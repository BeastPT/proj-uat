import { Address } from "./address.type"
import { PaymentMethod } from "./paymentmethod.type"

export interface User {
  id: string
  name: string
  email: string
  password: string
  country: string
  phone: string
  birthdate: Date
  address: Address
  drivingLicense?: DrivingLicense
  isVerified: boolean
  paymentMethods: PaymentMethod[]
  createdAt: Date
  updatedAt: Date
}

interface DrivingLicense {
  number: string
  issueDate?: Date
  expiryDate: Date
  country: string
}