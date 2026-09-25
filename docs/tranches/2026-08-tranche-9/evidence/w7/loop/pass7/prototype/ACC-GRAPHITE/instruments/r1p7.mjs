#!/usr/bin/env node
/**
 * R1, RE-CUT ON THE SHAPE-CENSUS LIBRARY (T9-W7 pass 7, ACC-GRAPHITE; PROPOSED for r0's law probe —
 * the chair inlines it at the fold, as with L5b). "Every chromatic token that paints in BOTH themes
 * carries a dark arm; the focus ring paints no chromatic literal."
 *
 * Pass 6's cut (pass6/prototype/ACC-GRAPHITE/instruments/r1.mjs) exited 0 on three shapes (the pass-6
 * critic): the family's OWN second path painted chromatic (the ring clause keyed `.cell-ghost-path`
 * only), a named / lch / lab / hwb colour (its `chroma()` read hex/rgb/hsl/oklch and scored every other
 * syntax 0), and a token PUBLISHED from script (it read `.css`/`.vue` only). This cut reads through the
 * library the tree vendors (`<fe>/scripts/lib/shape-census.mjs`, the chair's copy + `tokenSites`):
 *   - declarations: every CSS block the library reads (stylesheets, public/, every SFC <style>,
 *     index.html; `@theme` read as :root) AND every script/template publisher `tokenSites` finds;
 *   - chroma: ONE parser (`parseColor`, every CSS <color> syntax), scored as OKLab chroma ≥ 0.03;
 *   - a value with `var()` channels (`oklch(var(--peer-ink-l) 0.11 …)`) flips with the theme when a
 *     var it reads carries a dark arm; a chromatic literal with no flipping var does not;
 *   - the ring clause keys on the SUBJECT COMPOUND: `.cell-ghost-path`, `.cell-ghost-retrace`, and any
 *     `:focus-visible` rule whose subject sits under `.cell-ghost`, in CSS and through `census()`
 *     (template `:style`, script writes).
 *   node r1p7.mjs <web/frontend> [--plant <name>|none] [--self-test]
 * Exit 0 GREEN, 1 RED; --self-test exits 0 when the clean tree reads GREEN, every plant RED and every
 * negative GREEN, 2 otherwise.
 */
import fs from "node:fs";
import path from "node:path";

const FE = path.resolve(process.argv[2] ?? ".");
// LIB overrides the library (the control carries none: read it with the tree's copy, printed)
const LIB = process.env.LIB ?? path.join(FE, "scripts/lib/shape-census.mjs");
const L = await import(LIB);
const { sources, sfc, cssRules, subjectHas, colorLiterals, parseColor, srgbToOklab, tokenSites, census, stripJs } = L;

