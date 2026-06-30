import {
  BookOpen,
  Eye,
  Hand,
  Maximize2,
  Minus,
  MousePointer2,
  Pin,
  RotateCcw,
  Settings,
  Sparkles,
  X
} from "lucide-react";
import { useMemo, useState } from "react";
import { INTERACTIONS } from "../data/interactions";
import { ROCKS } from "../data/rocks";
import { applyInteraction, clampScale, collectionProgress, CORE_PHRASE, currentRock } from "../domain/rockSimulator";
import type { RockAppState } from "../types";
import { Encyclopedia } from "./Encyclopedia";
import { IconButton } from "./IconButton";

type ControlPanelProps = {
  state: RockAppState;
  patchState: (patch: Partial<RockAppState>) => void;
  compact?: boolean;
};

type PanelTab = "interact" | "book" | "size" | "settings";

export function ControlPanel({ state, patchState, compact = false }: ControlPanelProps) {
  const [tab, setTab] = useState<PanelTab>("interact");
  const progress = collectionProgress(state);
  const rock = currentRock(state);

  const groupedInteractions = useMemo(
    () => ({
      touch: INTERACTIONS.filter((item) => item.category === "touch"),
      observe: INTERACTIONS.filter((item) => item.category === "observe"),
      ritual: INTERACTIONS.filter((item) => item.category === "ritual"),
      utility: INTERACTIONS.filter((item) => item.category === "utility")
    }),
    []
  );

  function runInteraction(interactionId: string) {
    const result = applyInteraction(state, interactionId);
    patchState(result.state);
  }

  function updateScale(value: number) {
    patchState({ scale: clampScale(value) });
  }

  function togglePinned() {
    patchState({ pinned: !state.pinned });
  }

  function toggleClickThrough() {
    patchState({ clickThrough: !state.clickThrough });
  }

  function resetState() {
    patchState({
      currentRockId: "rock-001",
      scale: 1,
      pinned: true,
      clickThrough: false,
      unlockedRockIds: ["rock-001"],
      interactionCount: 0,
      lastMessage: CORE_PHRASE,
      lastAnimationKey: "none",
      animationTick: 0
    });
  }

  return (
    <aside className={`stone-panel ${compact ? "stone-panel--compact" : ""}`}>
      <header className="panel-titlebar">
        <div>
          <strong>돌 시뮬레이터</strong>
          <span>{rock.nameKo}</span>
        </div>
        <div className="window-actions">
          <button type="button" aria-label="최소화" title="최소화" onClick={() => window.rockDesktop?.windowControl("minimize")}>
            <Minus size={15} />
          </button>
          <button type="button" aria-label="닫기" title="닫기" onClick={() => window.rockDesktop?.windowControl("close")}>
            <X size={15} />
          </button>
        </div>
      </header>

      <nav className="panel-nav" aria-label="돌 제어">
        <IconButton icon={<Hand size={20} />} label="상호작용" active={tab === "interact"} onClick={() => setTab("interact")} />
        <IconButton icon={<BookOpen size={20} />} label="백과사전" active={tab === "book"} onClick={() => setTab("book")} />
        <IconButton icon={<Maximize2 size={20} />} label="크기" active={tab === "size"} onClick={() => setTab("size")} />
        {compact && <IconButton icon={<Pin size={20} />} label="고정" active={state.pinned} onClick={togglePinned} />}
        <IconButton icon={<Settings size={20} />} label="설정" active={tab === "settings"} onClick={() => setTab("settings")} />
      </nav>

      {!compact && <main className="panel-body">
        {tab === "interact" && (
          <div className="interaction-grid">
            {Object.entries(groupedInteractions).map(([category, interactions]) => (
              <section key={category} className="interaction-group">
                <div className="group-label">{categoryLabel(category)}</div>
                {interactions.map((interaction) => (
                  <button type="button" key={interaction.id} className="interaction-button" onClick={() => runInteraction(interaction.id)}>
                    <Sparkles size={14} />
                    <span>{interaction.labelKo}</span>
                  </button>
                ))}
              </section>
            ))}
          </div>
        )}

        {tab === "book" && <Encyclopedia state={state} onSelect={(currentRockId) => patchState({ currentRockId })} />}

        {tab === "size" && (
          <div className="size-tools">
            <label htmlFor="rock-scale">크기</label>
            <input
              id="rock-scale"
              type="range"
              min="0.45"
              max="1.8"
              step="0.01"
              value={state.scale}
              onChange={(event) => updateScale(Number(event.currentTarget.value))}
            />
            <div className="scale-readout">{Math.round(state.scale * 100)}%</div>
            <div className="size-buttons">
              <button type="button" onClick={() => updateScale(state.scale - 0.1)}>-</button>
              <button type="button" onClick={() => updateScale(1)}>100</button>
              <button type="button" onClick={() => updateScale(state.scale + 0.1)}>+</button>
            </div>
          </div>
        )}

        {tab === "settings" && (
          <div className="settings-list">
            <button type="button" className={`setting-row ${state.pinned ? "is-enabled" : ""}`} onClick={togglePinned}>
              <Pin size={17} />
              <span>고정</span>
              <b>{state.pinned ? "켜짐" : "꺼짐"}</b>
            </button>
            <button type="button" className={`setting-row ${state.clickThrough ? "is-enabled" : ""}`} onClick={toggleClickThrough}>
              <MousePointer2 size={17} />
              <span>클릭 통과</span>
              <b>{state.clickThrough ? "켜짐" : "꺼짐"}</b>
            </button>
            <button type="button" className="setting-row" onClick={resetState}>
              <RotateCcw size={17} />
              <span>초기화</span>
              <b>돌</b>
            </button>
            <div className="setting-row setting-row--static">
              <Eye size={17} />
              <span>상호작용</span>
              <b>{state.interactionCount}</b>
            </div>
          </div>
        )}
      </main>}

      <footer className="panel-footer">
        <div className="collection-chip">
          <span className="mini-rock" />
          수집 {progress.unlocked}/{ROCKS.length}
        </div>
        <p>{state.lastMessage || CORE_PHRASE}</p>
      </footer>
    </aside>
  );
}

function categoryLabel(category: string) {
  switch (category) {
    case "touch":
      return "접촉";
    case "observe":
      return "관찰";
    case "ritual":
      return "의식";
    case "utility":
      return "도구";
    default:
      return category;
  }
}
