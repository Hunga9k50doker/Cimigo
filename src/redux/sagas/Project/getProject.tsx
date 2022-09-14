import { push } from 'connected-react-router';
import { put, takeLatest, call } from 'redux-saga/effects';
import { getAdditionalBrandsRequest, getPacksRequest, GET_PROJECT_REQUEST, setProjectReducer, getUserAttributesRequest, getProjectAttributesRequest, getCustomQuestionsRequest, getEyeTrackingPacksRequest } from 'redux/reducers/Project/actionTypes';
import { setErrorMess, setLoading } from 'redux/reducers/Status/actionTypes';
import { routes } from 'routers/routes';
import { ProjectService } from 'services/project';

function* requestGetProject(data: { type: string, id: number, callback: () => void }) {
  try {
    yield put(setLoading(true))
    const project = yield call(ProjectService.getProject, data.id);
    yield put(setProjectReducer(project))
    yield put(getPacksRequest(data.id))
    yield put(getAdditionalBrandsRequest(data.id))
    yield put(getUserAttributesRequest(data.id))
    yield put(getProjectAttributesRequest(data.id))
    yield put(getCustomQuestionsRequest(data.id))
    yield put(getEyeTrackingPacksRequest(data.id))
    
    data.callback && data.callback()
  } catch (e: any) {
    yield put(setErrorMess(e))
    if (e?.status === 404) {
      yield put(push(routes.project.management))
    }
  } finally {
    yield put(setLoading(false))
  }
}

function* getProject() {
  yield takeLatest(GET_PROJECT_REQUEST, requestGetProject);
}

export default getProject;
