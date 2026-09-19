/**
 * consumers.mjs — the blast radius of every accent token, derived, never carried.
 *
 * A re-cut needs to know what a token touches BEFORE it moves it, and the estate's own
 * lesson ("numbers are re-derived at citation") applies to a consumer list more than to
 * anything else: `--color-crayon-orange` reads as a live colour token and its only
 * source-level consumer is a STRING in `selectors.ts` that names a CSS class.
 *
 * Three kinds of consumer, counted separately because they fail differently:
 *   VAR   — `var(--color-x)` in a stylesheet or SFC block. Moves with the token.
 *   CLASS — a `crayon-*` utility class name, usually as a data string. Moves with the
 *           token only because `index.css` maps the class to the ink; a re-cut that
 *           renames the token and forgets the class map paints nothing.
 *   HEX   — the literal spelled out. Does not move with the token at all.
 *
 * Run: node consumers.mjs   (writes ../census/consumers.json and prints the table)
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const SRC = process.env.SRC;
const ROOT = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion";
const OUT =
  process.env.ACC_FIVE_OUT ??
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/research/ACC-FIVE/readings/control";

const files = [];
(function walk(d) {
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(vue|ts|css)$/.test(p)) files.push(p);
  }
})(SRC);

const TOKENS = {
  "--color-user-ink": { job: "authorship (yours + every peer's, rebound per cell)" },
  "--color-peer-cursor-ink": { job: "authorship (whose pencil is on this square)" },
  "--peer-ink-l": { job: "authorship (the peer walk's lightness band)" },
  "--color-focus-sketch": { job: "focus (the board's keyboard ring)" },
  "--color-crayon-blue": { job: "selection (the unit wash) + focus fallback" },
  "--color-progress-ink": { job: "progress (the fill meter's trace)" },
  "--color-teacher-red": { job: "danger (conflict ring, hint laminate, failure frame)" },
  "--color-red-ink": { job: "danger (the verdict's words)" },
  "--color-crayon-rose": { job: "danger wax + difficulty HARD" },
  "--color-gold-star": { job: "celebration (the solved frame + sticker)" },
  "--color-gold-ink": { job: "celebration (the verdict's words)" },
  "--color-crayon-gold": { job: "celebration wax (sky, moon, star)" },
  "--color-green-ink": { job: "difficulty EASY (heading + chip)" },
  "--color-orange-ink": { job: "difficulty MEDIUM (heading + chip)" },
  "--color-crayon-green": { job: "difficulty wax EASY" },
  "--color-crayon-orange": { job: "difficulty wax MEDIUM" },
  "--color-solver-ink-1": { job: "answer (rainbow stop 1)" },
  "--color-solver-ink-2": { job: "answer (rainbow stop 2)" },
  "--color-solver-ink-3": { job: "answer (rainbow stop 3)" },
  "--color-solver-ink-4": { job: "answer (rainbow stop 4)" },
  "--color-solver-ink-5": { job: "answer (rainbow stop 5)" },
  "--color-pencil-graphite": { job: "structure (grid, hover ghost, rules)" },
  "--grid-line-color": { job: "structure (the graphite itself)" },
  "--ink-press-rule": { job: "quiet (non-text hairlines, kbd borders)" },
  "--ink-press-quiet": { job: "quiet (caption text)" },
  "--color-ring": { job: "focus (the Tailwind-preflight ring on EVERY control)" },
  "--color-accent": { job: "chrome (hover grounds)" },
  "--color-border": { job: "chrome (borders)" },
  "--color-muted-foreground": { job: "quiet (sublabels; NOT on the ink ramp)" },
};

const HEXES = {
  "#2563eb": "--color-user-ink (light)",
  "#60a5fa": "--color-user-ink (dark)",
  "#8b5cf6": "--color-progress-ink (light)",
  "#7c3aed": "--color-progress-ink (dark) / solver-ink-2 (light)",
  "#c4b5fd": "solver-ink-2 (dark)",
  "#3a7bc4": "--color-focus-sketch",
  "#e8315b": "--color-crayon-rose",
  "#c99a2e": "--color-crayon-gold",
  "#2dc653": "--color-crayon-green",
  "#f4a236": "--color-crayon-orange",
  "#4a90d9": "--color-crayon-blue",
};

const rows = [];
for (const [tok, meta] of Object.entries(TOKENS)) {
  const cls = tok.replace("--color-", "");
  const varHits = [];
  const classHits = [];
  for (const f of files) {
    if (f.endsWith("src/assets/index.css")) continue;
    const t = readFileSync(f, "utf8");
    const lines = t.split("\n");
    lines.forEach((l, i) => {
      if (l.includes(`var(${tok}`) || l.includes(`${tok}:`) || l.includes(`"${tok}"`))
        varHits.push(`${relative(ROOT, f)}:${i + 1}`);
      else if (/^crayon-/.test(cls) && new RegExp(`["'\`]${cls}["'\`]|\\b${cls}\\b`).test(l) && !l.includes("var("))
        classHits.push(`${relative(ROOT, f)}:${i + 1}`);
    });
  }
  rows.push({
    token: tok,
    job: meta.job,
    varConsumers: varHits.length,
    varFiles: Array.from(new Set(varHits.map((h) => h.split(":")[0]))),
    classConsumers: classHits.length,
    classFiles: Array.from(new Set(classHits.map((h) => h.split(":")[0]))),
    sites: varHits.slice(0, 12),
  });
}

const hexRows = [];
for (const [hx, owner] of Object.entries(HEXES)) {
  const hits = [];
  for (const f of files) {
    if (f.endsWith("src/assets/index.css")) continue;
    const t = readFileSync(f, "utf8");
    t.split("\n").forEach((l, i) => {
      if (l.toLowerCase().includes(hx)) hits.push(`${relative(ROOT, f)}:${i + 1}`);
    });
  }
  // the rgb() spelling of the same colour
  const n = parseInt(hx.slice(1), 16);
  const rgb = `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
  for (const f of files) {
    if (f.endsWith("src/assets/index.css")) continue;
    const t = readFileSync(f, "utf8");
    t.split("\n").forEach((l, i) => {
      if (l.includes(rgb)) hits.push(`${relative(ROOT, f)}:${i + 1} (rgb)`);
    });
  }
  if (hits.length) hexRows.push({ hex: hx, owner, sites: hits });
}

writeFileSync(join(OUT, "consumers.json"), JSON.stringify({ rows, hexRows }, null, 2));

console.log("TOKEN                       VAR  CLS  JOB");
for (const r of rows)
  console.log(
    `${r.token.padEnd(26)} ${String(r.varConsumers).padStart(3)}  ${String(r.classConsumers).padStart(3)}  ${r.job}`,
  );
console.log("\nOFF-TOKEN LITERALS (the hex spelled where no token can reach it)");
for (const h of hexRows) console.log(`  ${h.hex}  ${h.owner}\n      ${h.sites.join("\n      ")}`);
