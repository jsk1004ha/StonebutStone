import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { App } from "../src/App";
import { RockStage } from "../src/components/RockStage";
import { currentRock, DEFAULT_STATE } from "../src/domain/rockSimulator";

describe("app UI", () => {
  it("renders the exact core phrase in the harness", async () => {
    window.history.replaceState(null, "", "/?view=harness");
    render(<App />);
    expect(await screen.findByText("돌은 항상 돌입니다.")).toBeInTheDocument();
  });

  it("updates size controls in panel view", async () => {
    window.history.replaceState(null, "", "/?view=panel");
    render(<App />);
    fireEvent.click(await screen.findByRole("button", { name: "크기" }));
    expect(screen.getByText("100%")).toBeInTheDocument();
    fireEvent.change(screen.getByRole("slider", { name: "크기" }), { target: { value: "1.5" } });
    expect(screen.getByText("150%")).toBeInTheDocument();
  });

  it("applies interaction animation classes to the rock stage", () => {
    render(<RockStage rock={currentRock(DEFAULT_STATE)} scale={1} animationKey="nudge" animationTick={7} />);
    expect(screen.getByTestId("rock-stage")).toHaveClass("rock-motion-nudge");
  });
});
