export const SET_PAYMENT_IS_MAKE_AN_ORDER_SUCCESS_REDUCER = 'SET_PAYMENT_IS_MAKE_AN_ORDER_SUCCESS_REDUCER';
export const setPaymentIsMakeAnOrderSuccessReducer = (data: boolean) => {
    return {
      type: SET_PAYMENT_IS_MAKE_AN_ORDER_SUCCESS_REDUCER,
      data: data
    }
  }