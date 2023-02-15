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
export interface GetPaymentSchedule{
  projectId: number;
}
interface SolutionConfig{
  daysOfDueDate: number;
  daysOfDueDateType: number;
  paymentMonthSchedule: number;
}
export enum PaymentScheduleStatus {
  NOT_PAID,
  IN_PROGRESS,
  PAID,
  OVERDUE,
}
export interface PaymentSchedule{
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
  currency?: string;
}
export interface GetListPaymentScheduleHistory {
  projectId: number;
  sortedField?: string;
  isDescending?: boolean;
  folderIds?: number[];
  statusIds?: number[];
  keyword?: string;
  take?: number;
  page?: number;
}