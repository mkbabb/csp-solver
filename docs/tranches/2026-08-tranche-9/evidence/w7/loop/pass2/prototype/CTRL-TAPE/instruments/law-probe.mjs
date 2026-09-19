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

// COPY of `loop/r0/r6-idiom-history/law-probe.mjs` (T9-W7 pass 2, CTRL-TAPE). The r0 record is
// FROZEN: this file is the copy, re-pointed at THIS LANE'S WORKTREE, and two of its rows are
// re-aimed below. The r0 rows those two came from are reported MOVED, never re-cut in place.
//   `--fe <dir>` overrides the tree; the default is the CTRL-TAPE pass-2 worktree.
const FE = process.argv.includes("--fe")
  ? process.argv[process.argv.indexOf("--fe") + 1]
  : "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-28/web/frontend";
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

// L3, RE-AIMED (the r0 row is reported MOVED). r0 asserted the law by counting `since:` keys
// in the gate's SOURCE — two ADMITTED entries meant "M16 holds". That reads the gate's table,
// not the tree: a new rendered string with an em dash in it leaves the table at two and the
// law broken, and every design pass in this wave adds rendered strings. The honest reading is
// the gate's own EXIT STATUS, which is what CI reads. The admitted count rides along as
// detail, so r0's number is reported rather than lost.
law(
  "L3",
  "no em dash and no unadmitted jargon reaches a reader",
  "check-copy-register.mjs, M16 (owner 2026-08-03) - re-aimed: the gate's exit, not its table",
  "GREEN",
  () => {
    const g = read("scripts/check-copy-register.mjs");
    const admitted = (g.match(/since:\s*"/g) ?? []).length;
    const run = spawnSync(process.execPath, ["scripts/check-copy-register.mjs"], {
      cwd: FE,
      encoding: "utf8",
    });
    const tail = (run.stdout || run.stderr || "").trim().split("\n").slice(-1)[0] ?? "";
    return {
      ok: run.status === 0,
      detail: `gate exit ${run.status} - ${admitted} ADMITTED entries - ${tail.slice(0, 70)}`,
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
  "every chromatic token that paints in BOTH themes carries a dark arm",
  "index.css --color-focus-sketch:219 — its own comment claims 'Dark mode keeps crayon-blue'",
  "RED",
  () => {
    const css = read("src/assets/index.css");
    const darkAt = css.indexOf("\n.dark");
    const inDark = css.slice(darkAt).includes("--color-focus-sketch:");
    return {
      ok: inDark,
      detail: inDark
        ? "declared in .dark"
        : "declared ONLY in :root — the focus ring paints #3a7bc4 at night, and the comment says otherwise",
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
    // R3, RE-AIMED (the r0 row is reported MOVED). r0 looked for `border|HandDrawnOutline`
    // INSIDE the `.action-bar { ... }` CSS block, which can only ever see a CSS border - and a
    // CSS border on chrome is the thing L5 forbids. The house's answer to M04 is a DRAWN edge,
    // which is a component in the TEMPLATE, so the row as written could not go green by any
    // lawful cure. It accepts a template-drawn edge now, and still reports a CSS border if one
    // ever appears, because that is L5's business and this row should not hide it.
    const p = read("src/games/shared/GameControlPanel.vue");
    const tpl = p.slice(p.indexOf("<template>"));
    const barTpl = /class="action-bar"([\s\S]{0,1600})/.exec(tpl)?.[1] ?? "";
    const drawn = /<HandDrawnOutline[\s\S]{0,300}?bar-frame/.test(barTpl);
    const css = /\.action-bar\s*\{([\s\S]*?)\n\}/.exec(p)?.[1] ?? "";
    const cssBorder = /border/.test(css);
    return {
      ok: drawn || cssBorder,
      detail: drawn
        ? "the bar carries a HandDrawnOutline (.bar-frame) in the template"
        : cssBorder
          ? "the bar declares a CSS border (L5 would refuse this)"
          : "no drawn outline and no border",
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
