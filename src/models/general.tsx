
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

export interface Country {
  formattedName: string;
  rawName: string;
}

export interface OptionItem {
  id: number;
  name: string;
}

export interface OptionItemT<T> {
  id: T;
  name: string;
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
  name: string
}

export const langSupports: LangSupport[] = [
  {
    key: Lang.VI,
    name: 'Tiếng Việt'
  },
  {
    key: Lang.EN,
    name: 'English'
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

export enum EPaymentMethod {
  CREDIT_OR_DEBIT = 1,
  INTERNET_BANKING,
  BANK_TRANSFER,
  MAKE_AN_ORDER
}

export const paymentMethods: OptionItem[] = [
  { id: EPaymentMethod.CREDIT_OR_DEBIT, name: "Credit / Debit Card" },
  { id: EPaymentMethod.INTERNET_BANKING, name: "ATM card / Bank account" },
  { id: EPaymentMethod.BANK_TRANSFER, name: "Bank transfer" },
  { id: EPaymentMethod.MAKE_AN_ORDER, name: "Make an order" }
]