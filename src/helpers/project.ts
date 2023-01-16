import _ from "lodash";
import { ESOLUTION_TYPE } from "models";
import { TargetQuestionType } from "models/Admin/target";
import { ConfigData } from "models/config";
import { CustomQuestionType } from "models/custom_question";
import { PackType } from "models/pack";
import { EPaymentStatus } from "models/payment";
import { Project, ProjectStatus } from "models/project";
import moment from "moment-timezone";

export const editableProject = (project: Project) => {
  return project?.editable
}
export class ProjectHelper {

  static getPrefixTrans = (solutionType?: number) => {
    return `solution_type_${solutionType || ESOLUTION_TYPE.PACK}`
  }

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

  static getCustomQuestionPriceConfig(project: Project, customQuestionType: CustomQuestionType) {
    const _project = ProjectHelper.getProject(project)
    const customQuestion = _project?.customQuestions?.find(t => t.typeId === customQuestionType.id)
    return {
      price: customQuestion?.type?.price ?? customQuestionType?.price,
      priceAttribute: customQuestion?.type?.priceAttribute ?? customQuestionType?.priceAttribute
    }
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

  static minPack(project: Project) {
    const _project = ProjectHelper.getProject(project)
    return _project?.solution?.minPack ?? 0
  }

  static minAdditionalBrand(project: Project) {
    const _project = ProjectHelper.getProject(project)
    return _project?.solution?.minAdditionalBrand ?? 0
  }

  static minEyeTrackingPack(project: Project) {
    const _project = ProjectHelper.getProject(project)
    const minEyeTrackingPack = _project?.solution?.minEyeTrackingPack ?? 0
    const competitorPack = project?.packs?.filter(it => it.packTypeId === PackType.Competitor_Pack)?.length || 0
    return competitorPack >= minEyeTrackingPack ? 0 : minEyeTrackingPack - competitorPack
  }

  static minVideo(project: Project) {
    const _project = ProjectHelper.getProject(project)
    return _project?.solution?.minVideo ?? 0
  }

  static packNeedMore(project: Project) {
    const totalPack = project?.packs?.length || 0
    const minPack = ProjectHelper.minPack(project)
    return totalPack >= minPack ? 0 : minPack - totalPack
  }

  static additionalBrandNeedMore(project: Project) {
    const totalBrand = project?.additionalBrands?.length || 0
    const minBrand = ProjectHelper.minAdditionalBrand(project)
    return totalBrand >= minBrand ? 0 : minBrand - totalBrand
  }

  static eyeTrackingPackNeedMore(project: Project) {
    const totalEyeTrackingPack = project?.eyeTrackingPacks?.length || 0
    const minEyeTrackingPack = ProjectHelper.minEyeTrackingPack(project)
    return totalEyeTrackingPack >= minEyeTrackingPack ? 0 : minEyeTrackingPack - totalEyeTrackingPack
  }

  static videoNeedMore(project: Project) {
    const totalVideo = project?.videos?.length || 0
    const minVideo = ProjectHelper.minVideo(project)
    return totalVideo >= minVideo ? 0 : minVideo - totalVideo
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

  static isValidPacks(project: Project): boolean {
    return (project?.packs?.length ?? 0) >= ProjectHelper.minPack(project)
  }

  static isValidVideos(project: Project): boolean {
    return (project?.videos?.length ?? 0) >= ProjectHelper.minVideo(project)
  }

  static isValidAdditionalBrand(project: Project) {
    return (project?.additionalBrands?.length ?? 0) >= ProjectHelper.minAdditionalBrand(project)
  }

  static isValidEyeTracking(project: Project) {
    const _project = ProjectHelper.getProject(project)
    switch (project?.solution?.typeId) {
      case ESOLUTION_TYPE.PACK:
        return ((project?.eyeTrackingPacks?.length ?? 0) >= ProjectHelper.minEyeTrackingPack(project)) || !_project?.solution?.enableEyeTracking || !project?.enableEyeTracking
      case ESOLUTION_TYPE.VIDEO_CHOICE:
        return true
    }
  }

  static isValidBasic(project: Project) {
    return !!project?.category
  }

  static isValidSetup(project: Project) {
    switch (project?.solution?.typeId) {
      case ESOLUTION_TYPE.PACK:
        return ProjectHelper.isValidBasic(project) &&
          ProjectHelper.isValidPacks(project) &&
          ProjectHelper.isValidAdditionalBrand(project) &&
          ProjectHelper.isValidEyeTracking(project)
      case ESOLUTION_TYPE.VIDEO_CHOICE:
        return ProjectHelper.isValidBasic(project) &&
        ProjectHelper.isValidVideos(project)
    }
  }

  static isValidCheckout(project: Project) {
    switch (project?.solution?.typeId) {
      case ESOLUTION_TYPE.PACK:
        return ProjectHelper.isValidSampleSize(project) &&
          ProjectHelper.isValidTarget(project) &&
          ProjectHelper.isValidPacks(project) &&
          ProjectHelper.isValidAdditionalBrand(project) &&
          ProjectHelper.isValidBasic(project) &&
          ProjectHelper.isValidEyeTracking(project) &&
          ProjectHelper.isValidEyeTrackingSampleSize(project)
      case ESOLUTION_TYPE.VIDEO_CHOICE:
        return ProjectHelper.isValidSampleSize(project) &&
          ProjectHelper.isValidTarget(project) &&
          ProjectHelper.isValidVideos(project) &&
          ProjectHelper.isValidEyeTrackingSampleSize(project)
    }
  }
}

export default ProjectHelper