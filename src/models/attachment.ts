export interface Attachment {
  id: number;
  fileName: string;
  fileSize: number;
  mimeType: string;
  url: string;
  objectId: number;
  objectTypeId: AttachmentObjectTypeId;
  createdAt: Date;
  updatedAt: Date;
}

export enum AttachmentObjectTypeId {
  PROJECT_REPORT = 1,
}

export interface FileUpload {
  id?: number | string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  url?: string;
  file?: File;
  isNew?: boolean
}