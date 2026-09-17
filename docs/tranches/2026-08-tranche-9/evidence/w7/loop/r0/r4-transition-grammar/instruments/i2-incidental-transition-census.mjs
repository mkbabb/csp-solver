#!/usr/bin/env node
/**
 * I2 — EVERY SHIPPED `transition:` CARRIES A HOUSE CURVE.  BORN RED.
 *
 * The two-layer easing rule (pencilConfig.ts MOTION.curves, assets/index.css @theme §EASING)
 * says every `<style>`-layer easing reads a `var(--ease-*)`. Nothing enforces it, and the
 * owner's "not properly defined" (T9-M09) is exactly the class that escaped: a transition
 * whose curve is a bare UA keyword (`ease`, `ease-out`, `ease-in`, `linear`) or omitted
 * entirely, so the browser's default cubic-bezier(0.25,0.1,0.25,1) IS the design.
 *
 * Scope: `.vue`/`.css` under src/, excluding `src/pencil/dev/` (FilterTuner is a debug rig).
 * `transition: none` is a kill switch, not a curve, and is exempt. `animation:` shorthands
 * are NOT in scope: a keyframe list may legitimately carry `linear` at the shorthand and its
 * real easing per step (`animation-timing-function` inside @keyframes).
 *
 * Run: node i2-incidental-transition-census.mjs   (cwd anywhere; paths resolve off the repo)
 *      --list prints every offender.
 *
 * READING AT HEAD (2026-09-17): RED — 16 of 39 shipped `transition:` declarations carry no
 * `var(--ease-*)`. The dusk ease itself (assets/index.css:667, the theme swap's page-colour
 * tween, `350ms ease`) is one of them.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve, relative } from "node:path";
import process from "node:process";

const SRC = resolve(process.env.SRC ?? "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/src");
const EXCLUDE_DIRS = ["dev"];
const BUDGET = 0; // every shipped transition owes a named curve

const DECL = /(?<![\w-])transition\s*:\s*/;
const HOUSE = /var\(--ease-[A-Za-z]+\)/;

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (EXCLUDE_DIRS.includes(name)) continue;
      yield* walk(p);
    } else if (/\.(vue|css)$/.test(name)) yield p;
  }
}

const offenders = [];
let total = 0;
for (const file of walk(SRC)) {
  const lines = readFileSync(file, "utf8").split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const m = DECL.exec(line);
    const s = line.trim();
    if (!m || s.startsWith("*") || s.startsWith("//") || s.startsWith("/*")) continue;
    const buf = [line];
    let j = i;
    while (!buf[buf.length - 1].includes(";") && j - i < 8) {
      j++;
      if (j >= lines.length) break;
      buf.push(lines[j]);
    }
    const joined = buf.map((x) => x.trim()).join(" ");
    const body = joined.slice(joined.indexOf(m[0]) + m[0].length).split(";")[0].trim();
    const declLine = i + 1; // cite the declaration's FIRST line, not its last
    i = j;
    if (body.startsWith("none")) continue;
    total++;
    if (!HOUSE.test(body)) offenders.push({ at: `${relative(SRC, file)}:${declLine}`, body: body.slice(0, 80) });
  }
}

console.log(`shipped \`transition:\` declarations: ${total}`);
console.log(`carrying a var(--ease-*) token     : ${total - offenders.length}`);
console.log(`INCIDENTAL (bare keyword / none)   : ${offenders.length}  (budget ${BUDGET})`);
if (process.argv.includes("--list") || offenders.length > BUDGET)
  for (const o of offenders) console.log(`  · src/${o.at.padEnd(52)} ${o.body}`);
if (offenders.length > BUDGET) {
  console.log("RED");
  process.exit(1);
}
console.log("GREEN");
