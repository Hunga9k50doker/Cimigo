export interface GetSchedulePreview {
  projectId: number;
  month: number;
  year: number;
}
export interface SchedulePreview{
    totalAmount: number;
    totalAmountUSD: number;
    order: number;
    scheduledMonths: number;
    start: Date;
    end: Date;
    dueDate: Date;
}
export interface MakeAnOrder{
  projectId: number;
  month: number;
  year: number;
}
export interface PayMentHistory {
  sortedField?: string;
  isDescending?: boolean;
  folderIds?: number[];
  statusIds?: number[];
  keyword?: string;
  take?: number;
  page?: number;
}