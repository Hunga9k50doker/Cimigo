import produce from 'immer';
import * as types from './actionTypes';


export interface AuthState {
  token?: string;
}

const initial: AuthState = {
  token: null
}

export const authReducer = (state = initial, action: any) =>
  produce(state, draft => {
    switch (action.type) {
      case types.SET_USER_TOKEN_REDUCER:
        draft.token = action.token
        break;
      case types.CLEAR_USER_TOKEN_REDUCER:
        draft.token = null
        break;
      default:
        return state;
    }
  })
