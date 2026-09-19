#!/usr/bin/env node
/**
 * I3 — THE ONE GLASS CURVE HAS ONE MIRROR AND A NAMED DURATION EVERY TIME IT IS SPENT.
 * BORN HALF-RED. (r0 lane R4's instrument, EXTENDED here: check B grows a WAAPI arm.)
 *
 *   A. THE MIRROR — unchanged from r0. `MOTION.curves.drawerGlide` vs `--ease-glassGlide`.
 *
 *   B1. THE CSS HOME — unchanged from r0. Every `var(--ease-glassGlide)` spend's duration.
 *
 *   B2. THE WAAPI HOME — NEW (T9-W7 pass 1, MOT-DERIVE G-MOT-D1). The CSS arm cannot see the
 *       three gesture classes that matter most: the drawer, the fold and the card step never
 *       write a `transition:` — they hand a number to `Element.prototype.animate`. So:
 *       every `duration:` at an `.animate()` call and every duration handed to `useFlipGlide`
 *       (at construction as `durationMs:`, or at `run(specs, <here>)`) must resolve to a
 *       pencilConfig member — directly, or through ONE module-local alias in the same file.
 *       A raw number typed at the call site is the "incidental" class wearing a named curve,
 *       and it is exactly what the covenant forbids (`pencilConfig.ts:141-143`, R6 law 4).
 *
 * Scope note, said plainly: B2 reads `.animate(` call sites and the `useFlipGlide` seam only.
 * pencil-boil's own primitives (`createGlyphWiggle`, `createStrokeDrawIn`) take a `duration`
 * too; they are a different family's argument and are NOT read here.
 *
 * Run: FE=<frontend dir> node i3-glass-curve-home.mjs
 *
 * READING AT HEAD (aab67b92):
 *   A  GREEN · B1 RED, 6 durations / 8 homeless · B2 RED, ONE row:
 *      useControlsDrawer.ts:233 `durationMs: GLIDE_MS` → GLIDE_MS = 520 (:86), a literal.
 * READING ON THE MOT-DERIVE DIFF:
 *   A  GREEN · B1 RED, 6 / 8 (untouched — this family lands no CSS) · B2 GREEN.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve, relative } from "node:path";
import process from "node:process";

const FE = resolve(
  process.env.FE ?? "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend",
);
const SRC = join(FE, "src");

// ── A. the mirror ─────────────────────────────────────────────────────────
const ts = readFileSync(join(SRC, "pencil/config/pencilConfig.ts"), "utf8");
const css = readFileSync(join(SRC, "assets/index.css"), "utf8");
const tsCurve = /drawerGlide:\s*"([^"]+)"/.exec(ts)?.[1] ?? null;
const cssCurve =
  /^\s*--ease-glassGlide:\s*(cubic-bezier\([^;]+\));/m.exec(css)?.[1]?.trim() ?? null;
const mirrorOk = tsCurve !== null && cssCurve !== null && tsCurve === cssCurve;

// ── B1. every duration spent on the glass curve, in CSS ───────────────────
const HOMED = new Set(["var(--card-step-ms, 440ms)"]); // MOTION.cardStepMs
const motionBlock = ts.slice(
  ts.indexOf("export const MOTION"),
  ts.indexOf("export function beatsFor"),
);
const MOTION_MS = [...motionBlock.matchAll(/^\s+([a-zA-Z]+Ms):\s*(\d+)/gm)].map((m) => ({
  name: m[1],
  ms: +m[2],
}));

function* walk(dir, exts) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name === "dev") continue;
      yield* walk(p, exts);
    } else if (exts.test(name)) yield p;
  }
}

const spends = [];
for (const file of walk(SRC, /\.(vue|css)$/)) {
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    if (!line.includes("var(--ease-glassGlide)")) return;
    const dur =
      /(var\(--card-step-ms,\s*\d+ms\)|\d+(?:\.\d+)?m?s)\s+var\(--ease-glassGlide\)/.exec(line);
    spends.push({ at: `${relative(FE, file)}:${i + 1}`, dur: dur?.[1] ?? "?" });
  });
}
spends.push({ at: "src/games/shared/useFlipGlide.ts:115", dur: "MOTION.boardFoldMs" });
const homeless1 = spends.filter((s) => !HOMED.has(s.dur) && !s.dur.startsWith("MOTION."));
const distinct = [...new Set(spends.map((s) => s.dur))];

// ── B2. every duration spent by a WAAPI mover ─────────────────────────────
// The config tables a duration may legally come from. `MOTION` is this family's home; the
// others are named so the gate reports "homed elsewhere in config" rather than pretending a
// pencil-boil preset is a literal.
const CONFIG_TABLES = /^(MOTION|GLYPH_ANIM|DRAW_IN_PRESETS|CELEBRATION|BOIL)\b/;

/** Resolve an expression to its home: a config member, a same-file alias of one, or nothing. */
function resolve1(expr, src) {
  const e = expr.trim();
  if (CONFIG_TABLES.test(e)) return { kind: "config", via: e };
  // a ternary of two config members is one decision per pose, both named — the drawer's.
  const tern = /^[^?]+\?\s*([A-Za-z_$][\w$.]*)\s*:\s*([A-Za-z_$][\w$.]*)\s*$/.exec(e);
  if (tern) {
    const a = resolve1(tern[1], src);
    const b = resolve1(tern[2], src);
    if (a.kind === "config" && b.kind === "config")
      return { kind: "config", via: `${a.via} | ${b.via}` };
    return { kind: "literal", via: e };
  }
  if (/^\d+(\.\d+)?$/.test(e)) return { kind: "literal", via: e };
  const id = /^[A-Za-z_$][\w$]*$/.exec(e)?.[0];
  if (id) {
    const decl = new RegExp(`^\\s*const\\s+${id}\\s*=\\s*([^;\\n]+);`, "m").exec(src);
    if (decl) {
      const inner = resolve1(decl[1], src);
      const line = src.slice(0, decl.index).split("\n").length;
      return { ...inner, via: `${id} = ${decl[1].trim()}`, declLine: line };
    }
  }
  // `options.durationMs` / the primitive's own parameter — the CALLER is the row, not this.
  if (/^(options\.)?durationMs$/.test(e)) return { kind: "plumbing", via: e };
  return { kind: "unresolved", via: e };
}

