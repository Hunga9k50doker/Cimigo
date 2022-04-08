import _ from "lodash";
import { Project } from "models/project";

export class PriceService {
  static getSampleSizeConstConfig = (project: Project) => {
    return [...(project?.solution?.sampleSizes || [])].sort((a, b) => a.limit - b.limit)
  }
  static getSampleSizeCost = (project: Project) => {
    const sampleSize = project?.sampleSize || 0
    const sampleSizeConstConfig = this.getSampleSizeConstConfig(project)
    const unitPrice = sampleSizeConstConfig.find((it, index) => it.limit > sampleSize || (it.limit === sampleSize && index === (sampleSizeConstConfig.length - 1)))?.price || 0
    return sampleSize * unitPrice
  }
}