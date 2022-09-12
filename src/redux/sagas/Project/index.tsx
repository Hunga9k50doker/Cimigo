import { all } from 'redux-saga/effects';
import getAdditionalBrands from './getAdditionalBrands';
import getCustomQuestions from './getCustomQuestions';
import getPacks from './getPacks';
import getProject from './getProject';
import getProjectAttributes from './getProjectAttributes';
import getUserAttributes from './getUserAttributes';

export const projectSagas = function* root() {
  yield all([
    getProject(),
    getPacks(),
    getAdditionalBrands(),
    getProjectAttributes(),
    getUserAttributes(),
    getCustomQuestions()
  ]);
};