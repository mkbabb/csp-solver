#!/usr/bin/env node
/**
 * MOT-LADDER · PASS-1 PROTOTYPE APPLIER (the pass-2 form of the ladder).
 *
 * Replays the research prototype's row-for-row choices (the 16 incidental curves, the twins,
 * the dusk, the three PRM arms, `transition: all` narrowed) and then the synthesis delta:
 * the three band keys DIE (no aliases), six TS consumers read `MOTION.rungs.*`, the whole
 * script class (every duration position whose value is unchanged or lengthens ≤5%) is
 * re-pointed by rule, `.sparkle-icon` and AttributionCard gain reduce arms.
 *
 * Two halves, both fail-loud:
 *   §A  anchored structural edits (config, publisher, TS consumers, PRM arms, curves)
 *   §B  the position-aware rung rewriter over every remaining duration position
 *
 * Run: node apply-ladder-pass2.mjs <path-to-web/frontend>
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import process from "node:process";

const FE = process.argv[2];
if (!FE) throw new Error("usage: apply-ladder-pass2.mjs <web/frontend>");
const S = (p) => join(FE, "src", p);
let structural = 0;

function edit(path, pairs) {
  const p = S(path);
  let t = readFileSync(p, "utf8");
  for (const [from, to] of pairs) {
    const n = t.split(from).length - 1;
    if (n !== 1) throw new Error(`${n === 0 ? "MISS" : `AMBIG (${n}×)`} ${path}: ${from.slice(0, 80)}`);
    t = t.replace(from, to);
    structural++;
  }
  writeFileSync(p, t);
}

/* ══ §A · STRUCTURAL ═══════════════════════════════════════════════════════════ */

