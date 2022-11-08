import { CustomQuestion, CustomQuestionType, ECustomQuestionType } from "models/custom_question";
import { currencySymbol, ECurrency } from "models/general";
import { Project } from "models/project";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { ReducerType } from "redux/reducers";
import { fCurrency2, fCurrency2VND, round } from "utils/formatNumber";
import ProjectHelper from "./project";

export class PriceService {
  static getSampleSizeConstConfig = (project: Project) => {
    const _project = ProjectHelper.getProject(project)
    return [...(_project?.solution?.sampleSizes || [])].sort((a, b) => a.limit - b.limit)
  }

  static getSampleSizeCost = (project: Project) => {
    const _project = ProjectHelper.getProject(project)
    const sampleSize = _project?.sampleSize || 0
    const sampleSizeConstConfig = PriceService.getSampleSizeConstConfig(project)
    const unitPrice = sampleSizeConstConfig.find((it, index) => it.limit > sampleSize || (it.limit === sampleSize && index === (sampleSizeConstConfig.length - 1)))?.price || 0
    return round(sampleSize * unitPrice)
  }

  static getEyeTrackingSampleSizeConstConfig = (project: Project) => {
    const _project = ProjectHelper.getProject(project)
    return [...(_project?.solution?.eyeTrackingSampleSizes || [])].sort((a, b) => a.limit - b.limit)
  }

  static getEyeTrackingSampleSizeCost = (project: Project) => {
    const _project = ProjectHelper.getProject(project)
    if (!_project?.enableEyeTracking) return 0
    const sampleSize = _project?.eyeTrackingSampleSize || 0
    const eyeTrackingSampleSizeConstConfig = PriceService.getEyeTrackingSampleSizeConstConfig(project)
    const unitPrice = eyeTrackingSampleSizeConstConfig.find((it, index) => it.limit > sampleSize || (it.limit === sampleSize && index === (eyeTrackingSampleSizeConstConfig.length - 1)))?.price || 0
    return round(sampleSize * unitPrice)
  }

  static convertUSDToVND = (value: number, usdToVND: number) => {
    return Math.round(value * usdToVND)
  }

  static getCustomQuestionOpenQuestionCost = (customQuestionType: CustomQuestionType, project: Project) => {
    const config = ProjectHelper.getCustomQuestionPriceConfig(project, customQuestionType)
    const priceUSD = round(config?.price || 0)
    return priceUSD
  }

  static getCustomQuestionSingleChoiceCost = (customQuestionType: CustomQuestionType, project: Project) => {
    const config = ProjectHelper.getCustomQuestionPriceConfig(project, customQuestionType)
    const priceUSD = round(config?.price || 0)
    return priceUSD
  }

  static getCustomQuestionMultipleChoicesCost = (customQuestionType: CustomQuestionType, project: Project) => {
    const config = ProjectHelper.getCustomQuestionPriceConfig(project, customQuestionType)
    const priceUSD = round(config?.price || 0)
    return priceUSD
  }


  static getCustomQuestionNumericScaleCost = (customQuestionType: CustomQuestionType, numberOfAttributes: number, project: Project) => {
    const config = ProjectHelper.getCustomQuestionPriceConfig(project, customQuestionType)
    const _numberOfAttributes = numberOfAttributes > 1 ? numberOfAttributes - 1 : 0;
    const priceUSD = round((config?.price || 0) + (_numberOfAttributes * (config?.priceAttribute || 0)))
    return priceUSD
  }

  static getCustomQuestionSmileyRatingCost = (customQuestionType: CustomQuestionType, numberOfAttributes: number, project: Project) => {
    const config = ProjectHelper.getCustomQuestionPriceConfig(project, customQuestionType)
    const _numberOfAttributes = numberOfAttributes > 1 ? numberOfAttributes - 1 : 0;
    const priceUSD = round((config?.price || 0) + (_numberOfAttributes * (config?.priceAttribute || 0)))
    return priceUSD
  }

