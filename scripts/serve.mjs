import { readFile } from "node:fs/promises";
import { loadEnvironment, serve } from "./http-server.mjs";

const code = await readFile("dist/server/index.js", "utf8");
const { default: worker } = await import(
  `data:text/javascript;base64,${Buffer.from(code).toString("base64")}`
);
serve(worker.fetch, loadEnvironment(), Number(process.env.PORT || 3100));
