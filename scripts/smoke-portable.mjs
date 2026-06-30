import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const releaseDir = path.join(root, "release");
const portablePattern = /^rock-simulator-desktop-portable-.+\.exe$/;
const portableFile = fs.existsSync(releaseDir)
  ? fs.readdirSync(releaseDir).find((file) => portablePattern.test(file))
  : undefined;
const exePath = portableFile ? path.join(releaseDir, portableFile) : path.join(releaseDir, "rock-simulator-desktop-portable-unknown.exe");

if (process.platform !== "win32") {
  console.log("portable smoke skipped: Windows executable launch requires win32");
  process.exit(0);
}

if (!fs.existsSync(exePath)) {
  console.error(`portable smoke failed: missing ${exePath}`);
  process.exit(1);
}

const child = spawn(exePath, [], {
  windowsHide: true,
  stdio: "ignore"
});

let exited = false;
let passed = false;
child.once("exit", (code, signal) => {
  exited = true;
  if (passed) return;
  console.error(`portable smoke failed: process exited early code=${code ?? "null"} signal=${signal ?? "null"}`);
  process.exitCode = 1;
});

setTimeout(() => {
  if (!exited) {
    passed = true;
    child.kill();
    console.log("portable smoke passed: executable started and stayed alive");
  }
}, 8000);
