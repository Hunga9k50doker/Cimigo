import { brandAssetTypes, EBRAND_ASSET_TYPE } from "models/brand_asset";

const getBrandAssetType = (typeId) => {
  switch (typeId) {
    case EBRAND_ASSET_TYPE.IMAGE:
      return brandAssetTypes[0];
    case EBRAND_ASSET_TYPE.SLOGAN:
      return brandAssetTypes[1];
    default:
      return brandAssetTypes[2];
  }
};

export default getBrandAssetType;
