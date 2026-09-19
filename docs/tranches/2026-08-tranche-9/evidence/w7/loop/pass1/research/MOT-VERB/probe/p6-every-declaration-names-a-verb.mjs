#!/usr/bin/env node
/**
 * P6 — EVERY DECLARATION NAMES A VERB.  BORN RED.
 *
 * The charter asks for `check-motion-contract.mjs` "widened to 'every declaration names a
 * verb'". It cannot be widened: that script's entire corpus is `e2e/*.spec.ts` heads and its
 * three checks are about a SPEC's declared PRM state (see its own banner). Nothing in it reads
 * `src/`. So the verb law needs its own gate, and this is its shape.
 *
 * THIS GATE ALSO REPLACES I2, WHICH THE VERB GRAMMAR BREAKS. I2 asserts every `transition:`
 * carries `var(--ease-*)`; a verb-named transition carries `var(--verb-*-ease)`, which I2's
 * regex refuses, so curing three sites took I2 from 16 offenders to 19. I2 encodes the TOKEN
 * SPELLING, not the law. (I2 carries a second defect, reproduced separately: it has no
 * block-comment state, so a `transition:` sentence inside a CSS block comment counts as a
 * shipped declaration.)
 *
 * FOUR CHECKS:
 *   1  CURVE      every shipped `transition:`/`animation:` names a house curve — `var(--ease-*)`
 *                 or `var(--verb-*-ease)`. A bare UA keyword or no curve reds.
 *   2  DURATION   every duration is a named rung — `var(--rung-*)`, `var(--verb-*-ms)`,
 *                 `var(--draw-dur…)`, `var(--card-step-ms…)` or a v-bound config value. A raw
 *                 `<n>ms` literal reds.
 *   3  ADMITTED   a row may be ADMITTED with a one-line ruling in EXCEPTIONS below; an
 *                 admission whose site no longer exists reds too (a ledger closed both ways,
 *                 the check-copy-register precedent).
 *   4  COMMENTS   the collector blanks block and line comments before matching, so prose can never
 *                 be counted as a declaration (I2's defect, not inherited).
 *
 * SRC=<tree>/src node p6-every-declaration-names-a-verb.mjs [--list]
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve, relative } from "node:path";
import process from "node:process";

const SRC = resolve(process.env.SRC ?? "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/src");

/** Rows the set cannot take, each with the ruling that admits it. Closed both ways. */
const EXCEPTIONS = new Map([
  ["assets/index.css:@PRM-kill", "the global prefers-reduced-motion duration kill is not a gesture"],
]);

const SHAPE_KEYFRAMES = /^(bloom-in|bloom-out|outline-flash|sticker-pop|plush-bounce|plush-murmur|plush-blink|plush-land|ink-write-in|ink-rub-out|note-in|refuse-shake|cell-reveal|pencil-draw-on|toggle-squash|controls-fade-in)/;

function* walk(dir) {
  for (const n of readdirSync(dir).sort()) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) {
      if (n === "dev") continue;
      yield* walk(p);
    } else if (/\.(vue|css)$/.test(n)) yield p;
  }
}
/** Blank out block and line comments IN PLACE so line numbers survive. I2's missing half. */
function strip(text) {
  let out = "", i = 0, n = text.length;
  while (i < n) {
    if (text[i] === "/" && text[i + 1] === "*") {
      const e = text.indexOf("*/", i + 2);
      const end = e < 0 ? n : e + 2;
      for (let k = i; k < end; k++) out += text[k] === "\n" ? "\n" : " ";
      i = end;
    } else if (text[i] === "/" && text[i + 1] === "/") {
      while (i < n && text[i] !== "\n") { out += " "; i++; }
    } else { out += text[i]; i++; }
  }
  return out;
}

const HOUSE_CURVE = /var\(--(?:ease-[A-Za-z]+|verb-[A-Za-z]+-ease)\)/;
const NAMED_DUR = /var\(--(?:rung-[a-z]+|verb-[A-Za-z]+-ms|draw-dur|draw-delay|card-step-ms|reveal-delay)[^)]*\)/;
const RAW_MS = /(?<!\()\b\d+(?:\.\d+)?m?s\b/;
const VBIND = /v-bind\(/;

const rows = [];
for (const file of walk(SRC)) {
  const raw = readFileSync(file, "utf8");
  const text = strip(raw);
  const lines = text.split("\n");
  const DECL = /(?:transition|animation)(?:-[a-z]+)?\s*:\s*/;
  for (let i = 0; i < lines.length; i++) {
    if (!DECL.test(lines[i])) continue;
    let buf = lines[i], j = i;
    while (!buf.includes(";") && j - i < 8 && j + 1 < lines.length) buf += " " + lines[++j];
    const body = buf.slice(buf.search(DECL)).replace(DECL, "").split(";")[0].replace(/\s+/g, " ").trim();
    const at = `${relative(SRC, file)}:${i + 1}`;
    i = j;
    if (!body || body.startsWith("none")) continue;
    const isShape = SHAPE_KEYFRAMES.test(body);
    const curveOk = HOUSE_CURVE.test(body) || VBIND.test(body) || (isShape && !RAW_MS.test(body));
    const durOk = NAMED_DUR.test(body) || VBIND.test(body) || !RAW_MS.test(body);
    if (curveOk && durOk) continue;
    if (EXCEPTIONS.has(at)) continue;
    rows.push({ at, body: body.slice(0, 84), why: [!curveOk && "no verb curve", !durOk && "raw duration"].filter(Boolean).join(" + ") });
  }
}
const dead = [...EXCEPTIONS.keys()].filter((k) => !k.includes("@") && !rows.some((r) => r.at === k));
console.log(`declarations that do NOT name a verb: ${rows.length}  (budget 0)`);
console.log(`admissions in the ledger             : ${EXCEPTIONS.size}, stale ${dead.length}`);
if (rows.length && (process.argv.includes("--list") || rows.length > 0))
  for (const r of rows) console.log(`  · src/${r.at.padEnd(52)} ${r.why.padEnd(24)} ${r.body}`);
console.log(rows.length || dead.length ? "RED" : "GREEN");
process.exit(rows.length || dead.length ? 1 : 0);
