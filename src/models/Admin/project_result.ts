import { Attachment } from 'models/attachment';

export interface ProjectResult {
    id: number,
    month: Date,
    dataStudio: string,
    report?: Attachment,
    reportId: number,
    isReplacedReport: boolean,
    isReplacedDataStudio: boolean,
    isReady: boolean
}

export interface GetResult {
    projectId: number
}

export interface UploadResult {
    month: Date,
    dataStudio: string,
}