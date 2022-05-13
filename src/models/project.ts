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
import i18n from 'locales';
import { User } from './user';
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
  invoiceId: number;
  invoice: Attachment;
  enableCustomQuestion: boolean;
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
  user?: User;
}

export enum ProjectStatus {
  DRAFT = 1,
  AWAIT_PAYMENT,
  IN_PROGRESS,
  COMPLETED
}

export const projectStatus: OptionItem[] = [
  { id: ProjectStatus.DRAFT, name: 'Draft', translation: 'project_status_draft' },
  { id: ProjectStatus.AWAIT_PAYMENT, name: 'Await payment', translation: 'project_status_await_payment' },
  { id: ProjectStatus.IN_PROGRESS, name: 'In progress', translation: 'project_status_in_progress' },
  { id: ProjectStatus.COMPLETED, name: 'Completed', translation: 'project_status_completed' }
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

export interface UpdateEnableCustomQuestion {
  enableCustomQuestion: boolean;
}