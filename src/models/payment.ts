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
  amount: number;
  amountUSD: number;
  vat: number;
  vatUSD: number;
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
  email: string;
  phone: string;
  countryId: number;
  taxCode: string;
  invoiceDate: Date;
  userConfirm: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
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