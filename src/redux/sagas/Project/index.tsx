import { all } from 'redux-saga/effects';
import getAdditionalBrands from './getAdditionalBrands';
import getPacks from './getPacks';
import getProject from './getProject';

export const projectSagas = function* root() {
  yield all([
    getProject(),
    getPacks(),
    getAdditionalBrands()
  ]);
};