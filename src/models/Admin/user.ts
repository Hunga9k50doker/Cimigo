export interface GetUsersParams {
  take: number;
  page: number;
  keyword?: string;
  sortedField?: string;
  isDescending?: boolean;
  countryIds?: number[]
}