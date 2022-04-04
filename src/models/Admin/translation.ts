export interface GetTranslations {
  take?: number;
  page?: number;
  keyword?: string;
}

export interface CreateTranslation {
  key: string;
  data: string;
  language: string;
}

export interface UpdateTranslation {
  key?: string;
  data?: string;
  language?: string;
}

export interface Translation {
  id: number;
  key: string;
  data: string;
  namespace: string,
  language: string;
  createdAt: Date;
  updatedAt: Date;
}