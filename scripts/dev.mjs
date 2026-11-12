import { spawn } from "node:child_process";
import { handleContact } from "../server/contact.mjs";
import { loadEnvironment, serve } from "./http-server.mjs";

const api = serve(handleContact, loadEnvironment, 8787);
const next = spawn(
  process.execPath,
  [
    "node_modules/next/dist/bin/next",
    "dev",
    "--hostname",
    "0.0.0.0",
    ...process.argv.slice(2),
  ],
  { stdio: "inherit", windowsHide: true },
);
for (const signal of ["SIGINT", "SIGTERM"])
  process.on(signal, () => {
    next.kill();
    api.close();
  });
next.on("exit", (code) => {
  api.close();
  process.exitCode = code || 0;
});