/* A1 · THE HOME — the ladder replaces the three band keys, rulings and all. */
edit("pencil/config/pencilConfig.ts", [
  [
    `  /** Carousel card-step glide (T4-W12) — a keyboard/button step of the gallery
   *  track rides the ONE glass curve (\`curves.drawerGlide\`) as a WAAPI FLIP transform
   *  at this duration, one clock, monotone, zero overshoot. A shorter throw than the
   *  drawer's 520ms ceiling (a card step travels one slot, not a full sheet): 440ms,
   *  auditioned by eye at the local preview, inside the glass band. Lands HERE, not as
   *  a mover-local literal, per the wave covenant (no new timing constants outside
   *  pencilConfig). PRM collapses the glide to an instant snap (no tween).
   *
   *  RATIFY-ME (T4-W12 ballot row 4): the card-step glide duration. 440ms auditioned at
   *  the Wave-D preview (:4788) against 380/440/520 — 380 read clipped for a one-slot
   *  throw, 520 (the drawer's full-sheet ceiling) dragged for the shorter travel; 440
   *  is the settled read, monotone on the glass curve with zero overshoot (\`snap-glide-
   *  trace.json\`). Inside the glass band, no new named curve. */
  cardStepMs: 440,
  /** Board⇄card FOLD (T4-W12 Wave C) — the gallery entry folds the live board INTO the
   *  center card (and the exit unfolds it back) as a classic FLIP on the ONE glass curve
   *  (\`curves.drawerGlide\`) via the extracted \`useFlipGlide\` engine. A FULL-sheet throw
   *  (board → card-face, not one card slot), so it takes the drawer's glass ceiling 520ms
   *  — longer than the 440ms card-step. Lands HERE, not as an App-local literal, per the
   *  covenant (no timing constants outside pencilConfig). PRM cuts it (same-frame swap). */
  boardFoldMs: 520,
  /** BEAT 0 — chrome leaves (T4-W12 Wave C2 §ENTRY). The gallery entry opens by fading the
   *  scene's controls/drawer out on the EXISTING scene-leaving beat (scene.css, 200ms) — the
   *  board itself never erases (we fold it, not discard it). This is that band, so the fold
   *  begins as the chrome clears. Matches scene.css's \`.scene-leaving\` fade; lands HERE per
   *  the covenant. PRM skips it (same-frame cut, no fade, no delay). */
  chromeLeaveMs: 200,`,
    `  /** THE DURATION LADDER (T9-W7 §13 · M09) — a short closed set of LENGTHS, not
   *  meanings. What a rung is spent on is the call site's business; the ladder only says
   *  how long a thing may take. Six rungs, every one a number this product already ships,
   *  so nothing the owner ruled moves. A call site reads as a sentence:
   *  \`opacity var(--motion-leave, 200ms) var(--ease-fadeOut)\` — "leave, fading out".
   *
   *    whisper 150  the estate's most-used length (19 positions): a hover, a tape, a hint.
   *                 No prior ruling; the ladder ratifies what shipped.
   *    leave   200  chrome leaving the page — was \`chromeLeaveMs\` (T4-W12 Wave C2 §ENTRY,
   *                 the beat-0 window App holds \`html.gallery-leaving\` for). Both declared
   *                 twins ride it: scene.css's chrome fade and the deck's dissolve.
   *    note    250  a written note arriving (MarginNote, SolverErrorNote, the vignette).
   *    dusk    350  the theme's colour turn (index.css, T3-W10 disposition keep).
   *    step    440  one card slot — was \`cardStepMs\`. RATIFY-ME T4-W12 ballot row 4:
   *                 auditioned 380/440/520 at the Wave-D preview; 380 read clipped, 520
   *                 dragged for a one-slot travel.
   *    throw   520  a full sheet — was \`boardFoldMs\` and useControlsDrawer's GLIDE_MS
   *                 literal. Audit 4, 2026-07-11: auditioned 480/520/560 by eye at :3001,
   *                 the glass family's settle. The board fold, the drawer's four movers and
   *                 the mobile dock all spend it; the dock's 628px at 520ms is 1208 px/s,
   *                 the desk's own speed (1256 chromium / 1198 webkit).
   *
   *  NOT ON THE LADDER — 25 positions in two cited classes, the ADMITTED ledger in
   *  \`scripts/check-motion-bands.mjs\`, closed both ways. CHARACTER (14): a keyframed
   *  gesture auditioned whole — the dark toggle's eight beats, cell-reveal, the eraser
   *  scrub, sharePop, refuse-shake, the loader's loop, the wordmark's 1.2s write-on. The
   *  ladder governs a gesture's LENGTH, never its interior. GRADED (11): a set whose
   *  differences ARE the design — the player rows ("a return is lighter than an arrival",
   *  40ms), the laminate's lay-down against its lift, \`--draw-dur\`'s own default, the focus
   *  ring's 180ms. Delays are a separate axis (11 positions) and are not laddered here.
   *
   *  THE CHOREOGRAPHY the marks asked to see defined — no value moves:
   *    gallery IN   beat 0  chrome leaves              leave · --ease-fadeOut
   *                 beat 1  board + wordmark fold      throw · glass   (at +leave)
   *                 beat 2  the deal                   —               (at +0.42·throw)
   *    gallery OUT  board + wordmark unfold            throw · glass
   *                 the deck's leave-only dissolve     leave · --ease-fadeOut
   *    card step    track FLIP + three card faces      step  · glass
   *    drawer       sheet · case · masthead · tab      throw · glass, ONE WAAPI clock
   *    dock <1024   the sheet alone, 628px             throw (inherited, not a 7th rung)
   *    dusk         the five narrowed selectors        dusk  · --ease-standard
   *
   *  BOTH LAYERS, ONE SOURCE: \`publishMotionRungs\` writes every rung onto the document
   *  root as \`--motion-<rung>\`, so a <style> block reads \`var(--motion-whisper, 150ms)\`.
   *  The fallback is the same number, so a missed publish is a no-op rather than a page of
   *  zero-length transitions, and the gate holds every fallback byte-equal to its rung.
   *  There is NO @theme copy and no per-component publisher: a second home is a retune
   *  waiting to happen (the \`--card-step-ms\` publisher this replaces was exactly that). */
  rungs: {
    whisper: 150,
    leave: 200,
    note: 250,
    dusk: 350,
    step: 440,
    throw: 520,
  },`,
  ],
  [
    `} as const;

/** Quantize an interval to whole beats`,
    `} as const;

/** THE ONE PUBLISHER. Writes the ladder onto an element as \`--motion-<rung>\` custom
 *  properties, so the CSS layer and the TS layer can never disagree: there is no second
 *  copy to retune. Called once from main.ts against \`document.documentElement\` BEFORE
 *  mount — html, not the app root, because the dusk's \`html.theme-turning body\` selector
 *  sits above \`.page-root\` and must inherit it. */
export function publishMotionRungs(el: HTMLElement): void {
  for (const [name, ms] of Object.entries(MOTION.rungs))
    el.style.setProperty(\`--motion-\${name}\`, \`\${ms}ms\`);
}

/** Quantize an interval to whole beats`,
  ],
]);

