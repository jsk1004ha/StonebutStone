import { app, BrowserWindow, ipcMain, screen } from "electron";
import { autoUpdater } from "electron-updater";
import fs from "node:fs";
import path from "node:path";

type RockAppState = {
  currentRockId: string;
  scale: number;
  pinned: boolean;
  clickThrough: boolean;
  unlockedRockIds: string[];
  interactionCount: number;
  lastMessage: string;
  lastAnimationKey: "nudge" | "pulse" | "glint" | "settle" | "none";
  animationTick: number;
};

const DEFAULT_STATE: RockAppState = {
  currentRockId: "rock-001",
  scale: 1,
  pinned: true,
  clickThrough: false,
  unlockedRockIds: ["rock-001"],
  interactionCount: 0,
  lastMessage: "돌은 항상 돌입니다.",
  lastAnimationKey: "none",
  animationTick: 0
};

let overlayWindow: BrowserWindow | null = null;
let panelWindow: BrowserWindow | null = null;
let appState: RockAppState = DEFAULT_STATE;
let updateCheckTimer: NodeJS.Timeout | null = null;

const isDev = Boolean(process.env.VITE_DEV_SERVER_URL) || !app.isPackaged;
const devServerUrl = process.env.VITE_DEV_SERVER_URL ?? "http://127.0.0.1:5173";
const rockIdPattern = /^rock-\d{3}$/;
const animationKeys: RockAppState["lastAnimationKey"][] = ["nudge", "pulse", "glint", "settle", "none"];
const updateCheckIntervalMs = 6 * 60 * 60 * 1000;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function clampScale(value: unknown) {
  const numeric = typeof value === "number" ? value : Number(value);
  return Math.min(1.8, Math.max(0.45, Number.isFinite(numeric) ? numeric : DEFAULT_STATE.scale));
}

function normalizeRockIds(value: unknown) {
  if (!Array.isArray(value)) return DEFAULT_STATE.unlockedRockIds;
  const ids = value.filter((id): id is string => typeof id === "string" && rockIdPattern.test(id));
  return ids.length > 0 ? Array.from(new Set(ids)) : DEFAULT_STATE.unlockedRockIds;
}

function normalizeAnimationKey(value: unknown): RockAppState["lastAnimationKey"] {
  return typeof value === "string" && animationKeys.includes(value as RockAppState["lastAnimationKey"])
    ? value as RockAppState["lastAnimationKey"]
    : DEFAULT_STATE.lastAnimationKey;
}

function normalizeTick(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? Math.max(0, Math.floor(value)) : DEFAULT_STATE.animationTick;
}

function normalizeState(input: unknown): RockAppState {
  const record = isRecord(input) ? input : {};
  const unlockedRockIds = normalizeRockIds(record.unlockedRockIds);
  const currentRockId =
    typeof record.currentRockId === "string" && rockIdPattern.test(record.currentRockId)
      ? record.currentRockId
      : unlockedRockIds[0];
  const lastMessage = typeof record.lastMessage === "string" && record.lastMessage.length <= 180
    ? record.lastMessage
    : DEFAULT_STATE.lastMessage;
  const interactionCount = typeof record.interactionCount === "number" && Number.isFinite(record.interactionCount)
    ? Math.max(0, Math.floor(record.interactionCount))
    : DEFAULT_STATE.interactionCount;

  return {
    currentRockId,
    scale: clampScale(record.scale),
    pinned: typeof record.pinned === "boolean" ? record.pinned : DEFAULT_STATE.pinned,
    clickThrough: typeof record.clickThrough === "boolean" ? record.clickThrough : DEFAULT_STATE.clickThrough,
    unlockedRockIds,
    interactionCount,
    lastMessage,
    lastAnimationKey: normalizeAnimationKey(record.lastAnimationKey),
    animationTick: normalizeTick(record.animationTick)
  };
}

function sanitizePatch(patch: unknown): Partial<RockAppState> {
  if (!isRecord(patch)) return {};
  const sanitized: Partial<RockAppState> = {};

  if (typeof patch.currentRockId === "string" && rockIdPattern.test(patch.currentRockId)) {
    sanitized.currentRockId = patch.currentRockId;
  }
  if (typeof patch.scale === "number" || typeof patch.scale === "string") {
    sanitized.scale = clampScale(patch.scale);
  }
  if (typeof patch.pinned === "boolean") {
    sanitized.pinned = patch.pinned;
  }
  if (typeof patch.clickThrough === "boolean") {
    sanitized.clickThrough = patch.clickThrough;
  }
  if (Array.isArray(patch.unlockedRockIds)) {
    sanitized.unlockedRockIds = normalizeRockIds(patch.unlockedRockIds);
  }
  if (typeof patch.interactionCount === "number" && Number.isFinite(patch.interactionCount)) {
    sanitized.interactionCount = Math.max(0, Math.floor(patch.interactionCount));
  }
  if (typeof patch.lastMessage === "string" && patch.lastMessage.length <= 180) {
    sanitized.lastMessage = patch.lastMessage;
  }
  if (typeof patch.lastAnimationKey === "string" && animationKeys.includes(patch.lastAnimationKey as RockAppState["lastAnimationKey"])) {
    sanitized.lastAnimationKey = patch.lastAnimationKey as RockAppState["lastAnimationKey"];
  }
  if (typeof patch.animationTick === "number" && Number.isFinite(patch.animationTick)) {
    sanitized.animationTick = Math.max(0, Math.floor(patch.animationTick));
  }

  return sanitized;
}

