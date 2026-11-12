import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, unlinkSync, rmdirSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { loadEnvironment } from "../scripts/http-server.mjs";

test("local API reads changed keys and .env.local overrides without restarting", () => {
  const directory = mkdtempSync(path.join(tmpdir(), "portfolio-env-"));
  const envFile = path.join(directory, ".env");
  const localFile = path.join(directory, ".env.local");
  try {
    writeFileSync(envFile, "BREVO_API_KEY=\n");
    assert.equal(loadEnvironment(directory).BREVO_API_KEY, "");
    writeFileSync(envFile, "BREVO_API_KEY=test-updated-value\n");
    assert.equal(
      loadEnvironment(directory).BREVO_API_KEY,
      "test-updated-value",
    );
    writeFileSync(localFile, "BREVO_API_KEY=test-local-value\n");
    assert.equal(loadEnvironment(directory).BREVO_API_KEY, "test-local-value");
    writeFileSync(localFile, "BREVO_API_KEY=test-rotated-value\n");
    assert.equal(
      loadEnvironment(directory).BREVO_API_KEY,
      "test-rotated-value",
    );
  } finally {
    for (const file of [envFile, localFile]) {
      try {
        unlinkSync(file);
      } catch (error) {
        if (error.code !== "ENOENT") throw error;
      }
    }
    rmdirSync(directory);
  }
});
