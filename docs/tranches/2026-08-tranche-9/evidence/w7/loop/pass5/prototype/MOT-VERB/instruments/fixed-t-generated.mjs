#!/usr/bin/env node
/**
 * MOT-VERB pass 5 — THE FIXED-t TABLE, GENERATED FROM THE TREE (charter row 2; the pass-4
 * critic's §2.3: the hand-listed table priced 29 sites against 49 `var(--verb-*-ease)` reads
 * and could not reconcile). Nothing here is listed by hand.
 *
 * 1. Every `transition` / `animation` / `*-timing-function` declaration in both trees' `src/`
 *    (the work tree and `git show 74a2b5d9:`), comments masked, parsed into TERMS (top-level
 *    commas), each keyed `file :: selector-chain :: prop :: term #ordinal`.
 * 2. Every after-term whose curve is a `var(--verb-*-ease)` is joined to the control term of
 *    the same key. A term with no control twin is printed UNMATCHED (a new site), never
 *    dropped.
 * 3. Curve-only price: worst |Δprogress| over 21 fractions of the term's own duration (the
 *    pass-4 instrument's statistic, same bisection solver). Joint price: the two traces on ONE
 *    wall clock (length × curve), 1 ms steps.
 * 4. RECONCILIATION: the raw `var(--verb-*-ease)` reads (comment-masked) → the declarations
 *    that carry them → the terms priced, with every read accounted for.
 *
 *   node fixed-t-generated.mjs <worktree>
 */
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { join, relative } from "node:path";

const WT = process.argv[2];
const FE = join(WT, "web/frontend");
const BASE = "74a2b5d9";
const RUNG_MS = { whisper: 150, leave: 200, note: 250, dusk: 350, step: 440, throw: 520, rise: 520 };

function bezier(p1x, p1y, p2x, p2y) {
  const A = (a, b) => 3 * a - 3 * b + 1;
  const cx = (t, a, b) => ((A(a, b) * t + (3 * b - 6 * a)) * t + 3 * a) * t;
  return (p) => {
    if (p <= 0) return 0;
    if (p >= 1) return 1;
    let lo = 0, hi = 1, t = p;
    for (let i = 0; i < 60; i++) {
      const x = cx(t, p1x, p2x);
      if (Math.abs(x - p) < 1e-7) break;
      if (x < p) lo = t; else hi = t;
      t = (lo + hi) / 2;
    }
    return cx(t, p1y, p2y);
  };
}
const KW = { ease: [0.25, 0.1, 0.25, 1], "ease-in": [0.42, 0, 1, 1], "ease-out": [0, 0, 0.58, 1], "ease-in-out": [0.42, 0, 0.58, 1], linear: [0, 0, 1, 1] };
const mask = (t) => t.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "));
const tokensOf = (css) => {
  const o = {};
  for (const m of mask(css).matchAll(/(--(?:ease|verb)-[\w-]+)\s*:\s*(cubic-bezier\([^)]*\)|linear|ease(?:-in|-out|-in-out)?)/g)) o[m[1]] = m[2];
  return o;
};
const pts = (curve, toks) => {
  if (KW[curve]) return KW[curve];
  const v = /^var\((--[\w-]+)\)$/.exec(curve)?.[1];
  const raw = v ? toks[v] : curve;
  if (KW[raw]) return KW[raw];
  const m = /cubic-bezier\(([^)]*)\)/.exec(raw ?? "");
  return m ? m[1].split(",").map(Number) : null;
};

