import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const standardDir = path.join(root, "src", "assets", "rocks", "catalog-webp");
const retinaDir = path.join(root, "src", "assets", "rocks", "catalog-webp-2x");
const pngDir = path.join(root, "src", "assets", "rocks", "catalog");
const expectedFilePattern = /^rock-\d{3}\.webp$/;

function fail(message) {
  console.error(`asset performance check failed: ${message}`);
  process.exit(1);
}

function readUInt24LE(buffer, offset) {
  return buffer[offset] | (buffer[offset + 1] << 8) | (buffer[offset + 2] << 16);
}

function webpDimensions(filePath) {
  const buffer = fs.readFileSync(filePath);
  if (buffer.toString("ascii", 0, 4) !== "RIFF" || buffer.toString("ascii", 8, 12) !== "WEBP") {
    fail(`${filePath} is not a RIFF WEBP file`);
  }

  const chunk = buffer.toString("ascii", 12, 16);
  if (chunk === "VP8X") {
    return {
      width: readUInt24LE(buffer, 24) + 1,
      height: readUInt24LE(buffer, 27) + 1
    };
  }

  if (chunk === "VP8 ") {
    return {
      width: buffer.readUInt16LE(26) & 0x3fff,
      height: buffer.readUInt16LE(28) & 0x3fff
    };
  }

  if (chunk === "VP8L") {
    const b0 = buffer[21];
    const b1 = buffer[22];
    const b2 = buffer[23];
    const b3 = buffer[24];
    return {
      width: 1 + (((b1 & 0x3f) << 8) | b0),
      height: 1 + (((b3 & 0x0f) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6))
    };
  }

  fail(`${filePath} uses unsupported WEBP chunk ${chunk}`);
}

function collectWebp(dir) {
  if (!fs.existsSync(dir)) fail(`missing ${path.relative(root, dir)}`);
  const files = fs.readdirSync(dir).filter((file) => expectedFilePattern.test(file)).sort();
  if (files.length !== 100) fail(`expected 100 webp files in ${path.relative(root, dir)}, found ${files.length}`);
  return files.map((file) => path.join(dir, file));
}

function verifyDimensions(files, width, height, label) {
  for (const file of files) {
    const dimensions = webpDimensions(file);
    if (dimensions.width !== width || dimensions.height !== height) {
      fail(`${label} ${path.basename(file)} is ${dimensions.width}x${dimensions.height}, expected ${width}x${height}`);
    }
  }
}

const standardFiles = collectWebp(standardDir);
const retinaFiles = collectWebp(retinaDir);
verifyDimensions(standardFiles, 960, 576, "standard");
verifyDimensions(retinaFiles, 1440, 864, "retina");

if (fs.existsSync(pngDir)) {
  const pngCount = fs.readdirSync(pngDir).filter((file) => /^rock-\d{3}\.png$/.test(file)).length;
  if (pngCount > 0) fail(`found ${pngCount} generated PNG catalog files`);
}

const standardBytes = standardFiles.reduce((sum, file) => sum + fs.statSync(file).size, 0);
const retinaBytes = retinaFiles.reduce((sum, file) => sum + fs.statSync(file).size, 0);
if (standardBytes > 6_000_000) fail(`standard assets are too large: ${standardBytes} bytes`);
if (retinaBytes > 13_000_000) fail(`retina assets are too large: ${retinaBytes} bytes`);

const rockAssetsSource = fs.readFileSync(path.join(root, "src", "data", "rockAssets.ts"), "utf8");
if (!rockAssetsSource.includes("catalog-webp-2x")) fail("rockAssets.ts does not expose retina assets");
if (!rockAssetsSource.includes("srcSet")) fail("rockAssets.ts does not return srcSet");

const styles = fs.readFileSync(path.join(root, "src", "styles.css"), "utf8");
if (/drop-shadow\(/.test(styles)) fail("styles.css still uses drop-shadow filters");
if (/filter:\s*blur\(/.test(styles)) fail("styles.css still uses blur filters");

const mainSource = fs.readFileSync(path.join(root, "electron", "main.ts"), "utf8");
if (!mainSource.includes("scheduleStateWrite()")) fail("state writes are not scheduled");
if (!mainSource.includes("flushStateWrite()")) fail("state writes are not flushed on quit");

console.log(`asset performance check passed: 100 standard assets (${standardBytes} bytes), 100 retina assets (${retinaBytes} bytes)`);
