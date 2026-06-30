import { currentRock } from "../domain/rockSimulator";
import type { RockAppState } from "../types";
import { ControlPanel } from "./ControlPanel";
import { RockStage } from "./RockStage";

type VisualHarnessProps = {
  state: RockAppState;
  patchState: (patch: Partial<RockAppState>) => void;
};

export function VisualHarness({ state, patchState }: VisualHarnessProps) {
  const rock = currentRock(state);
  return (
    <div className="visual-harness">
      <div className="desktop-haze" />
      <div className="taskbar">
        <div className="start-mark">▦</div>
        <div className="search-box">검색</div>
        <div className="task-icon" />
        <div className="tray">⌃  한  오후 10:42</div>
      </div>
      <div className="harness-rock">
        <RockStage
          rock={rock}
          scale={state.scale}
          mode="harness"
          animationKey={state.lastAnimationKey}
          animationTick={state.animationTick}
        />
      </div>
      <div className="harness-panel">
        <ControlPanel state={state} patchState={patchState} compact />
      </div>
    </div>
  );
}
