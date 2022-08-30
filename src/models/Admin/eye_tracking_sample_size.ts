export interface EyeTrackingSampleSize {
  id: number;
  solutionId: number;
  price: number;
  limit: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetListEyeTrackingSampleSize {
  take?: number;
  page?: number;
  solutionId?: number;
}

export interface CreateEyeTrackingSampleSize {
  solutionId: number;
  price: number;
  limit: number;
}

export interface UpdateEyeTrackingSampleSize {
  solutionId?: number;
  price?: number;
  limit?: number;
}