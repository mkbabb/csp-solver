/**
 * T9-W7 pass 2 · MRK-ABS PROTOTYPE — G-ABS-8: POSE 0 IS THE SHIPPED ARTIFACT.
 *
 * Takes the focused cell's RESIDENT `d` (read off the live DOM by proto.probe.ts and banked in
 * p2-board-<engine>.json) and recomputes it OFFLINE from the library alone with the same seed
 * and RING_GEOMETRY. Byte identity or the gate is red.
 *
 * Run: node .pass2-mrkabs/identity-p2.mjs <logs dir>
 */
import { wobbleRect } from "@mkbabb/pencil-boil";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";

const RING = { wanderUnits: 5.4, inset: 0.86 };
const VIEWBOX = 1000;
const SEED = 42;
const LOGS = process.argv[2] ?? ".";

function expected(boardSize, pos) {
  const cs = VIEWBOX / boardSize;
  const size = RING.inset * cs;
  const pad = ((1 - RING.inset) / 2) * cs;
  const r = Math.floor(pos / boardSize);
  const c = pos % boardSize;
  return wobbleRect(c * cs + pad, r * cs + pad, size, size, {
    roughness: RING.wanderUnits / (0.015 * size),
    segments: 4,
    seed: SEED + 500 + pos * 7,
    jagged: true,
  });
}

for (const engine of ["chromium", "webkit"]) {
  let report;
  try {
    report = JSON.parse(readFileSync(join(LOGS, `p2-board2-${engine}.json`), "utf8"));
  } catch {
    console.log(`${engine}: no board log yet`);
    continue;
  }
  for (const theme of ["dark", "light"]) {
    const res = report[theme]?.facts;
    if (!res?.d) {
      console.log(`${engine}/${theme}: no resident d`);
      continue;
    }
    const want = expected(16, res.index);
    const same = want === res.d;
    console.log(
      `${engine}/${theme} cell ${res.index}: DOM d ${res.d.length} B · library d ${want.length} B · IDENTICAL=${same}` +
        (same ? "" : `\n   DOM  ${res.d.slice(0, 120)}\n   LIB  ${want.slice(0, 120)}`),
    );
    console.log(
      `   viewBox ${res.viewBox} · stroke ${res.stroke} w ${res.strokeWidth} opacity ${res.strokeOpacity} · fill-opacity ${res.fillOpacity} · input outline ${res.inputOutline} · :focus-visible ${res.focusVisible}`,
    );
  }
}
