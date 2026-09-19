#!/usr/bin/env node
/**
 * I7 — THE TRAVEL GRAMMAR. BORN RED (T9-W7 pass 1, MOT-DERIVE G-MOT-D3).
 *
 * MOT-DERIVE's formula is dead (`ms = baseMs + travelPx/speed` cannot fit the drawer's own
 * two poses; the best least-squares fit spends 26.5ms — 1.6 frames — on a 3× travel range).
 * What survives is the half that was always true: **distance informs the record, never the
 * clock.** A duration is a decision, and a decision is auditable only if the reader can see
 * what it was made against.
 *
 * THE RULE. Every `MOTION.*Ms` a FLIP mover actually spends carries one docstring line:
 *
 *     travel: <n>px @<w>x<h> (<mover>) · <v> px/ms
 *
 * — the distance that number moves, the viewport it was measured at, the thing that moves,
 * and the mean speed that falls out. Anything may follow on the same line (a second viewport,
 * a first-frame figure) after a ` · `. The grammar is `check-motion-contract.mjs`'s precedent:
 * a fact held only in prose propagates to nobody, so the fact gets a shape and a gate.
 *
 * TWO CHECKS:
 *   1  DECLARED  — every FLIP-spent MOTION *Ms has a travel line in its own docstring.
 *   2  ARITHMETIC — the declared px/ms agrees with travel ÷ duration to within 5%. A travel
 *                   line that lies is worse than no travel line; this is the only part of the
 *                   family's arithmetic that survives, and it runs in the direction that works
 *                   (speed is DERIVED FROM the ruled duration, never the reverse).
 *
 * WHICH MEMBERS ARE IN SCOPE is derived, not listed: the script censuses every `.animate()`
 * duration and every duration handed to `useFlipGlide` (construction + per-run override),
 * resolves each through one module-local alias, and takes the MOTION members it lands on.
 * A duration typed as a literal at a call site is invisible here BY CONSTRUCTION — that is
 * G-MOT-D1's row (i3 check B2), and this script says so rather than silently passing.
 *
 * Run: FE=<frontend dir> node i7-travel-declared.mjs
 *
 * READING AT HEAD (aab67b92): RED — 0 of 2 in-scope members declare a travel
 *   (boardFoldMs, cardStepMs), and the drawer's own gesture is NOT EVEN IN SCOPE because its
 *   520 is a module literal. Counting the two members the family mints, 0 of 4.
 * READING ON THE MOT-DERIVE DIFF: GREEN — 4 of 4 (cardStepMs, boardFoldMs, drawerGlideMs,
 *   dockGlideMs), every declared px/ms within 5% of travel ÷ duration.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve, relative } from "node:path";
import process from "node:process";

const FE = resolve(
  process.env.FE ?? "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend",
);
const SRC = join(FE, "src");
const CFG = join(SRC, "pencil/config/pencilConfig.ts");

const TRAVEL =
  /travel:\s*([\d.]+)px\s*@(\d+)x(\d+)\s*\(([^)]+)\)\s*·\s*([\d.]+)\s*px\/ms/;

// ── the MOTION members, each with the docstring block directly above it ────
const ts = readFileSync(CFG, "utf8");
const motionBlock = ts.slice(
  ts.indexOf("export const MOTION"),
  ts.indexOf("export function beatsFor"),
);
const members = new Map();
{
  const lines = motionBlock.split("\n");
  let doc = [];
  lines.forEach((line) => {
    const t = line.trim();
    if (t.startsWith("/**") || t.startsWith("*") || t.startsWith("*/")) doc.push(t);
    const m = /^\s+([a-zA-Z]+Ms):\s*(\d+)/.exec(line);
    if (m) {
      members.set(m[1], { ms: +m[2], doc: doc.join("\n") });
      doc = [];
    } else if (!t.startsWith("/**") && !t.startsWith("*") && !t.startsWith("*/") && t) doc = [];
  });
}

// ── which of them a FLIP mover spends (same census as i3 check B2) ────────
function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name === "dev") continue;
      yield* walk(p);
    } else if (/\.(vue|ts)$/.test(name)) yield p;
  }
}

