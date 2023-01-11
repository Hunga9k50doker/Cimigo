import { OptionItem } from "models/general";
import { Solution } from "./solution";

export interface GetAttributesParams {
  take?: number;
  page?: number;
  keyword?: string;
}

export interface CreateAttribute {
  solutionId: number;
  typeId: number;
  start?: string;
  end?: string;
  content?: string;
  categoryId: number;
  contentTypeId: number;
}

export interface UpdateAttribute {
  solutionId: number;
  typeId: number;
  start?: string;
  end?: string;
  content?: string;
  categoryId: number;
  contentTypeId: number;
  language?: string;
}

export interface AttributeCategory {
  id: number;
  name: string;
}

export interface Attribute {
  id: number;
  solutionId: number;
  typeId: AttributeType;
  type: OptionItem;
  start: string;
  end: string;
  content: string;
  contentTypeId: number;
  parentLanguage: number;
  language: number;
  contentType: OptionItem;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  solution?: Solution;
  languages?: Attribute[];
  category?: AttributeCategory;
  categoryId: number;
}

export enum AttributeType {
  MANATORY = 1,
  PRE_DEFINED = 2
}

export const attributeTypes: OptionItem[] = [
  { id: AttributeType.MANATORY, name: 'Mandatory' },
  { id: AttributeType.PRE_DEFINED, name: 'Pre-defined' },
]

export interface AttributeCategory {
  id: number;
  language: number;
  name: string;
  parentLanguage: number;
  status: number;
  languages?: AttributeCategory[];
}

export interface GetAttributeCategoriesParams {
  take?: number;
  page?: number;
  keyword?: string;
}

export interface UpdateAttributeCategoryParams {
  name: string,
  language?: string
}

export interface CreateAttributeCategoryParams {
  name: string
}

export enum AttributeContentType {
  SINGLE = 1,
  MULTIPLE = 2
}

export const attributeContentTypes: OptionItem[] = [
  { id: AttributeContentType.SINGLE, name: 'Single' },
  { id: AttributeContentType.MULTIPLE, name: 'Multiple' },
]