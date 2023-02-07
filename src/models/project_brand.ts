import { AdditionalBrand } from "./additional_brand";

export interface ProjectBrand {
  id: number;
  brandId: number;
  projectId: number;
  brand?: AdditionalBrand;
}

export interface GetProjectBrandParams {
  take?: number;
  page?: number;
  projectId: number;
}

export interface CreateProjectBrand {
  brandIds: number[];
  projectId: number;
}