/* A2 · main.ts publishes before mount. */
edit("main.ts", [
  [
    `import { createApp } from "vue";
import App from "./App.vue";
import "./assets/index.css";

createApp(App).mount("#app");`,
    `import { createApp } from "vue";
import App from "./App.vue";
import { publishMotionRungs } from "@pencil/config/pencilConfig";
import "./assets/index.css";

// The duration ladder reaches CSS from ONE place, before the first paint (T9-W7 §13).
publishMotionRungs(document.documentElement);

createApp(App).mount("#app");`,
  ],
]);

/* A3 · the six TS consumers read the rung, each keeping its ruling at the site. */
edit("App.vue", [
  [
    `const foldCtl = useFlipGlide({ durationMs: MOTION.boardFoldMs });`,
    `// A full sheet: the board folds into the card face on the throw rung (was boardFoldMs).
const foldCtl = useFlipGlide({ durationMs: MOTION.rungs.throw });`,
  ],
  [`  }, MOTION.chromeLeaveMs);`, `  }, MOTION.rungs.leave);`],
  [`\`html.gallery-leaving\`, MOTION.chromeLeaveMs)`, `\`html.gallery-leaving\`, MOTION.rungs.leave)`],
]);
edit("games/shared/scene.css", [
  [
    `App holds \`html.gallery-leaving\` for the beat-0 window (MOTION.chromeLeaveMs), then the fold`,
    `App holds \`html.gallery-leaving\` for the beat-0 window (MOTION.rungs.leave), then the fold`,
  ],
]);
edit("pencil/chrome/GameGallery/useCarouselGlide.ts", [
  [
    `const GLIDE_MS = MOTION.cardStepMs;`,
    `/** One card slot, the step rung (was MOTION.cardStepMs — T4-W12 ballot row 4). */
const GLIDE_MS = MOTION.rungs.step;`,
  ],
]);
edit("games/shared/useControlsDrawer.ts", [
  [
    `import { computed, nextTick, ref, watch } from "vue";
`,
    `import { computed, nextTick, ref, watch } from "vue";

import { MOTION } from "@pencil/config/pencilConfig";
`,
  ],
  [
    `/** Band-D one-shot — the movers' shared WAAPI clock (scene.css arms no transitions).
 *  520ms: the glass settle wants a touch more breath than the dead spring's 480
 *  (auditioned 480/520/560 by eye at :3001 — the S3′ retune, within Band D). */
const GLIDE_MS = 520;`,
    `/** Band-D one-shot — the movers' shared WAAPI clock (scene.css arms no transitions).
 *  520ms: the glass settle wants a touch more breath than the dead spring's 480
 *  (auditioned 480/520/560 by eye at :3001 — the S3′ retune, within Band D). The number
 *  is unchanged; it now lives where the covenant says a length lives (T9-W7 §13). */
const GLIDE_MS = MOTION.rungs.throw;`,
  ],
]);
edit("pencil/chrome/GameGallery/GameGallery.vue", [
  [`const base = Math.round(MOTION.boardFoldMs * 0.42);`, `const base = Math.round(MOTION.rungs.throw * 0.42);`],
  // the per-component publisher dies: the ladder is published once, from main.ts
  [
    `    :style="{ '--card-step-ms': \`\${MOTION.cardStepMs}ms\` }"
`,
    ``,
  ],
]);
edit("pencil/chrome/GameGallery/GameCard.vue", [
  [
    `    transform var(--card-step-ms, 440ms) var(--ease-glassGlide),
    opacity var(--card-step-ms, 440ms) var(--ease-glassGlide);`,
    `    transform var(--motion-step, 440ms) var(--ease-glassGlide),
    opacity var(--motion-step, 440ms) var(--ease-glassGlide);`,
  ],
]);

