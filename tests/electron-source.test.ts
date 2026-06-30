import fs from "node:fs";
import { describe, expect, it } from "vitest";

describe("Electron desktop contract", () => {
  const mainSource = fs.readFileSync("electron/main.ts", "utf8");
  const preloadSource = fs.readFileSync("electron/preload.ts", "utf8");

  it("keeps the rock overlay desktop-shaped", () => {
    expect(mainSource).toContain("frame: false");
    expect(mainSource).toContain("transparent: true");
    expect(mainSource).toContain("alwaysOnTop: true");
    expect(mainSource).toContain("skipTaskbar: true");
    expect(mainSource).toContain("setIgnoreMouseEvents(appState.clickThrough");
  });

  it("keeps renderer privileges narrow", () => {
    expect(mainSource).toContain("contextIsolation: true");
    expect(mainSource).toContain("nodeIntegration: false");
    expect(mainSource).toContain("sandbox: true");
    expect(preloadSource).toContain('contextBridge.exposeInMainWorld("rockDesktop"');
    expect(preloadSource).not.toContain("setAlwaysOnTop");
    expect(preloadSource).not.toContain("setClickThrough");
  });

  it("keeps state updates as the single window-control path", () => {
    expect(mainSource).toContain('ipcMain.handle("state:update"');
    expect(mainSource).toContain("setAlwaysOnTop(sanitizedPatch.pinned");
    expect(mainSource).toContain("setIgnoreMouseEvents(sanitizedPatch.clickThrough");
    expect(preloadSource).toContain('updateState: (patch: unknown) => ipcRenderer.invoke("state:update", patch)');
  });

  it("checks GitHub releases for packaged app updates", () => {
    expect(mainSource).toContain('import { autoUpdater } from "electron-updater"');
    expect(mainSource).toContain("autoUpdater.checkForUpdatesAndNotify()");
    expect(mainSource).toContain("if (isDev) return;");
    expect(mainSource).toContain("autoUpdater.autoInstallOnAppQuit = true");
  });
});
