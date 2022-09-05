import { Solution } from "./solution";

export interface Plan {
  id: number;
  title: string;
  price: number;
  solutionId: number;
  sampleSize: number;
  content: string[];
  isMostPopular: boolean;
  status: number;
  order: number;
  parentLanguage: number,
  language: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  languages?: Plan[];
  solution?: Solution;
}

export interface GetPlansParams {
  page: number,
  take: number,
  solutionIds?: number[],
  keyword?: string
}

export interface CreateOrUpdatePlanInput {
  title: string;
  price: number;
  solutionId: number;
  sampleSize: number;
  content: string[];
  isMostPopular?: boolean;
  order?: number;
  language?: string;
}
