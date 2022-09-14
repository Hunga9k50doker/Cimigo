import images from "config/images";
import { OptionItem } from "./general";

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

export const icCustomQuestions: { [key: string]: string } = {
  [ECustomQuestionType.Open_Question]: images.icOpenQuestion,
  [ECustomQuestionType.Single_Choice]: images.icSingleChoice,
  [ECustomQuestionType.Multiple_Choices]: images.icMultipleChoices,
  [ECustomQuestionType.Numeric_Scale]: images.icNumbericScale,
  [ECustomQuestionType.Smiley_Rating]: images.icSmileyRating,
  [ECustomQuestionType.Star_Rating]: images.icStarRating,
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
    exclusive?: boolean;
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
    exclusive?: boolean;
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
    exclusive?: boolean;
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
  emojiId: number;
  order: number,
  customQuestionId: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  customQuestion?: CustomQuestion
}

export enum EmojisId {
  LAUGH = 1,
  SMILE = 2,
  MEH = 3,
  SAD = 4,
  PAIN = 5,
}


export const arrayEmojis: OptionItem[] = [
  { 
    id: EmojisId.PAIN,
    name: 'Pain'
  },
  {
    id: EmojisId.SAD,
    name: 'Sad'
  },
  {
    id: EmojisId.MEH,
    name: 'Meh'
  },
  {
    id: EmojisId.SMILE,
    name: 'Smile'
  },
  {
    id: EmojisId.LAUGH,
    name: 'Laugh'
  },
]

export enum FaceType {
  FIVE = 5,
  THREE = 3,
}

export const emojiFaces: OptionItem[] = [
  { id: FaceType.FIVE, name: "5 faces" },
  { id: FaceType.THREE, name: "3 faces" },
]