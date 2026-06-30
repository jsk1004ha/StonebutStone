const rockAssetModules = import.meta.glob("../assets/rocks/catalog-webp/rock-*.webp", {
  eager: true,
  import: "default"
}) as Record<string, string>;

export const ROCK_ASSET_COUNT = Object.keys(rockAssetModules).length;

export function getRockAsset(assetKey: string) {
  return rockAssetModules[`../assets/rocks/catalog-webp/${assetKey}.webp`] ?? rockAssetModules["../assets/rocks/catalog-webp/rock-001.webp"];
}
