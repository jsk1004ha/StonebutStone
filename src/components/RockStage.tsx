import type { CSSProperties } from "react";
import { getRockAsset } from "../data/rockAssets";
import type { RockInteraction, RockSpecies } from "../types";

type RockStageProps = {
  rock: RockSpecies;
  scale: number;
  mode?: "overlay" | "harness";
  animationKey?: RockInteraction["animationKey"];
  animationTick?: number;
};

export function RockStage({ rock, scale, mode = "harness", animationKey = "none", animationTick = 0 }: RockStageProps) {
  const rockAsset = getRockAsset(rock.assetKey);
  const style = {
    "--rock-scale": scale.toString()
  } as CSSProperties;

  return (
    <section className={`rock-stage rock-stage--${mode}`} style={style} aria-label={rock.nameKo}>
      <div key={`${animationKey}-${animationTick}`} className={`rock-wrap rock-motion-${animationKey}`} data-testid="rock-stage">
        <img
          className="rock-image"
          src={rockAsset.src}
          srcSet={rockAsset.srcSet}
          width={1440}
          height={864}
          alt={rock.nameKo}
          decoding="async"
          draggable={false}
        />
      </div>
      <div className="rock-shadow" aria-hidden="true" />
    </section>
  );
}
