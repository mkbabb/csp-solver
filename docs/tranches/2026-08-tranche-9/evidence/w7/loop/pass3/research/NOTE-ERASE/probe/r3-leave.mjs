/**
 * r3-leave — the leave-class cascade, measured in isolation (T9-W7 §7, pass-3 research).
 *
 * WHY A LAB AND NOT THE PRODUCT: a research lane is read-only on product files, and the four
 * arms below differ only in CSS that does not exist at HEAD. So the estate's OWN Vue
 * (`web/frontend/node_modules/vue/dist/vue.global.js`, 3.5.39 — the same runtime whose
 * `whenTransitionEnds` decides when the node drops) is loaded on `about:blank` and handed the
 * pass-2 build's exact rules. No dev server, no port, no product file read into a page.
 * CTRL-TAPE's pass-3 `@property` probe is the precedent for this shape.
 *
 * THE QUESTION: pass 2 shipped `.note-leave-active { transition: none }` as LOAD-BEARING and
 * the critic measured it never applying (`.margin-note-ink[data-note-age="settled"]` is (0,2,0),
 * the leave class (0,1,0)). Vue then reads a 350ms `transition-duration` off the leaving element
 * and drops the node on a 351ms timeout, while the 150ms rub-out — which declares no fill —
 * has released its pose 200ms earlier. Four arms, one number each.
 *
 *   A  as built (pass 2)                     — the defect
 *   B  + the specificity cure                 — `.ink.note-leave-active[data-note-age]`
 *   C  + the rest pose only                   — `.note-leave-to { clip + opacity }`, no cure
 *   D  both
 *
 * Out: readings/r3-leave-<engine>.json
 */
import { chromium, webkit } from "@playwright/test";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// OUT is relative to THIS file, so a copy of the probe re-points itself (the frozen-record rule).
const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = process.env.R3_OUT ? resolve(process.env.R3_OUT) : resolve(HERE, "../readings");
const FRONTEND =
  process.env.R3_FRONTEND ??
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend";
const VUE = resolve(FRONTEND, "node_modules/vue/dist/vue.global.js");

const BASE_CSS = `
  body { margin: 0; font: 16px/1.3 sans-serif; background: #fbfaf9; color: #262626 }
  @keyframes ink-write-in  { from { clip-path: inset(0 100% 0 0) } to { clip-path: inset(0 0 0 0) } }
  @keyframes ink-rub-out   { from { clip-path: inset(0 0 0 0) } to { clip-path: inset(0 100% 0 0) } }
  @keyframes ink-rub-out-fade { from { opacity: 1 } to { opacity: 0 } }
  .ink { display: inline-block }
  .note-enter-active { animation: ink-write-in 250ms cubic-bezier(0.22,1,0.36,1) backwards }
  .note-leave-active {
    animation:
      ink-rub-out 150ms cubic-bezier(0.55,0.055,0.675,0.19),
      ink-rub-out-fade 150ms cubic-bezier(0.55,0.055,0.675,0.19);
    transition: none;
  }
  .ink[data-note-age="settled"] {
    color: #6a6a6a;
    transition: color 350ms cubic-bezier(0.4,0,0.2,1);
  }
`;

const ARMS = {
  A_as_built: "",
  B_specificity: `.ink.note-leave-active[data-note-age] { transition: none }`,
  C_rest_pose: `.note-leave-to { clip-path: inset(0 100% 0 0); opacity: 0 }`,
  D_both: `.ink.note-leave-active[data-note-age] { transition: none }
           .note-leave-to { clip-path: inset(0 100% 0 0); opacity: 0 }`,
};

const PAGE = (arm) => `<!doctype html><html><head><meta charset="utf-8">
<style>${BASE_CSS}\n${ARMS[arm]}</style></head>
<body><div id="app">
  <p class="region" role="status" aria-live="polite" aria-atomic="true">
    <transition name="note" mode="out-in">
      <span v-if="text" :key="seq" class="ink" :data-note-age="age">{{ text }}</span>
    </transition>
  </p>
</div></body></html>`;

