import { spawn } from "node:child_process";
import net from "node:net";

const port = 5173;
const vite = spawn("npm", ["run", "dev", "--", "--port", String(port)], {
  stdio: "inherit",
  shell: true
});

function waitForPort(retries = 120) {
  return new Promise((resolve, reject) => {
    const attempt = () => {
      const socket = net.connect(port, "127.0.0.1");
      socket.once("connect", () => {
        socket.end();
        resolve();
      });
      socket.once("error", () => {
        socket.destroy();
        if (retries <= 0) reject(new Error("Vite dev server did not start"));
        else setTimeout(() => {
          retries -= 1;
          attempt();
        }, 500);
      });
    };
    attempt();
  });
}

await waitForPort();
await new Promise((resolve, reject) => {
  const build = spawn("npm", ["run", "build:electron"], { stdio: "inherit", shell: true });
  build.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`Electron build failed: ${code}`))));
});

const electron = spawn("npx", ["electron", "."], {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, VITE_DEV_SERVER_URL: `http://127.0.0.1:${port}` }
});

electron.on("exit", (code) => {
  vite.kill();
  process.exit(code ?? 0);
});
