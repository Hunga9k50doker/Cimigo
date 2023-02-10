import produce from "immer";
import _ from "lodash";
import * as types from "./actionTypes";
export interface InfoMakeAnOrder {
  projectId?: number;
  startDate?: Date;
}
export interface PaymentState {
  isMakeAnOrder: boolean;
  infoMakeAnOrder: InfoMakeAnOrder;
}
const initial: PaymentState = {
  isMakeAnOrder: false,
  infoMakeAnOrder: null,
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
          draft.infoMakeAnOrder = {
            ...action.data.infoMakeAnOrder,
          }
        } else {
          draft.isMakeAnOrder = false;
          draft.infoMakeAnOrder = null;
        }
        break;
    }
  });
