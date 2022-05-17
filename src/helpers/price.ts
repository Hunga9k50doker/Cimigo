import _ from "lodash";
import { ConfigData } from "models/config";
import { Project } from "models/project";
import { round } from "utils/formatNumber";

export class PriceService {
  static getSampleSizeConstConfig = (project: Project) => {
    return [...(project?.solution?.sampleSizes || [])].sort((a, b) => a.limit - b.limit)
  }
  static getSampleSizeCost = (project: Project) => {
    const sampleSize = project?.sampleSize || 0
    const sampleSizeConstConfig = this.getSampleSizeConstConfig(project)
    const unitPrice = sampleSizeConstConfig.find((it, index) => it.limit > sampleSize || (it.limit === sampleSize && index === (sampleSizeConstConfig.length - 1)))?.price || 0
    return round(sampleSize * unitPrice)
  }
  static getTotal = (project: Project, configs: ConfigData) => {
    const sampleSize: number = project.sampleSize;
  
    const sampleSizeCostUSD: number = this.getSampleSizeCost(project);
    const amountUSD = sampleSizeCostUSD
    const vatUSD = Math.round(amountUSD * configs.vat * 100) / 100;
    const totalAmountUSD = Math.round((amountUSD + vatUSD) * 100) / 100
  
    const sampleSizeCost: number = Math.round(sampleSizeCostUSD * configs.usdToVND);
    const amount = Math.round(amountUSD * configs.usdToVND)
    const vat = Math.round(vatUSD * configs.usdToVND);
    const totalAmount = Math.round(totalAmountUSD * configs.usdToVND)
  
    return {
      sampleSize,
      sampleSizeCost,
      sampleSizeCostUSD,
      amount,
      amountUSD,
      vat,
      vatUSD,
      totalAmount,
      totalAmountUSD
    }
  }
}