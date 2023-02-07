import images from "config/images";
import ReactDOMServer from 'react-dom/server'

export interface TableHeaderLabel {
  name: string;
  label: string;
  sortable: boolean;
  align?: 'center'
  | 'inherit'
  | 'justify'
  | 'left'
  | 'right'
}

// export interface Country {
//   formattedName: string;
//   rawName: string;
// }

export interface OptionItem<T=number> {
  id: T;
  name: string;
  translation?: string;
  img?: string;
  subName?: string;
  icon?: any;
}

export interface OptionItemT<T> {
  id: T;
  name: string;
  translation?: string;
}

export interface PaginationParams {
  take?: number;
  page?: number;
}

export interface Meta {
  take: number;
  itemCount: number;
  page: number;
  pageCount: number;
}

export interface DataOption {
  data: OptionItem[];
  meta: Meta;
}

export class Filter {
  public take?: number;
  public page?: number;
  public keyword?: string;
  constructor(take?: number, page?: number) {
    this.take = take || 10
    this.page = page || 1
    this.keyword = ''
  }
}

export interface DataPagination<T> {
  data: T[];
  meta: Meta;
}

export enum SocialProvider {
  FACEBOOK = 'Facebook',
  ZALO = 'Zalo',
  GOOGLE = 'Google'
}

export interface BreadcrumbItem {
  name: string,
  routes?: string,
  outside?: boolean
}

export enum Lang {
  VI = 'vi',
  EN = 'en'
}

export interface LangSupport {
  key: Lang,
  name: string,
  img: string
}

export const langSupports: LangSupport[] = [
  {
    key: Lang.VI,
    name: 'Tiếng Việt',
    img: images.imgLangVi
  },
  {
    key: Lang.EN,
    name: 'English',
    img: images.imgLangEn
  }
]

export const langOptions: OptionItem<string>[] = [
  {
    id: Lang.VI,
    name: 'Tiếng Việt',
    img: images.imgLangVi,
  },
  {
    id: Lang.EN,
    name: 'English',
    img: images.imgLangEn,
  }
]

export enum EGender {
  Female = 'Nu',
  Male = 'Nam'
}

export interface SortItem {
  sortedField: string;
  isDescending: boolean;
}

export enum EKey {
  TOKEN = 'token',
  REFRESH_TOKEN = 'refresh_token'
}

export enum EStatus {
  Active = 1,
  Inactive,
  Coming_Soon
}

export const statuses: OptionItem[] = [
  { id: EStatus.Active, name: "Active" },
  { id: EStatus.Inactive, name: "Inactive" },
]

export enum EPaymentMethod {
  CREDIT_OR_DEBIT = 1,
  INTERNET_BANKING = 2,
  BANK_TRANSFER = 3,
  MAKE_AN_ORDER = 4,
  ONEPAY_GENERAL = 5
}

export const paymentMethods: OptionItem[] = [
  { id: EPaymentMethod.CREDIT_OR_DEBIT, name: "Credit / Debit Card" },
  { id: EPaymentMethod.INTERNET_BANKING, name: "ATM card / Bank account" },
  { id: EPaymentMethod.BANK_TRANSFER, name: "Bank transfer" },
  { id: EPaymentMethod.MAKE_AN_ORDER, name: "Make an order" },
  { id: EPaymentMethod.ONEPAY_GENERAL, name: "ATM card (Internet Banking) / Credit / Debit Card" },
]

export enum ETypeVerifyCode {
  VERIFY_EMAIL = 1,
  RESET_PASSWORD = 2
}
export enum ECurrency {
  USD = 'USD',
  VND = 'VND',
}

export const currencySymbol = {
  [ECurrency.USD]: {
    first: '$',
    last: ''
  },
  [ECurrency.VND]: {
    first: '',
    last: ReactDOMServer.renderToString(<>&nbsp;₫</>)
  },
}

export const currencyTypes: OptionItem<string>[] = [
  { id: ECurrency.USD, name: "$ USD", subName: 'USD' },
  { id: ECurrency.VND, name: "₫ VND", subName: 'VND'},
]

export enum EVIDEO_MARKETING_STAGE {
  POST_LAUNCH = 1,
  PRE_LAUNCH = 2
}

export enum EOPERATION_TYPE {
  ADD = 1,
  SUBTRACT = 2
}

export const operationTypes: OptionItem[] = [
  { id: EOPERATION_TYPE.ADD, name: "Add" },
  { id: EOPERATION_TYPE.SUBTRACT, name: "Subtract" },
]