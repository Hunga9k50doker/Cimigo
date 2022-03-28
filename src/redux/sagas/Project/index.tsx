import { all } from 'redux-saga/effects';
import getProject from './getProject';

export const projectSagas = function* root() {
  yield all([
    getProject()
  ]);
};