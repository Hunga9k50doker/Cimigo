import { PaymentState } from ".";

export const SET_PAYMENT_REDUCER = 'SET_PAYMENT_REDUCER';
export const setPaymentReducer = (data: PaymentState) => {
    return {
      type: SET_PAYMENT_REDUCER,
      data: data
    }
  }