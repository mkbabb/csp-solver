#!/usr/bin/env node
/**
 * I6 (r0/r7 owners-eye) lifted out of the playwright battery so it can be run against two
 * trees without a browser. The DEFAULT arm is byte-for-byte the original's arithmetic
 * (owners-eye.instruments.mjs:225-261) — it must reproduce the banked 77/35/4 at HEAD or
 * the lift is wrong.
 *
 * --widened  counts a `var(--motion-<rung>)` read as NAMED (T9-W7 §13). The original walks
 *            the declaration body for `\d+ms` and a rung read carries its fallback INSIDE
 *            the body, so an unwidened I6 reports the ladder as if nothing had been named.
 *            Masking the rung reads first is the whole of the change.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";

const SRC = process.env.SRC;
const WIDE = process.argv.includes("--widened");

const NO_DEV = process.argv.includes("--no-dev");
const files = [];
(function walk(d) {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) {
      if (NO_DEV && f === "dev") continue;
      walk(p);
    } else if (/\.(vue|css|ts)$/.test(f)) files.push(p);
  }
})(SRC);

const literals = new Map();
let decls = 0;
let namedReads = 0;
for (const f of files) {
  const t = readFileSync(f, "utf8");
  for (const m of t.matchAll(/(?:transition|animation)[a-z-]*:\s*([^;]+);/g)) {
    let body = m[1];
    if (WIDE)
      body = body.replace(/var\(\s*--motion-[A-Za-z]+\s*(?:,[^)]*)?\)/g, () => {
        namedReads++;
        return " NAMED ";
      });
    const found = body.match(/\b\d+(?:\.\d+)?m?s\b/g);
    if (!found) continue;
    decls++;
    for (const d of found) literals.set(d, (literals.get(d) || 0) + 1);
  }
}

// the ladder's rungs, read off pencilConfig — the original's four band keys become six.
const ts = readFileSync(join(SRC, "pencil/config/pencilConfig.ts"), "utf8");
const block = ts.slice(ts.indexOf("export const MOTION"), ts.indexOf("export function beatsFor"));
const rungs = [...(/rungs:\s*\{([^}]*)\}/.exec(block)?.[1] ?? "").matchAll(/([a-zA-Z]+):\s*(\d+)/g)].map(
  (m) => `${m[1]} ${m[2]}`,
);
const bands = [...block.matchAll(/^\s+([a-zA-Z]+Ms):\s*(\d+)/gm)].map((m) => `${m[1]} ${m[2]}`);
const named = [...bands, ...rungs];

const top = [...literals.entries()]
  .sort((a, b) => b[1] - a[1])
  .slice(0, 4)
  .map(([k, v]) => `${k}×${v}`)
  .join(", ");
console.log(
  `I6${WIDE ? " (widened)" : ""}: ${decls} declarations spell ${literals.size} distinct literal durations` +
    ` (top: ${top}) against ${named.length} named in MOTION` +
    (WIDE ? `; ${namedReads} rung reads counted as NAMED` : ""),
);
console.log(literals.size === 0 ? "GREEN" : "RED");
