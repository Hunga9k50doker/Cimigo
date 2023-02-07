export interface GetPaymentSchedulePreview {
  projectId: number;
  startDate: Date;
}
export interface PaymentSchedulePreview{
    totalAmount: number;
    totalAmountUSD: number;
    order: number;
    scheduledMonths: number;
    startDate: Date;
    endDate: Date;
    dueDate: Date;
}
export interface GetSlidePaymentSchedule{
  projectId: number;
}
interface SolutionConfig{
  daysOfDueDate: number;
  daysOfDueDateType: number;
  paymentMonthSchedule: number;
}
export interface SlidePaymentScheduleMakeAnOrder{
  id: number;
  solutionConfig: SolutionConfig;
  start: Date;
  end: Date;
  dueDate: Date;
  totalAmount: number;
  totalAmountUSD: number;
  status: number;

}
export interface PaymentScheduleMakeAnOrder{
  projectId: number;
  startDate: Date;
}
export interface PayMentScheduleHistory {
  sortedField?: string;
  isDescending?: boolean;
  folderIds?: number[];
  statusIds?: number[];
  keyword?: string;
  take?: number;
  page?: number;
}
interface Schedule {
  id: number;
  start: Date;
  end: Date;
}
export interface PaymentScheduleHistory {
  id: number;
  orderId: number;
  schedule: Schedule;
  totalAmount: number;
  totalAmountUSD: number;
  completedDate?: Date;
}
export interface GetListPaymentScheduleHistory {
  page: number;
  take: number;
  projectId: number;
  sortedField?: string;
  isDescending?: boolean;
  folderIds?: number[];
  statusIds?: number[];
}