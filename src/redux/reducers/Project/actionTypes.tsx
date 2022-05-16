import { Project } from "models/project";

export const GET_PROJECT_REQUEST = 'GET_PROJECT_REQUEST';

export const SET_PROJECT_REDUCER = 'SET_PROJECT_REDUCER';

export const SET_SOLUTION_CREATE_PROJECT_REDUCER = 'SET_SOLUTION_CREATE_PROJECT_REDUCER';

export const SET_CANCEL_PAYMENT_REDUCER = 'SET_CANCEL_PAYMENT_REDUCER';

export const getProjectRequest = (id: number) => {
  return {
    type: GET_PROJECT_REQUEST,
    id: id
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