/** One arm: settle a note, retract it, sample every frame. */
async function runArm(page, arm, vueSrc) {
  await page.setContent(PAGE(arm));
  await page.addScriptTag({ content: vueSrc });
  await page.evaluate(() => {
    const { createApp, ref } = window.Vue;
    const app = {
      setup() {
        const text = ref("that's a given clue");
        const seq = ref(1);
        const age = ref("settled"); // the state the note spends most of its life in
        window.__note = { text, seq, age };
        return { text, seq, age };
      },
    };
    createApp(app).mount("#app");
  });
  await page.waitForTimeout(400); // the write-in finishes; the settle rule is resident

  return page.evaluate(
    () =>
      new Promise((resolve) => {
        const region = document.querySelector(".region");
        const read = () => {
          const el = region.querySelector(".ink");
          if (!el) return { present: false };
          const cs = getComputedStyle(el);
          return {
            present: true,
            clip: cs.clipPath,
            op: cs.opacity,
            anim: cs.animationName,
            transDur: cs.transitionDuration,
            transProp: cs.transitionProperty,
          };
        };
        const before = read();
        const samples = [];
        const t0 = performance.now();
        window.__note.text.value = "";
        const tick = () => {
          const t = performance.now() - t0;
          samples.push({ t: +t.toFixed(1), ...read() });
          if (t < 700) requestAnimationFrame(tick);
          else resolve({ before, samples });
        };
        requestAnimationFrame(tick);
      }),
  );
}

function reduce(arm, raw) {
  const { before, samples } = raw;
  const present = samples.filter((s) => s.present);
  const goneIdx = samples.findIndex((s) => !s.present);
  const gone = goneIdx === -1 ? null : samples[goneIdx].t;
  // A frame is "snapped back" when the ink is present, the verb is over (past 150ms) and the
  // cascade has handed the line its full, unclipped pose again.
  const snapped = present.filter(
    (s) => s.t >= 150 && (s.clip === "none" || Number(s.op) > 0.95),
  );
  const rafs = present.map((s, i, a) => (i ? +(s.t - a[i - 1].t).toFixed(1) : null)).slice(1);
  const medRaf = rafs.length
    ? [...rafs].sort((a, b) => a - b)[Math.floor(rafs.length / 2)]
    : null;
  const clipStates = new Set(present.filter((s) => s.t <= 160).map((s) => s.clip));
  return {
    arm,
    beforeTransDur: before.transDur,
    beforeTransProp: before.transProp,
    leaveTransDur: present.length ? present[Math.min(2, present.length - 1)].transDur : null,
    framesPresentAfterVerb: present.filter((s) => s.t >= 150).length,
    snappedFrames: snapped.length,
    snappedSpan: snapped.length ? [snapped[0].t, snapped[snapped.length - 1].t] : null,
    goneAtMs: gone,
    medianRafMs: medRaf,
    distinctClipStatesDuringVerb: clipStates.size,
    lastPresent: present.length ? present[present.length - 1] : null,
  };
}

const engines = { chromium, webkit };
const vueSrc = readFileSync(VUE, "utf8");
mkdirSync(OUT, { recursive: true });

for (const [name, launcher] of Object.entries(engines)) {
  const browser = await launcher.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  const rows = [];
  for (const arm of Object.keys(ARMS)) {
    rows.push(reduce(arm, await runArm(page, arm, vueSrc)));
  }
  await browser.close();
  const out = {
    engine: name,
    vue: JSON.parse(
      readFileSync(resolve(VUE, "../../package.json"), "utf8"),
    ).version,
    rows,
  };
  writeFileSync(`${OUT}/r3-leave-${name}.json`, JSON.stringify(out, null, 2));
  console.log(name, JSON.stringify(rows.map((r) => [r.arm, r.goneAtMs, r.snappedFrames, r.leaveTransDur])));
}
