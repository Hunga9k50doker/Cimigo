import { Folder } from './folder';
import { OptionItem } from './general';
import { Solution } from 'models/Admin/solution';
import { TargetAnswer, TargetQuestion } from './Admin/target';
import { Payment } from './payment';
import { Attachment } from './attachment';
import { Pack } from './pack';
import { AdditionalBrand } from './additional_brand';
import { ProjectAttribute } from './project_attribute';
import { UserAttribute } from './user_attribute';
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
  editable: boolean;
  dataStudio: string;
  solution?: Solution;
  folderId: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  folder?: Folder;
  targets: ProjectTarget[];
  payments: Payment[];
  reports?: Attachment[];
  packs?: Pack[];
  additionalBrands?: AdditionalBrand[];
  projectAttributes?: ProjectAttribute[];
  userAttributes?: UserAttribute[];
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
  folderId: number,
}

export interface RenameProject {
  name: string
}

export interface UpdateProjectBasicInformation {
  category?: string,
  brand?: string,
  variant?: string,
  manufacturer?: string
}

export interface ProjectTarget {
  id: number;
  projectId: string;
  questionId: number;
  answerIds: number[];
  createdAt: Date;
  updatedAt: Date;
  answers: TargetAnswer[];
  targetQuestion?: TargetQuestion;
}

export interface UpdateTarget {
  questionTypeId: number,
  questionSelected: {
    questionId: number,
    answerIds: number[]
  }[]
}