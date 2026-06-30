import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { INTERACTIONS } from "../src/data/interactions";
import { ROCK_ASSET_COUNT } from "../src/data/rockAssets";
import { ROCKS } from "../src/data/rocks";
import { interactionCountByCategory } from "../src/domain/rockSimulator";

describe("catalog data", () => {
  it("contains exactly 100 encyclopedia rocks", () => {
    expect(ROCKS).toHaveLength(100);
    expect(new Set(ROCKS.map((rock) => rock.id)).size).toBe(100);
    expect(new Set(ROCKS.map((rock) => rock.assetKey)).size).toBe(100);
    expect(ROCK_ASSET_COUNT).toBe(100);
    expect(fs.readdirSync("src/assets/rocks/catalog-webp").filter((file) => /^rock-\d{3}\.webp$/.test(file))).toHaveLength(100);
  });

  it("contains at least 30 non-destructive interactions", () => {
    expect(INTERACTIONS.length).toBeGreaterThanOrEqual(30);
    expect(INTERACTIONS.every((interaction) => !/깨짐|부서짐|파괴|사망/.test(interaction.messageKo))).toBe(true);
  });

  it("spreads interactions across expected categories", () => {
    expect(interactionCountByCategory()).toMatchObject({
      touch: expect.any(Number),
      observe: expect.any(Number),
      ritual: expect.any(Number),
      utility: expect.any(Number)
    });
  });
});
