import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests",
  testMatch: ["visual.spec.ts"],
  timeout: 60_000,
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1600, height: 900 } }
    }
  ],
  webServer: {
    command: "npm run dev -- --port 5173",
    url: "http://127.0.0.1:5173/?view=harness",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  }
});
