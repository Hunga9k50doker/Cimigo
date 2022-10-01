import { AdditionalBrand } from "models/additional_brand";
import { CustomQuestion } from "models/custom_question";
import { Pack } from "models/pack";
import { CreateProjectRedirect, Project, ProjectTarget } from "models/project";
import { ProjectAttribute } from "models/project_attribute";
import { UserAttribute } from "models/user_attribute";

export const GET_PROJECT_REQUEST = 'GET_PROJECT_REQUEST';

export const SET_PROJECT_REDUCER = 'SET_PROJECT_REDUCER';

export const SET_CREATE_PROJECT_REDIRECT_OF_PROJECT_REDUCER = 'SET_CREATE_PROJECT_REDIRECT_OF_PROJECT_REDUCER';

export const SET_CANCEL_PAYMENT_REDUCER = 'SET_CANCEL_PAYMENT_REDUCER';

export const GET_PACKS_OF_PROJECT_REQUEST = 'GET_PACKS_OF_PROJECT_REQUEST';

export const SET_PACKS_OF_PROJECT_REDUCER = 'SET_PACKS_OF_PROJECT_REDUCER';

export const GET_ADDITIONAL_BRANDS_OF_PROJECT_REQUEST = 'GET_ADDITIONAL_BRANDS_OF_PROJECT_REQUEST';

export const SET_ADDITIONAL_BRANDS_OF_PROJECT_REDUCER = 'SET_ADDITIONAL_BRANDS_OF_PROJECT_REDUCER';

export const GET_USER_ATTRIBUTES_OF_PROJECT_REQUEST = 'GET_USER_ATTRIBUTES_OF_PROJECT_REQUEST';

export const SET_USER_ATTRIBUTES_OF_PROJECT_REDUCER = 'SET_USER_ATTRIBUTES_OF_PROJECT_REDUCER';

export const GET_PROJECT_ATTRIBUTES_OF_PROJECT_REQUEST = 'GET_PROJECT_ATTRIBUTES_OF_PROJECT_REQUEST';

export const SET_PROJECT_ATTRIBUTES_OF_PROJECT_REDUCER = 'SET_PROJECT_ATTRIBUTES_OF_PROJECT_REDUCER';

export const GET_CUSTOM_QUESTIONS_OF_PROJECT_REQUEST = 'GET_CUSTOM_QUESTIONS_OF_PROJECT_REQUEST';

export const SET_CUSTOM_QUESTIONS_OF_PROJECT_REDUCER = 'SET_CUSTOM_QUESTIONS_OF_PROJECT_REDUCER';

export const GET_EYE_TRACKING_PACKS_OF_PROJECT_REQUEST = 'GET_EYE_TRACKING_PACKS_OF_PROJECT_REQUEST';

export const SET_EYE_TRACKING_PACKS_OF_PROJECT_REDUCER = 'SET_EYE_TRACKING_PACKS_OF_PROJECT_REDUCER';

export const GET_TARGET_OF_PROJECT_REQUEST = 'GET_TARGET_OF_PROJECT_REQUEST';

export const SET_TARGET_OF_PROJECT_REDUCER = 'SET_TARGET_OF_PROJECT_REDUCER';

export const SET_SCROLL_TO_SECTION_OF_PROJECT_REDUCER = 'SET_SCROLL_TO_SECTION_OF_PROJECT_REDUCER'

export const getProjectRequest = (id: number, callback?: () => void, getFull: boolean = false) => {
  return {
    type: GET_PROJECT_REQUEST,
    id: id,
    callback,
    getFull
  }
}

export const setProjectReducer = (data: Project) => {
  return {
    type: SET_PROJECT_REDUCER,
    data: data
  }
}

export const setCreateProjectRedirectReducer = (data: CreateProjectRedirect) => {
  return {
    type: SET_CREATE_PROJECT_REDIRECT_OF_PROJECT_REDUCER,
    data: data
  }
}

export const setCancelPayment = (status: boolean) => {
  return {
    type: SET_CANCEL_PAYMENT_REDUCER,
    data: status
  }
}

export const getPacksRequest = (projectId: number) => {
  return {
    type: GET_PACKS_OF_PROJECT_REQUEST,
    projectId
  }
}

export const setPacksReducer = (data: Pack[]) => {
  return {
    type: SET_PACKS_OF_PROJECT_REDUCER,
    data
  }
}

export const getAdditionalBrandsRequest = (projectId: number) => {
  return {
    type: GET_ADDITIONAL_BRANDS_OF_PROJECT_REQUEST,
    projectId
  }
}

export const setAdditionalBrandsReducer = (data: AdditionalBrand[]) => {
  return {
    type: SET_ADDITIONAL_BRANDS_OF_PROJECT_REDUCER,
    data
  }
}

export const getUserAttributesRequest = (projectId: number) => {
  return {
    type: GET_USER_ATTRIBUTES_OF_PROJECT_REQUEST,
    projectId
  }
}

export const setUserAttributesReducer = (data: UserAttribute[]) => {
  return {
    type: SET_USER_ATTRIBUTES_OF_PROJECT_REDUCER,
    data
  }
}


export const getProjectAttributesRequest = (projectId: number) => {
  return {
    type: GET_PROJECT_ATTRIBUTES_OF_PROJECT_REQUEST,
    projectId
  }
}

export const setProjectAttributesReducer = (data: ProjectAttribute[]) => {
  return {
    type: SET_PROJECT_ATTRIBUTES_OF_PROJECT_REDUCER,
    data
  }
}

export const getCustomQuestionsRequest = (projectId: number) => {
  return {
    type: GET_CUSTOM_QUESTIONS_OF_PROJECT_REQUEST,
    projectId
  }
}

export const setCustomQuestionsReducer = (data: CustomQuestion[]) => {
  return {
    type: SET_CUSTOM_QUESTIONS_OF_PROJECT_REDUCER,
    data
  }
}

export const getEyeTrackingPacksRequest = (projectId: number) => {
  return {
    type: GET_EYE_TRACKING_PACKS_OF_PROJECT_REQUEST,
    projectId
  }
}

export const setEyeTrackingPacksReducer = (data: Pack[]) => {
  return {
    type: SET_EYE_TRACKING_PACKS_OF_PROJECT_REDUCER,
    data
  }
}

export const getTargetRequest = (projectId: number) => {
  return {
    type: GET_TARGET_OF_PROJECT_REQUEST,
    projectId
  }
}

export const setTargetReducer = (data: ProjectTarget[]) => {
  return {
    type: SET_TARGET_OF_PROJECT_REDUCER,
    data
  }
}

export const setScrollToSectionReducer = (data?: string) => {
  return {
    type: SET_SCROLL_TO_SECTION_OF_PROJECT_REDUCER,
    data
  }
}