const PAINT = /^(color|fill|stroke|background|background-color|background-image|border(-(top|right|bottom|left|block|inline)(-(start|end))?)?(-color)?|outline(-color)?|box-shadow|text-decoration(-color)?|caret-color|stop-color|flood-color|lighting-color|column-rule-color|accent-color|text-shadow|-webkit-text-stroke(-color)?)$/;
const chromaOf = (rgb) => { const [, a, b] = srgbToOklab(rgb); return Math.hypot(a, b); };
const CHROMA = 0.03;
const varsIn = (v) => [...v.matchAll(/var\(\s*(--[\w-]+)/g)].map((m) => m[1]);
const isRootSel = (s) => /^(:root|html|:host)$/.test(s.replace(/\s+/g, ""));
const isDarkRoot = (s) => /^(:root|html)?\.dark$/.test(s.replace(/\s+/g, ""));
const otherMedia = (ctx) => /@media/.test(ctx) && !/prefers-contrast/.test(ctx);

const PLANTS = {
  "ring-token": { file: "src/games/shared/gameCell.css", add: "\n:root { --color-ring-plant: #3a7bc4; }\n.game-cell:has(input:focus-visible) .cell-ghost-path { stroke: var(--color-ring-plant); }\n", red: true },
  "ring-hex": { file: "src/games/shared/gameCell.css", add: "\n.game-cell:has(input:focus-visible) .cell-ghost-path { stroke: #3a7bc4; }\n", red: true },
  "retrace-hex": { file: "src/games/shared/gameCell.css", add: "\n.game-cell:has(input:focus-visible) .cell-ghost-retrace { stroke: #3a7bc4; }\n", red: true },
  "ring-named": { file: "src/games/shared/gameCell.css", add: "\n.game-cell:has(input:focus-visible) .cell-ghost-retrace { stroke: royalblue; }\n", red: true },
  "ring-token-lch": { file: "src/games/shared/gameCell.css", add: "\n:root { --color-ring-plant: lch(50% 60 250); }\n.game-cell:has(input:focus-visible) .cell-ghost-path { stroke: var(--color-ring-plant); }\n", red: true },
  "ring-token-named": { file: "src/games/shared/gameCell.css", add: "\n:root { --color-ring-plant: royalblue; }\n.game-cell:has(input:focus-visible) .cell-ghost-retrace { stroke: var(--color-ring-plant); }\n", red: true },
  "ring-under-cell-ghost": { file: "src/games/shared/gameCell.css", add: "\n.game-cell:has(input:focus-visible) .cell-ghost path { fill: hwb(210 20% 20%); }\n", red: true },
  "script-token": { file: "src/games/shared/playerIdentity.ts", add: '\nexport const plantInk = { "--color-ring-plant": "#3a7bc4" };\n', also: { file: "src/games/shared/gameCell.css", add: "\n.game-cell:has(input:focus-visible) .cell-ghost-path { stroke: var(--color-ring-plant); }\n" }, red: true },
  // negatives: must stay GREEN
  "ring-graphite-literal (negative)": { file: "src/games/shared/gameCell.css", add: "\n.game-cell:has(input:focus-visible) .cell-ghost-retrace { stroke: hsl(24 5% 21%); }\n", red: false },
  "script-token-flips (negative)": { file: "src/games/shared/playerIdentity.ts", add: '\nexport const plantInk = { "--color-ring-plant": `oklch(var(--peer-ink-l) 0.11 200deg)` };\n', also: { file: "src/games/shared/gameCell.css", add: "\n.game-cell:has(input:focus-visible) .cell-ghost-path { stroke: var(--color-ring-plant); }\n" }, red: false },
};

export function r1(fe = FE, plant = "none") {
  const P = PLANTS[plant];
  const adds = new Map();
  if (P) for (const x of [P, P.also].filter(Boolean)) adds.set(path.join(fe, x.file), (adds.get(path.join(fe, x.file)) ?? "") + x.add);
  const memo = new Map();
  const read = (f) => memo.get(f) ?? (memo.set(f, fs.readFileSync(f, "utf8") + (adds.get(f) ?? "")), memo.get(f));
  const files = sources(fe);
  const light = new Map(); const dark = new Set(); const paints = new Set();
  const ringLiterals = []; const ringStrokes = [];
  const blocksOf = (f, text) => f.endsWith(".css") ? [{ css: text, line: 1 }] : f.endsWith(".vue") ? sfc(text).styles : f.endsWith(".html") ? [...text.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => ({ css: m[1], line: 1 })) : [];
  const ringRule = (prelude) => subjectHas(prelude, "cell-ghost-path") || subjectHas(prelude, "cell-ghost-retrace") || (/:focus-visible/.test(prelude) && /\.cell-ghost\b/.test(prelude));
  for (const f of files) {
    const text = read(f); const rel = path.relative(fe, f);
    for (const b of blocksOf(f, text)) for (const r of cssRules(b.css, b.line)) {
      if (otherMedia(r.ctx.join(" "))) continue;
      const sels = r.prelude.split(",").map((s) => s.trim());
      for (const d of r.decls) {
        if (d.prop.startsWith("--")) { if (sels.some(isDarkRoot)) dark.add(d.prop); else if (sels.some(isRootSel)) light.set(d.prop, d.value); continue; }
        if (!PAINT.test(d.prop)) continue;
        if (sels.every((s) => /\.dark\b/.test(s))) continue;
        for (const t of varsIn(d.value)) paints.add(t);
        if (ringRule(r.prelude) && /^(stroke|fill)$/.test(d.prop)) {
          for (const c of colorLiterals(d.value.replace(/var\([^)]*\)/g, ""))) if (c.a > 0 && chromaOf(c.rgb) >= CHROMA) ringLiterals.push(`${rel}:${d.line} ${r.prelude} ${d.prop}: ${d.value}`);
          if (d.prop === "stroke") ringStrokes.push(`${r.prelude.replace(/\s+/g, " ")} → ${d.value}`);
        }
      }
    }
    if (f.endsWith(".vue")) for (const m of text.matchAll(/(?:stroke|fill|stop-color|color)\s*[=:]\s*["'`][^"'`]*?var\(\s*(--[\w-]+)/g)) paints.add(m[1]);
  }
  // the ring painted from a template :style / a script write
  for (const cls of ["cell-ghost-path", "cell-ghost-retrace"]) for (const prop of ["stroke", "fill"]) for (const s of census(fe, cls, prop, { files, read }))
    if (!/^sfc|^stylesheet|^public|^index-html/.test(s.kind ?? "")) for (const c of colorLiterals(String(s.value))) if (c.a > 0 && chromaOf(c.rgb) >= CHROMA) ringLiterals.push(`${s.file}:${s.line} ${s.kind} ${prop}: ${s.value}`);
  // script-published tokens (quoted keys, setProperty): every name a publisher writes
  const names = new Set();
  for (const f of files) if (/\.(vue|ts|tsx|js|mjs|json|html)$/.test(f)) for (const m of stripJs(read(f)).matchAll(/(['"`])(--[\w-]+)\1\s*[\]]?\s*[:,]/g)) names.add(m[2]);
  const published = new Map();
  for (const n of names) for (const s of tokenSites(fe, n, { files: files.filter((f) => read(f).includes(n)), read })) if (/key|setProperty|style-index|css-string/.test(s.kind) && !s.unresolved) published.set(n, [...(published.get(n) ?? []), s.value]);
  const valueChroma = (v) => {
    const lit = v.replace(/^(['"`])|(['"`])$/g, "").replace(/\$\{[^}]*\}/g, "0");
    const res = lit.replace(/var\(\s*(--[\w-]+)\s*(?:,[^()]*)?\)/g, (m, t) => (light.has(t) && !/var\(/.test(light.get(t)) ? light.get(t) : "0.5"));
    const c = parseColor(res.trim()) ?? colorLiterals(res)[0];
    return c ? chromaOf(c.rgb) : 0;
  };
  const chromatic = (t, seen = new Set()) => {
    if (seen.has(t)) return false; seen.add(t);
    const vals = [...(light.has(t) ? [light.get(t)] : []), ...(published.get(t) ?? [])];
    return vals.some((v) => valueChroma(v) >= CHROMA || varsIn(v).some((u) => chromatic(u, seen)));
  };
  const hasDarkArm = (t, seen = new Set()) => {
    if (dark.has(t)) return true;
    if (seen.has(t)) return false; seen.add(t);
    const vals = [...(light.has(t) ? [light.get(t)] : []), ...(published.get(t) ?? [])];
    return vals.length > 0 && vals.every((v) => {
      const own = valueChroma(v.replace(/var\([^)]*\)/g, "0.5")) >= CHROMA;
      const refs = varsIn(v);
      if (own) return refs.some((u) => hasDarkArm(u, new Set(seen)));
      const cref = refs.filter((u) => chromatic(u));
      return cref.length > 0 && cref.every((u) => hasDarkArm(u, new Set(seen)));
    });
  };
  const UTIL = ["bg", "text", "border", "ring", "fill", "stroke", "outline", "decoration", "accent", "caret", "divide", "shadow", "from", "via", "to"];
  const markup = files.filter((f) => f.endsWith(".vue")).map((f) => read(f)).join("\n");
  for (const t of [...light.keys(), ...published.keys()]) {
    if (!t.startsWith("--color-")) continue;
    const stem = t.slice(8).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (new RegExp(`(^|[^\\w-])(dark:)?(${UTIL.join("|")})-${stem}(?![\\w-])`).test(markup)) paints.add(t);
  }
  for (let changed = true; changed; ) { changed = false; for (const t of [...paints]) for (const u of varsIn([light.get(t) ?? "", ...(published.get(t) ?? [])].join(" "))) if (!paints.has(u)) (paints.add(u), (changed = true)); }
  const members = [...paints].filter((t) => (light.has(t) || published.has(t)) && chromatic(t)).sort();
  const missing = members.filter((t) => !hasDarkArm(t));
  return { members, missing, ringStrokes, ringLiterals, published: [...published.keys()].sort() };
}

const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  const show = (label, r) => {
    const ok = r.missing.length === 0 && r.ringLiterals.length === 0;
    console.log(`${label}: ${ok ? "GREEN" : "RED"} · ${r.members.length} chromatic tokens paint in both themes; ${r.missing.length} without a dark arm${r.missing.length ? ": " + r.missing.join(", ") : ""}${r.ringLiterals.length ? " · chromatic literals on the ring: " + r.ringLiterals.join(" | ") : ""}`);
    return ok;
  };
  if (process.argv.includes("--self-test")) {
    const r = r1(FE, "none");
    const clean = show("clean", r);
    console.log(`  members: ${r.members.join(" ")}\n  published by script: ${r.published.join(" ")}\n  ring strokes: ${r.ringStrokes.join(" ; ")}`);
    let bad = 0;
    for (const [name, p] of Object.entries(PLANTS)) {
      const g = show(`plant ${name}`, r1(FE, name));
      const as = g === !p.red;
      if (!as) bad++;
      console.log(`  → ${as ? "as required" : "FAILED"}`);
    }
    process.exit(clean && !bad ? 0 : 2);
  }
  const plantArg = process.argv.includes("--plant") ? process.argv[process.argv.indexOf("--plant") + 1] : "none";
  process.exit(show(`R1${plantArg === "none" ? "" : " plant " + plantArg}`, r1(FE, plantArg)) ? 0 : 1);
}