/* A4 · the twins ride one curve (the deck leaves the glass glide for the leave curve). */
edit("App.vue", [
  [
    `/* The deck's leave-only dissolve — the twin of BEAT 0's chrome-leave, on the same clock. */
.gallery-fade-leave-active {
  transition: opacity 200ms var(--ease-glassGlide);
}`,
    `/* The deck's leave-only dissolve — the twin of BEAT 0's chrome-leave, on the same clock
   AND, from T9-W7 §13, on the same curve. It was the one declared twin riding two curves:
   BEAT 0 leaves on \`--ease-fadeOut\` (the house's leave curve — things accelerate off the
   page) and this rode the glass glide, whose job is a sheet arriving. One leave, one curve. */
.gallery-fade-leave-active {
  transition: opacity 200ms var(--ease-fadeOut);
}`,
  ],
]);

/* A5 · `transition: all` dies — the only property that ever moves there is the hover
   drop-shadow, and the wide form caught `visibility` during the drawer gesture (measured
   at HEAD under PRM reduce: 1 animation, `visibility 200ms ease`). */
edit("games/shared/GameControlPanel.vue", [
  [`  transition: all 200ms;`, `  transition: filter 200ms;`],
  // the residue the research named: narrowing fixed the leak, not the arm
  [
    `@media (prefers-reduced-motion: reduce) {
  .legend-fold {
    transition: none;
  }
}`,
    `@media (prefers-reduced-motion: reduce) {
  .legend-fold {
    transition: none;
  }

  /* The sparkle's glow is a gesture like any other: same-frame swap, no fade. */
  .sparkle-icon {
    transition: none;
  }
}`,
  ],
]);

/* A6 · the three files that ship a transition with no reduce arm at all — plus the fourth
   this lane's own B5 turned up (AttributionCard's hover card, R4 §5 missed it). */
edit("games/shared/DrawerTab.vue", [
  [
    `  transition: transform 150ms ease-out;
}`,
    `  transition: transform 150ms ease-out;
}

/* PRM: the tongue's tilt is a gesture like any other — it collapses to a same-frame swap. */
@media (prefers-reduced-motion: reduce) {
  .drawer-tab-text {
    transition: none;
  }
}`,
  ],
]);
edit("pencil/chrome/AttributionCard/CrayonHeart.vue", [
  [
    `.face {
  transition: opacity 240ms ease;
}`,
    `.face {
  transition: opacity 240ms ease;
}

/* PRM: the wink is a named gesture, so it collapses to a same-frame swap like the rest. */
@media (prefers-reduced-motion: reduce) {
  .face {
    transition: none;
  }
}`,
  ],
]);
edit("pencil/sheet/SheetWashiLabel.vue", [
  [
    `  z-index: 50;
}`,
    `  z-index: 50;
}

/* PRM: the tape appears without a fade. */
@media (prefers-reduced-motion: reduce) {
  .washi-label {
    transition: none;
  }
}`,
  ],
]);
edit("pencil/chrome/AttributionCard/AttributionCard.vue", [
  [
    `.hover-card::before {`,
    `/* PRM: the card is there or it is not — the fade and the lift both collapse, and the
   visibility hand-off stays on its own zero clock. */
@media (prefers-reduced-motion: reduce) {
  .hover-card,
  .hover-card.is-open {
    transition: none;
  }
}

.hover-card::before {`,
  ],
]);

