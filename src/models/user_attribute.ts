import { OptionItem } from "models/general";

export interface GetUserAttributeParams {
  take?: number;
  page?: number;
  projectId: number;
}

export interface CreateUserAttribute {
  start: string;
  end: string;
  projectId: number
}

export interface UpdateUserAttribute {
  start?: string;
  end?: string;
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