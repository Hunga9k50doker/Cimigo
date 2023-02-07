import { Project } from "./project";

export enum EBrandType {
  MAIN = 1,
  COMPETING = 2
}

export interface AdditionalBrand {
  id: number;
  userId: number;
  projectId: number;
  brand: string;
  manufacturer: string;
  variant: string,
  createdAt: Date;
  updatedAt: Date;
  project?: Project;
  typeId?: EBrandType;
}

export interface GetAdditionalBrandList {
  take?: number;
  page?: number;
  projectId?: number;
  typeId?: EBrandType;
}

export interface CreateAdditionalBrand {
  projectId: number;
  brand: string;
  manufacturer: string;
  variant: string;
  typeId?: EBrandType;
}

export interface UpdateAdditionalBrand {
  brand?: string;
  manufacturer?: string;
  variant?: string;
  typeId?: EBrandType;
}