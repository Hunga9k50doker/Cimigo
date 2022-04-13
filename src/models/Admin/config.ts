export interface UpdateConfig {
  name?: string;
  value?: string;
}

export interface GetConfigsParams {
  page?: number,
  take?: number,
  keyword?: string
}