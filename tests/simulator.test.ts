import { describe, expect, it } from "vitest";
import { ROCKS } from "../src/data/rocks";
import { applyInteraction, CORE_PHRASE, DEFAULT_STATE, MUTATION_PHRASE, MUTATION_PROBABILITY } from "../src/domain/rockSimulator";

describe("rock simulator domain", () => {
  it("keeps the core phrase exact", () => {
    expect(CORE_PHRASE).toBe("돌은 항상 돌입니다.");
    expect(MUTATION_PHRASE).toBe("돌은 돌이었습니다.");
    expect(MUTATION_PROBABILITY).toBe(0.001);
  });

  it("applies normal interactions without changing the rock identity", () => {
    const result = applyInteraction(DEFAULT_STATE, "knock", () => 0.5);
    expect(result.mutated).toBe(false);
    expect(result.state.currentRockId).toBe(DEFAULT_STATE.currentRockId);
    expect(result.state.interactionCount).toBe(1);
    expect(result.state.lastAnimationKey).toBe("nudge");
    expect(result.state.animationTick).toBe(1);
    expect(result.message).toContain("돌");
  });

  it("mutates with injectable 0.1% probability roll", () => {
    const rolls = [0.0005, 0.42];
    const result = applyInteraction(DEFAULT_STATE, "pat", () => rolls.shift() ?? 0.42);
    expect(result.mutated).toBe(true);
    expect(result.message).toBe(MUTATION_PHRASE);
    expect(result.nextRock).toBeDefined();
    expect(result.state.currentRockId).not.toBe(DEFAULT_STATE.currentRockId);
    expect(result.state.unlockedRockIds).toContain(result.state.currentRockId);
  });

  it("can keep discovering rocks without exceeding catalog ids", () => {
    const state = {
      ...DEFAULT_STATE,
      unlockedRockIds: ROCKS.slice(0, 99).map((rock) => rock.id),
      currentRockId: ROCKS[0].id
    };
    const result = applyInteraction(state, "scan", () => 0);
    expect(ROCKS.some((rock) => rock.id === result.state.currentRockId)).toBe(true);
    expect(result.state.unlockedRockIds.length).toBe(100);
  });
});
