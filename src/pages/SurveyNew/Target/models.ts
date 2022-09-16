export enum ETab {
  Location,
  Household_Income,
  Age_Coverage
}
export interface TabItem {
  id: ETab,
  title: string,
  img: string
}

export interface SampleSizeItem {
  value: number,
  popular: boolean
}

export const _listSampleSize: SampleSizeItem[] = [
  { value: 100, popular: false },
  { value: 200, popular: true },
  { value: 300, popular: false },
]

export const _listEyeTrackingSampleSize: SampleSizeItem[] = [
  { value: 30, popular: false },
  { value: 50, popular: false },
  { value: 100, popular: false },
]

export interface CustomSampleSizeForm {
  sampleSize: number
}

export interface CustomEyeTrackingSampleSizeForm {
  eyeTrackingSampleSize: number
}