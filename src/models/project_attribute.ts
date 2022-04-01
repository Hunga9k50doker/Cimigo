import { Attribute } from "./Admin/attribute";

export interface ProjectAttribute {
  id: number;
  attributeId: number;
  projectId: number;
  createdAt: Date;
  updatedAt: Date;
  attribute?: Attribute;
}

export interface GetProjectAttributeParams {
  take?: number;
  page?: number;
  projectId: number;
}

export interface CreateProjectAttribute {
  attributeIds: number[];
  projectId: number;
}

