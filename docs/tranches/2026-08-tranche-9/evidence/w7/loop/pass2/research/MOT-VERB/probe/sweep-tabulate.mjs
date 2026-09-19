#!/usr/bin/env node
/**
 * THE SWEEP, DECLARATION BY DECLARATION (T9-W7 pass 2, MOT-VERB research).
 *
 * Charter item 1: "tabulate every changed declaration with old/new resolved ms and curve".
 * Reads the pass-1 worktree's own `git diff` (nothing is written to any tree), pairs each
 * removed line with the added line that replaced it, and resolves both sides' durations and
 * curves against the token tables of their OWN layer — HEAD's `--ease-*` ledger for the old
 * side, the published `--rung-*` / `--verb-*` block for the new side.
 *
 *   node sweep-tabulate.mjs            > readings/sweep-table.tsv
 *
 * A row where the removed and added counts disagree inside one hunk is emitted as UNPAIRED
 * and read by hand; nothing is guessed.
 */
import { execFileSync } from "node:child_process";
import process from "node:process";

const WT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_e58b4764-0fc-52";

// HEAD's easing ledger (src/assets/index.css:349-358, read on the main tree).
const EASE = {
  noteWrite: "cubic-bezier(0.22, 1, 0.36, 1)",
  standard: "cubic-bezier(0.4, 0, 0.2, 1)",
  springPop: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  accelIn: "cubic-bezier(0.55, 0.055, 0.675, 0.19)",
  fadeOut: "cubic-bezier(0.32, 0, 0.67, 0)",
  ghostDraw: "cubic-bezier(0.215, 0.61, 0.355, 1)",
  drawOn: "cubic-bezier(0.33, 1, 0.68, 1)",
  loaderScrub: "cubic-bezier(0.645, 0.045, 0.355, 1)",
  anticipatePop: "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  glassGlide: "cubic-bezier(0.32, 0.72, 0, 1)",
};
// The published block (prototype).
const RUNG = { page: 520, step: 440, sheet: 280, mark: 250, breath: 200, touch: 150 };
const VERB = {
  layDown: "cubic-bezier(0.32, 0.72, 0, 1)",
  lift: "cubic-bezier(0.32, 0, 0.67, 0)",
  turn: "cubic-bezier(0.32, 0.72, 0, 1)",
  slide: "cubic-bezier(0.32, 0.72, 0, 1)",
  writeIn: "cubic-bezier(0.22, 1, 0.36, 1)",
  rubOut: "cubic-bezier(0.32, 0, 0.67, 0)",
  dusk: "cubic-bezier(0.25, 0.1, 0.25, 1)",
};
const KEYWORD = {
  ease: "cubic-bezier(0.25, 0.1, 0.25, 1)",
  "ease-in": "cubic-bezier(0.42, 0, 1, 1)",
  "ease-out": "cubic-bezier(0, 0, 0.58, 1)",
  "ease-in-out": "cubic-bezier(0.42, 0, 0.58, 1)",
  linear: "linear",
};

const DECL = /(?:transition|animation)(?:-[a-z-]+)?\s*:/;

/** split a shorthand at top-level commas */
function terms(body) {
  const out = [];
  let d = 0, cur = "";
  for (const ch of body) {
    if (ch === "(") d++;
    else if (ch === ")") d--;
    if (ch === "," && d === 0) { out.push(cur); cur = ""; } else cur += ch;
  }
  out.push(cur);
  return out;
}

const toMs = (s) => (/ms$/.test(s) ? parseFloat(s) : parseFloat(s) * 1000);

/** every time value in a term, in order: [duration, delay?] */
function times(term) {
  const out = [];
  for (const m of term.matchAll(/(?<![\w(.-])(\d+(?:\.\d+)?)(ms|s)\b/g))
    out.push(toMs(m[1] + m[2]));
  for (const m of term.matchAll(/var\(--rung-([a-z]+)/g)) out.push(RUNG[m[1]] ?? "?");
  for (const m of term.matchAll(/var\(--verb-([A-Za-z]+)-ms/g))
    out.push(m[1] === "dusk" ? 350 : "?");
  for (const m of term.matchAll(/var\(--(card-step-ms|draw-dur|draw-delay|reveal-delay)/g))
    out.push(`{${m[1]}}`);
  return out;
}

function curveOf(term) {
  let m = /var\(--verb-([A-Za-z]+)-ease\)/.exec(term);
  if (m) return [`verb:${m[1]}`, VERB[m[1]] ?? "?"];
  m = /var\(--ease-([A-Za-z]+)\)/.exec(term);
  if (m) return [`ease:${m[1]}`, EASE[m[1]] ?? "?"];
  m = /cubic-bezier\([^)]*\)/.exec(term);
  if (m) return ["literal", m[0]];
  m = /\b(ease-in-out|ease-out|ease-in|ease|linear|steps\([^)]*\))\b/.exec(term);
  if (m) return [`kw:${m[1]}`, KEYWORD[m[1]] ?? m[1]];
  if (/v-bind\(/.test(term)) return ["v-bind", "v-bind"];
  return ["(none)", "(initial: ease)"];
}

const files = execFileSync("git", ["-C", WT, "diff", "--name-only"], { encoding: "utf8" })
  .trim()
  .split("\n")
  .filter((f) => /\.(vue|css|ts)$/.test(f));

const rows = [];
for (const f of files) {
  const d = execFileSync("git", ["-C", WT, "diff", "-U0", "--", f], { encoding: "utf8" });
  let hunkOld = 0, minus = [], plus = [];
  const flush = () => {
    const mm = minus.filter((l) => DECL.test(l.t));
    const pp = plus.filter((l) => DECL.test(l.t));
    const n = Math.max(mm.length, pp.length);
    for (let i = 0; i < n; i++) {
      const a = mm[i], b = pp[i];
      rows.push({ file: f, line: (a ?? b)?.n ?? 0, old: a?.t ?? "(added)", neu: b?.t ?? "(removed)", paired: !!(a && b) });
    }
    minus = []; plus = [];
  };
  for (const line of d.split("\n")) {
    const h = /^@@ -(\d+)(?:,\d+)? \+(\d+)/.exec(line);
    if (h) { flush(); hunkOld = +h[1]; continue; }
    if (line.startsWith("---") || line.startsWith("+++")) continue;
    if (line.startsWith("-")) minus.push({ n: hunkOld++, t: line.slice(1).trim() });
    else if (line.startsWith("+")) plus.push({ n: hunkOld, t: line.slice(1).trim() });
  }
  flush();
}

const body = (l) => l.replace(/^.*?(?:transition|animation)(?:-[a-z-]+)?\s*:\s*/, "").split(";")[0].replace(/\s+/g, " ").trim();

const out = ["file\tline\tside\tterm\tdurations_ms\tcurve_name\tcurve_points\tdecl"];
for (const r of rows) {
  for (const [side, raw] of [["OLD", r.old], ["NEW", r.neu]]) {
    if (!DECL.test(raw)) { out.push(`${r.file}\t${r.line}\t${side}\t-\t-\t-\t-\t${raw}`); continue; }
    const b = body(raw);
    terms(b).forEach((t, i) => {
      const [cn, cp] = curveOf(t);
      out.push(`${r.file.replace("web/frontend/src/", "")}\t${r.line}\t${side}\t${i}\t${times(t).join("|") || "-"}\t${cn}\t${cp}\t${t.trim().slice(0, 70)}`);
    });
  }
  if (!r.paired) out.push(`${r.file}\t${r.line}\tUNPAIRED\t\t\t\t\t`);
}
process.stdout.write(out.join("\n") + "\n");
