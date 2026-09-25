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

// `LAW_FE` re-points the read (a lane runs the probe on its tree, the control and a sibling's
// tree); the relative default is r0's own depth.
const FE = process.env.LAW_FE || path.join(import.meta.dirname, "../../../../../../../../web/frontend");
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
  "the live-filter population never grows past 9 (a ceiling; the census holds the exact set)",
  "filterBudget.ts FILTER_BUDGET_TOTAL, T4-P1 filter-deletion cure",
  "GREEN",
  () => {
    const src = read("src/pencil/config/filterBudget.ts");
    // The four budget groups only — FILL_ALLOWLIST below them is the SECONDARY census and
    // carries its own `count:` rows (reading both was this probe's first bug, banked).
    const budget = src.slice(0, src.indexOf("SECONDARY CENSUS"));
    const counts = [...budget.matchAll(/count:\s*(\d+)/g)].map((m) => +m[1]);
    const total = counts.reduce((a, b) => a + b, 0);
    // The law is "never grows" — a CEILING at 9, the same form the chair gave L3. The exact
    // population is filter-census's job (exact-match allowlist, both directions, on the built
    // dist), so a surface that LEAVES is not a broken law; a surface that ARRIVES still reds here
    // AND in the census. (CTRL-TABS's pass-4 PROPOSED diff, landed by the chair — registry-v4 §8
    // act 3; the lane's plant at 10 read RED.)
    return { ok: total <= 9, detail: `FILTER_BUDGET rows sum to ${total} (ceiling 9)` };
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

// The module's imports are extensionless, the way the bundler writes them (check-peer-arcs's hook).
(await import("node:module")).registerHooks({
  resolve(spec, ctx, next) {
    try {
      return next(spec, ctx);
    } catch (e) {
      if (/^\.\.?\//.test(spec)) return next(`${spec}.ts`, ctx);
      throw e;
    }
  },
});
// L6's module read happens BEFORE the rows (an ESM import is async; `law()` is sync). A tree whose
// playerIdentity.ts cannot be imported reads RED on the formula half, never skipped.
const L6_MOD = await import(path.join(FE, "src/games/shared/playerIdentity.ts")).catch((e) => ({ __err: e.message }));

law(
  "L6",
  "the per-player ink is a FORMULA, not a palette: every string inkFor emits is oklch() of a band " +
    "VAR, its hue the golden step over the arcs RESERVED_ARCS leaves open and its chroma the largest " +
    "sRGB holds at the string's bands (≤ 0.215) — asked of the module's OUTPUT, never of its spellings; " +
    "and every ring ARM index.css publishes, under ANY selector, sits in one of the two theme blocks " +
    "and paints at the section's pair (registry-v4 §2.4, registry-v5 §2.4: OKLab L 0.295 / 0.79)",
  "playerIdentity.ts inkFor/RESERVED_ARCS, index.css ring arms, T6 mark 13, registry-v5 §2.4, pass6/CHAIR-RULINGS §1.4, pass7/CHAIR-RULINGS §2 (WALK's form)",
  "GREEN",
  () => {
    // MOVED (T9-W7 pass 2, re-cut pass 7). Pass 6's formula half grepped `const STEP`,
    // `Math.sqrt(5)` and `function chromaAt`: a fixed oklch() table behind `inkFor`, with those
    // spellings left standing, read GREEN (the pass-6 critic's LA4). The half now asks the module's
    // own output, 288 indices and a negative one, and re-derives every hue and chroma from the
    // arcs and the gamut here — a table that is not the walk disagrees somewhere in 289.
    const css = read("src/assets/index.css").replace(/\/\*[\s\S]*?\*\//g, "");
    let formula = true;
    const why = [];
    if (L6_MOD.__err || typeof L6_MOD.inkFor !== "function" || !Array.isArray(L6_MOD.RESERVED_ARCS)) {
      formula = false;
      why.push(`module unreadable (${L6_MOD.__err ?? "no inkFor / RESERVED_ARCS"})`);
    } else {
      const open = [];
      let cut = 0;
      for (const [a, b] of L6_MOD.RESERVED_ARCS) {
        if (a > cut) open.push([cut, a]);
        cut = Math.max(cut, b);
      }
      if (cut < 360) open.push([cut, 360]);
      const span = open.reduce((s, [a, b]) => s + b - a, 0);
      const step = span * ((3 - Math.sqrt(5)) / 2);
      const hueAt = (i) => {
        let p = (((i * step) % span) + span) % span;
        for (const [a, b] of open) {
          if (p < b - a) return a + p;
          p -= b - a;
        }
        return open.at(-1)[1];
      };
      const inG = (l, c, h) => {
        const A = c * Math.cos((h * Math.PI) / 180);
        const B = c * Math.sin((h * Math.PI) / 180);
        const x = (l + 0.3963377774 * A + 0.2158037573 * B) ** 3;
        const y = (l - 0.1055613458 * A - 0.0638541728 * B) ** 3;
        const z = (l - 0.0894841775 * A - 1.291485548 * B) ** 3;
        return [
          4.0767416621 * x - 3.3077115913 * y + 0.2309699292 * z,
          -1.2684380046 * x + 2.6097574011 * y - 0.3413193965 * z,
          -0.0041960863 * x - 0.7034186147 * y + 1.707614701 * z,
        ].every((v) => v >= -1e-4 && v <= 1.0001);
      };
      const cMax = (h, bands) => {
        if (bands.every((l) => inG(l, 0.215, h))) return 0.215;
        let lo = 0, hi = 0.215;
        for (let k = 0; k < 20; k++) {
          const m = (lo + hi) / 2;
          if (bands.every((l) => inG(l, m, h))) lo = m;
          else hi = m;
        }
        return lo;
      };
      // Each band VAR's pair, read off the SHEET (light arm, dark arm) — the module's tables are the
      // copy check 3 holds; L6 reads what the engine is asked to paint.
      const armOf = (tok) => {
        const d = /\.dark\s*\{([\s\S]*?)\n\}/.exec(css)?.[1] ?? "";
        const light = css.replace(/\.dark\s*\{[\s\S]*?\n\}/, "");
        const num = (t) => Number(new RegExp(`${tok}\\s*:\\s*([\\d.]+)`).exec(t)?.[1]);
        return [num(light), num(d)];
      };
      let bad = 0, first = "";
      for (const i of [...Array(288).keys(), -1]) {
        for (const [key, s] of Object.entries(L6_MOD.inkFor(i))) {
          const m = /^oklch\(var\((--peer-[a-z]+-l)\)\s+([\d.]+)\s+([\d.]+)deg\)$/.exec(s);
          const h = hueAt(i);
          const ok =
            m &&
            Math.abs(Number(m[3]) - h) <= 0.011 &&
            // the chroma is bisected at the EMITTED hue (two decimals, rounded into its arc)
            Math.abs(Number(m[2]) - cMax(Number(m[3]), armOf(m[1]))) <= 6e-5;
          if (!ok) {
            bad++;
            first ||= `i=${i} ${key} = ${s} (walk: ${h.toFixed(2)}°, C ${m ? cMax(h, armOf(m[1])).toFixed(4) : "—"})`;
          }
        }
      }
      if (bad) {
        formula = false;
        why.push(`${bad} string(s) off the walk, first ${first}`);
      }
    }
    // THE PAIR, keyed on SHAPE (the pass-6 critic's LA1–LA3: an arm under `.dark .game-cell`,
    // `html.dark` or `.board-cells` was invisible to a reader of three block names). EVERY rule in
    // the sheet is walked with its at-rule context; every ring-arm declaration found is classified
    // by its rule: exactly `@theme` / `:root` at top level is the light arm, exactly `.dark` at top
    // level the dark one; `@media print` and `forced-colors` are neither and must carry none; ANY
    // other rule carrying a ring arm is a third arm and RED, whatever it paints.
    const rules = [];
    const walkRules = (text, ctx) => {
      let depth = 0, start = 0, open = 0;
      for (let k = 0; k < text.length; k++) {
        if (text[k] === "{") { if (depth++ === 0) open = k; }
        else if (text[k] === "}" && --depth === 0) {
          const prelude = text.slice(start, open).trim().split(/;\s*/).pop().trim().replace(/\s+/g, " ");
          const body = text.slice(open + 1, k);
          if (prelude.startsWith("@") && prelude !== "@theme") walkRules(body, [...ctx, prelude]);
          else rules.push({ ctx, prelude, body: body.replace(/[^{}]*\{[^{}]*\}/g, "") });
          if (!prelude.startsWith("@") || prelude === "@theme") walkRules(body.replace(/^[^{}]*;/, ""), [...ctx, prelude]);
          start = k + 1;
        } else if (text[k] === ";" && depth === 0) start = k + 1;
      }
    };
    walkRules(css, []);
    const lin = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
    const okL = ([r, g, b]) => {
      const [R, G, B] = [r, g, b].map((v) => lin(v / 255));
      const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
      const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
      const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
      return 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
    };
    const lOf = (v) => {
      let m;
      if ((m = /^([\d.]+)$/.exec(v))) return Number(m[1]);
      if ((m = /^oklch\(\s*([\d.]+)(%?)/.exec(v))) return Number(m[1]) / (m[2] ? 100 : 1);
      if ((m = /^#([0-9a-f]{3,8})$/i.exec(v))) {
        const x = m[1].length <= 4 ? [...m[1]].map((c) => c + c).join("") : m[1];
        return okL([0, 2, 4].map((k) => parseInt(x.slice(k, k + 2), 16)));
      }
      if ((m = /^rgba?\(\s*(\d+)[\s,]+(\d+)[\s,]+(\d+)/.exec(v))) return okL([m[1], m[2], m[3]].map(Number));
      return NaN; // an alias or a mix is not a lightness anyone can hold — RED below
    };
    const PAIR = { light: 0.295, dark: 0.79 };
    const TOL = 0.005; // a hex rounds OKLab L by ≤ 0.002
    const RING_ARM = /(--peer-ring-l|--color-peer-[\w-]*ring[\w-]*|--color-peer-cursor-ink)\s*:\s*([^;]+)/g;
    const seen = { light: [], dark: [] };
    const stray = [];
    let pair = true;
    for (const r of rules)
      for (const m of r.body.matchAll(RING_ARM)) {
        const v = m[2].trim();
        const top = r.ctx.length === 0 || (r.ctx.length === 1 && r.ctx[0] === "@theme");
        const theme =
          top && (r.prelude === "@theme" || r.prelude === ":root") ? "light" : top && r.prelude === ".dark" ? "dark" : null;
        if (!theme) {
          stray.push(`${[...r.ctx, r.prelude].join(" ")} { ${m[1]}: ${v} }`);
          continue;
        }
        const L = lOf(v);
        seen[theme].push(`${m[1]} L ${Number.isFinite(L) ? L.toFixed(3) : "unreadable"}`);
        if (!(Math.abs(L - PAIR[theme]) <= TOL)) pair = false;
      }
    if (!seen.light.length || !seen.dark.length || stray.length) pair = false;
    return {
      ok: formula && pair,
      detail:
        `formula (the module's output, 289 indices): ${formula}${why.length ? ` — ${why.join("; ")}` : ""}; ` +
        `ring arms at the pair ${PAIR.light}/${PAIR.dark}: ${pair} — light ${seen.light.join(", ") || "NO ring arm"} · dark ${seen.dark.join(", ") || "NO ring arm"}` +
        (stray.length ? ` · OUTSIDE the two theme blocks: ${stray.join(" | ")}` : ""),
    };
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
    // Re-cut by the chair (registry-v4 §3.19 / §8 act 3): the old `/border|HandDrawnOutline/`
    // passed on `border: none`. The edge must be the house hand — a HandDrawnOutline INSIDE the
    // bar's template box — and the bar's CSS may carry no border longhand with a width > 0 (R6 L5:
    // one box grammar). Comments are stripped first (CTRL-RULE's trap: a comment fools a text law).
    const p = read("src/games/shared/GameControlPanel.vue").replace(/<!--[\s\S]*?-->|\/\*[\s\S]*?\*\//g, "");
    // PROPOSED (CTRL-RULE pass 5). The 1,200-char window GREENS ON THE ACT FACES: `Clear`'s
    // `HandDrawnOutline` sits inside the bar's box on any tree whose verbs wear drawn faces, so
    // deleting the bar's own edge leaves the row GREEN (break-tested on wf_f72f3b5a-83a-28). The
    // EDGE is the bar's own: the first element inside the bar's opening tag, or the one
    // immediately wrapping it — in the house hand, drawn by either of its two components (a
    // closed `HandDrawnOutline`, T9-B13 arm a; one `RuledLine`, arm b — the same pencil-boil
    // wobble the board's grid draws). Comments are stripped above, so a comment can't stand in.
    const first = /<div\b[^>]*\bclass="[^"]*\baction-bar\b[^"]*"[^>]*>\s*<(?:HandDrawnOutline|RuledLine)\b/.test(p);
    const wraps = /<HandDrawnOutline\b[^>]*>\s*<div\b[^>]*\bclass="[^"]*\baction-bar\b/.test(p);
    const drawn = first || wraps;
    const bar = /\.action-bar\s*\{([\s\S]*?)\n\}/.exec(p)?.[1] ?? "";
    // Third re-cut (the chair, pass-6 rulings §1.3, from CTRL-TAPE's critic): every edge-painting
    // longhand counts — physical AND logical borders, `outline`, `box-shadow` (a 0 0 0 Npx spread is
    // a border by another name) and a `background-image` gradient hairline.
    const edgeProp = /\b(?:border(?:-(?:top|right|bottom|left|block|inline|block-start|block-end|inline-start|inline-end))?(?:-width)?|outline(?:-width)?)\s*:\s*(?!0(?:px)?\b|none\b)[^;]*?(?:[1-9][\d.]*(?:px|rem|em)|thin|medium|thick)/.test(bar);
    const shadowEdge = /\bbox-shadow\s*:\s*(?!none\b)[^;]*[1-9][\d.]*(?:px|rem|em)/.test(bar);
    const gradientEdge = /\bbackground(?:-image)?\s*:\s*[^;]*gradient\(/.test(bar);
    const cssBorder = edgeProp || shadowEdge || gradientEdge;
    return {
      ok: drawn && !cssBorder,
      detail: drawn
        ? cssBorder ? "the bar's own drawn edge is present but its CSS also paints an edge (border/outline/box-shadow/gradient — L5 RED)" : "the bar wears its own drawn edge and no CSS edge"
        : "no drawn edge of the bar's own (first child or wrapper) — an act face's outline or a CSS border does not count (L5)",
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
