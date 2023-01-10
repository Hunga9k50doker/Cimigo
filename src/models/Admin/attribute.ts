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
  start: string;
  end: string;
}

export interface UpdateAttribute {
  solutionId: number;
  typeId: number;
  start: string;
  end: string;
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
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  solution?: Solution;
  languages?: Attribute[];
  category: AttributeCategory;
}

export enum AttributeType {
  MANATORY = 1,
  PRE_DEFINED = 2
}

export const attributeTypes: OptionItem[] = [
  { id: AttributeType.MANATORY, name: 'Mandatory' },
  { id: AttributeType.PRE_DEFINED, name: 'Pre-defined' },
]