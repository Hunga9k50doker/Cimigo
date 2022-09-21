import { Attachment } from "./attachment";

export interface ConfigData {
  usdToVND: number,
  vat: number,
  viewContract: number
}

export interface ConfigAttributes {
  id: number;
  name: string;
  key: string;
  value: string;
  type: ConfigType;
  attachment?: Attachment;
  createdAt: Date;
  updatedAt: Date;
}

export enum ConfigType {
  number = 'number',
  attachment = 'attachment'
}