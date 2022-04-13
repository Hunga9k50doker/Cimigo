export interface AdminGetProjects {
  take: number;
  page: number;
  keyword: string;
  sortedField?: string;
  isDescending?: boolean;
  solutionIds?: number[];
  statusIds?: number[];
  orderIds?: number[];
}