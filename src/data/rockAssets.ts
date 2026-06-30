const standardRockAssetModules = import.meta.glob("../assets/rocks/catalog-webp/rock-*.webp", {
  eager: true,
  import: "default"
}) as Record<string, string>;

const retinaRockAssetModules = import.meta.glob("../assets/rocks/catalog-webp-2x/rock-*.webp", {
  eager: true,
  import: "default"
}) as Record<string, string>;

export const ROCK_ASSET_COUNT = Object.keys(standardRockAssetModules).length;
export const ROCK_RETINA_ASSET_COUNT = Object.keys(retinaRockAssetModules).length;

export function getRockAsset(assetKey: string) {
  const standard =
    standardRockAssetModules[`../assets/rocks/catalog-webp/${assetKey}.webp`] ??
    standardRockAssetModules["../assets/rocks/catalog-webp/rock-001.webp"];
  const retina =
    retinaRockAssetModules[`../assets/rocks/catalog-webp-2x/${assetKey}.webp`] ??
    retinaRockAssetModules["../assets/rocks/catalog-webp-2x/rock-001.webp"] ??
    standard;

  return {
    src: standard,
    srcSet: `${standard} 1x, ${retina} 2x`
  };
}
