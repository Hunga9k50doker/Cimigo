import produce from "immer";
import * as types from "./actionTypes";
export interface PaymentState {
  isMakeAnOrder: boolean;
}
const initial: PaymentState = {
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