const spent = new Map(); // member -> [call sites]
let literalSites = 0;
function noteExpr(expr, src, at) {
  const e = expr.replace(/\s+/g, " ").trim();
  const names = [...e.matchAll(/MOTION\.([a-zA-Z]+Ms)\b/g)].map((m) => m[1]);
  if (names.length) {
    for (const n of names) spent.set(n, [...(spent.get(n) ?? []), at]);
    return;
  }
  const id = /^[A-Za-z_$][\w$]*$/.exec(e)?.[0];
  if (id) {
    const decl = new RegExp(`^\\s*const\\s+${id}\\s*=\\s*([^;\\n]+);`, "m").exec(src);
    if (decl) return noteExpr(decl[1], src, at);
  }
  if (/^(options\.)?durationMs$/.test(e)) return; // the primitive's own plumbing
  if (/^\d+(\.\d+)?$/.test(e)) literalSites++;
}

for (const file of walk(SRC)) {
  const src = readFileSync(file, "utf8");
  const rel = relative(FE, file);
  const lineOf = (i) => src.slice(0, i).split("\n").length;
  for (const m of src.matchAll(/\.animate\(([\s\S]{0,400})/g)) {
    const d = /\bduration:\s*([^,\n]+)/.exec(m[1]);
    if (d) noteExpr(d[1], src, `${rel}:${lineOf(m.index)}`);
  }
  for (const m of src.matchAll(/useFlipGlide\(\{([\s\S]{0,400}?)\}\)/g)) {
    const d = /\bdurationMs:\s*([^,\n]+)/.exec(m[1]);
    if (d) noteExpr(d[1], src, `${rel}:${lineOf(m.index)}`);
  }
  for (const m of src.matchAll(/\b\w*[Cc]tl\.run\(([^;]*?)\);/gs)) {
    const args = m[1];
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
    if (cut >= 0) noteExpr(args.slice(cut + 1), src, `${rel}:${lineOf(m.index)}`);
  }
}

// ── the verdict ───────────────────────────────────────────────────────────
const scope = [...spent.keys()].sort();
const rows = scope.map((name) => {
  const mem = members.get(name);
  const t = mem ? TRAVEL.exec(mem.doc) : null;
  const declared = t ? +t[5] : null;
  const derived = t && mem ? +(+t[1] / mem.ms).toFixed(3) : null;
  const drift = t && mem ? Math.abs(declared - derived) / derived : null;
  return {
    name,
    ms: mem?.ms ?? null,
    travel: t ? +t[1] : null,
    at: t ? `${t[2]}x${t[3]}` : null,
    mover: t ? t[4] : null,
    declared,
    derived,
    ok: !!t && drift <= 0.05,
    drift,
    sites: spent.get(name),
  };
});

console.log("I7 — THE TRAVEL GRAMMAR (G-MOT-D3)");
console.log(`   config            : ${relative(FE, CFG)}`);
console.log(`   MOTION *Ms        : ${[...members.keys()].join(" ")}`);
console.log(`   FLIP-spent (scope): ${scope.length} — ${scope.join(" ")}`);
if (literalSites)
  console.log(
    `   NOT IN SCOPE      : ${literalSites} FLIP duration site(s) spend a literal, so no member is reachable — G-MOT-D1's row (i3 B2).`,
  );
for (const r of rows) {
  if (!r.travel) {
    console.log(`     RED  ${r.name.padEnd(14)} ${String(r.ms).padStart(4)}ms   no travel line`);
    continue;
  }
  console.log(
    `     ${r.ok ? "ok  " : "RED "} ${r.name.padEnd(14)} ${String(r.ms).padStart(4)}ms   ${String(r.travel).padStart(6)}px @${r.at.padEnd(9)} (${r.mover})  declared ${r.declared} px/ms · derived ${r.derived} (${(r.drift * 100).toFixed(1)}%)`,
  );
  console.log(`            spent at: ${r.sites.join(", ")}`);
}
const bad = rows.filter((r) => !r.ok);
console.log(`   declared          : ${rows.length - bad.length} of ${rows.length}`);
console.log(bad.length ? "RED" : "GREEN");
if (bad.length) process.exit(1);
