
export interface TableHeaderLabel {
  name: string;
  label: string;
  sortable: boolean;
}

export interface Country {
  formattedName: string;
  rawName: string;
}

export interface OptionItem {
  id: number;
  name: string;
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

export interface TargetQuestion {
  id: number;
  name: string;
  code: number;
}

export interface Selector {
  id: number;
  name: string;
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
    name: 'Việt Nam'
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