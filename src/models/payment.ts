import { Country } from "./country";
import { CustomQuestion } from "./custom_question";
import { OptionItem } from "./general";
import { OnePay } from "./onepays";
import { Project } from "./project";
import { User } from "./user";

export interface CheckoutParams {
  projectId: number,
  returnUrl?: string,
  againLink?: string,
  paymentMethodId: number,
  contactName: string,
  contactEmail: string,
  contactPhone: string,
  saveForLater: boolean,
  fullName: string,
  companyName: string,
  title: string,
  email: string,
  phone: string,
  countryId: number,
  companyAddress: string,
  taxCode: string
}

export interface Payment {
  id: number;
  orderId: string;
  userId: number;
  projectId: number;
  sampleSize: number;
  sampleSizeCost: number;
  sampleSizeCostUSD: number;
  customQuestions: CustomQuestion[];
  customQuestionCost: number;
  customQuestionCostUSD: number;
  amount: number;
  amountUSD: number;
  vat: number;
  vatUSD: number;
  vatRate: number;
  usdToVNDRate: number;
  totalAmount: number;
  totalAmountUSD: number;
  paymentMethodId: number;
  status: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  fullName: string;
  companyName: string;
  companyAddress: string;
  title: string;
  email: string;
  phone: string;
  countryId: number;
  taxCode: string;
  invoiceDate: Date;
  userConfirm: boolean;
  createdAt: Date;
  completedDate: Date;
  cancelledDate: Date;
  updatedAt: Date;
  deletedAt: Date;
  country: Country;
  user: User;
  project: Project;
  onepays: OnePay[];
  eyeTrackingSampleSizeCostUSD: number;
  eyeTrackingSampleSize: number;
}

export interface TryAgain {
  projectId: number;
  returnUrl: string,
  againLink: string,
}

export interface ChangePaymentMethodParams {
  projectId: number,
  paymentMethodId: number,
  contactName: string,
  contactEmail: string,
  contactPhone: string,
  returnUrl?: string,
  againLink?: string,
}

export interface ChangePaymentMethodFormData {
  paymentMethodId: number,
  contactName: string,
  contactEmail: string,
  contactPhone: string,
}

export interface UpdateConfirmPayment {
  projectId: number;
  userConfirm: boolean;
}

export enum EPaymentStatus {
  NOT_PAID = 0,
  PAID,
  CANCEL,
  FAILED
}
export interface UpdateInvoiceInfo {
  saveForLater: boolean,
  fullName: string,
  companyName: string,
  title: string,
  email: string,
  phone: string,
  countryId: number,
  companyAddress: string,
  taxCode: string,
}

export const paymentStatuses: OptionItem[] = [
  { id: EPaymentStatus.NOT_PAID, name: 'Not paid' },
  { id: EPaymentStatus.PAID, name: 'Paid' },
  { id: EPaymentStatus.CANCEL, name: 'Cancel' },
  { id: EPaymentStatus.FAILED, name: 'Failed' },
]