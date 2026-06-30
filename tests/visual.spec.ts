import { expect, test } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

test("captures Visual Ralph harness", async ({ page }) => {
  await page.goto("/?view=harness");
  await expect(page.getByText("돌은 항상 돌입니다.")).toBeVisible();
  await expect(page.getByRole("button", { name: "상호작용" })).toBeVisible();
  await expect(page.locator('[data-testid="rock-stage"]')).toBeVisible();
  await expect.poll(async () => page.evaluate(() => {
    const image = document.querySelector('[data-testid="rock-stage"] img');
    return image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0;
  })).toBe(true);
  const outputDir = path.resolve(".omx/artifacts/visual-ralph/rock-simulator");
  fs.mkdirSync(outputDir, { recursive: true });
  await page.screenshot({ path: path.join(outputDir, "render.png"), fullPage: true });
});
