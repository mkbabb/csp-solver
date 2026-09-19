#!/usr/bin/env node
// T9-W7 pass-3 research · MOT-LADDER · WHAT KEY THE RATCHET CAN BE HUNG ON (gap 13)
//
// The pass-2 bank keys a row on a per-file occurrence ordinal; the critic's objection is that
// an ordinal renumbers every row below an insertion. This measures four candidate keys over
// the same 85 CSS duration rows and reports the collision count of each — the cheapest key
// with zero collisions is the one the ratchet can hang on.
//
// usage: node ratchet-key-collisions.mjs [<frontend root>]

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, extname } from "node:path";

const ROOT = process.argv[2] ?? process.cwd();
const SRC = join(ROOT, "src");
const SKIP_DIR = /(^|\/)(dev|node_modules|dist)(\/|$)/;
const SKIP_FILE = /\.(test|spec)\.[tj]s$|\.d\.ts$/;

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (!SKIP_DIR.test(relative(SRC, p))) walk(p, out);
    } else if (!SKIP_FILE.test(name) && [".vue", ".css"].includes(extname(name))) out.push(p);
  }
  return out;
}

const rows = [];
for (const path of walk(SRC).sort()) {
  const text = readFileSync(path, "utf8");
  const chunks =
    extname(path) === ".css"
      ? [text]
      : [...text.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]);
  for (const chunk of chunks) {
    // walk declaration by declaration, remembering the nearest selector text
    const re = /([^{}]+)\{([^{}]*)\}/g;
    let m;
    while ((m = re.exec(chunk))) {
      const selector = m[1].split("\n").pop().trim().replace(/\s+/g, " ");
      const body = m[2];
      for (const d of body.matchAll(/\b(transition|animation)(-duration)?\s*:\s*([^;]+)/g)) {
        const prop = d[1] + (d[2] ?? "");
        let depth = 0;
        let cur = "";
        const terms = [];
        for (const ch of d[3]) {
          if (ch === "(") depth++;
          else if (ch === ")") depth--;
          if (ch === "," && depth === 0) {
            terms.push(cur);
            cur = "";
          } else cur += ch;
        }
        terms.push(cur);
        for (const term of terms) {
          const t = term.trim().replace(/\s+/g, " ");
          const time = /(-?\d*\.?\d+)\s*(ms|s)\b/.exec(t);
          if (!time) continue;
          const ms = time[2] === "s" ? parseFloat(time[1]) * 1000 : parseFloat(time[1]);
          rows.push({ file: relative(ROOT, path), selector, prop, term: t, ms });
        }
      }
    }
  }
}

const KEYS = {
  "file :: term": (r) => `${r.file} :: ${r.term}`,
  "file :: prop :: ms": (r) => `${r.file} :: ${r.prop} :: ${r.ms}`,
  "file :: selector :: prop :: ms": (r) => `${r.file} :: ${r.selector} :: ${r.prop} :: ${r.ms}`,
  "file :: selector :: term": (r) => `${r.file} :: ${r.selector} :: ${r.term}`,
};

console.log(`rows: ${rows.length}`);
for (const [name, fn] of Object.entries(KEYS)) {
  const seen = new Map();
  for (const r of rows) {
    const k = fn(r);
    seen.set(k, (seen.get(k) ?? 0) + 1);
  }
  const dup = [...seen.entries()].filter(([, n]) => n > 1);
  console.log(
    `${name.padEnd(32)} distinct=${String(seen.size).padStart(3)} collisions=${dup.reduce(
      (a, [, n]) => a + n - 1,
      0
    )}`
  );
  for (const [k, n] of dup) console.log(`    x${n}  ${k.slice(0, 130)}`);
}
