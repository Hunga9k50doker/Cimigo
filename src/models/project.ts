import { ProjectFolder } from './folder';
import { OptionItem } from './general';
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
  project_folders?: ProjectFolder[]
}

export enum ProjectStatus {
  DRAFT = 1,
  AWAIT_PAYMENT,
  IN_PROGRESS,
  COMPLETED
}

export const projectStatus: OptionItem[] = [
  { id: ProjectStatus.DRAFT, name: 'Draft' },
  { id: ProjectStatus.AWAIT_PAYMENT, name: 'Await payment' },
  { id: ProjectStatus.IN_PROGRESS, name: 'In progress' },
  { id: ProjectStatus.COMPLETED, name: 'Completed' }
]

export interface GetMyProjects {
  sortedField?: string;
  isDescending?: boolean;
  folderIds?: number[];
  statusIds?: number[];
  keyword?: string;
  take?: number;
  page?: number;
}

export interface MoveProject {
  createFolderIds?: number[],
  deleteFolderIds?: number[],
  createFolder?: string
}