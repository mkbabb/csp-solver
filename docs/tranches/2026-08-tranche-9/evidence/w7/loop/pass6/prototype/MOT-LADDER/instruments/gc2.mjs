#!/usr/bin/env node
/**
 * GC2 (INTAKE row 43) as an instrument that can fail — MOT-LADDER pass 6, charter row 9.
 * "No timing literal outside pencilConfig in the §10/§13 diffs": every ADDED code line of the
 * tree's diff against BASE (default 74a2b5d9) under web/frontend/src, pencilConfig.ts excluded,
 * that carries a CSS time literal inside a transition/animation declaration, or a TS clock
 * literal in a clock context, is a finding — unless a DECLARED exception names its file, its
 * literal and its COUNT (the value law: an exception carries its value). An exception nothing
 * matches reds STALE. Comments are masked before reading (a sentence is not a rule).
 *   node gc2.mjs <work-tree root> [--plant]   (--plant adds one synthetic added line: must red)
 */
import { execFileSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
const ROOT = process.argv[2];
const BASE = process.env.BASE ?? "74a2b5d9";
const PLANT = process.argv.includes("--plant");
const git = (...a) => execFileSync("git", ["-C", ROOT, ...a], { encoding: "utf8", maxBuffer: 64e6 });
/** Each exception: file, the literal, how many added code lines carry it, and why. */
const DECLARED = [
  { file: "src/pencil/sheet/AnswerKeyLaminate.vue", lit: "280ms", n: 2, why: "the lay-down, R6 §1.2's GRADED pair against `leave` 200; re-curved to --verb-layDown-ease, length kept (ADMITTED GRADED, ms [280])" },
  { file: "src/pencil/sheet/AnswerKeyLaminate.vue", lit: "150ms", n: 1, why: "the laminate's PRM-FALLBACK fade, re-curved to --ease-prmLinear (ADMITTED PRM-FALLBACK, ms [150])" },
  { file: "src/pencil/celestial/DarkModeToggle.vue", lit: "150ms", n: 1, why: "the Bloom's star tuck (scale), re-curved to --ease-starTuck; the Bloom is T9-M15's ratified surface" },
  { file: "src/pencil/celestial/DarkModeToggle.vue", lit: "100ms", n: 1, why: "the Bloom's star tuck (opacity), re-curved" },
  { file: "src/pencil/celestial/DarkModeToggle.vue", lit: "120ms", n: 1, why: "the Bloom's star crest fade, re-curved to --ease-starFade" },
  { file: "src/pencil/celestial/DarkModeToggle.vue", lit: "560ms", n: 1, why: "the crest fade's DELAY (B9's axis), byte-identical value" },
  { file: "src/pencil/celestial/DarkModeToggle.vue", lit: "200ms", n: 1, why: "the toggle's PRM-FALLBACK crossfade, re-curved to --ease-prmFade (ADMITTED PRM-FALLBACK)" },
  { file: "src/games/shared/scene.css", lit: "150ms", n: 1, why: "controls-fade-in's DELAY (B9's axis), byte-identical on the control" },
];
const files = [
  ...git("diff", "--name-only", BASE, "--", "web/frontend/src").split("\n"),
  ...git("ls-files", "--others", "--exclude-standard", "--", "web/frontend/src").split("\n"),
].filter((f) => f && !f.endsWith("pencilConfig.ts") && /\.(css|vue|ts)$/.test(f) && !/\.test\.ts$/.test(f));
const mask = (t) =>
  t.replace(/\/\*[^]*?\*\/|<!--[^]*?-->/g, (m) => m.replace(/[^\n]/g, " ")).replace(/(^|[^:"'`])\/\/.*$/gm, (m, p) => p + " ".repeat(m.length - p.length));
const found = [];
for (const f of new Set(files)) {
  const abs = join(ROOT, f);
  if (!existsSync(abs)) continue;
  const tracked = git("ls-files", "--", f).trim() !== "";
  const added = new Set();
  if (tracked) {
    for (const m of git("diff", "-U0", BASE, "--", f).matchAll(/^@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/gm)) {
      const a = Number(m[1]), n = m[2] === undefined ? 1 : Number(m[2]);
      for (let i = 0; i < n; i++) added.add(a + i);
    }
  } else readFileSync(abs, "utf8").split("\n").forEach((_, i) => added.add(i + 1));
  const lines = mask(readFileSync(abs, "utf8")).split("\n");
  if (PLANT && f.endsWith("scene.css")) { lines.push("  transition: opacity 90ms var(--verb-lift-ease);"); added.add(lines.length); }
  // CSS: a line inside a transition/animation declaration (the declaration may span lines)
  let inDecl = false;
  lines.forEach((ln, i) => {
    if (/(?<![\w-])(transition|animation)[a-z-]*\s*:/.test(ln)) inDecl = true;
    const css = inDecl && /\.(css|vue)$/.test(f);
    const tsClock = /\.(ts|vue)$/.test(f) && /(setTimeout|setInterval|duration\s*:|delay\s*:|_MS\s*=|Ms\s*[:=]|\.animate\s*\()/.test(ln);
    if (added.has(i + 1)) {
      if (css) for (const m of ln.matchAll(/(?<![\w.-])(\d+(?:\.\d+)?)(ms|s)(?![\w-])/g)) if (!(Number(m[1]) * (m[2] === "s" ? 1000 : 1) <= 1)) found.push({ file: f.replace(/^web\/frontend\//, ""), line: i + 1, lit: m[0], text: ln.trim().slice(0, 90) });
      if (tsClock && !css) for (const m of ln.matchAll(/(?<![\w.$-])(\d{2,5})(?![\w.])/g)) found.push({ file: f.replace(/^web\/frontend\//, ""), line: i + 1, lit: m[1], text: ln.trim().slice(0, 90) });
    }
    if (inDecl && /[;}]/.test(ln)) inDecl = false;
  });
}
const bad = [];
const used = new Map();
for (const x of found) {
  const row = DECLARED.find((d) => d.file === x.file && d.lit === x.lit);
  if (!row) bad.push(`UNDECLARED ${x.file}:${x.line}  ${x.lit}   ${x.text}`);
  else used.set(row, (used.get(row) ?? 0) + 1);
}
for (const d of DECLARED)
  if ((used.get(d) ?? 0) !== d.n) bad.push(`EXCEPTION ${d.file} ${d.lit} declares n=${d.n}, the diff carries ${used.get(d) ?? 0} — STALE or grown`);
console.log(`GC2 · base ${BASE} · ${files.length} files in the diff (pencilConfig excluded) · ${found.length} added literal sites · ${DECLARED.length} declared exceptions`);
for (const x of found) console.log(`  ${x.file}:${x.line}  ${x.lit}   ${x.text}`);
for (const b of bad) console.log(`  ✗ ${b}`);
process.exit(bad.length ? 1 : 0);
