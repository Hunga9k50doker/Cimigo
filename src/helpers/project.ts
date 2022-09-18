import { AdditionalBrand } from "models/additional_brand";
import { Solution } from "models/Admin/solution";
import { TargetQuestionType } from "models/Admin/target";
import { Pack } from "models/pack";
import { Project } from "models/project";

export const editableProject = (project: Project) => {
  return project?.editable
}
export class ProjectHelper {

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
    return ProjectHelper.isValidSetup(project) && ProjectHelper.isValidSampleSize(project) && ProjectHelper.isValidTarget(project)
  }
}

export default ProjectHelper