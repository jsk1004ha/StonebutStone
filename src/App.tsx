import { ControlPanel } from "./components/ControlPanel";
import { RockStage } from "./components/RockStage";
import { VisualHarness } from "./components/VisualHarness";
import { currentRock } from "./domain/rockSimulator";
import { useRockState } from "./hooks/useRockState";

function currentView() {
  const params = new URLSearchParams(window.location.search);
  return params.get("view") ?? "harness";
}

export function App() {
  const { state, patchState } = useRockState();
  const view = currentView();
  const rock = currentRock(state);

  if (view === "overlay") {
    return (
      <div className="overlay-root">
        <RockStage
          rock={rock}
          scale={state.scale}
          mode="overlay"
          animationKey={state.lastAnimationKey}
          animationTick={state.animationTick}
        />
      </div>
    );
  }

  if (view === "panel") {
    return (
      <div className="panel-root">
        <ControlPanel state={state} patchState={patchState} />
      </div>
    );
  }

  return <VisualHarness state={state} patchState={patchState} />;
}
