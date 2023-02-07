import { push } from 'connected-react-router';
import { Project } from 'models/project';
import { put, takeLatest, call } from 'redux-saga/effects';
import { getVideosRequest, getTargetRequest, getAdditionalBrandsRequest, getPacksRequest, GET_PROJECT_REQUEST, setProjectReducer, getUserAttributesRequest, getProjectAttributesRequest, getCustomQuestionsRequest, getEyeTrackingPacksRequest, getProjectBrandsRequest, getBrandAssetsRequest } from 'redux/reducers/Project/actionTypes';
import { setErrorMess, setLoading } from 'redux/reducers/Status/actionTypes';
import { routes } from 'routers/routes';
import { ProjectService } from 'services/project';
import { ESOLUTION_TYPE } from 'models';

function* requestGetProject(data: { type: string, id: number, callback: () => void, getFull: boolean}) {
  try {
    yield put(setLoading(true))
    const project: Project = yield call(ProjectService.getProject, data.id);
    yield put(setProjectReducer(project))
    if (data.getFull) {
      if (project?.solution?.typeId === ESOLUTION_TYPE.PACK) {
        yield put(getPacksRequest(data.id))
        yield put(getAdditionalBrandsRequest(data.id))
        yield put(getUserAttributesRequest(data.id))
        yield put(getProjectAttributesRequest(data.id))
        yield put(getCustomQuestionsRequest(data.id))
        yield put(getEyeTrackingPacksRequest(data.id))
      } else if (project?.solution?.typeId === ESOLUTION_TYPE.VIDEO_CHOICE){
        yield put(getVideosRequest(data.id))
        yield put(getCustomQuestionsRequest(data.id))
      } else if (project?.solution?.typeId === ESOLUTION_TYPE.BRAND_TRACKING){
        yield put(getAdditionalBrandsRequest(data.id))
        yield put(getProjectAttributesRequest(data.id))
        yield put(getUserAttributesRequest(data.id))
        yield put(getProjectBrandsRequest(data.id))
        yield put(getBrandAssetsRequest(data.id))
        yield put(getCustomQuestionsRequest(data.id))
      }
      yield put(getTargetRequest(data.id))
    }
    
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
