#!/usr/bin/env node
/**
 * R6 LAW PROBE (T9-W7 round zero) — the house's standing design laws, asserted against the
 * tree rather than remembered. Every row is a one-line law with its cite; the row prints
 * GREEN when the tree still honours it and RED when it does not.
 *
 * Born-RED rows are the point: three of the nine are RED at HEAD and name a cure W7 owns.
 * Read-only — it opens no browser, writes no file, and touches nothing under `src/`.
 *
 *   node docs/tranches/2026-08-tranche-9/evidence/w7/loop/r0/r6-idiom-history/law-probe.mjs
 *
 * Exit 0 when every row that is GREEN at HEAD is still GREEN (the π half); exit 1 when a
 * standing law has been broken. The born-RED rows never fail the run — they are the wave's
 * work, and they flip to GREEN in the cure's own commit.
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

// COPY of r0's probe, re-pointed: the tree under test is argv[2] (this lane's worktree), the
// main tree by default. r0 is never written; the three rebased rows below are MRK-LIVE's
// pass-3 `synthesize/MRK-LIVE/instruments/R6-rebase.diff`, applied HERE.
const FE =
  process.argv[2] ??
  path.join(import.meta.dirname, "../../../../../../../../../../web/frontend");
const read = (rel) => fs.readFileSync(path.join(FE, rel), "utf8");

const rows = [];
/** @param expect 'GREEN' when the law holds at HEAD; 'RED' when this is the wave's work. */
const law = (id, statement, cite, atHead, fn) => {
  let got = false;
  let detail = "";
  try {
    const r = fn();
    got = r === true || (r && r.ok === true);
    detail = (r && r.detail) || "";
  } catch (e) {
    detail = `probe threw: ${e.message}`;
  }
  rows.push({ id, statement, cite, atHead, now: got ? "GREEN" : "RED", detail });
};

// ── π ROWS — GREEN at HEAD, and they must stay GREEN through every W7 cure ─────────────

law(
  "L1",
  "the live-filter population is exactly 9 and the boil budget never grows",
  "filterBudget.ts FILTER_BUDGET_TOTAL, T4-P1 filter-deletion cure",
  "GREEN",
  () => {
    const src = read("src/pencil/config/filterBudget.ts");
    // The four budget groups only — FILL_ALLOWLIST below them is the SECONDARY census and
    // carries its own `count:` rows (reading both was this probe's first bug, banked).
    const budget = src.slice(0, src.indexOf("SECONDARY CENSUS"));
    const counts = [...budget.matchAll(/count:\s*(\d+)/g)].map((m) => +m[1]);
    const total = counts.reduce((a, b) => a + b, 0);
    return { ok: total === 9, detail: `FILTER_BUDGET rows sum to ${total}` };
  },
);

law(
  "L2",
  "the drawer's glass curve is one ruling in two layers, byte-identical",
  "pencilConfig MOTION.curves.drawerGlide + index.css --ease-glassGlide, owner audit 4 2026-07-11",
  "GREEN",
  () => {
    const ts = /drawerGlide:\s*"([^"]+)"/.exec(read("src/pencil/config/pencilConfig.ts"))?.[1];
    // Comments stripped FIRST — the easing ledger names this token in its own prose, and a
    // match that reads the comment reports the paragraph as the curve (banked probe bug).
    const cssSrc = read("src/assets/index.css").replace(/\/\*[\s\S]*?\*\//g, "");
    const css = /--ease-glassGlide:\s*([^;]+);/.exec(cssSrc)?.[1];
    const norm = (s) => (s ?? "").replace(/\s+/g, "");
    return {
      ok: !!ts && norm(ts) === norm(css),
      detail: `TS ${ts} · CSS ${css?.trim()}`,
    };
  },
);

law(
  "L3",
  "no em dash and no unadmitted jargon reaches a reader",
  "check-copy-register.mjs, M16 (owner 2026-08-03)",
  "GREEN",
  () => {
    // MOVED (R6-rebase.diff): the law is the gate's VERDICT, not a count of its source. Run it
    // bare (never piped, `cmd | tail` eats the exit code) and read the numbers it prints.
    const r = spawnSync("node", ["scripts/check-copy-register.mjs"], {
      cwd: FE,
      encoding: "utf8",
    });
    const out = `${r.stdout}\n${r.stderr}`;
    const n = (re) => Number(out.match(re)?.[1] ?? NaN);
    const dashes = n(/(\d+)\s+em/i);
    const jargon = n(/(\d+)\s+jargon/i);
    const unadmitted = n(/(\d+)\s+unadmitted/i);
    const ok = r.status === 0 && dashes === 0 && (jargon === 0 || unadmitted === 0);
    return {
      ok,
      detail: `exit ${r.status}; ${dashes} dashes, ${jargon} jargon hits, ${unadmitted} unadmitted`,
    };
  },
);