  static getCustomQuestionStarRatingCost = (customQuestionType: CustomQuestionType, numberOfAttributes: number, project: Project) => {
    const config = ProjectHelper.getCustomQuestionPriceConfig(project, customQuestionType)
    const _numberOfAttributes = numberOfAttributes > 1 ? numberOfAttributes - 1 : 0;
    const priceUSD = round((config?.price || 0) + (_numberOfAttributes * (config?.priceAttribute || 0)))
    return priceUSD
  }


  static getCustomQuestionItemCost = (customQuestion: CustomQuestion, project: Project) => {
    switch (customQuestion.typeId) {
      case ECustomQuestionType.Open_Question:
        return PriceService.getCustomQuestionOpenQuestionCost(customQuestion.type, project)
      case ECustomQuestionType.Single_Choice:
        return PriceService.getCustomQuestionSingleChoiceCost(customQuestion.type, project)
      case ECustomQuestionType.Multiple_Choices:
        return PriceService.getCustomQuestionMultipleChoicesCost(customQuestion.type, project)
      case ECustomQuestionType.Numeric_Scale:
        return PriceService.getCustomQuestionNumericScaleCost(customQuestion.type, customQuestion.customQuestionAttributes?.length, project)
      case ECustomQuestionType.Smiley_Rating:
        return PriceService.getCustomQuestionSmileyRatingCost(customQuestion.type, customQuestion.customQuestionAttributes?.length, project)
      case ECustomQuestionType.Star_Rating:
        return PriceService.getCustomQuestionStarRatingCost(customQuestion.type, customQuestion.customQuestionAttributes?.length, project)
    }
  }

  static getCustomQuestionCost = (project: Project) => {
    return project?.customQuestions?.reduce((total, item) => total + PriceService.getCustomQuestionItemCost(item, project), 0) || 0;
  }
}

interface ICurrencyConvert {
  USD: number;
  VND: number;
  USDShow: string;
  VNDShow: string;
  show: string;
  equivalent: string;
}

const getCurrencyConvert = (costUSD: number, currency: string, usdToVND: number): ICurrencyConvert => {
  let show = '', equivalent = ''
  let USD = costUSD
  let VND = Math.round(costUSD * usdToVND)
  let USDShow = `${currencySymbol[ECurrency.USD].first}${fCurrency2(USD)}${currencySymbol[ECurrency.USD].last}`
  let VNDShow = `${currencySymbol[ECurrency.VND].first}${fCurrency2VND(VND)}${currencySymbol[ECurrency.VND].last}`
  switch (currency) {
    case ECurrency.USD:
      show = USDShow
      equivalent = VNDShow
      break;
    case ECurrency.VND:
      show = VNDShow
      equivalent = USDShow
      break;
  }
  return {
    USD: USD,
    VND: VND,
    USDShow: USDShow,
    VNDShow: VNDShow,
    show: show,
    equivalent: equivalent,
  }
}

