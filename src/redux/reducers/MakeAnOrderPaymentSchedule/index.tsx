import produce from "immer";
import _ from "lodash";
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
      case types.SET_MAKE_AN_ORDER:
        if (action.data && !_.isEmpty(action.data)) {
          draft.isMakeAnOrder = action.data.isMakeAnOrder;
        } else {
          draft.isMakeAnOrder = false;
        }
        break;
    }
  });
