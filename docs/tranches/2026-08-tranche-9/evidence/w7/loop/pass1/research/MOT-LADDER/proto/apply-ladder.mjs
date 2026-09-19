#!/usr/bin/env node
/** MOT-LADDER prototype: apply the duration ladder inside the throwaway worktree. */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";

const FE = process.argv[2];
const S = (p) => join(FE, "src", p);
let changed = 0;

function edit(path, pairs) {
  const p = S(path);
  let t = readFileSync(p, "utf8");
  for (const [from, to] of pairs) {
    if (!t.includes(from)) throw new Error(`MISS ${path}: ${from.slice(0, 70)}`);
    const n = t.split(from).length - 1;
    if (n !== 1) throw new Error(`AMBIG ${path} (${n}×): ${from.slice(0, 70)}`);
    t = t.replace(from, to);
    changed++;
  }
  writeFileSync(p, t);
}

/* ── 1 · THE LADDER + THE PUBLISHER ─────────────────────────────────────────── */
edit("pencil/config/pencilConfig.ts", [
  [
    `export const MOTION = {
  /** The one beat window every perpetual boil swap lands on (~8Hz). */
  beatMs: 125,`,
    `/** THE DURATION LADDER (T9-W7 §13, T9-M09) — a short closed set of LENGTHS, not
 *  meanings. What a rung is USED for is the call site's business; the ladder only says
 *  how long a thing may take. Six rungs, every one of them a number this product already
 *  ships, so nothing the owner has ruled moves:
 *
 *    whisper 150  the most-used length in the estate (18 sites): a hover, a tape, a hint
 *    leave   200  MOTION.chromeLeaveMs — chrome leaving the page (14 sites)
 *    note    250  a written note arriving (7 sites)
 *    dusk    350  the theme's colour turn (4 sites)
 *    step    440  MOTION.cardStepMs — one card slot (T4-W12 ballot row 4, owner-ratified)
 *    throw   520  MOTION.boardFoldMs + the drawer — a full sheet (audit 4, 2026-07-11)
 *
 *  ABOVE THE LADDER there are five LONG-FORM lengths, and they are NOT rungs: the
 *  wordmark's 1.2s clip write-on, plush-land's 1010ms, the bloom's 800ms, the loader's
 *  1000ms infinite cycle, refuse-shake's 600ms. Each was auditioned as itself; a ladder
 *  that swallowed them would be shortening a deliberate length to make a law tidy, which
 *  the quality law forbids. They stay literals and say so at their call site.
 *
 *  BOTH LAYERS, ONE SOURCE: \`publishMotionRungs\` writes every rung onto the document root
 *  as \`--motion-<rung>\`, so a \`<style>\` block reads \`var(--motion-whisper, 150ms)\` — the
 *  \`--card-step-ms\` precedent (GameGallery.vue:930 → GameCard.vue:411) lifted from one
 *  component to the root and widened to the whole ladder. The fallback in each var() is
 *  the same number, so a rule still paints before the publisher runs. */
const RUNGS = {
  whisper: 150,
  leave: 200,
  note: 250,
  dusk: 350,
  step: 440,
  throw: 520,
} as const;

export const MOTION = {
  /** The one beat window every perpetual boil swap lands on (~8Hz). */
  beatMs: 125,
  /** The ladder itself — see RUNGS above. */
  rungs: RUNGS,`,
  ],
  [`  cardStepMs: 440,`, `  cardStepMs: RUNGS.step,`],
  [`  boardFoldMs: 520,`, `  boardFoldMs: RUNGS.throw,`],
  [
    `  chromeLeaveMs: 200,`,
    `  chromeLeaveMs: RUNGS.leave,
  /** The controls drawer's throw — the sheet, the case, the masthead and the tab counter-
   *  scale on ONE clock (useControlsDrawer's \`GLIDE_MS\`, which lived as a module literal
   *  until this wave and contradicted the covenant three lines below). The 520 is the
   *  audit-4 ruling, unchanged: auditioned 480/520/560 by eye at :3001 (the S3′ retune). */
  drawerGlideMs: RUNGS.throw,`,
  ],
  [
    `} as const;

/** Quantize an interval to whole beats`,
    `} as const;

/** THE ONE PUBLISHER. Writes the ladder onto an element as \`--motion-<rung>\` custom
 *  properties, so the CSS layer and the TS layer can never disagree: there is no second
 *  copy to retune. Called once from main.ts against \`document.documentElement\`, BEFORE
 *  mount, so the first paint already has them; every consumer still carries the rung's own
 *  number as the var() fallback, which is what makes a missed publish a no-op rather than a
 *  zero-length transition. */
export function publishMotionRungs(el: HTMLElement): void {
  for (const [name, ms] of Object.entries(MOTION.rungs))
    el.style.setProperty(\`--motion-\${name}\`, \`\${ms}ms\`);
}

/** Quantize an interval to whole beats`,
  ],
]);

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

/* ── 2 · GLIDE_MS COMES HOME ────────────────────────────────────────────────── */
edit("games/shared/useControlsDrawer.ts", [
  [
    `/** Band-D one-shot — the movers' shared WAAPI clock (scene.css arms no transitions).
 *  520ms: the glass settle wants a touch more breath than the dead spring's 480
 *  (auditioned 480/520/560 by eye at :3001 — the S3′ retune, within Band D). */
const GLIDE_MS = 520;`,
    `/** Band-D one-shot — the movers' shared WAAPI clock (scene.css arms no transitions).
 *  520ms: the glass settle wants a touch more breath than the dead spring's 480
 *  (auditioned 480/520/560 by eye at :3001 — the S3′ retune, within Band D). The number
 *  is unchanged; it now lives where the covenant says timing lives (T9-W7 §13). */
const GLIDE_MS = MOTION.drawerGlideMs;`,
  ],
]);

