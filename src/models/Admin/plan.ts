import { Solution } from "./solution";

export interface Plan {
  id: number;
  title: string;
  price: number;
  solutionId: number;
  sampleSize: number;
  content: string[];
  isMostPopular: boolean;
  month?: number;
  status: number;
  order: number;
  parentLanguage: number,
  language: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  languages?: Plan[];
  solution?: Solution;
  priceUSD?: string;
  priceVND?: string;
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
  month?: number;
  order?: number;
  language?: string;
}
