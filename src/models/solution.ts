import { OptionItem } from "./general";
import { useTranslation } from "react-i18next";

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
  BRAND_TRACKING = 3
}

export const solutionTypes: OptionItem[] = [
  { id: ESOLUTION_TYPE.PACK, name: 'Pack test' },
  { id: ESOLUTION_TYPE.VIDEO_CHOICE, name: 'Video choice' },
  { id: ESOLUTION_TYPE.BRAND_TRACKING, name: 'Brand tracking' }
]
