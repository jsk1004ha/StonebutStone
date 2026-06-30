import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";

const root = process.cwd();
const exePath = path.join(root, "release", "win-unpacked", "돌 시뮬레이터.exe");
const port = 9330 + Math.floor(Math.random() * 400);
const endpoint = `http://127.0.0.1:${port}`;

if (process.platform !== "win32") {
  console.log("packaged UI smoke skipped: Windows executable launch requires win32");
  process.exit(0);
}

if (!fs.existsSync(exePath)) {
  console.error(`packaged UI smoke failed: missing ${exePath}`);
  process.exit(1);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForDebugPort() {
  const started = Date.now();
  while (Date.now() - started < 20000) {
    try {
      const response = await fetch(`${endpoint}/json/version`);
      if (response.ok) return;
    } catch {
      await sleep(250);
    }
  }
  throw new Error(`DevTools endpoint did not open at ${endpoint}`);
}

const child = spawn(exePath, [`--remote-debugging-port=${port}`], {
  windowsHide: true,
  stdio: "ignore"
});

let browser;
try {
  await waitForDebugPort();
  browser = await chromium.connectOverCDP(endpoint);

  const started = Date.now();
  let verified = false;
  while (Date.now() - started < 20000 && !verified) {
    const pages = browser.contexts().flatMap((context) => context.pages());
    for (const page of pages) {
      const hasPanel = await page.evaluate(() => Boolean(document.querySelector(".stone-panel")));
      const hasPhrase = await page.evaluate(() => document.body.innerText.includes("돌은 항상 돌입니다."));
      const hasLoadedRock = await page.evaluate(() => {
        const image = document.querySelector('[data-testid="rock-stage"] img');
        return image instanceof HTMLImageElement && image.complete && image.naturalWidth > 0;
      });
      if ((hasPanel && hasPhrase) || hasLoadedRock) {
        verified = true;
        break;
      }
    }
    if (!verified) await sleep(500);
  }

  if (!verified) {
    throw new Error("packaged UI smoke failed: no stone panel text or loaded rock image was found");
  }

  console.log("packaged UI smoke passed: packaged Electron loaded UI assets");
} finally {
  if (browser) await browser.close().catch(() => undefined);
  if (!child.killed) child.kill();
}
