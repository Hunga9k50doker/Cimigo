import { put, takeLatest, select } from 'redux-saga/effects';
import { SET_LOADING_AUTH_REDUCER } from 'redux/reducers/Status/actionTypes';
import { ReducerType } from 'redux/reducers';
import { GET_ME_REQUEST } from 'redux/reducers/User/actionTypes';

function* requestGetMe() {
  const token = yield select((state: ReducerType) => state.auth.token);
  if(!token) {
    yield put({
      type: SET_LOADING_AUTH_REDUCER,
      isLoadingAuth: false,
    });
    return;
  }
  // try {
  //   const userLogin = yield call(getMeApi);
  //   yield put({
  //     type: USER_LOGIN_REDUCER,
  //     user: userLogin,
  //   });
  // } catch (e) {
  //   if(e.status !== 401) {
  //     yield put({
  //       type: USER_LOGOUT_REQUEST,
  //     });
  //   }
  // } finally {
  //   yield put({
  //     type: SET_LOADING_AUTH_REDUCER,
  //     isLoadingAuth: false,
  //   });
  // }
}

function* getMe() {
  yield takeLatest(GET_ME_REQUEST, requestGetMe);
}

export default getMe;
