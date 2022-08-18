import { AdditionalBrand } from "models/additional_brand";
import { Solution } from "models/Admin/solution";
import { TargetQuestionType } from "models/Admin/target";
import { Pack } from "models/pack";
import { Project } from "models/project";

export const editableProject = (project: Project) => {
  return project?.editable
}
export class ProjectHelper {
  static isValidTarget(project: Project) {
    const location = project?.targets.find(it => it.targetQuestion?.typeId === TargetQuestionType.Location)
    if (!location) return false
    const economicClass = project?.targets.find(it => it.targetQuestion?.typeId === TargetQuestionType.Economic_Class)
    if (!economicClass) return false
    const ageCoverage = project?.targets.find(it => [TargetQuestionType.Mums_Only, TargetQuestionType.Gender_And_Age_Quotas].includes(it.targetQuestion?.typeId || 0))
    if (!ageCoverage) return false
    return true
  }

  static isValidSampleSize(project: Project) {
    return !!project?.sampleSize
  }

  static isValidPacks(solution: Solution, packs: Pack[]): boolean {
    return (packs?.length ?? 0) >= (solution?.minPack ?? 0)
  }

  static isValidAdditionalBrand(solution: Solution, additionalBrands: AdditionalBrand[]) {
    return (additionalBrands?.length ?? 0) >= (solution?.minAdditionalBrand ?? 0)
  }

  static isValidEyeTracking(solution: Solution, eyeTrackingPacks: Pack[]) {
    return ((eyeTrackingPacks?.length ?? 0) >= (solution?.minEyeTrackingPack ?? 0)) || solution?.enableEyeTracking
  }

  static isValidBasic(project: Project) {
    return !!project?.category && !!project?.brand && !!project?.variant && !!project?.manufacturer
  }

  static isValidCheckout(project: Project) {
    return ProjectHelper.isValidSampleSize(project) && 
    ProjectHelper.isValidTarget(project) && 
    ProjectHelper.isValidPacks(project?.solution, project?.packs) && 
    ProjectHelper.isValidAdditionalBrand(project?.solution, project?.additionalBrands) && 
    ProjectHelper.isValidBasic(project) &&
    ProjectHelper.isValidEyeTracking(project?.solution, project?.eyeTrackingPacks)
  }
}

export default ProjectHelper