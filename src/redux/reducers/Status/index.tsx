import produce from 'immer';
import * as types from './actionTypes';

export interface StatusState {
  isLoading: boolean,
  isLoadingAuth: boolean,
}

const initial: StatusState = {
  isLoading: false,
  isLoadingAuth: true,
}
export const statusReducer = (state = initial, action: any) =>
  produce(state, draft => {
    switch (action.type) {
      case types.SET_LOADING_AUTH_REDUCER:
        draft.isLoadingAuth = action.isLoadingAuth
        break;
      case types.SET_LOADING_REDUCER:
        draft.isLoading = action.isLoading
        break;
      default:
        return state;
    }
  })
