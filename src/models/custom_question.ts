export interface CustomQuestionType {
  id: number;
  title: string;
  order: number;
  price: number;
  minAnswer: number;
  maxAnswer: number;
  status: number;
  language: string;
  parentLanguage: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  languages?: CustomQuestionType[];
}

export interface CustomQuestion {
  typeId: number;
  title: string;
  answers?: CustomAnswer[];
  id?: number;
  order?: number;
  projectId?: number;
  createdAt?: Date;
  updatedAt?: Date;
  type?: CustomQuestionType;
}

export interface CustomAnswer {
  title: string;
  exclusive?: boolean;
  id?: number;
  order?: number;
  questionId?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CustomQuestionFormData {
  title: string;
  answers?: CustomAnswer[];
}

export interface GetTypeParams {
  take?: number;
  page?: number;
  keyword?: string;
}

export interface GetAllQuestionParams {
  take?: number;
  page?: number;
  projectId: number;
}

export interface CreateQuestionParams {
  projectId: number;
  title: string;
  typeId: number;
  answers?: CustomAnswer[];
}

export interface QuestionOrder {
  id: number;
  order: number;
}

export interface UpdateOrderQuestionParams {
  projectId: number;
  questions: QuestionOrder[];
}

export interface UpdateQuestionParams {
  title?: string;
  answers?: CustomAnswer[];
}