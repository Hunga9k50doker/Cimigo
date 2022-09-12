import produce from 'immer';
import { Project } from 'models/project';
import * as types from './actionTypes';

export interface ProjectState {
  solutionId?: number,
  planId?: number,
  project?: Project,
  cancelPayment?: boolean
}

const initial: ProjectState = {
  solutionId: null,
  planId: null,
  project: null,
  cancelPayment: false,
}

export const projectReducer = (state = initial, action: any) =>
  produce(state, draft => {
    switch (action.type) {
      case types.SET_PROJECT_REDUCER:
        draft.project = action.data;
        break;
      case types.SET_SOLUTION_CREATE_PROJECT_REDUCER:
        draft.solutionId = action.data;
        break;
      case types.SET_CANCEL_PAYMENT_REDUCER:
        draft.cancelPayment = action.data;
        break;
      case types.SET_PACKS_OF_PROJECT_REDUCER:
        draft.project = {
          ...draft.project,
          packs: action.data
        };
        break;
      case types.SET_ADDITIONAL_BRANDS_OF_PROJECT_REDUCER:
        draft.project = {
          ...draft.project,
          additionalBrands: action.data
        };
        break;
      case types.SET_USER_ATTRIBUTES_OF_PROJECT_REDUCER:
        draft.project = {
          ...draft.project,
          userAttributes: action.data
        };
        break;
      case types.SET_PROJECT_ATTRIBUTES_OF_PROJECT_REDUCER:
        draft.project = {
          ...draft.project,
          projectAttributes: action.data
        };
        break;
      case types.SET_CUSTOM_QUESTIONS_OF_PROJECT_REDUCER:
        draft.project = {
          ...draft.project,
          customQuestions: action.data
        };
        break;
      default:
        return state;
    }
  })
