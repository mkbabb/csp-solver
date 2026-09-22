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

// pass-4 copy (MRK-ABS): FE=<tree>/web/frontend is REQUIRED; R1 re-pointed below, all else verbatim.
const FE = process.env.FE;
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
    const g = read("scripts/check-copy-register.mjs");
    // The law is UNADMITTED = 0; an ADMITTED row is a debt with a cure's seam, and the count
    // may only ever FALL. Pinning it at 2 made the probe red on the commit that paid it
    // (T9-W7 · B1/B1b at the fold `74a2b5d9`). The ceiling stays, the floor goes. The count
    // also reads the ADMITTED ARRAY, not every `since:` in the file — the self-test's
    // synthetic stale-admission fixture is not a standing debt. (CTRL-COST's pass-3 PROPOSED
    // diff, landed by the chair — registry-v3 §2.12; pass4/CHAIR-RULINGS.md §1.)
    const table = /const ADMITTED = \[([\s\S]*?)\n\];/.exec(g)?.[1] ?? "";
    const admitted = (table.match(/since:\s*"/g) ?? []).length;
    return { ok: admitted <= 2, detail: `${admitted} ADMITTED entries standing (of B1's two)` };
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
  // MOVED (pass4 CHAIR-RULINGS §1.3; MRK-LIVE pass-4 README §1.10 wording). The r0 sentence
  // ("every chromatic token that paints in BOTH themes carries a dark arm") is superseded for
  // this token: the chair accepted the ONE-value token as its value (pass3 chair §6.7).
  "`--color-focus-sketch` is declared once, at :root, with no theme arm; its comment states the painted reading it was chosen on and names which figures are arithmetic",
  "index.css --color-focus-sketch — MRK-LIVE's rebased wording, booked by the chair (pass4 §1.3)",
  "RED",
  () => {
    const css = read("src/assets/index.css");
    const decls = [...css.matchAll(/--color-focus-sketch:/g)].map((m) => m.index);
    const darkAt = css.indexOf("\n.dark");
    const inDark = decls.some((i) => i > darkAt);
    const at = decls[0] ?? -1;
    const comment = at < 0 ? "" : css.slice(at, css.indexOf("*/", at));
    const painted = /painted/i.test(comment);
    const statistic = /\b(worst|median)\b/i.test(comment);
    const arithmetic = /arithmetic/i.test(comment);
    const ok = decls.length === 1 && !inDark && painted && statistic && arithmetic;
    return {
      ok,
      detail: `declarations ${decls.length}, in .dark ${inDark}; comment: painted ${painted}, statistic named ${statistic}, arithmetic named ${arithmetic}`,
    };
  },
);

law(
  "R2",
  "the copy register's jargon arm reads EVERY rendered string, including a computed accessible name",
  "B1's second string lives at useGameCell.ts:153 (`solver's answer ${…}`), outside the arm's corpus",
  "RED",
  () => {
    const cell = read("src/games/shared/useGameCell.ts");
    const shipsIt = /solver's answer/.test(cell);
    const gate = read("scripts/check-copy-register.mjs");
    // The arm reads template text, static RENDERED_ATTRS, COPY_KEYS object literals and
    // NARRATION_CALLS. A `computed(() => …)` that becomes an `:aria-label` is none of those.
    const armWouldSee = /useGameCell|computed|ariaLabel/.test(
      /const COPY_KEYS[\s\S]*?\];/.exec(gate)?.[0] ?? "",
    );
    return {
      ok: !shipsIt || armWouldSee,
      detail: shipsIt
        ? "useGameCell.ts ships `solver's answer` into an aria-label and the gate's corpus cannot reach it"
        : "string is gone",
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
