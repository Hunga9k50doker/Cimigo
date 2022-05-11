import produce from 'immer';
import { Project } from 'models/project';
import * as types from './actionTypes';

export interface ProjectState {
  solutionId?: number,
  project?: Project,
}

const initial: ProjectState = {
  solutionId: null,
  project: null,
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
      default:
        return state;
    }
  })
