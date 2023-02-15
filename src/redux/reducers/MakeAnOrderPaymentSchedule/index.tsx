import produce from "immer";
import * as types from "./actionTypes";
export interface PaymentState {
  isMakeAnOrder: boolean;
}
const initial: PaymentState = {
  isMakeAnOrder: false,
};
export const paymentReducer = (
  state = initial,
  action: any
) =>
  produce(state, (draft) => {
    switch (action.type) {
      case types.SET_PAYMENT_REDUCER:
        draft.isMakeAnOrder = action.data.isMakeAnOrder;
        break;
    }
  });