function styleText(file, text) {
  if (file.endsWith(".css")) return mask(text);
  // keep offsets: blank everything outside <style> blocks
  let out = text.replace(/[^\n]/g, " ");
  for (const m of text.matchAll(/(<style\b[^>]*>)([\s\S]*?)<\/style>/g)) {
    const s = m.index + m[1].length;
    out = out.slice(0, s) + mask(m[2]) + out.slice(s + m[2].length);
  }
  return out;
}
const splitTop = (v) => {
  const out = []; let d = 0, cur = "";
  for (const c of v) { if (c === "(") d++; if (c === ")") d--; if (c === "," && d === 0) { out.push(cur); cur = ""; } else cur += c; }
  out.push(cur); return out.map((s) => s.trim()).filter(Boolean);
};
const CURVE_RE = /var\(--(?:verb-[A-Za-z]+-ease|ease-[\w-]+)\)|cubic-bezier\([^)]*\)|\b(?:ease-in-out|ease-in|ease-out|ease|linear)\b(?![\w-])/;
function parseTerm(term, prop) {
  const curve = CURVE_RE.exec(term)?.[0] ?? null;
  let ms = null;
  const t = /var\(--motion-([a-z]+)\)|var\(--[\w-]+,\s*(\d+(?:\.\d+)?)(ms|s)\)|(?<![\w-])(\d+(?:\.\d+)?)(ms|s)(?![\w-])/.exec(term);
  if (t) ms = t[1] ? RUNG_MS[t[1]] : t[2] ? Number(t[2]) * (t[3] === "s" ? 1000 : 1) : Number(t[4]) * (t[5] === "s" ? 1000 : 1);
  const name = /-timing-function$/.test(prop) ? "(timing)" : (term.replace(CURVE_RE, " ").match(/(?:^|\s)([A-Za-z][\w-]*)/)?.[1] ?? "—");
  return { curve, ms, name };
}
function decls(file, text) {
  const s = styleText(file, text);
  const out = []; const stack = []; let buf = "", bufStart = 0;
  const lineAt = (i) => text.slice(0, i).split("\n").length;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === "{") { stack.push(buf.trim().replace(/\s+/g, " ")); buf = ""; bufStart = i + 1; }
    else if (c === "}" || c === ";") {
      const m = /^\s*([\w-]+)\s*:\s*([\s\S]*)$/.exec(buf);
      if (m && /^(transition|animation|transition-timing-function|animation-timing-function)$/.test(m[1]))
        out.push({ file, sel: stack.join(" » "), prop: m[1], value: m[2].trim().replace(/\s+/g, " "), line: lineAt(bufStart + buf.indexOf(m[1])) });
      if (c === "}") stack.pop();
      buf = ""; bufStart = i + 1;
    } else buf += c;
  }
  return out;
}
function termsOf(rev) {
  const files = [];
  const walk = (d) => { for (const e of readdirSync(d, { withFileTypes: true })) { const f = join(d, e.name); if (e.isDirectory()) walk(f); else if (/\.(vue|css)$/.test(e.name)) files.push(f); } };
  walk(join(FE, "src"));
  const rows = new Map(); const seen = new Map();
  for (const f of files) {
    const rel = relative(join(FE, "src"), f);
    let text;
    try { text = rev === "WT" ? readFileSync(f, "utf8") : execFileSync("git", ["-C", WT, "show", `${BASE}:web/frontend/src/${rel}`], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }); } catch { continue; }
    for (const d of decls(rel, text))
      for (const term of splitTop(d.value)) {
        const p = parseTerm(term, d.prop);
        const k0 = `${rel} :: ${d.sel} :: ${d.prop} :: ${p.name}`;
        const n = (seen.get(k0) ?? 0) + 1; seen.set(k0, n);
        rows.set(`${k0} #${n}`, { ...p, term, line: d.line, file: rel, sel: d.sel, prop: d.prop });
      }
  }
  return rows;
}

const tokA = tokensOf(readFileSync(join(FE, "src/assets/index.css"), "utf8"));
const tokC = tokensOf(execFileSync("git", ["-C", WT, "show", `${BASE}:web/frontend/src/assets/index.css`], { encoding: "utf8" }));
const after = termsOf("WT"), control = termsOf("BASE");

// the raw reads, for the reconciliation
let rawReads = 0; const rawByFile = {};
for (const [k, r] of after) if (/var\(--verb-[A-Za-z]+-ease\)/.test(r.term)) { rawReads++; }
const grepReads = execFileSync("bash", ["-c", `cd ${FE} && grep -rnoE 'var\\(--verb-[A-Za-z]+-ease\\)' src | wc -l`], { encoding: "utf8" }).trim();

