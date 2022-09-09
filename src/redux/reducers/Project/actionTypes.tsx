import { AdditionalBrand } from "models/additional_brand";
import { Pack } from "models/pack";
import { Project } from "models/project";
import { ProjectAttribute } from "models/project_attribute";
import { UserAttribute } from "models/user_attribute";

export const GET_PROJECT_REQUEST = 'GET_PROJECT_REQUEST';

export const SET_PROJECT_REDUCER = 'SET_PROJECT_REDUCER';

export const SET_SOLUTION_CREATE_PROJECT_REDUCER = 'SET_SOLUTION_CREATE_PROJECT_REDUCER';

export const SET_CANCEL_PAYMENT_REDUCER = 'SET_CANCEL_PAYMENT_REDUCER';

export const GET_PACKS_OF_PROJECT_REQUEST = 'GET_PACKS_OF_PROJECT_REQUEST';

export const SET_PACKS_OF_PROJECT_REDUCER = 'SET_PACKS_OF_PROJECT_REDUCER';

export const GET_ADDITIONAL_BRANDS_OF_PROJECT_REQUEST = 'GET_ADDITIONAL_BRANDS_OF_PROJECT_REQUEST';

export const SET_ADDITIONAL_BRANDS_OF_PROJECT_REDUCER = 'SET_ADDITIONAL_BRANDS_OF_PROJECT_REDUCER';

export const GET_USER_ATTRIBUTES_OF_PROJECT_REQUEST = 'GET_USER_ATTRIBUTES_OF_PROJECT_REQUEST';

export const SET_USER_ATTRIBUTES_OF_PROJECT_REDUCER = 'SET_USER_ATTRIBUTES_OF_PROJECT_REDUCER';

export const GET_PROJECT_ATTRIBUTES_OF_PROJECT_REQUEST = 'GET_PROJECT_ATTRIBUTES_OF_PROJECT_REQUEST';

export const SET_PROJECT_ATTRIBUTES_OF_PROJECT_REDUCER = 'SET_PROJECT_ATTRIBUTES_OF_PROJECT_REDUCER';

export const getProjectRequest = (id: number, callback?: () => void) => {
  return {
    type: GET_PROJECT_REQUEST,
    id: id,
    callback
  }
}

export const setProjectReducer = (data: Project) => {
  return {
    type: SET_PROJECT_REDUCER,
    data: data
  }
}

export const setSolutionCreateProject = (id: number) => {
  return {
    type: SET_SOLUTION_CREATE_PROJECT_REDUCER,
    data: id
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