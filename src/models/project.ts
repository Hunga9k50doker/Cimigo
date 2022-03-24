import { Solution } from 'models/Admin/solution';
export interface CreateProjectData {
  solutionId: number;
  name: string,
  category?: string,
  brand?: string,
  variant?: string,
  manufacturer?: string
}

export interface Project {
  id: number;
  name: string;
  userId: number;
  solutionId: number;
  brand: string;
  manufacturer: string;
  category: string;
  variant: string,
  sampleSize: number;
  status: ProjectStatus;
  accessToDashboard: string;
  accessToReport: string;
  solution?: Solution;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export enum ProjectStatus {
  DRAFT,
  AWAIT_PAYMENT,
  IN_PROGRESS,
  COMPLETED
}