import fs from "node:fs";
import { describe, expect, it } from "vitest";
import { INTERACTIONS } from "../src/data/interactions";
import { ROCK_ASSET_COUNT, ROCK_RETINA_ASSET_COUNT } from "../src/data/rockAssets";
import { ROCKS, getRockById } from "../src/data/rocks";
import { interactionCountByCategory } from "../src/domain/rockSimulator";

describe("catalog data", () => {
  it("contains exactly 100 encyclopedia rocks", () => {
    expect(ROCKS).toHaveLength(100);
    expect(new Set(ROCKS.map((rock) => rock.id)).size).toBe(100);
    expect(new Set(ROCKS.map((rock) => rock.assetKey)).size).toBe(100);
    expect(new Set(ROCKS.map((rock) => rock.nameKo)).size).toBe(100);
    expect(ROCKS.every((rock) => rock.assetKey === rock.id)).toBe(true);
    expect(ROCK_ASSET_COUNT).toBe(100);
    expect(ROCK_RETINA_ASSET_COUNT).toBe(100);
    expect(fs.readdirSync("src/assets/rocks/catalog-webp").filter((file) => /^rock-\d{3}\.webp$/.test(file))).toHaveLength(100);
    expect(fs.readdirSync("src/assets/rocks/catalog-webp-2x").filter((file) => /^rock-\d{3}\.webp$/.test(file))).toHaveLength(100);
  });

  it("keeps visual names matched to fixed asset slots", () => {
    const expectedNamesById = {
      "rock-001": "운석공 공동석",
      "rock-002": "남청 정동석",
      "rock-003": "사막장미 결정석",
      "rock-026": "녹아내린 운석석",
      "rock-051": "별자리 금선석",
      "rock-076": "부유 절벽석",
      "rock-100": "원형 화석 패턴석"
    };

    for (const [id, nameKo] of Object.entries(expectedNamesById)) {
      const rock = getRockById(id);
      expect(rock.assetKey).toBe(id);
      expect(rock.nameKo).toBe(nameKo);
    }
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
