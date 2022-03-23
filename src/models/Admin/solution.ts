export interface SolutionCategory {
  id: number;
  name: string;
  status: number;
  parentLanguage: number,
  language: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date
}

export interface GetSolutionCategoriesParams {
  take?: number;
  page?: number;
  keyword?: string;
}

export interface CreateSolutionCategoryParams {
  name: string
}

export interface UpdateSolutionCategoryParams {
  name: string,
  language?: string
}

export interface Solution {
  id: number;
  title: string;
  description: string;
  image: string;
  content: string;
  status: number;
  categoryId: number;
  categoryHomeId: number;
  parentLanguage: number,
  language: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  languages?: Solution[];
  category?: SolutionCategory;
  categoryHome?: SolutionCategory;
}

export interface GetSolutionsParams {
  take?: number;
  page?: number;
  keyword?: string;
  categoryId?: number;
}