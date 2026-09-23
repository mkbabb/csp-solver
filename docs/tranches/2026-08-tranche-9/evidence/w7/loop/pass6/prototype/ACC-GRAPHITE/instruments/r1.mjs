#!/usr/bin/env node
/**
 * R1, RE-CUT (T9-W7 pass 6, ACC-GRAPHITE; PROPOSED for r0's law probe — the chair lands it).
 * "Every chromatic token that paints in BOTH themes carries a dark arm."
 *
 * The pass-5 re-cut read ONE name (`--color-focus-sketch`) and went GREEN whenever that name was
 * absent (the critic's finding: a tree that deletes the token and paints the ring with any other
 * chromatic hex lacking a dark arm read GREEN). This census reads the LAW'S SHAPE instead:
 *   1. every custom property declared in a LIGHT root scope (`@theme`, bare `:root`/`html`) of
 *      every stylesheet and SFC `<style>` under src/, comments stripped;
 *   2. it PAINTS when a paint property (color, fill, stroke, background, *-color, box-shadow,
 *      stop-color …) or an SVG paint attribute reads it by `var()` anywhere in src/ outside a
 *      dark-only rule, or a Tailwind colour utility minted off it (`text-X`, `bg-X` …) appears
 *      in an SFC, directly or through another painting token's value (alias chains);
 *   3. it is CHROMATIC when its light value is a colour literal with chroma > 0.08, or when it
 *      reaches one through its own var() chain;
 *   4. it CARRIES A DARK ARM when a dark scope (`.dark`, `html.dark`, `:root.dark`) redeclares
 *      it, or when EVERY chromatic var() its light value reads carries one (it flips through
 *      its alias).
 * Literal chromatic colours written straight into a paint property of the focus ring's own rule
 * (`.cell-ghost-path` under `:focus-visible`) are censused too: a ring painted by a hex has no
 * token to carry an arm. The ring's stroke token is printed by name on every run.
 *
 *   node r1.mjs <web/frontend> [--plant ring-token|ring-hex|none] [--self-test]
 * Exit 0 GREEN, 1 RED; --self-test exits 0 when the clean tree's reading is printed and both
 * ring plants RED, 2 otherwise.
 */
import fs from "node:fs";
import path from "node:path";

const FE = path.resolve(process.argv[2] ?? ".");

function files(fe) {
  const out = [];
  const walk = (d) => {
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      const f = path.join(d, e.name);
      if (e.isDirectory()) walk(f);
      else if (/\.(css|vue)$/.test(e.name)) out.push(f);
    }
  };
  walk(path.join(fe, "src"));
  return out;
}

