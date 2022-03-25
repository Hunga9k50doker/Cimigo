import { Project } from "./project";

export interface GetFolders {
  take?: number;
  page?: number;
  projectIds?: number[]
}

export interface Folder {
  id: number;
  name: string;
  userId: number;
  project_folders?: ProjectFolder[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectFolder {
  id: number;
  projectId: string;
  folderId: number;
  folder?: Folder
  project?: Project,
  createdAt: Date;
  updatedAt: Date;
}

export interface DeleteFolderParams {
  isDeleteProject?: boolean
}