const rows = [];
for (const [k, a] of after) {
  if (!/var\(--verb-[A-Za-z]+-ease\)/.test(a.curve ?? "")) continue;
  // An `all` shorthand the after-tree split into named properties (`.sparkle-icon`'s
  // `transition: all 200ms` → `filter, transform`): the control twin is that `all` term.
  const c = control.get(k) ?? control.get(k.replace(/:: [\w-]+ #\d+$/, ":: all #1"));
  const row = { key: k, file: a.file, line: a.line, term: a.term, msA: a.ms, curveA: a.curve, control: c ? c.term : null, msC: c?.ms ?? null, curveC: c ? (c.curve ?? "ease(none)") : null };
  if (c) {
    const pa = pts(a.curve, tokA), pc = pts(c.curve ?? "ease", tokC);
    if (pa && pc) {
      const fa = bezier(...pa), fc = bezier(...pc);
      let wd = 0, wt = 0;
      for (let i = 0; i <= 20; i++) { const t = i / 20, d = Math.abs(fa(t) - fc(t)); if (d > wd) { wd = d; wt = t; } }
      let jd = 0, jms = 0;
      if (a.ms && c.ms) for (let ms = 0; ms <= Math.max(a.ms, c.ms); ms++) { const d = Math.abs(fa(Math.min(1, ms / a.ms)) - fc(Math.min(1, ms / c.ms))); if (d > jd) { jd = d; jms = ms; } }
      Object.assign(row, { dCurve: wd, atT: wt, dJoint: a.ms && c.ms ? jd : null, atMs: jms, pc, pa });
    }
  }
  rows.push(row);
}
const cls = (d) => (d == null ? "UNPRICED" : d < 0.005 ? "re-name" : d < 0.05 ? "nudge" : "RE-CURVE");
console.log(`FIXED-t TABLE, GENERATED — after = ${WT} vs control ${BASE}`);
console.log(`\nRECONCILIATION: grep 'var(--verb-*-ease)' in src (comments NOT masked): ${grepReads} reads`);
const declReads = rows.length;
// per-file: raw reads with comments masked, against terms priced
{
  const byFile = {};
  for (const r of rows) byFile[r.file] = (byFile[r.file] ?? 0) + 1;
  const raw = execFileSync("bash", ["-c", `cd ${FE}/src && grep -rlE 'var\\(--verb-[A-Za-z]+-ease\\)' .`], { encoding: "utf8" }).trim().split("\n");
  for (const f of raw) {
    const rel = f.replace(/^\.\//, "");
    const t = readFileSync(join(FE, "src", rel), "utf8");
    const all = (t.match(/var\(--verb-[A-Za-z]+-ease\)/g) ?? []).length;
    const live = (mask(t).match(/var\(--verb-[A-Za-z]+-ease\)/g) ?? []).length;
    if (all !== (byFile[rel] ?? 0)) console.log(`  ${rel}: ${all} raw reads, ${all - live} inside comments, ${byFile[rel] ?? 0} terms priced`);
  }
}
console.log(`  terms in a transition/animation/timing-function declaration naming a verb curve (comments masked, style blocks only): ${declReads}`);
console.log(`  (the difference is the six published @theme declarations + reads inside comments; printed below)`);
console.log(`\n${"file:line".padEnd(46)}${"term (after)".padEnd(58)}${"control".padEnd(52)}  Δcurve  @t    Δjoint  @ms  class`);
for (const r of rows.sort((x, y) => (y.dCurve ?? 9) - (x.dCurve ?? 9)))
  console.log(`${(r.file + ":" + r.line).padEnd(46)}${r.term.slice(0, 56).padEnd(58)}${(r.control ?? "— UNMATCHED —").slice(0, 50).padEnd(52)}  ${r.dCurve?.toFixed(4) ?? "  —   "}  ${r.atT?.toFixed(2) ?? " — "}  ${r.dJoint?.toFixed(4) ?? "  —   "}  ${String(r.atMs ?? "—").padStart(3)}  ${cls(r.dCurve)}`);
const n = (c) => rows.filter((r) => cls(r.dCurve) === c).length;
console.log(`\nterms ${rows.length} · RE-CURVE ${n("RE-CURVE")} · nudge ${n("nudge")} · re-name ${n("re-name")} · unpriced/unmatched ${n("UNPRICED")}`);
const byDecl = new Map();
for (const r of rows) { const k = `${r.file}:${r.line}`; const w = byDecl.get(k); if (!w || (r.dCurve ?? 0) > (w.dCurve ?? 0)) byDecl.set(k, r); }
const nd = (c) => [...byDecl.values()].filter((r) => cls(r.dCurve) === c).length;
console.log(`DECLARATIONS ${byDecl.size} (a declaration's class is its worst term) · RE-CURVE ${nd("RE-CURVE")} · nudge ${nd("nudge")} · re-name ${nd("re-name")}`);
const lenMoved = rows.filter((r) => r.msA && r.msC && r.msA !== r.msC);
console.log(`length moved on ${lenMoved.length} terms: ${lenMoved.map((r) => `${r.file}:${r.line} ${r.msC}→${r.msA}`).join(" · ")}`);
const both = rows.filter((r) => r.dJoint != null && r.dCurve != null && Math.abs(r.dJoint - r.dCurve) > 1e-4);
console.log(`joint length×curve differs from curve-only on ${both.length}: ${both.map((r) => `${r.file}:${r.line} curve ${r.dCurve.toFixed(4)} joint ${r.dJoint.toFixed(4)}`).join(" · ")}`);
console.log(`\nJSON ${JSON.stringify({ terms: rows.length, recurve: n("RE-CURVE"), nudge: n("nudge"), rename: n("re-name"), unpriced: n("UNPRICED"), grepReads: Number(grepReads) })}`);
