import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, "..");
const atlasDir = path.join(rootDir, "src", "assets", "rocks", "source-atlases");
const webpDir = path.join(rootDir, "src", "assets", "rocks", "catalog-webp");
const pngDir = path.join(rootDir, "src", "assets", "rocks", "catalog");

const atlasFiles = Array.from({ length: 4 }, (_, index) => `surreal-rock-atlas-${String(index + 1).padStart(2, "0")}.png`);
const outputWidth = 1200;
const outputHeight = 720;
const gridSize = 5;

async function readAtlasDataUrl(fileName) {
  const filePath = path.join(atlasDir, fileName);
  const file = await fs.readFile(filePath);
  return `data:image/png;base64,${file.toString("base64")}`;
}

async function extractAtlas(page, dataUrl) {
  return page.evaluate(
    async ({ dataUrlValue, gridSizeValue, outputWidthValue, outputHeightValue }) => {
      const image = new Image();
      image.src = dataUrlValue;
      await image.decode();

      const source = document.createElement("canvas");
      source.width = image.naturalWidth;
      source.height = image.naturalHeight;
      const sourceContext = source.getContext("2d", { willReadFrequently: true });
      sourceContext.drawImage(image, 0, 0);

      const cellWidth = source.width / gridSizeValue;
      const cellHeight = source.height / gridSizeValue;

      function isKeyPixel(r, g, b, a) {
        return a < 8 || (r > 165 && b > 145 && g < 95 && r - g > 90 && b - g > 80);
      }

      function trimTransparent(imageData) {
        const { data, width, height } = imageData;
        let left = width;
        let top = height;
        let right = -1;
        let bottom = -1;

        for (let y = 0; y < height; y += 1) {
          for (let x = 0; x < width; x += 1) {
            const alpha = data[(y * width + x) * 4 + 3];
            if (alpha > 12) {
              left = Math.min(left, x);
              top = Math.min(top, y);
              right = Math.max(right, x);
              bottom = Math.max(bottom, y);
            }
          }
        }

        if (right < left || bottom < top) {
          return { left: 0, top: 0, width, height };
        }

        const padding = 6;
        left = Math.max(0, left - padding);
        top = Math.max(0, top - padding);
        right = Math.min(width - 1, right + padding);
        bottom = Math.min(height - 1, bottom + padding);

        return {
          left,
          top,
          width: right - left + 1,
          height: bottom - top + 1
        };
      }

      function removeSmallComponents(imageData) {
        const { data, width, height } = imageData;
        const labels = new Int32Array(width * height);
        const areas = [0];
        let label = 0;

        for (let y = 0; y < height; y += 1) {
          for (let x = 0; x < width; x += 1) {
            const start = y * width + x;
            if (labels[start] !== 0 || data[start * 4 + 3] <= 14) continue;

            label += 1;
            let area = 0;
            const stack = [start];
            labels[start] = label;

            while (stack.length > 0) {
              const current = stack.pop();
              area += 1;
              const currentX = current % width;
              const currentY = Math.floor(current / width);
              const neighbors = [
                currentX > 0 ? current - 1 : -1,
                currentX < width - 1 ? current + 1 : -1,
                currentY > 0 ? current - width : -1,
                currentY < height - 1 ? current + width : -1
              ];

              for (const next of neighbors) {
                if (next < 0 || labels[next] !== 0 || data[next * 4 + 3] <= 14) continue;
                labels[next] = label;
                stack.push(next);
              }
            }

            areas[label] = area;
          }
        }

        const largestArea = Math.max(...areas);
        const minimumArea = Math.max(160, largestArea * 0.1);

        for (let index = 0; index < labels.length; index += 1) {
          const pixelLabel = labels[index];
          if (pixelLabel !== 0 && areas[pixelLabel] < minimumArea) {
            data[index * 4] = 0;
            data[index * 4 + 1] = 0;
            data[index * 4 + 2] = 0;
            data[index * 4 + 3] = 0;
          }
        }
      }

      function decontaminateEdges(imageData) {
        const { data, width, height } = imageData;
        const alpha = new Uint8ClampedArray(width * height);

        for (let index = 0; index < alpha.length; index += 1) {
          alpha[index] = data[index * 4 + 3];
        }

        for (let y = 0; y < height; y += 1) {
          for (let x = 0; x < width; x += 1) {
            const pixel = y * width + x;
            const offset = pixel * 4;
            const a = alpha[pixel];

            if (a === 0) {
              data[offset] = 0;
              data[offset + 1] = 0;
              data[offset + 2] = 0;
              continue;
            }

            let touchesTransparent = false;
            for (let dy = -1; dy <= 1 && !touchesTransparent; dy += 1) {
              for (let dx = -1; dx <= 1; dx += 1) {
                if (dx === 0 && dy === 0) continue;
                const nx = x + dx;
                const ny = y + dy;
                if (nx < 0 || nx >= width || ny < 0 || ny >= height || alpha[ny * width + nx] === 0) {
                  touchesTransparent = true;
                  break;
                }
              }
            }

            if (!touchesTransparent) continue;

            const r = data[offset];
            const g = data[offset + 1];
            const b = data[offset + 2];
            const magentaBias = Math.min((r - g) / 255, (b - g) / 255);

            if (magentaBias > 0.13 && r > g + 26 && b > g + 24) {
              const strength = Math.min(1, magentaBias * 1.85);
              data[offset] = Math.max(0, Math.round(r - 190 * strength));
              data[offset + 2] = Math.max(0, Math.round(b - 190 * strength));
              data[offset + 3] = Math.max(0, Math.round(a * (1 - strength * 0.42)));
              if (data[offset + 3] < 18) {
                data[offset] = 0;
                data[offset + 1] = 0;
                data[offset + 2] = 0;
                data[offset + 3] = 0;
              }
            }
          }
        }
      }

      function removeChromaBackground(cellCanvas) {
        const context = cellCanvas.getContext("2d", { willReadFrequently: true });
        const imageData = context.getImageData(0, 0, cellCanvas.width, cellCanvas.height);
        const { data, width, height } = imageData;

        for (let index = 0; index < data.length; index += 4) {
          const r = data[index];
          const g = data[index + 1];
          const b = data[index + 2];
          const a = data[index + 3];

          if (isKeyPixel(r, g, b, a)) {
            data[index] = 0;
            data[index + 1] = 0;
            data[index + 2] = 0;
            data[index + 3] = 0;
            continue;
          }

          const keyStrength = Math.min((r - g - 72) / 150, (b - g - 64) / 150);
          if (keyStrength > 0.38 && r > 135 && b > 125 && g < 130) {
            data[index + 3] = Math.max(0, Math.round(a * (1 - Math.min(0.88, keyStrength))));
            data[index] = Math.max(0, Math.round(r - 245 * keyStrength * 0.34));
            data[index + 2] = Math.max(0, Math.round(b - 245 * keyStrength * 0.34));
          }
        }

        removeSmallComponents(imageData);
        decontaminateEdges(imageData);
        context.putImageData(imageData, 0, 0);

        return trimTransparent(imageData);
      }

      async function encode(canvas, type, quality) {
        return new Promise((resolve, reject) => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error(`Failed to encode ${type}`));
                return;
              }
              const reader = new FileReader();
              reader.onloadend = () => resolve(String(reader.result).split(",")[1]);
              reader.onerror = () => reject(reader.error);
              reader.readAsDataURL(blob);
            },
            type,
            quality
          );
        });
      }

      const results = [];

      for (let row = 0; row < gridSizeValue; row += 1) {
        for (let column = 0; column < gridSizeValue; column += 1) {
          const cell = document.createElement("canvas");
          cell.width = Math.ceil(cellWidth);
          cell.height = Math.ceil(cellHeight);
          const cellContext = cell.getContext("2d", { willReadFrequently: true });
          cellContext.drawImage(source, column * cellWidth, row * cellHeight, cellWidth, cellHeight, 0, 0, cell.width, cell.height);

          const box = removeChromaBackground(cell);
          const output = document.createElement("canvas");
          output.width = outputWidthValue;
          output.height = outputHeightValue;
          const outputContext = output.getContext("2d");
          outputContext.imageSmoothingEnabled = true;
          outputContext.imageSmoothingQuality = "high";

          const scale = Math.min((outputWidthValue * 0.78) / box.width, (outputHeightValue * 0.78) / box.height, 3.35);
          const drawWidth = box.width * scale;
          const drawHeight = box.height * scale;
          const drawX = (outputWidthValue - drawWidth) / 2;
          const drawY = (outputHeightValue - drawHeight) / 2;
          outputContext.drawImage(cell, box.left, box.top, box.width, box.height, drawX, drawY, drawWidth, drawHeight);

          results.push({
            webp: await encode(output, "image/webp", 0.95),
            png: await encode(output, "image/png")
          });
        }
      }

      return results;
    },
    {
      dataUrlValue: dataUrl,
      gridSizeValue: gridSize,
      outputWidthValue: outputWidth,
      outputHeightValue: outputHeight
    }
  );
}

await fs.mkdir(webpDir, { recursive: true });
await fs.mkdir(pngDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: outputWidth, height: outputHeight }, deviceScaleFactor: 1 });

try {
  let outputIndex = 1;

  for (const atlasFile of atlasFiles) {
    const dataUrl = await readAtlasDataUrl(atlasFile);
    const assets = await extractAtlas(page, dataUrl);

    for (const asset of assets) {
      const name = `rock-${String(outputIndex).padStart(3, "0")}`;
      await Promise.all([
        fs.writeFile(path.join(webpDir, `${name}.webp`), Buffer.from(asset.webp, "base64")),
        fs.writeFile(path.join(pngDir, `${name}.png`), Buffer.from(asset.png, "base64"))
      ]);
      outputIndex += 1;
    }

    console.log(`Extracted ${outputIndex - 1}/100 surreal rock assets`);
  }
} finally {
  await browser.close();
}

console.log("Generated 100 bundled photoreal surreal rock assets from source atlases");
