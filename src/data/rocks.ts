import type { RockRarity, RockSpecies } from "../types";

const minerals = [
  "석영",
  "흑요",
  "운모",
  "현무",
  "감람",
  "장석",
  "철광",
  "구리",
  "청회",
  "월광"
];

const textures = [
  "잔금",
  "결정",
  "침묵",
  "비늘",
  "층리",
  "별점",
  "이끼",
  "서리",
  "그을음",
  "물결"
];

const shapes = [
  "덩이",
  "괴석",
  "조약",
  "편암",
  "자갈",
  "표석",
  "심석",
  "핵석",
  "부석",
  "원석"
];

function rarityFor(index: number): RockRarity {
  if (index % 25 === 0) return "mythic";
  if (index % 10 === 0) return "rare";
  if (index % 3 === 0) return "uncommon";
  return "common";
}

export const ROCKS: RockSpecies[] = Array.from({ length: 100 }, (_, zeroIndex) => {
  const index = zeroIndex + 1;
  const mineral = minerals[zeroIndex % minerals.length];
  const texture = textures[Math.floor(zeroIndex / minerals.length) % textures.length];
  const shape = shapes[(zeroIndex * 3 + Math.floor(zeroIndex / 10)) % shapes.length];
  return {
    id: `rock-${String(index).padStart(3, "0")}`,
    index,
    nameKo: `${mineral} ${texture} ${shape}`,
    rarity: rarityFor(index),
    descriptionKo: `${mineral} 기운과 ${texture} 표면을 지닌 돌입니다. 많이 살펴보아도 결론은 돌입니다.`,
    assetKey: `rock-${String(index).padStart(3, "0")}`
  };
});

export function getRockById(id: string) {
  return ROCKS.find((rock) => rock.id === id) ?? ROCKS[0];
}