const stripCss = (t) => t.replace(/\/\*[\s\S]*?\*\//g, "");

/** CSS text of a file: the whole file for .css, the `<style>` blocks for .vue (scoped ones too). */
function cssOf(file, text) {
  if (file.endsWith(".css")) return stripCss(text);
  return [...text.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => stripCss(m[1])).join("\n");
}

/** Rules with their context stack: [{ ctx:[preludes], decls:[[prop,value]] }]. */
function rules(css) {
  const out = [];
  const stack = [];
  let buf = "";
  let cur = null;
  const flushDecl = () => {
    const m = buf.match(/^\s*([-\w]+)\s*:\s*([\s\S]+?)\s*$/);
    if (m && cur) cur.decls.push([m[1], m[2].replace(/\s+/g, " ")]);
    buf = "";
  };
  for (const c of css) {
    if (c === "{") {
      stack.push(buf.trim());
      buf = "";
      cur = { ctx: [...stack], decls: [] };
      out.push(cur);
    } else if (c === "}") {
      flushDecl();
      stack.pop();
      cur = out.findLast((r) => r.ctx.length === stack.length && r.ctx.every((p, i) => p === stack[i])) ?? null;
    } else if (c === ";") flushDecl();
    else buf += c;
  }
  return out;
}

const selectorOf = (ctx) => [...ctx].reverse().find((p) => !p.startsWith("@")) ?? (ctx.some((p) => p.startsWith("@theme")) ? ":root" : "");
const inOtherMedia = (ctx) => ctx.some((p) => p.startsWith("@media") && !/prefers-contrast/.test(p));
const isRootSel = (s) => /^(:root|html|:host)([.:][\w-]+)*$/.test(s);
const isDarkRoot = (s) => /^(:root|html)?\.dark([.:][\w-]+)*$/.test(s) || /^(:root|html)\.dark\b/.test(s);

const PAINT = /^(color|fill|stroke|background|background-color|background-image|border(-(top|right|bottom|left|block|inline)(-(start|end))?)?(-color)?|outline(-color)?|box-shadow|text-decoration(-color)?|caret-color|stop-color|flood-color|lighting-color|column-rule-color|accent-color|text-shadow|-webkit-text-stroke(-color)?)$/;

function chroma(v) {
  let m = v.match(/#([0-9a-f]{3,8})\b/i);
  if (m) {
    let h = m[1];
    if (h.length <= 4) h = [...h].map((x) => x + x).join("");
    const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
    return Math.max(r, g, b) - Math.min(r, g, b);
  }
  m = v.match(/rgba?\(\s*([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)/);
  if (m) {
    const [r, g, b] = m.slice(1, 4).map((x) => Number(x) / 255);
    return Math.max(r, g, b) - Math.min(r, g, b);
  }
  m = v.match(/hsla?\(\s*([\d.]+)(?:deg)?[ ,]+([\d.]+)%[ ,]+([\d.]+)%/);
  if (m) {
    const s = Number(m[2]) / 100, l = Number(m[3]) / 100;
    return (1 - Math.abs(2 * l - 1)) * s;
  }
  m = v.match(/oklch\(\s*([\d.]+%?)\s+([\d.]+)/);
  if (m) return Number(m[2]) * 2.5; // oklch C ~0.4 max; scaled so 0.032 C ≈ 0.08
  return 0;
}
const varsIn = (v) => [...v.matchAll(/var\(\s*(--[\w-]+)/g)].map((m) => m[1]);

export function r1(fe = FE, plant = "none") {
  const light = new Map(); // token -> value (last light declaration wins)
  const dark = new Set();
  const paints = new Set();
  const ringLiterals = [];
  const ringStrokes = [];
  const texts = files(fe).map((f) => [f, fs.readFileSync(f, "utf8")]);
  if (plant !== "none") {
    const gc = texts.find(([f]) => f.endsWith(path.join("games", "shared", "gameCell.css")));
    gc[1] +=
      plant === "ring-token"
        ? "\n:root { --color-ring-plant: #3a7bc4; }\n.game-cell:has(input:focus-visible) .cell-ghost-path { stroke: var(--color-ring-plant); }\n"
        : "\n.game-cell:has(input:focus-visible) .cell-ghost-path { stroke: #3a7bc4; }\n";
  }
  for (const [file, text] of texts) {
    const css = cssOf(file, text);
    for (const r of rules(css)) {
      if (inOtherMedia(r.ctx)) continue;
      const sels = selectorOf(r.ctx).split(",").map((s) => s.trim());
      for (const [prop, value] of r.decls) {
        if (prop.startsWith("--")) {
          if (sels.some(isDarkRoot)) dark.add(prop);
          else if (sels.some(isRootSel)) light.set(prop, value);
          continue;
        }
        if (!PAINT.test(prop)) continue;
        if (sels.every((s) => /\.dark\b/.test(s))) continue; // a dark-only rule
        for (const t of varsIn(value)) paints.add(t);
        const ringRule = sels.some((s) => /:focus-visible/.test(s) && /\.cell-ghost-path/.test(s));
        if (ringRule && /^(stroke|fill)$/.test(prop)) {
          if (!/var\(/.test(value) && chroma(value) > 0.08) ringLiterals.push(`${path.relative(fe, file)} ${prop}: ${value}`);
          if (prop === "stroke") ringStrokes.push(`${sels.find((x) => /:focus-visible/.test(x))} → ${value}`);
        }
      }
    }
    // SVG paint attributes and bound strings in templates/scripts
    if (file.endsWith(".vue"))
      for (const m of text.matchAll(/(?:stroke|fill|stop-color|color)\s*[=:]\s*["'`][^"'`]*?var\(\s*(--[\w-]+)/g)) paints.add(m[1]);
  }
  // Tailwind colour utilities minted off a `--color-X` token paint it too (`text-X`, `bg-X` …).
  const UTIL = ["bg", "text", "border", "ring", "fill", "stroke", "outline", "decoration", "accent", "caret", "divide", "shadow", "from", "via", "to"];
  const markup = texts.filter(([f]) => f.endsWith(".vue")).map(([, t]) => t).join("\n");
  for (const t of light.keys()) {
    if (!t.startsWith("--color-")) continue;
    const stem = t.slice(8).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (new RegExp(`(^|[^\\w-])(dark:)?(${UTIL.join("|")})-${stem}(?![\\w-])`).test(markup)) paints.add(t);
  }
  // alias chains: a painting token's value paints what it reads
  for (let changed = true; changed; ) {
    changed = false;
    for (const t of [...paints])
      for (const u of varsIn(light.get(t) ?? "")) if (!paints.has(u)) (paints.add(u), (changed = true));
  }
  const chromatic = (t, seen = new Set()) => {
    if (seen.has(t)) return false;
    seen.add(t);
    const v = light.get(t);
    if (v === undefined) return false;
    return chroma(v.replace(/var\([^)]*\)/g, "")) > 0.08 || varsIn(v).some((u) => chromatic(u, seen));
  };
  const hasDarkArm = (t, seen = new Set()) => {
    if (dark.has(t)) return true;
    if (seen.has(t)) return false;
    seen.add(t);
    const v = light.get(t) ?? "";
    const own = chroma(v.replace(/var\([^)]*\)/g, "")) > 0.08;
    const refs = varsIn(v).filter((u) => chromatic(u));
    return !own && refs.length > 0 && refs.every((u) => hasDarkArm(u, seen));
  };
  const members = [...paints].filter((t) => light.has(t) && chromatic(t)).sort();
  const missing = members.filter((t) => !hasDarkArm(t));
  return { members, missing, ringStrokes, ringLiterals };
}

const isMain = import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  const plantArg = process.argv.includes("--plant") ? process.argv[process.argv.indexOf("--plant") + 1] : "none";
  const show = (label, r) => {
    console.log(`${label}: ${r.members.length} chromatic tokens paint in both themes; ${r.missing.length} without a dark arm${r.missing.length ? ": " + r.missing.join(", ") : ""}`);
    console.log(`  members: ${r.members.join(" ")}`);
    console.log(`  the focus ring's strokes: ${r.ringStrokes.join(" ; ")}${r.ringLiterals.length ? " · chromatic literals in the ring rule: " + r.ringLiterals.join(" | ") : ""}`);
    return r.missing.length === 0 && r.ringLiterals.length === 0;
  };
  if (process.argv.includes("--self-test")) {
    const clean = show("clean", r1(FE, "none"));
    const a = show("plant ring-token (#3a7bc4 in :root only, the ring's stroke)", r1(FE, "ring-token"));
    const b = show("plant ring-hex (the ring's stroke written #3a7bc4)", r1(FE, "ring-hex"));
    console.log(`R1 clean ${clean ? "GREEN" : "RED"} · ring-token plant ${a ? "GREEN — FAILED" : "RED as required"} · ring-hex plant ${b ? "GREEN — FAILED" : "RED as required"}`);
    process.exit(!a && !b ? 0 : 2);
  }
  process.exit(show(`R1 ${plantArg === "none" ? "" : "plant " + plantArg}`, r1(FE, plantArg)) ? 0 : 1);
}
