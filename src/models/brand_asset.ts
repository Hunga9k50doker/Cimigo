import { OptionItem } from "./general";
import { IconImagesMode } from "components/icons"
import { MusicNote, Title } from "@mui/icons-material";

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
  { id: EBRAND_ASSET_TYPE.IMAGE, name: 'Unbranded image', icon: IconImagesMode, translation: "brand_track_field_brand_asset_type_image_title" },
  { id: EBRAND_ASSET_TYPE.SLOGAN, name: 'Slogan or tagline', icon: Title, translation: "brand_track_field_brand_asset_type_slogan_title" },
  { id: EBRAND_ASSET_TYPE.SOUND, name: 'Song or sound', icon: MusicNote, translation: "brand_track_field_brand_asset_type_song_title" }
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