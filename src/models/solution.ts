import { OptionItem } from "./general";

export interface UserGetSolutions {
  take?: number;
  page?: number;
  keyword?: string;
  categoryId?: number;
}

export interface UserGetSolutionCategories {
  take?: number;
  page?: number;
  keyword?: string;
}

export enum ESOLUTION_TYPE {
  PACK = 1,
  VIDEO_CHOICE = 2,
}

export const solutionTypes: OptionItem[] = [
  { id: ESOLUTION_TYPE.PACK, name: 'Pack test' },
  { id: ESOLUTION_TYPE.VIDEO_CHOICE, name: 'Video choice' }
]