import produce from "immer";
import _ from "lodash";
import * as types from "./actionTypes";
export interface MakeAnOrderReducer {
  projectId?: number;
  startDate?: Date;
}
export interface MakeAnOrderPaymentScheduleState {
  makeAnOrderPaymentSchedule: MakeAnOrderReducer;
}
const initial: MakeAnOrderPaymentScheduleState = {
  makeAnOrderPaymentSchedule: null,
};
export const makeAnOrderPaymentScheduleReducer = (
  state = initial,
  action: any
) =>
  produce(state, (draft) => {
    switch (action.type) {
      case types.SET_MAKE_AN_ORDER:
        if (action.data && !_.isEmpty(action.data)) {
          draft.makeAnOrderPaymentSchedule = {
            ...action.data,
          };
        } else {
          draft.makeAnOrderPaymentSchedule = null;
        }
        break;
    }
  });
