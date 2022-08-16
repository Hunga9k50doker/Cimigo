export interface CustomQuestionType {
  id: number;
  title: string;
  order: number;
  price: number;
  priceAttribute: number;
  minAnswer: number;
  maxAnswer: number;
  maxAttribute: number;
  status: number;
  language: string;
  parentLanguage: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  languages?: CustomQuestionType[];
}

export enum ECustomQuestionType {
  Open_Question = 1,
  Single_Choice = 2,
  Multiple_Choices = 3,
  Numeric_Scale = 4,
  Smiley_Rating = 5,
  Star_Rating = 6,
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
  scaleRangeFrom?: number;
  scaleRangeTo?: number;
  numberOfStars?: number;
  invertScale?: boolean;
  customQuestionAttributes?: CustomQuestionAttribute[];
  customQuestionEmojis?: CustomQuestionEmoji[];
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

export interface CreateOrEditCustomQuestionInput {
  projectId?: number;
  title: string;
  scaleRangeFrom?: number;
  scaleRangeTo?: number;
  numberOfStars?: number;
  invertScale?: boolean;
  typeId: number;
  answers?: {
    id?: number;
    title: string;
    exclusive: boolean;
  }[],
  customQuestionAttributes?: {
    id?: number;
    attribute?: string;
    leftLabel?: string;
    rightLabel?: string;
  }[],
  customQuestionEmojis?: {
    id?: number;
    label: string;
    emojiId: number;
  }[]
}

export interface CreateCustomQuestionInput {
  projectId?: number;
  title: string;
  scaleRangeFrom?: number;
  scaleRangeTo?: number;
  numberOfStars?: number;
  invertScale?: boolean;
  typeId: number;
  answers?: {
    title: string;
    exclusive: boolean;
  }[],
  customQuestionAttributes?: {
    attribute?: string;
    leftLabel?: string;
    rightLabel?: string;
  }[],
  customQuestionEmojis?: {
    label: string;
    emojiId: number;
  }[]
}

export interface QuestionOrder {
  id: number;
  order: number;
}

export interface UpdateOrderQuestionParams {
  projectId: number;
  questions: QuestionOrder[];
}

export interface UpdateCustomQuestionInput {
  title: string;
  typeId: number;
  scaleRangeFrom?: number;
  scaleRangeTo?: number;
  numberOfStars?: number;
  invertScale?: boolean;
  answers?: {
    id?: number;
    title: string;
    exclusive: boolean;
  }[],
  customQuestionAttributes?: {
    id?: number;
    attribute?: string;
    leftLabel?: string;
    rightLabel?: string;
  }[],
  customQuestionEmojis?: {
    id?: number;
    label: string;
    emojiId: number;
  }[]
}

export interface CustomQuestionAttribute {
  id: number;
  attribute: string;
  leftLabel: string;
  rightLabel: string;
  order: number,
  customQuestionId: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  customQuestion?: CustomQuestion
}

export interface CustomQuestionEmoji {
  id: number;
  label: string;
  emojiId: string;
  order: number,
  customQuestionId: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  customQuestion?: CustomQuestion
}