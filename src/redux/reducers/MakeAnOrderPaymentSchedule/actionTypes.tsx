import { PaymentState } from ".";

export const SET_MAKE_AN_ORDER = 'SET_MAKE_AN_ORDER';
export const setPaymentReducer = (data: PaymentState) => {
    return {
      type: SET_MAKE_AN_ORDER,
      data: data
    }
  }