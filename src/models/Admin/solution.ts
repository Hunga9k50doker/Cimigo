import { Attachment } from "models/attachment";
import { ESOLUTION_TYPE } from "models/solution";
import { EyeTrackingSampleSize } from "./eye_tracking_sample_size";
import { SampleSize } from "./sample_size";
import { EOPERATION_TYPE } from "models/general";

export interface SolutionCategory {
  id: number;
  name: string;
  status: number;
  parentLanguage: number,
  language: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  languages?: SolutionCategory[]
}

export interface GetSolutionCategoriesParams {
  take?: number;
  page?: number;
  keyword?: string;
}

export interface CreateSolutionCategoryParams {
  name: string
}

export interface UpdateSolutionCategoryParams {
  name: string,
  language?: string
}

export interface Solution {
  id: number;
  title: string;
  description: string;
  image: string;
  content: string;
  status: number;
  categoryId: number;
  categoryHomeId: number;
  parentLanguage: number,
  language: string;
  typeId: ESOLUTION_TYPE;
  minPack: number;
  maxPack: number;
  minVideo: number;
  maxVideo: number;
  minAdditionalBrand: number;
  maxAdditionalBrand: number;
  maxAdditionalAttribute: number;
  minMainBrand: number;
  maxMainBrand: number;
  minCompetingBrand: number;
  maxCompetingBrand: number;
  minCompetitiveBrand: number;
  maxCompetitiveBrand: number;
  minEquityAttributes: number;
  maxEquityAttributes: number;
  minBrandAssetRecognition: number;
  maxBrandAssetRecognition: number;
  daysOfDueDate: number;
  daysOfDueDateType: EOPERATION_TYPE;
  paymentMonthSchedule: number;
  maxCustomQuestion: number;
  enableCustomQuestion: boolean;
  enableEyeTracking: boolean;
  minEyeTrackingPack: number;
  maxEyeTrackingPack: number;
  eyeTrackingHelp: string;
  enableHowToSetUpSurvey: boolean;
  howToSetUpSurveyPageTitle: string;
  howToSetUpSurveyDialogTitle: string;
  howToSetUpSurveyContent: string;
  howToSetUpSurveyFileId: number;
  howToSetUpSurveyFile: Attachment;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  languages?: Solution[];
  category?: SolutionCategory;
  categoryHome?: SolutionCategoryHome;
  sampleSizes?: SampleSize[];
  eyeTrackingSampleSizes?: EyeTrackingSampleSize[];
}

export interface GetSolutionsParams {
  take?: number;
  page?: number;
  keyword?: string;
  categoryId?: number;
}

export interface GetSolutionCategoriesHomeParams {
  take?: number;
  page?: number;
  keyword?: string;
}

export interface SolutionCategoryHome {
  id: number;
  name: string;
  status: number;
  image: string;
  parentLanguage: number;
  language: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  solutions?: Solution[];
  languages?: SolutionCategoryHome[]
}