function statePath() {
  return path.join(app.getPath("userData"), "rock-state.json");
}

function readState(): RockAppState {
  try {
    const parsed = JSON.parse(fs.readFileSync(statePath(), "utf8")) as unknown;
    return normalizeState(parsed);
  } catch {
    return DEFAULT_STATE;
  }
}

function writeState(state: RockAppState) {
  fs.mkdirSync(app.getPath("userData"), { recursive: true });
  fs.writeFileSync(statePath(), JSON.stringify(state, null, 2), "utf8");
}

function broadcastState() {
  for (const win of BrowserWindow.getAllWindows()) {
    win.webContents.send("state:changed", appState);
  }
}

function loadView(win: BrowserWindow, view: "overlay" | "panel") {
  if (isDev) {
    void win.loadURL(`${devServerUrl}/?view=${view}`);
    return;
  }

  void win.loadFile(path.join(__dirname, "../dist/index.html"), {
    query: { view }
  });
}

function logUpdateError(error: unknown) {
  console.error("auto update failed", error);
}

function checkForUpdates() {
  void autoUpdater.checkForUpdatesAndNotify().catch(logUpdateError);
}

function startAutoUpdateChecks() {
  if (isDev) return;

  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;
  autoUpdater.on("error", (error) => logUpdateError(error));

  checkForUpdates();
  updateCheckTimer = setInterval(checkForUpdates, updateCheckIntervalMs);
  updateCheckTimer.unref();
}

function stopAutoUpdateChecks() {
  if (updateCheckTimer) {
    clearInterval(updateCheckTimer);
    updateCheckTimer = null;
  }
}

function createOverlayWindow() {
  const display = screen.getPrimaryDisplay();
  const { width, height } = display.workAreaSize;
  overlayWindow = new BrowserWindow({
    width: 720,
    height: 430,
    x: Math.max(24, Math.round(width * 0.22)),
    y: Math.max(24, Math.round(height * 0.32)),
    frame: false,
    transparent: true,
    resizable: true,
    hasShadow: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    backgroundColor: "#00000000",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });
  overlayWindow.setAlwaysOnTop(appState.pinned, "screen-saver");
  overlayWindow.setIgnoreMouseEvents(appState.clickThrough, { forward: true });
  loadView(overlayWindow, "overlay");
}

function createPanelWindow() {
  const display = screen.getPrimaryDisplay();
  const { width, height } = display.workAreaSize;
  panelWindow = new BrowserWindow({
    width: 246,
    height: 560,
    x: Math.max(16, width - 286),
    y: Math.max(16, Math.round(height * 0.18)),
    frame: false,
    transparent: true,
    resizable: false,
    hasShadow: true,
    skipTaskbar: false,
    alwaysOnTop: true,
    backgroundColor: "#00000000",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });
  panelWindow.setAlwaysOnTop(appState.pinned, "screen-saver");
  loadView(panelWindow, "panel");
}

app.whenReady().then(() => {
  appState = readState();
  createOverlayWindow();
  createPanelWindow();
  startAutoUpdateChecks();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createOverlayWindow();
      createPanelWindow();
    }
  });
});

app.on("before-quit", stopAutoUpdateChecks);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.handle("state:load", () => appState);

ipcMain.handle("state:update", (_event, patch: unknown) => {
  const sanitizedPatch = sanitizePatch(patch);
  appState = normalizeState({ ...appState, ...sanitizedPatch });
  writeState(appState);
  if (typeof sanitizedPatch.pinned === "boolean") {
    overlayWindow?.setAlwaysOnTop(sanitizedPatch.pinned, "screen-saver");
    panelWindow?.setAlwaysOnTop(sanitizedPatch.pinned, "screen-saver");
  }
  if (typeof sanitizedPatch.clickThrough === "boolean") {
    overlayWindow?.setIgnoreMouseEvents(sanitizedPatch.clickThrough, { forward: true });
  }
  broadcastState();
  return appState;
});

ipcMain.handle("window:control", (_event, action: "minimize" | "close") => {
  if (action === "minimize") {
    panelWindow?.minimize();
    return;
  }
  app.quit();
});
