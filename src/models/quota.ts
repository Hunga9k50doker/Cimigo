import { QuotaTable } from "./Admin/quota"
import { TargetAnswer, TargetQuestion } from "./Admin/target"

export interface QuotaTableRow {
  targetAnswers: TargetAnswer[],
  original: number,
  rebase?: number,
  sampleSize?: number
}

export interface Quota {
  quotaTable: QuotaTable,
  questions: TargetQuestion[],
  rows: QuotaTableRow[]
}