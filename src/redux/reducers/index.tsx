import { combineReducers } from 'redux';
import { History } from 'history';
import { connectRouter } from 'connected-react-router';
import { AuthState, authReducer } from './Auth';
import { StatusState, statusReducer } from './Status';
import { userReducer, UserState } from './User';


const createRootReducer = (history: History) => {
  const reducers = combineReducers({
    auth: authReducer,
    user: userReducer,
    status: statusReducer,
    router: connectRouter(history),
  });
  return reducers;
};

export interface ReducerType {
  auth: AuthState;
  status: StatusState;
  user: UserState;
  router: {
    location: {
      pathname: string;
      search: string;
      hash: string;
    };
    action: string;
  };
}

export default createRootReducer;
