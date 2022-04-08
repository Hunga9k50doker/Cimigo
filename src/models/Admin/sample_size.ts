export interface SampleSize {
  id: number;
  solutionId: number;
  price: number;
  limit: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetListSampleSize {
  take?: number;
  page?: number;
  solutionId?: number;
}

export interface CreateSampleSize {
  solutionId: number;
  price: number;
  limit: number;
}

export interface UpdateSampleSize {
  solutionId?: number;
  price?: number;
  limit?: number;
}