export interface GetFolders {
  take?: number;
  page?: number;
  projectIds?: number[]
}

export interface Folder {
  id: number;
  name: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}