/* ══ §B · THE RUNG REWRITER ════════════════════════════════════════════════════ */

const RUNGS = { whisper: 150, leave: 200, note: 250, dusk: 350, step: 440, throw: 520 };
/** A script row may keep its value or LENGTHEN by ≤5% (below the ~10% duration JND). */
const TOLERANCE = 0.05;
/** Positions the ADMITTED ledger holds — cited by the value they spend in that file. */
const ADMITTED_MS = new Map([
  ["src/pencil/celestial/DarkModeToggle.vue", [100, 120, 300, 340, 800, 1010]],
  ["src/assets/index.css", [300, 600, 160]],
  ["src/games/shared/GameControlPanel.vue", [400, 500, 320, 380, 280, 260]],
  ["src/pencil/chrome/ScribbleLoader.vue", [1000]],
  ["src/pencil/chrome/HandwrittenLogo/HandwrittenLogo.vue", [1200]],
  ["src/pencil/sheet/AnswerKeyLaminate.vue", [280]],
  ["src/games/shared/gameCell.css", [180]],
]);
/** The 16 incidental declarations (i2's RED list) and the house curve each one implies. */
const CURVES = {
  "src/assets/index.css:590": ["drawOn"],
  "src/assets/index.css:607": ["drawOn"],
  "src/assets/index.css:667": ["standard", "standard"],
  "src/games/shared/DrawerTab.vue:144": ["drawOn"],
  "src/games/shared/GameControlPanel.vue:1956": ["standard", "standard"],
  "src/games/shared/GameControlPanel.vue:2082": ["standard"],
  "src/games/shared/GameControlPanel.vue:2132": ["standard"],
  "src/games/shared/SolverErrorNote.vue:97": ["standard"],
  "src/games/shared/scene.css:378": ["standard"],
  "src/pencil/celestial/DarkModeToggle.vue:717": ["standard"],
  "src/pencil/celestial/DarkModeToggle.vue:873": ["accelIn", "accelIn"],
  "src/pencil/celestial/DarkModeToggle.vue:976": ["standard"],
  "src/pencil/chrome/AttributionCard/CrayonHeart.vue:329": ["standard"],
  "src/pencil/grid/HandDrawnGrid/HandDrawnGrid.vue:588": ["drawOn", "standard"],
  "src/pencil/sheet/AnswerKeyLaminate.vue:271": ["standard"],
  "src/pencil/sheet/SheetWashiLabel.vue:109": ["standard"],
};

const DECL = /(transition|animation)([a-z-]*):\s*([^;{}]+);/g;
const RUNG_VAR = /var\(\s*--motion-([A-Za-z]+)\s*(?:,\s*(\d+(?:\.\d+)?m?s)\s*)?\)/g;
const OTHER_VAR = /var\(\s*--[A-Za-z-]+\s*(?:,\s*(\d+(?:\.\d+)?m?s)\s*)?\)/g;
const BARE = /(?<![\w-])(ease-in-out|ease-out|ease-in|ease|linear)(?![\w-(])/;
const toMs = (n, u) => (u === "s" ? Number(n) * 1000 : Number(n));

function rungFor(ms) {
  for (const [name, v] of Object.entries(RUNGS)) if (v === ms) return name;
  for (const [name, v] of Object.entries(RUNGS))
    if (v > ms && (v - ms) / ms <= TOLERANCE) return name; // lengthen only, ≤5%
  return null;
}

function* walk(dir) {
  for (const name of readdirSync(dir).sort()) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name === "dev") continue; // the debug rig is not shipped
      yield* walk(p);
    } else if (/\.(vue|css)$/.test(name)) yield p;
  }
}

