import { OptionItem } from 'models/general';

export interface TargetQuestion {
  id: number;
  name: string;
  order: number,
  type: OptionItem;
  typeId: number;
  renderType: OptionItem;
  renderTypeId: number;
  answerGroupName: string;
  parentLanguage: string;
  language: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  languages?: TargetQuestion[];
  targetAnswers?: TargetAnswer[];
  targetAnswerGroups?: TargetAnswerGroup[];
  targetAnswerSuggestions?: TargetAnswerSuggestion[];
}

export interface TargetAnswer {
  id: number;
  name: string;
  description: string;
  questionId: number;
  groupId: number;
  exclusive: boolean;
  parentLanguage: string;
  language: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  languages?: TargetAnswer[],
  targetAnswerGroup?: TargetAnswerGroup
}

export interface GetQuestionsParams {
  take?: number;
  page?: number;
  keyword?: string
}

export interface CreateQuestionParams {
  name: string;
  order: number;
  typeId: number;
  renderTypeId: number;
  answerGroupName: string;
}

export interface UpdateQuestionParams {
  name?: string;
  order?: number;
  language?: string;
  typeId?: number;
  renderTypeId?: number;
  answerGroupName?: string;
}


export enum TargetQuestionType {
  Location = 1,
  Economic_Class,
  Gender_And_Age_Quotas,
  Mums_Only
}

export const targetQuestionTypes: OptionItem[] = [
  { id: TargetQuestionType.Location, name: 'Location' },
  { id: TargetQuestionType.Economic_Class, name: 'Economic class' },
  { id: TargetQuestionType.Gender_And_Age_Quotas, name: 'Gender and age quotas' },
  { id: TargetQuestionType.Mums_Only, name: 'Mums only' }
]

export interface GetAnswersParams {
  take?: number;
  page?: number;
  keyword?: string;
  questionId?: number;
}

export interface CreateAnswerParams {
  name: string;
  description: string;
  questionId: number;
  groupId: number;
  exclusive: boolean;
}

export interface UpdateAnswerParams {
  name?: string;
  description?: string;
  questionId?: number;
  groupId?: number;
  exclusive?: boolean;
  language?: string;
}

export interface TargetAnswerGroup {
  id: number;
  name: string;
  questionId: number;
  parentLanguage: string;
  language: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  languages?: TargetAnswerGroup[];
  targetAnswers?: TargetAnswer[];
}

export interface GetAnswerGroupsParams {
  take?: number;
  page?: number;
  keyword?: string;
  questionId?: number;
}

export interface CreateAnswerGroupParams {
  name: string;
  questionId: number;
}

export interface UpdateAnswerGroupParams {
  name?: string;
  questionId?: number;
  language?: string;
}

export enum TargetQuestionRenderType {
  Normal = 1,
  Box
}

export const targetQuestionRenderTypes: OptionItem[] = [
  { id: TargetQuestionRenderType.Normal, name: 'Normal' },
  { id: TargetQuestionRenderType.Box, name: 'Box' }
]

export interface GetAnswerSuggestionsParams {
  take?: number;
  page?: number;
  keyword?: string;
  questionId?: number;
}

export interface CreateAnswerSuggestionParams {
  name: string;
  questionId: number;
  answerIds: number[];
  groupIds: number[];
}

export interface UpdateAnswerSuggestionParams {
  name?: string;
  questionId?: number;
  language?: string;
  answerIds?: number[];
  groupIds?: number[];
}

export interface TargetAnswerSuggestion {
  id: number;
  name: string;
  questionId: number;
  answerIds: number[];
  groupIds: number[];
  parentLanguage: string;
  language: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  languages?: TargetAnswerSuggestion[];
  answers?: TargetAnswer[];
  groups?: TargetAnswerGroup[];
}