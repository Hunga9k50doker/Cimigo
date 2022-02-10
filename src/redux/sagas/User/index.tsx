import { all } from 'redux-saga/effects';
import getMe from './getMe';
import login from './login';
import logout from './logout';

export const userSagas = function* root() {
  yield all([
    login(),
    logout(),
    getMe()
  ]);
};