law(
  "L4",
  "washi is NEUTRAL tinted paper, one token, redefined per theme, never a hue",
  "index.css --sheet-washi-neutral, SheetWashiLabel.vue, T5 design-union §7.3",
  "GREEN",
  () => {
    const css = read("src/assets/index.css");
    const hits = [...css.matchAll(/--sheet-washi-neutral:\s*color-mix\(([\s\S]*?)\);/g)];
    const chromatic = hits.some((h) => /crayon|ink|#[0-9a-f]{6}/i.test(h[1]));
    return {
      ok: hits.length === 2 && !chromatic,
      detail: `${hits.length} declarations (light + dark), chromatic: ${chromatic}`,
    };
  },
);

law(
  "L5",
  "one box grammar: a drawn frame is HandDrawnOutline, never a CSS border on chrome",
  "HandDrawnOutline.vue; T8-W1 M4 (the guard ribbon's verbs took the drawn box)",
  "GREEN",
  () => {
    const g = read("src/pencil/chrome/GameGallery/GameGallery.vue");
    const drawn = /class="guard-btn guard-keep"[\s\S]{0,400}?HandDrawnOutline/.test(g);
    return { ok: drawn, detail: `guard verbs wear HandDrawnOutline: ${drawn}` };
  },
);

law(
  "L6",
  "the per-player ink is a formula, not a palette: hue = i × 137.5° at a banded lightness",
  "playerIdentity.ts inkFor, index.css --peer-ink-l, T6 mark 13",
  "GREEN",
  () => {
    const p = read("src/games/shared/playerIdentity.ts");
    const css = read("src/assets/index.css");
    const walk = /137\.5/.test(p) && /0\.11/.test(p);
    const band = (css.match(/--peer-ink-l:/g) ?? []).length;
    return { ok: walk && band === 2, detail: `golden-angle walk: ${walk}; --peer-ink-l arms: ${band}` };
  },
);

// ── BORN-RED ROWS — the wave's own work, red at HEAD by construction ────────────────────

law(
  "R1",
  "every chromatic token's comment tells the truth about its themes",
  "index.css --color-focus-sketch:219 — declared once in :root; the comment must say so and carry its readings",
  "RED",
  () => {
    // MOVED (R6-rebase.diff; chair §6.7 ACCEPTED it as the token's value). A token declared ONLY
    // in :root must not claim an arm; a token WITH an arm must name its arm's measured reading.
    // Both directions, so neither a lying comment nor a silent arm passes.
    const css = read("src/assets/index.css");
    const darkAt = css.indexOf("\n.dark");
    const inDark = css.slice(darkAt).includes("--color-focus-sketch:");
    const decl = css.indexOf("--color-focus-sketch:");
    const comment = css.slice(decl, css.indexOf("*/", decl) + 2);
    const claimsArm = /dark mode|at night|\.dark|dark arm/i.test(comment);
    const namesReading = /\d\.\d+\s*(:\s*1|light|dark)/i.test(comment);
    const saysOneValue = /both themes|both regimes|one value|no dark arm/i.test(comment);
    const ok = inDark ? claimsArm && namesReading : namesReading && saysOneValue;
    return {
      ok,
      detail: inDark
        ? `declared in .dark; comment ${claimsArm ? "names the arm" : "is SILENT about it"}, ${namesReading ? "with" : "with NO"} measured reading`
        : `declared ONLY in :root; comment ${saysOneValue ? "says so" : "does not say so"}, ${namesReading ? "with" : "with NO"} measured reading`,
    };
  },
);

law(
  "R2",
  "the copy register's jargon arm reads EVERY rendered string, including a computed accessible name",
  "B1's second string lived at useGameCell.ts (`solver's answer ${…}`); the fold cured it to `revealed answer` and the gate now discovers computed names",
  "RED",
  () => {
    // MOVED (R6-rebase.diff): read the ASSIGNMENT, not the file — the fold's own cure comment
    // records the retired string, and a comment is not a rendered word.
    const raw = read("src/games/shared/useGameCell.ts");
    const cell = raw
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/(^|[^:])\/\/.*$/gm, "$1");
    const shipsIt = /["'`][^"'`\n]*solver's answer/.test(cell);
    const gate = read("scripts/check-copy-register.mjs");
    const armWouldSee = /aria\*|\*Label|accessible name|computed accessible/i.test(gate);
    return {
      ok: !shipsIt || armWouldSee,
      detail: shipsIt
        ? "useGameCell.ts still ASSIGNS `solver's answer` and the gate cannot see a computed name"
        : `string is gone from code (${/solver's answer/.test(raw) ? "a comment still records the cure" : "no trace"}); gate ${armWouldSee ? "reads" : "does NOT read"} computed names`,
    };
  },
);

law(
  "R3",
  "the mobile floating controls bar wears a drawn edge in the house hand",
  "T9-M04 (owner 2026-08-25); GameControlPanel `.action-bar` is a colour-matched slab",
  "RED",
  () => {
    const p = read("src/games/shared/GameControlPanel.vue");
    const bar = /\.action-bar\s*\{([\s\S]*?)\n\}/.exec(p)?.[1] ?? "";
    const hasEdge = /border|HandDrawnOutline/.test(bar);
    return {
      ok: hasEdge,
      detail: hasEdge ? "the bar declares an edge" : "no border, no drawn outline — background + fade only",
    };
  },
);

// ── report ─────────────────────────────────────────────────────────────────────────────

const pad = (s, n) => String(s).padEnd(n);
console.log("R6 LAW PROBE — the house's standing design laws, on THIS tree\n");
console.log(`${pad("id", 4)} ${pad("head", 6)} ${pad("now", 6)} law`);
for (const r of rows) {
  const flag = r.now === r.atHead ? " " : "!";
  console.log(`${pad(r.id, 4)} ${pad(r.atHead, 6)} ${pad(r.now, 6)}${flag}${r.statement}`);
  console.log(`${" ".repeat(19)}cite: ${r.cite}`);
  if (r.detail) console.log(`${" ".repeat(19)}read: ${r.detail}`);
}

const brokenPi = rows.filter((r) => r.atHead === "GREEN" && r.now === "RED");
const bornRed = rows.filter((r) => r.atHead === "RED");
console.log(
  `\n${rows.length} rows · ${rows.length - bornRed.length} standing laws · ${bornRed.length} born-RED` +
    ` (${bornRed.filter((r) => r.now === "RED").length} still red)`,
);
if (brokenPi.length) {
  console.error(`\nBROKEN: ${brokenPi.map((r) => r.id).join(", ")}`);
  process.exit(1);
}
