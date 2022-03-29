import { OptionItem } from "./general";
import { Project } from "./project";

export interface GetPacks {
  take?: number;
  page?: number;
  projectId: number;
}

export interface Pack {
  id: number;
  name: string;
  image: string;
  packTypeId: number;
  projectId: number;
  userId: number;
  brand: string;
  manufacturer: string;
  variant: string,
  createdAt: Date;
  updatedAt: Date;
  packType: OptionItem;
  project?: Project
}

export enum PackType {
  Current_Pack = 1,
  Test_Pack,
  Competitor_Pack,
}

export const packTypes: OptionItem[] = [
  { id: PackType.Current_Pack, name: 'Current pack' },
  { id: PackType.Test_Pack, name: 'Test pack' },
  { id: PackType.Competitor_Pack, name: 'Competitor pack' },
]