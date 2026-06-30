import { contextBridge, ipcRenderer } from "electron";

const api = {
  loadState: () => ipcRenderer.invoke("state:load"),
  updateState: (patch: unknown) => ipcRenderer.invoke("state:update", patch),
  onState: (callback: (state: unknown) => void) => {
    const listener = (_event: Electron.IpcRendererEvent, state: unknown) => callback(state);
    ipcRenderer.on("state:changed", listener);
    return () => ipcRenderer.removeListener("state:changed", listener);
  },
  windowControl: (action: "minimize" | "close") => ipcRenderer.invoke("window:control", action)
};

contextBridge.exposeInMainWorld("rockDesktop", api);
