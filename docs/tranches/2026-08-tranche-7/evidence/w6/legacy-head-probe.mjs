#!/usr/bin/env node
/**
 * T7-W6 — the swallow census's pre-W6 clause head, run as an instrument.
 *
 * `CATCH_HEAD` as it stood at `check-empty-catch.mjs:47`, pointed at the file it was blind to
 * and at three synthetic arrow controls. The subject is read from the BASE COMMIT, not the
 * working tree, so this stays reproducible after the site is cured and after the chair commits.
 *
 *   $ node docs/tranches/2026-08-tranche-7/evidence/w6/legacy-head-probe.mjs   # from repo root
 */
import { execFileSync } from "node:child_process";

const BASE = "af5082880e59951a99aac12c19c8ad6b922882f3"; // T7-W1 head, the W6 base
const SUBJECT = "web/frontend/src/App.vue";
const LEGACY = /\bcatch\s*(?:\([^)]*\)\s*)?\{/g;

const app = execFileSync("git", ["show", `${BASE}:${SUBJECT}`], { encoding: "utf8" });
LEGACY.lastIndex = 0;
const hits = [...app.matchAll(LEGACY)].map((m) => app.slice(0, m.index).split("\n").length);

console.log(`subject: ${SUBJECT} @ ${BASE.slice(0, 8)}`);
console.log(
  "legacy CATCH_HEAD over src/App.vue — clause heads found at lines:",
  hits.join(", ") || "(none)",
);
console.log("App.vue:224 source:", JSON.stringify(app.split("\n")[223].trim()));
console.log("is line 224 among them?", hits.includes(224));

for (const control of [
  "warm().catch(() => {});",
  "warm().catch((e) => {});",
  "warm().catch(async () => {});",
]) {
  LEGACY.lastIndex = 0;
  console.log(
    `legacy sees ${JSON.stringify(control)} ->`,
    LEGACY.test(control) ? "MATCH" : "BLIND",
  );
}
