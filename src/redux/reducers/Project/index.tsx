import produce from 'immer';
import { Project } from 'models/project';
import * as types from './actionTypes';

export interface ProjectState {
  project?: Project,
}

const initial: ProjectState = {
  project: null,
}

export const projectReducer = (state = initial, action: any) =>
  produce(state, draft => {
    switch (action.type) {
      case types.SET_PROJECT_REDUCER:
        draft.project = action.data;
        break;
      default:
        return state;
    }
  })
