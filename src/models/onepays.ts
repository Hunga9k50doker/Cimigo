export interface OnePay {
  id: number;
  userPaymentId: number;
  amount: string;
  status: number;
  paymentMethodId: number;
  module: string;
  rawCheckout: string;
  rawCallback: string;
  vpc_MerchTxnRef: string;
  vpc_OrderInfo: string;
  vpc_TicketNo: string;
  vpc_TxnResponseCode: string;
  vpc_TransactionNo: string;
  message: string;
  completedDate: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
