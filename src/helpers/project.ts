import _ from "lodash";
import { AdditionalBrand } from "models/additional_brand";
import { Solution } from "models/Admin/solution";
import { TargetQuestionType } from "models/Admin/target";
import { ConfigData } from "models/config";
import { Pack } from "models/pack";
import { EPaymentStatus } from "models/payment";
import { Project, ProjectStatus } from "models/project";
import moment from "moment-timezone";

export const editableProject = (project: Project) => {
  return project?.editable
}
export class ProjectHelper {

  static getExpectedDelivery = (project: Project) => {
    return project?.sampleSize <= 500 ? 10 : 15
  }

  static addBusinessDate = (value: moment.MomentInput, numDaysToAdd: number) => {
    const Sunday = 0;
    const Saturday = 6;
    let daysRemaining = numDaysToAdd;
    const date = moment(value).add(1, "days").startOf("day");
    while (daysRemaining > 0) {
      date.add(1, 'days');
      if (date.day() !== Sunday && date.day() !== Saturday) {
        daysRemaining--;
      }
    }
    return date;
  }

  static getReportReadyDate(project: Project, lang: string) {
    moment.locale(lang)
    if (project?.reportReadyDate) {
      return moment.tz(project.reportReadyDate, "Asia/Ho_Chi_Minh")
    } else {
      const payment = ProjectHelper.getPayment(project)
      const expectedDelivery = ProjectHelper.getExpectedDelivery(project)
      return ProjectHelper.addBusinessDate(payment?.completedDate, expectedDelivery)
    }
  }

  static getPayment(project: Project) {
    return project?.payments?.filter(f => f.status !== EPaymentStatus.CANCEL)?.sort((a, b) => b.id - a.id)?.[0]
  }

  static isPaymentPaid(project: Project) {
    const payment = ProjectHelper.getPayment(project)
    return payment?.status === EPaymentStatus.PAID
  }

  static isReportReady(project: Project) {
    return project && (project.reports?.length || project.dataStudio) && project.status === ProjectStatus.COMPLETED
  }

  static getProject(project: Project) {
    const payment = ProjectHelper.getPayment(project)
    if (payment && !_.isEmpty(payment?.projectData)) {
      return payment.projectData
    }
    return project
  }

  static getConfig(project: Project, config: ConfigData) {
    const payment = ProjectHelper.getPayment(project)
    if (payment && !_.isEmpty(payment.config)) {
      return payment.config
    }
    return config
  }
  
  static isValidQuotas(project: Project) {
    return project?.agreeQuota
  }

  static isValidTargetTabLocation(project: Project) {
    return !!project?.targets?.find(it => it.targetQuestion?.typeId === TargetQuestionType.Location)
  }

  static isValidTargetTabHI(project: Project) {
    return !!project?.targets?.find(it => it.targetQuestion?.typeId === TargetQuestionType.Household_Income)
  }

  static isValidTargetTabAC(project: Project) {
    return !!project?.targets?.find(it => [TargetQuestionType.Mums_Only, TargetQuestionType.Gender_And_Age_Quotas].includes(it.targetQuestion?.typeId || 0))
  }

  static isValidTarget(project: Project) {
    return ProjectHelper.isValidTargetTabLocation(project) &&
      ProjectHelper.isValidTargetTabHI(project) &&
      ProjectHelper.isValidTargetTabAC(project)
  }

  static minPack(solution: Solution) {
    return solution?.minPack ?? 0
  }

  static minAdditionalBrand(solution: Solution) {
    return solution?.minAdditionalBrand ?? 0
  }

  static minEyeTrackingPack(solution: Solution) {
    return solution?.minEyeTrackingPack ?? 0
  }

  static isValidSampleSize(project: Project) {
    return !!project?.sampleSize
  }

  static isValidEyeTrackingSampleSize(project: Project) {
    return !!project?.eyeTrackingSampleSize || !project?.enableEyeTracking
  }

  static isValidTargetTab(project: Project) {
    return ProjectHelper.isValidTarget(project) && ProjectHelper.isValidSampleSize(project) && ProjectHelper.isValidEyeTrackingSampleSize(project)
  }

  static isValidPacks(solution: Solution, packs: Pack[]): boolean {
    return (packs?.length ?? 0) >= ProjectHelper.minPack(solution)
  }

  static isValidAdditionalBrand(solution: Solution, additionalBrands: AdditionalBrand[]) {
    return (additionalBrands?.length ?? 0) >= ProjectHelper.minAdditionalBrand(solution)
  }

  static isValidEyeTracking(project: Project) {
    return ((project?.eyeTrackingPacks?.length ?? 0) >= ProjectHelper.minEyeTrackingPack(project?.solution)) || !project?.solution?.enableEyeTracking || !project?.enableEyeTracking
  }

  static isValidBasic(project: Project) {
    return !!project?.category && !!project?.brand && !!project?.variant && !!project?.manufacturer
  }

  static isValidSetup(project: Project) {
    return ProjectHelper.isValidBasic(project) &&
      ProjectHelper.isValidPacks(project?.solution, project?.packs) &&
      ProjectHelper.isValidAdditionalBrand(project?.solution, project?.additionalBrands) &&
      ProjectHelper.isValidEyeTracking(project)
  }

  static isValidCheckout(project: Project) {
    return ProjectHelper.isValidSampleSize(project) && 
    ProjectHelper.isValidTarget(project) && 
    ProjectHelper.isValidPacks(project?.solution, project?.packs) && 
    ProjectHelper.isValidAdditionalBrand(project?.solution, project?.additionalBrands) && 
    ProjectHelper.isValidBasic(project) &&
    ProjectHelper.isValidEyeTracking(project)
  }
}

export default ProjectHelper