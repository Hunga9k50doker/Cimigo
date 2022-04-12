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