const waapi = [];
for (const file of walk(SRC, /\.(vue|ts)$/)) {
  const src = readFileSync(file, "utf8");
  const rel = relative(FE, file);
  const lineOf = (idx) => src.slice(0, idx).split("\n").length;
  // (a) `duration:` inside a `.animate(` options object.
  for (const m of src.matchAll(/\.animate\(([\s\S]{0,400})/g)) {
    const d = /\bduration:\s*([^,\n]+)/.exec(m[1]);
    if (d)
      waapi.push({
        at: `${rel}:${lineOf(m.index + m[1].indexOf(d[0]))}`,
        expr: d[1],
        src,
        form: "animate()",
      });
  }
  // (b) the useFlipGlide seam — construction, and a per-run override.
  for (const m of src.matchAll(/useFlipGlide\(\{([\s\S]{0,400}?)\}\)/g)) {
    const d = /\bdurationMs:\s*([^,\n]+)/.exec(m[1]);
    if (d)
      waapi.push({ at: `${rel}:${lineOf(m.index)}`, expr: d[1], src, form: "useFlipGlide({})" });
  }
  for (const m of src.matchAll(/\b(\w*[Cc]tl)\.run\(([^;]*?)\);/gs)) {
    const args = m[2];
    let d = 0,
      cut = -1;
    for (let i = 0; i < args.length; i++) {
      const c = args[i];
      if ("([{".includes(c)) d++;
      else if (")]}".includes(c)) d--;
      else if (c === "," && d === 0) {
        cut = i;
        break;
      }
    }
    if (cut >= 0)
      waapi.push({
        at: `${rel}:${lineOf(m.index)}`,
        expr: args.slice(cut + 1),
        src,
        form: `${m[1]}.run(specs, …)`,
      });
  }
}

const rows = waapi.map((w) => {
  const r = resolve1(w.expr.replace(/\s+/g, " "), w.src);
  return { ...w, ...r, expr: w.expr.replace(/\s+/g, " ").trim() };
});
const homeless2 = rows.filter((r) => r.kind === "literal" || r.kind === "unresolved");

console.log("A. THE MIRROR");
console.log(`   MOTION.curves.drawerGlide = ${tsCurve}`);
console.log(`   --ease-glassGlide         = ${cssCurve}`);
console.log(`   ${mirrorOk ? "GREEN" : "RED — the two layers have diverged"}`);
console.log("B1. THE CSS HOME");
console.log(`   MOTION duration constants : ${MOTION_MS.map((m) => `${m.name}=${m.ms}`).join(" ")}`);
console.log(`   distinct glass durations  : ${distinct.length} — ${distinct.join(", ")}`);
console.log(`   homeless spends           : ${homeless1.length}`);
for (const h of homeless1) console.log(`     · ${h.at.padEnd(52)} ${h.dur}`);
console.log("B2. THE WAAPI HOME (G-MOT-D1)");
console.log(`   WAAPI duration sites      : ${rows.length}`);
for (const r of rows)
  console.log(
    `     ${r.kind === "literal" || r.kind === "unresolved" ? "RED " : "ok  "} ${r.at.padEnd(44)} ${r.form.padEnd(20)} ${r.expr}${r.declLine ? `   (decl :${r.declLine})` : ""}`,
  );
console.log(`   homeless WAAPI durations  : ${homeless2.length}`);
console.log(`B2 ${homeless2.length === 0 ? "GREEN" : "RED"}`);
const red = !mirrorOk || homeless1.length > 0 || homeless2.length > 0;
console.log(red ? "RED" : "GREEN");
if (red) process.exit(1);