/* ── 3 · THE 16 INCIDENTAL SITES ────────────────────────────────────────────── */
edit("assets/index.css", [
  // solve-success stroke + shadow: 500 → throw 520 (a LENGTHENING; nothing shortened)
  [`    transition: stroke 500ms;`, `    transition: stroke var(--motion-throw, 520ms) var(--ease-drawOn);`],
  [
    `    transition: box-shadow 500ms;`,
    `    transition: box-shadow var(--motion-throw, 520ms) var(--ease-drawOn);`,
  ],
  // THE DUSK — same 350ms, same five selectors, a house curve instead of the UA default
  [
    `      transition:
        background-color 350ms ease,
        color 350ms ease !important;`,
    `      transition:
        background-color var(--motion-dusk, 350ms) var(--ease-standard),
        color var(--motion-dusk, 350ms) var(--ease-standard) !important;`,
  ],
]);

edit("games/shared/DrawerTab.vue", [
  [
    `  transition: transform 150ms ease-out;
}`,
    `  transition: transform var(--motion-whisper, 150ms) var(--ease-drawOn);
}

/* PRM: the tongue's tilt is a gesture like any other — it collapses to a same-frame swap. */
@media (prefers-reduced-motion: reduce) {
  .drawer-tab-text {
    transition: none;
  }
}`,
  ],
]);

edit("games/shared/GameControlPanel.vue", [
  [
    `    background-color 150ms,
    color 150ms;`,
    `    background-color var(--motion-whisper, 150ms) var(--ease-standard),
    color var(--motion-whisper, 150ms) var(--ease-standard);`,
  ],
  // `all` is banned: the ONLY property that moves here is the hover drop-shadow. The wide
  // form picked up `visibility` during the drawer gesture (R4 §2.2 D8, measured).
  [
    `  transition: all 200ms;`,
    `  transition: filter var(--motion-leave, 200ms) var(--ease-standard);`,
  ],
  [
    `    transition: opacity 150ms;
  }`,
    `    transition: opacity var(--motion-whisper, 150ms) var(--ease-standard);
  }`,
  ],
]);

edit("games/shared/SolverErrorNote.vue", [
  [
    `  transition: background 150ms;`,
    `  transition: background var(--motion-whisper, 150ms) var(--ease-standard);`,
  ],
]);

edit("games/shared/scene.css", [
  [
    `  .controls-card::before {
    transition: opacity 150ms;
  }`,
    `  .controls-card::before {
    transition: opacity var(--motion-whisper, 150ms) var(--ease-standard);
  }`,
  ],
  // the twins, half one: chrome-leave already rides the leave curve — it takes the rung
  [
    `  .app-layout.scene-leaving .scene-controls {
    opacity: 0;
    transition: opacity 200ms var(--ease-fadeOut);`,
    `  .app-layout.scene-leaving .scene-controls {
    opacity: 0;
    transition: opacity var(--motion-leave, 200ms) var(--ease-fadeOut);`,
  ],
  [
    `  html.gallery-leaving .scene-controls {
    opacity: 0;
    transition: opacity 200ms var(--ease-fadeOut);`,
    `  html.gallery-leaving .scene-controls {
    opacity: 0;
    transition: opacity var(--motion-leave, 200ms) var(--ease-fadeOut);`,
  ],
]);

edit("pencil/celestial/DarkModeToggle.vue", [
  [`  transition: transform 200ms ease;`, `  transition: transform var(--motion-leave, 200ms) var(--ease-standard);`],
  [
    `    scale 150ms ease-in,
    opacity 100ms ease-in !important;`,
    `    scale var(--motion-whisper, 150ms) var(--ease-accelIn),
    opacity 100ms var(--ease-accelIn) !important;`,
  ],
  [`  transition: opacity 200ms ease;`, `  transition: opacity var(--motion-leave, 200ms) var(--ease-standard);`],
]);

edit("pencil/chrome/AttributionCard/CrayonHeart.vue", [
  [
    `.face {
  transition: opacity 240ms ease;
}`,
    `.face {
  transition: opacity var(--motion-note, 250ms) var(--ease-standard);
}

/* PRM: the wink is a named gesture, so it collapses to a same-frame swap like the rest. */
@media (prefers-reduced-motion: reduce) {
  .face {
    transition: none;
  }
}`,
  ],
]);

edit("pencil/grid/HandDrawnGrid/HandDrawnGrid.vue", [
  [
    `      stroke-dashoffset 240ms ease,
      opacity 500ms ease;`,
    `      stroke-dashoffset var(--motion-note, 250ms) var(--ease-drawOn),
      opacity var(--motion-throw, 520ms) var(--ease-standard);`,
  ],
]);

edit("pencil/sheet/AnswerKeyLaminate.vue", [
  [
    `  transition: opacity 150ms linear;`,
    `  transition: opacity var(--motion-whisper, 150ms) var(--ease-standard);`,
  ],
]);

edit("pencil/sheet/SheetWashiLabel.vue", [
  [
    `  transition: opacity 150ms;`,
    `  transition: opacity var(--motion-whisper, 150ms) var(--ease-standard);`,
  ],
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

/* ── 4 · THE TWINS, HALF TWO ────────────────────────────────────────────────── */
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
  transition: opacity var(--motion-leave, 200ms) var(--ease-fadeOut);
}`,
  ],
]);

console.log(`applied ${changed} edits`);