const moved = [];
const left = [];
for (const file of walk(join(FE, "src"))) {
  const rel = relative(FE, file);
  let text = readFileSync(file, "utf8");
  const edits = [];
  for (const m of [...text.matchAll(DECL)]) {
    const [whole, kw, suffix, body] = m;
    const prop = kw + suffix;
    const line = text.slice(0, m.index).split("\n").length;
    const head = text.slice(text.lastIndexOf("\n", m.index) + 1, m.index).trim();
    if (head.startsWith("*") || head.startsWith("//") || head.startsWith("/*")) continue;
    const at = `${rel}:${line}`;
    const admitted = ADMITTED_MS.get(rel) ?? [];
    const curves = CURVES[at] ?? null;
    const hasHouseCurve = /var\(--ease-/.test(body);

    // mask var()s so their commas never split a clause
    const toks = [];
    let masked = body.replace(RUNG_VAR, (s) => {
      toks.push(s);
      return ` ${toks.length - 1} `;
    });
    masked = masked.replace(OTHER_VAR, (s) => {
      toks.push(s);
      return ` ${toks.length - 1} `;
    });

    let touched = false;
    const clauses = masked.split(",").map((clause, ci) => {
      let seen = 0;
      let out = clause.replace(/(?<![\w.-])(\d+(?:\.\d+)?)(ms|s)(?![\w-])/g, (raw, n, u) => {
        if (seen++ > 0) return raw; // a 2nd time in a clause is a DELAY — a separate axis
        const ms = toMs(n, u);
        if (ms <= 1) return raw; // a 0s hand-off / the PRM nuke: not a length
        if (admitted.includes(ms)) {
          left.push(`${at} ${ms}ms ADMITTED`);
          return raw;
        }
        const rung = rungFor(ms);
        if (!rung) {
          left.push(`${at} ${ms}ms NO RUNG`);
          return raw;
        }
        touched = true;
        moved.push({ at, from: ms, to: RUNGS[rung], rung, prop });
        return `var(--motion-${rung}, ${RUNGS[rung]}ms)`;
      });
      // the incidental class: the declaration carries no house curve, so give it the one
      // its motion implies — a bare UA keyword is replaced, a bare clause gains a token.
      if (curves && !hasHouseCurve) {
        const curve = curves[ci];
        if (!curve) throw new Error(`CURVE TABLE short at ${at} clause ${ci}: ${clause}`);
        touched = true;
        out = BARE.test(out)
          ? out.replace(BARE, `var(--ease-${curve})`)
          : out.replace(/(\s*!important)?\s*$/, ` var(--ease-${curve})$1`);
      }
      return out;
    });
    if (!touched) continue;
    const newBody = clauses.join(",").replace(/ (\d+) /g, (_s, i) => toks[Number(i)]);
    edits.push({ start: m.index, end: m.index + whole.length, text: `${prop}: ${newBody};` });
  }
  for (const e of edits.reverse()) text = text.slice(0, e.start) + e.text + text.slice(e.end);
  if (edits.length) writeFileSync(file, text);
}

console.log(`§A structural edits : ${structural}`);
console.log(`§B rung re-points   : ${moved.length}`);
const lengthened = moved.filter((m) => m.to !== m.from);
console.log(`   exact            : ${moved.length - lengthened.length}`);
console.log(`   lengthened ≤5%   : ${lengthened.length}  ${lengthened.map((m) => `${m.from}→${m.to}`).join(" ")}`);
console.log(`   shortened        : ${moved.filter((m) => m.to < m.from).length}`);
console.log(`§B left in place    : ${left.length}`);
for (const l of left) console.log(`     · ${l}`);
