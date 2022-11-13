import { all } from 'redux-saga/effects';
import getAdditionalBrands from './getAdditionalBrands';
import getCustomQuestions from './getCustomQuestions';
import getEyeTrackingPacks from './getEyeTrackingPacks';
import getPacks from './getPacks';
import getProject from './getProject';
import getProjectAttributes from './getProjectAttributes';
import getTarget from './getTarget';
import getUserAttributes from './getUserAttributes';
import getVideos from './getVideos';

export const projectSagas = function* root() {
  yield all([
    getProject(),
    getPacks(),
    getAdditionalBrands(),
    getProjectAttributes(),
    getUserAttributes(),
    getCustomQuestions(),
    getEyeTrackingPacks(),
    getTarget(),
    getVideos()
  ]);
};