import fs from "node:fs";
import path from "node:path";

const indexPath = path.join(process.cwd(), "dist", "index.html");
const assetsDir = path.join(process.cwd(), "dist", "assets");

if (!fs.existsSync(indexPath)) {
  console.error("dist verification failed: missing dist/index.html");
  process.exit(1);
}

const html = fs.readFileSync(indexPath, "utf8");
const hasAbsoluteBuildAsset = /\b(?:src|href)="\/assets\//.test(html);
const hasRelativeBuildAsset = /\b(?:src|href)="\.\/assets\//.test(html);
const rockAssetCount = fs.existsSync(assetsDir)
  ? fs.readdirSync(assetsDir).filter((file) => /^rock-\d{3}-.*\.webp$/.test(file)).length
  : 0;

if (hasAbsoluteBuildAsset) {
  console.error("dist verification failed: index.html uses /assets paths, which break under file:// packaged Electron");
  process.exit(1);
}

if (!hasRelativeBuildAsset) {
  console.error("dist verification failed: index.html does not reference relative ./assets paths");
  process.exit(1);
}

if (rockAssetCount !== 100) {
  console.error(`dist verification failed: expected 100 bundled rock webp assets, found ${rockAssetCount}`);
  process.exit(1);
}

console.log("dist verification passed: relative assets and 100 bundled rock webp files");
