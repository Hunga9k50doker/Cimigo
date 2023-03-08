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
import { User } from './user';
import { CustomQuestion } from './custom_question';
import { Plan } from './Admin/plan';
import { Video } from './video';
import { ProjectBrand } from './project_brand';
import { BrandAsset } from './brand_asset';
import { EPaymentScheduleCancelType, PaymentSchedule } from './payment_schedule';
export interface CreateProjectData {
  solutionId: number;
  planId: number;
  name: string,
  surveyLanguage: string,
  category?: string,
  brand?: string,
  variant?: string,
  manufacturer?: string
}

export interface CreateProjectRedirect {
  solutionId: number;
  planId: number;
}

export interface Project {
  id: number;
  name: string;
  userId: number;
  solutionId: number;
  planId: number;
  category: string;
  onPremise?: boolean;
  sampleSize: number;
  eyeTrackingSampleSize: number;
  status: ProjectStatus;
  editable: boolean;
  dataStudio: string;
  solution?: Solution;
  folderId: number;
  invoiceId: number;
  invoice: Attachment;
  enableCustomQuestion: boolean;
  enableEyeTracking: boolean;
  surveyLanguage: string,
  agreeQuota: boolean,
  reportReadyDate: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
  folder?: Folder;
  targets: ProjectTarget[];
  payments: Payment[];
  reports?: Attachment[];
  packs?: Pack[];
  videos?: Video[];
  eyeTrackingPacks?: Pack[];
  additionalBrands?: AdditionalBrand[];
  projectBrands?: ProjectBrand[];
  brandAssets?: BrandAsset[];
  projectAttributes?: ProjectAttribute[];
  userAttributes?: UserAttribute[];
  customQuestions?: CustomQuestion[];
  user?: User;
  plan?: Plan;
  planPricePerMonth?: number;
  startPaymentSchedule?: Date;
  paymentSchedules?: PaymentSchedule[];
  cancelPaymentScheduleType: EPaymentScheduleCancelType;
}

export enum ProjectStatus {
  DRAFT = 1,
  AWAIT_PAYMENT,
  IN_PROGRESS,
  COMPLETED
}

export const projectStatus: OptionItem[] = [
  { id: ProjectStatus.DRAFT, name: 'Draft', translation: 'project_status_draft' },
  { id: ProjectStatus.AWAIT_PAYMENT, name: 'Awaiting payment', translation: 'project_status_await_payment' },
  { id: ProjectStatus.IN_PROGRESS, name: 'Launching', translation: 'project_status_in_progress' },
  { id: ProjectStatus.COMPLETED, name: 'Results ready', translation: 'project_status_completed' }
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
  onPremise?: boolean,
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

export interface UpdateEnableEyeTracking {
  enableEyeTracking: boolean;
}

export interface UpdateQuota {
  quotaTableId: number
  quotas: {
    sampleSize: number,
    populationWeight: number,
    answerIds: number[]
  }[]
}

export interface ResetQuota {
  quotaTableId: number
}

export interface CancelSubscriptionData {
  projectId: number;
  reason?: string;
}

export enum SETUP_SURVEY_SECTION {
  basic_information = 'basic-information',
  upload_packs = 'upload-packs',
  additional_brand_list = 'additional-brand-list',
  additional_attributes = 'additional-attributes',
  content_survey_setup = 'content-survey-setup',
  custom_questions = 'custom_questions',
  eye_tracking = 'eye-tracking',
  add_video = 'add-video',
  emotion_measurement = 'emotion-measurement',
  brand_list = 'brand-list',
  brand_disposition_and_equity = 'brand-disposition-and-equity',
  brand_asset_recognition = 'brand-asset-recognition',
}

export enum TARGET_SECTION {
  CONTENT = 'target-content',
  SAMPLE_SIZE = 'target-sample-size',
  EYE_TRACKING_SAMPLE_SIZE = 'target-eye-tracking-sample-size',
  SELECT_TARGET = 'target-select-target'
}

export enum QUOTAS_SECTION {
  CONTENT = 'quotas-content',
}

export enum ETabRightPanel {
  OUTLINE,
  COST_SUMMARY
}

export enum PROJECT_DETAIL_SECTION {
  content = 'project-detail-content'
}