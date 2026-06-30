import { defineConfig, devices } from "@playwright/test";

const visualPort = Number(process.env.PLAYWRIGHT_PORT ?? 5174);
const visualBaseUrl = `http://127.0.0.1:${visualPort}`;

export default defineConfig({
  testDir: "tests",
  testMatch: ["visual.spec.ts"],
  timeout: 60_000,
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], baseURL: visualBaseUrl, viewport: { width: 1600, height: 900 } }
    }
  ],
  webServer: {
    command: `npm run dev -- --port ${visualPort} --strictPort`,
    url: `${visualBaseUrl}/?view=harness`,
    reuseExistingServer: false,
    timeout: 120_000
  }
});
