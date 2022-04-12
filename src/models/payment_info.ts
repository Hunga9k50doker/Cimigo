import { Country } from "./country";

export interface PaymentInfo {
  id: number;
  userId: number;
  fullName: string;
  companyName: string;
  companyAddress: string;
  email: string;
  phone: string;
  countryId: number;
  taxCode: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  country: Country
}