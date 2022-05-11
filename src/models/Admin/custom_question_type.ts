export interface CustomQuestionType {
  id: number;
  title: string;
  order: number,
  price: number;
  minAnswer: number;
  maxAnswer: number;
  status: number;
  language: string;
  parentLanguage: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  languages?: CustomQuestionType[]
}

export interface GetCustomQuestionTypes {
  page: number,
  take: number,
  keyword?: string
}

export interface AdminGetCustomQuestionTypes {
  page: number,
  take: number,
  keyword?: string
}

export interface AdminUpdateCustomQuestionType {
  title: string;
  order: number,
  price: number;
  minAnswer: number;
  maxAnswer: number;
  status: number;
  language?: string;
}