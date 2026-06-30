import { INTERACTIONS, getInteractionById } from "../data/interactions";
import { ROCKS, getRockById } from "../data/rocks";
import type { InteractionResult, RockAppState, RockInteraction, RockSpecies } from "../types";

export const CORE_PHRASE = "돌은 항상 돌입니다.";
export const MUTATION_PHRASE = "돌은 돌이었습니다.";
export const MUTATION_PROBABILITY = 0.001;
const ANIMATION_KEYS: RockInteraction["animationKey"][] = ["nudge", "pulse", "glint", "settle", "none"];

export const DEFAULT_STATE: RockAppState = {
  currentRockId: "rock-001",
  scale: 1,
  pinned: true,
  clickThrough: false,
  unlockedRockIds: ["rock-001"],
  interactionCount: 0,
  lastMessage: CORE_PHRASE,
  lastAnimationKey: "none",
  animationTick: 0
};

export function normalizeState(input?: Partial<RockAppState>): RockAppState {
  const merged = { ...DEFAULT_STATE, ...input };
  return {
    ...merged,
    scale: clampScale(merged.scale),
    unlockedRockIds: Array.from(new Set(merged.unlockedRockIds.length ? merged.unlockedRockIds : ["rock-001"])),
    currentRockId: getRockById(merged.currentRockId).id,
    lastAnimationKey: normalizeAnimationKey(merged.lastAnimationKey),
    animationTick: normalizeTick(merged.animationTick)
  };
}

export function clampScale(scale: number) {
  return Math.min(1.8, Math.max(0.45, Number.isFinite(scale) ? scale : 1));
}

function normalizeAnimationKey(value: unknown): RockInteraction["animationKey"] {
  return typeof value === "string" && ANIMATION_KEYS.includes(value as RockInteraction["animationKey"])
    ? value as RockInteraction["animationKey"]
    : "none";
}

function normalizeTick(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
}

export function chooseNextRock(state: RockAppState, rng: () => number): RockSpecies {
  const locked = ROCKS.filter((rock) => !state.unlockedRockIds.includes(rock.id));
  const pool = locked.length > 0 ? locked : ROCKS.filter((rock) => rock.id !== state.currentRockId);
  const index = Math.floor(rng() * pool.length) % pool.length;
  return pool[index] ?? ROCKS[0];
}

export function shouldMutate(rng: () => number) {
  return rng() < MUTATION_PROBABILITY;
}

export function applyInteraction(
  stateInput: RockAppState,
  interactionId: string,
  rng: () => number = Math.random
): InteractionResult {
  const state = normalizeState(stateInput);
  const interaction = getInteractionById(interactionId);
  const interactionCount = state.interactionCount + 1;
  const animationTick = state.animationTick + 1;

  if (shouldMutate(rng)) {
    const nextRock = chooseNextRock(state, rng);
    const nextUnlocked = Array.from(new Set([...state.unlockedRockIds, nextRock.id]));
    const nextState = {
      ...state,
      currentRockId: nextRock.id,
      unlockedRockIds: nextUnlocked,
      interactionCount,
      lastMessage: MUTATION_PHRASE,
      lastAnimationKey: interaction.animationKey,
      animationTick
    };
    return {
      state: nextState,
      message: MUTATION_PHRASE,
      mutated: true,
      interaction,
      nextRock
    };
  }

  const message = interaction.messageKo || CORE_PHRASE;
  return {
    state: {
      ...state,
      interactionCount,
      lastMessage: message,
      lastAnimationKey: interaction.animationKey,
      animationTick
    },
    message,
    mutated: false,
    interaction
  };
}

export function currentRock(state: RockAppState) {
  return getRockById(state.currentRockId);
}

export function collectionProgress(state: RockAppState) {
  return {
    unlocked: new Set(state.unlockedRockIds).size,
    total: ROCKS.length
  };
}

export function interactionCountByCategory() {
  return INTERACTIONS.reduce<Record<string, number>>((acc, interaction) => {
    acc[interaction.category] = (acc[interaction.category] ?? 0) + 1;
    return acc;
  }, {});
}
