import produce from 'immer';
import { ConfigData } from 'models/config';
import { User } from 'models/user';
import * as types from './actionTypes';

export interface UserState {
  user?: User,
  configs?: ConfigData
}

const initial: UserState = {
  user: null,
  configs: null
}

export const userReducer = (state = initial, action: any) =>
  produce(state, draft => {
    switch (action.type) {
      case types.USER_LOGIN_REDUCER:
        draft.user = action.data;
        break;
      case types.USER_LOGOUT_REDUCER:
        draft.user = null;
        break;
      case types.SET_CONFIGS_REDUCER:
        draft.configs = action.data;
        break;
      default:
        return state;
    }
  })
