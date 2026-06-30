export type RockRarity = "common" | "uncommon" | "rare" | "mythic";

export type RockSpecies = {
  id: string;
  index: number;
  nameKo: string;
  rarity: RockRarity;
  descriptionKo: string;
  assetKey: string;
};

export type InteractionCategory = "touch" | "observe" | "ritual" | "utility";

export type RockInteraction = {
  id: string;
  labelKo: string;
  category: InteractionCategory;
  messageKo: string;
  animationKey: "nudge" | "pulse" | "glint" | "settle" | "none";
};

export type RockAppState = {
  currentRockId: string;
  scale: number;
  pinned: boolean;
  clickThrough: boolean;
  unlockedRockIds: string[];
  interactionCount: number;
  lastMessage: string;
  lastAnimationKey: RockInteraction["animationKey"];
  animationTick: number;
};

export type InteractionResult = {
  state: RockAppState;
  message: string;
  mutated: boolean;
  interaction: RockInteraction;
  nextRock?: RockSpecies;
};
