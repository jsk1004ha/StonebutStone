import { ROCKS } from "../data/rocks";
import type { RockAppState } from "../types";

type EncyclopediaProps = {
  state: RockAppState;
  onSelect: (rockId: string) => void;
};

export function Encyclopedia({ state, onSelect }: EncyclopediaProps) {
  const unlocked = new Set(state.unlockedRockIds);
  return (
    <div className="encyclopedia" data-testid="encyclopedia">
      {ROCKS.map((rock) => {
        const isUnlocked = unlocked.has(rock.id);
        return (
          <button
            type="button"
            key={rock.id}
            className={`rock-entry ${rock.id === state.currentRockId ? "is-current" : ""}`}
            disabled={!isUnlocked}
            onClick={() => onSelect(rock.id)}
          >
            <span className={`rarity-dot rarity-${rock.rarity}`} />
            <span className="rock-entry-name">{isUnlocked ? rock.nameKo : "미발견 돌"}</span>
            <span className="rock-entry-index">{String(rock.index).padStart(3, "0")}</span>
          </button>
        );
      })}
    </div>
  );
}
