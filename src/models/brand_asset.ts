import { OptionItem } from "./general";
import images from "config/images";

export enum EBRAND_ASSET_TYPE {
  IMAGE = 1,
  SLOGAN = 2,
  SOUND = 3
}

export interface BrandAsset {
  id: number;
  brand: string;
  description?: string;
  slogan?: string;
  typeId: EBRAND_ASSET_TYPE;
  asset?: string;
  duration?: number;
  projectId: number;
}

export const brandAssetTypes: OptionItem[] = [
  { id: EBRAND_ASSET_TYPE.IMAGE, name: 'Unbranded image', img: images.icImagesMode },
  { id: EBRAND_ASSET_TYPE.SLOGAN, name: 'Slogan or tagline', img: images.icTitle },
  { id: EBRAND_ASSET_TYPE.SOUND, name: 'Song or sound', img: images.icMusic }
]

export interface GetBrandAssetParams {
  take?: number;
  page?: number;
  projectId: number
}
export interface CreateBrandAsset {
  brand: string;
  description?: string;
  slogan?: string;
  typeId: EBRAND_ASSET_TYPE;
  asset?: string;
  duration?: number;
  projectId: number;
}
export interface UpdateBrandAsset {
  brand: string;
  description?: string;
  slogan?: string;
  typeId: EBRAND_ASSET_TYPE;
  asset?: string;
  duration?: number;
  projectId?: number;
}