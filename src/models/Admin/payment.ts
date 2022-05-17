export interface UpdatePayment {
  fullName: string;
  companyName: string;
  companyAddress: string;
  email: string;
  phone: string;
  countryId: number;
  taxCode: string;
  sampleSizeCost: number;
  sampleSizeCostUSD: number;
  amount: number;
  amountUSD: number;
  vat: number;
  vatUSD: number;
  totalAmount: number;
  totalAmountUSD: number;
}

export interface GetPaymentsParams {
  take: number;
  page: number;
  keyword?: string;
  paymentMethodIds?: number[];
}