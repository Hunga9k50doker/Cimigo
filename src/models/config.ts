export interface ConfigData {
  usdToVND: number,
  vat: number
}

export interface ConfigAttributes {
  id: number;
  name: string;
  key: string;
  value: string;
  type: ConfigType;
  createdAt: Date;
  updatedAt: Date;
}

export enum ConfigType {
  number = 'number'
}