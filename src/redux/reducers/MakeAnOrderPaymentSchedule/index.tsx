import produce from "immer";
import * as types from "./actionTypes";
export interface PaymentIsMakeAnOrderState {
  isMakeAnOrder: boolean;
}
const initial: PaymentIsMakeAnOrderState = {
  isMakeAnOrder: false,
};
export const paymentIsMakeAnOrderReducer = (state = initial, action: any) =>
  produce(state, (draft) => {
    switch (action.type) {
      case types.SET_PAYMENT_IS_MAKE_AN_ORDER_SUCCESS_REDUCER:
        draft.isMakeAnOrder = action.data;
        break;
    }
  });
