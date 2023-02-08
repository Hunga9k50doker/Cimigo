import { MakeAnOrderReducer } from ".";

export const SET_MAKE_AN_ORDER = 'SET_MAKE_AN_ORDER';
export const setMakeAnOrderReducer = (data: MakeAnOrderReducer) => {
    return {
      type: SET_MAKE_AN_ORDER,
      data: data
    }
  }