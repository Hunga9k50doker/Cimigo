import { push } from 'connected-react-router';
import { put, takeLatest, call } from 'redux-saga/effects';
import { GET_PROJECT_REQUEST, setProjectReducer } from 'redux/reducers/Project/actionTypes';
import { setErrorMess, setLoading } from 'redux/reducers/Status/actionTypes';
import { routes } from 'routers/routes';
import { ProjectService } from 'services/project';

function* requestGetProject(data: { type: string,  id: number, callback: () => void }) {
  try {
    yield put(setLoading(true))
    const project = yield call(ProjectService.getProject, data.id);
    yield put(setProjectReducer(project))
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
