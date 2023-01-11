import { OptionItem } from "models/general";

export interface GetUserAttributeParams {
  take?: number;
  page?: number;
  projectId: number;
}

export interface CreateUserAttribute {
  content: string;
  contentTypeId : number;
  projectId: number
}

export interface UpdateUserAttribute {
  content?: string;
  contentTypeId : number;
}

export interface UserAttribute {
  id: number;
  userId: number;
  start?: string;
  end?: string;
  content?: string;
  contentTypeId: number;
  contentType?: OptionItem;
  createdAt: Date;
  updatedAt: Date;
}

export enum AttributeContentType {
  SINGLE = 1,
  MULTIPLE = 2
}