export function usePrice() {
  const { user, configs: configsNew } = useSelector((state: ReducerType) => state.user)
  const { project } = useSelector((state: ReducerType) => state.project)

  const currency = useMemo(() => {
    return user.currency || ECurrency.VND
  }, [user])

  const configs = useMemo(() => {
    return ProjectHelper.getConfig(project, configsNew)
  }, [configsNew, project])

  const usdToVND = useMemo(() => {
    return configs?.usdToVND || configsNew?.usdToVND
  }, [configs, configsNew])

  const vatConfig = useMemo(() => {
    return configs?.vat || configsNew?.vat
  }, [configs, configsNew])

  const sampleSizeCost = useMemo(() => {
    const costUSD = PriceService.getSampleSizeCost(project)
    return getCurrencyConvert(costUSD, currency, usdToVND)
  }, [currency, project, usdToVND])

  const eyeTrackingSampleSizeCost = useMemo(() => {
    const costUSD = PriceService.getEyeTrackingSampleSizeCost(project)
    return getCurrencyConvert(costUSD, currency, usdToVND)
  }, [currency, project, usdToVND])

  const customQuestionCost = useMemo(() => {
    const costUSD = PriceService.getCustomQuestionCost(project)
    return getCurrencyConvert(costUSD, currency, usdToVND)
  }, [project, currency, usdToVND])

  const amountCost = useMemo(() => {
    const costUSD = (sampleSizeCost?.USD ?? 0) + (customQuestionCost?.USD ?? 0) + (eyeTrackingSampleSizeCost?.USD ?? 0)
    return getCurrencyConvert(costUSD, currency, usdToVND)
  }, [sampleSizeCost?.USD, customQuestionCost?.USD, eyeTrackingSampleSizeCost?.USD, currency, usdToVND])

  const vatCost = useMemo(() => {
    const costUSD = round((amountCost?.USD ?? 0) * vatConfig)
    return getCurrencyConvert(costUSD, currency, usdToVND)
  }, [amountCost?.USD, vatConfig, currency, usdToVND])

  const totalAmountCost = useMemo(() => {
    const costUSD = round((amountCost?.USD ?? 0) + (vatCost?.USD ?? 0));
    return getCurrencyConvert(costUSD, currency, usdToVND)
  }, [amountCost?.USD, vatCost?.USD, currency, usdToVND])

  const getCustomQuestionOpenQuestionCost = (customQuestionType: CustomQuestionType, project: Project) => {
    const costUSD = PriceService.getCustomQuestionOpenQuestionCost(customQuestionType, project)
    return getCurrencyConvert(costUSD, currency, usdToVND)
  }

  const getCustomQuestionSingleChoiceCost = (customQuestionType: CustomQuestionType, project: Project) => {
    const costUSD = PriceService.getCustomQuestionSingleChoiceCost(customQuestionType, project)
    return getCurrencyConvert(costUSD, currency, usdToVND)
  }

  const getCustomQuestionMultipleChoicesCost = (customQuestionType: CustomQuestionType, project: Project) => {
    const costUSD = PriceService.getCustomQuestionMultipleChoicesCost(customQuestionType, project)
    return getCurrencyConvert(costUSD, currency, usdToVND)
  }

  const getCustomQuestionNumericScaleCost = (customQuestionType: CustomQuestionType, numberOfAttributes: number, project: Project) => {
    const costUSD = PriceService.getCustomQuestionNumericScaleCost(customQuestionType, numberOfAttributes, project)
    return getCurrencyConvert(costUSD, currency, usdToVND)
  }

  const getCustomQuestionSmileyRatingCost = (customQuestionType: CustomQuestionType, numberOfAttributes: number, project: Project) => {
    const costUSD = PriceService.getCustomQuestionSmileyRatingCost(customQuestionType, numberOfAttributes, project)
    return getCurrencyConvert(costUSD, currency, usdToVND)
  }

  const getCustomQuestionStarRatingCost = (customQuestionType: CustomQuestionType, numberOfAttributes: number, project: Project) => {
    const costUSD = PriceService.getCustomQuestionStarRatingCost(customQuestionType, numberOfAttributes, project)
    return getCurrencyConvert(costUSD, currency, usdToVND)
  }

  const getCustomQuestionItemCost = (customQuestion: CustomQuestion) => {
    const costUSD = PriceService.getCustomQuestionItemCost(customQuestion, project)
    return getCurrencyConvert(costUSD, currency, usdToVND)
  }

  const getCostCurrency = (costUSD: number) => {
    return getCurrencyConvert(costUSD, currency, usdToVND)
  }

  const price: TotalPrice = {
    sampleSizeCost,
    eyeTrackingSampleSizeCost,
    customQuestionCost,
    amountCost,
    vatCost,
    totalAmountCost,
  }

  return {
    price,
    getCostCurrency,
    getCustomQuestionItemCost,
    getCustomQuestionOpenQuestionCost,
    getCustomQuestionSingleChoiceCost,
    getCustomQuestionMultipleChoicesCost,
    getCustomQuestionNumericScaleCost,
    getCustomQuestionSmileyRatingCost,
    getCustomQuestionStarRatingCost
  }
}

export interface TotalPrice {
  sampleSizeCost: ICurrencyConvert,
  eyeTrackingSampleSizeCost: ICurrencyConvert,
  customQuestionCost: ICurrencyConvert,
  amountCost: ICurrencyConvert,
  vatCost: ICurrencyConvert,
  totalAmountCost: ICurrencyConvert,
}