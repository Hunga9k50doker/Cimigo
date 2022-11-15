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
}

export const solutionTypes: OptionItem[] = [
  { id: ESOLUTION_TYPE.PACK, name: 'Pack test' },
  { id: ESOLUTION_TYPE.VIDEO_CHOICE, name: 'Video choice' }
]

export const eyeTrackingTranslationKey = {
  [ESOLUTION_TYPE.PACK]: "project_right_panel_cost_summary_eye_tracking",
  [ESOLUTION_TYPE.VIDEO_CHOICE]: "project_right_panel_cost_summary_eye_tracking_video",
}

