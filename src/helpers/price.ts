import _ from "lodash";
import { ConfigData } from "models/config";
import { CustomQuestion, CustomQuestionType, ECustomQuestionType } from "models/custom_question";
import { Project } from "models/project";
import { round } from "utils/formatNumber";

export class PriceService {
  static getSampleSizeConstConfig = (project: Project) => {
    return [...(project?.solution?.sampleSizes || [])].sort((a, b) => a.limit - b.limit)
  }

  static getSampleSizeCost = (project: Project) => {
    const sampleSize = project?.sampleSize || 0
    const sampleSizeConstConfig = PriceService.getSampleSizeConstConfig(project)
    const unitPrice = sampleSizeConstConfig.find((it, index) => it.limit > sampleSize || (it.limit === sampleSize && index === (sampleSizeConstConfig.length - 1)))?.price || 0
    return round(sampleSize * unitPrice)
  }

  static getEyeTrackingSampleSizeConstConfig = (project: Project) => {
    return [...(project?.solution?.eyeTrackingSampleSizes || [])].sort((a, b) => a.limit - b.limit)
  }

  static getEyeTrackingSampleSizeCost = (project: Project) => {
    if (!project?.enableEyeTracking) return 0
    const sampleSize = project?.eyeTrackingSampleSize || 0
    const eyeTrackingSampleSizeConstConfig = PriceService.getEyeTrackingSampleSizeConstConfig(project)
    const unitPrice = eyeTrackingSampleSizeConstConfig.find((it, index) => it.limit > sampleSize || (it.limit === sampleSize && index === (eyeTrackingSampleSizeConstConfig.length - 1)))?.price || 0
    return round(sampleSize * unitPrice)
  }

  static convertUSDToVND = (value: number, configs: ConfigData) => {
    return Math.round(value * configs.usdToVND)
  }

  static getCustomQuestionOpenQuestionCost = (customQuestionType: CustomQuestionType, configs: ConfigData) => {
    const priceUSD = round(customQuestionType?.price || 0)
    const priceVND = PriceService.convertUSDToVND(priceUSD, configs)
    return {
      priceUSD,
      priceVND
    }
  }

  static getCustomQuestionSingleChoiceCost = (customQuestionType: CustomQuestionType, configs: ConfigData) => {
    const priceUSD = round(customQuestionType?.price || 0)
    const priceVND = PriceService.convertUSDToVND(priceUSD, configs)
    return {
      priceUSD,
      priceVND
    }
  }

  static getCustomQuestionMultipleChoicesCost = (customQuestionType: CustomQuestionType, configs: ConfigData) => {
    const priceUSD = round(customQuestionType?.price || 0)
    const priceVND = PriceService.convertUSDToVND(priceUSD, configs)
    return {
      priceUSD,
      priceVND
    }
  }

  
  static getCustomQuestionNumericScaleCost = (customQuestionType: CustomQuestionType, numberOfAttributes: number, configs: ConfigData) => {
    const _numberOfAttributes = numberOfAttributes > 1 ? numberOfAttributes - 1 : 0;
    const priceUSD = round((customQuestionType?.price || 0) + (_numberOfAttributes * (customQuestionType?.priceAttribute || 0)))
    const priceVND = PriceService.convertUSDToVND(priceUSD, configs)
    return {
      priceUSD,
      priceVND
    }
  }

  static getCustomQuestionSmileyRatingCost = (customQuestionType: CustomQuestionType, numberOfAttributes: number, configs: ConfigData) => {
    const _numberOfAttributes = numberOfAttributes > 1 ? numberOfAttributes - 1 : 0;
    const priceUSD = round((customQuestionType?.price || 0) + (_numberOfAttributes * (customQuestionType?.priceAttribute || 0)))
    const priceVND = PriceService.convertUSDToVND(priceUSD, configs)
    return {
      priceUSD,
      priceVND
    }
  }

  static getCustomQuestionStarRatingCost = (customQuestionType: CustomQuestionType, numberOfAttributes: number, configs: ConfigData) => {
    const _numberOfAttributes = numberOfAttributes > 1 ? numberOfAttributes - 1 : 0;
    const priceUSD = round((customQuestionType?.price || 0) + (_numberOfAttributes * (customQuestionType?.priceAttribute || 0)))
    const priceVND = PriceService.convertUSDToVND(priceUSD, configs)
    return {
      priceUSD,
      priceVND
    }
  }


  static getCustomQuestionItemCost = (customQuestion: CustomQuestion, configs: ConfigData) => {
    switch (customQuestion.typeId) {
      case ECustomQuestionType.Open_Question:
        return PriceService.getCustomQuestionOpenQuestionCost(customQuestion.type, configs)
      case ECustomQuestionType.Single_Choice:
        return PriceService.getCustomQuestionSingleChoiceCost(customQuestion.type, configs)
      case ECustomQuestionType.Multiple_Choices:
        return PriceService.getCustomQuestionMultipleChoicesCost(customQuestion.type, configs)
      case ECustomQuestionType.Numeric_Scale:
        return PriceService.getCustomQuestionNumericScaleCost(customQuestion.type, customQuestion.customQuestionAttributes?.length, configs)
      case ECustomQuestionType.Smiley_Rating:
        return PriceService.getCustomQuestionSmileyRatingCost(customQuestion.type, customQuestion.customQuestionAttributes?.length, configs)
      case ECustomQuestionType.Star_Rating:
        return PriceService.getCustomQuestionStarRatingCost(customQuestion.type, customQuestion.customQuestionAttributes?.length, configs)
    }
  }

  static getCustomQuestionCost = (customQuestions: CustomQuestion[], configs: ConfigData) => {
    return customQuestions?.reduce((total, item) => total + PriceService.getCustomQuestionItemCost(item, configs).priceUSD, 0) || 0;
  }

  static getTotal = (project: Project, configs: ConfigData) => {
    const sampleSize: number = project.sampleSize;

    const sampleSizeCostUSD: number = PriceService.getSampleSizeCost(project);
    const customQuestionCostUSD: number = PriceService.getCustomQuestionCost(project.customQuestions, configs);
    const eyeTrackingSampleSizeCostUSD: number = PriceService.getEyeTrackingSampleSizeCost(project);

    const amountUSD = sampleSizeCostUSD + customQuestionCostUSD + eyeTrackingSampleSizeCostUSD;
    const vatUSD = round(amountUSD * configs.vat);
    const totalAmountUSD = round(amountUSD + vatUSD);

    const sampleSizeCost: number = Math.round(sampleSizeCostUSD * configs.usdToVND);
    const customQuestionCost: number = Math.round(customQuestionCostUSD * configs.usdToVND);
    const eyeTrackingSampleSizeCost: number = Math.round(eyeTrackingSampleSizeCostUSD * configs.usdToVND);
    const amount = Math.round(amountUSD * configs.usdToVND);
    const vat = Math.round(vatUSD * configs.usdToVND);
    const totalAmount = Math.round(totalAmountUSD * configs.usdToVND);

    return {
      sampleSize,
      sampleSizeCost,
      sampleSizeCostUSD,
      eyeTrackingSampleSizeCost,
      eyeTrackingSampleSizeCostUSD,
      customQuestionCost,
      customQuestionCostUSD,
      amount,
      amountUSD,
      vat,
      vatUSD,
      totalAmount,
      totalAmountUSD
    }
  }
}