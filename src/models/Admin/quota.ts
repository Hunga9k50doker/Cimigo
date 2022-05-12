import { TargetAnswer, TargetQuestion } from "./target";

export interface QuotaTable {
  id: number;
  title: string;
  titleCell: string;
  questionIds: number[];
  order: number;
  parentLanguage: string;
  language: string;
  createdAt: Date;
  updatedAt: Date;
  languages?: QuotaTable[];
  targetQuestions?: TargetQuestion[];
  quotaCalculations: QuotaCalculation[]
}

export interface QuotaCalculation {
  id: number;
  original: number;
  quotaTableId: number;
  answerIds: number[];
  createdAt: Date;
  updatedAt: Date;
  targetAnswers?: TargetAnswer[]
}

export interface GetQuotaTablesParams {
  take?: number;
  page?: number;
  keyword?: string;
}

export interface CreateQuotaTableParams {
  title: string;
  titleCell: string;
  order: number;
  questionIds: number[];
  calculations: {
    answerIds: number[]
    original: number
  }[];
}

export interface UpdateQuotaTableParams {
  title?: string;
  titleCell?: string;
  order?: number;
  questionIds?: number[];
  calculations?: {
    answerIds: number[]
    original: number
  }[];
  language?: string
}
