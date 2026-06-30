import { spawn } from "node:child_process";

const child = spawn("npx", ["electron-builder", "--win", "--x64", "--publish", "never"], {
  stdio: "inherit",
  shell: true,
  env: {
    ...process.env,
    CSC_IDENTITY_AUTO_DISCOVERY: "false"
  }
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
