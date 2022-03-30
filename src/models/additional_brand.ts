import { Project } from "./project";

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
}

export interface GetAdditionalBrandList {
  take?: number;
  page?: number;
  projectId?: number
}

export interface CreateAdditionalBrand {
  projectId: number;
  brand: string;
  manufacturer: string;
  variant: string,
}

export interface UpdateAdditionalBrand {
  brand?: string;
  manufacturer?: string;
  variant?: string,
}