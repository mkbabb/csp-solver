/**
 * NOTE-LEDGER · pass-3 PROTOTYPE probe 3 — L13 (the exit and the rung) and the push, on the
 * REAL element. The act probe's first cut of this row sampled a <p> it had built itself, which
 * carries no `data-v-*` and therefore matches no scoped rule: the row read "none" for a reason
 * that had nothing to do with the cure. Everything here is driven by a real keypress and read
 * off the node Vue is actually removing.
 */
import pw from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/prototype/NOTE-LEDGER/logs";
mkdirSync(OUT, { recursive: true });
const bank = (n, d) => writeFileSync(join(OUT, n), JSON.stringify(d, null, 2));
const PROTO = "http://127.0.0.1:4249/";

async function boardReady(page) {
  await page.goto(PROTO + "?size=3&difficulty=EASY");
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 60000 });
  await page.waitForTimeout(1200);
}
const focusEmpty = (page, n) =>
  page.evaluate((k) => {
    const inputs = [...document.querySelectorAll(".board-cells input")];
    const free = inputs.filter((i) => !i.value && !i.readOnly && !i.disabled);
    free[k]?.focus();
    return free[k] ? inputs.indexOf(free[k]) : -1;
  }, n);
const refuse = (page) =>
  page.evaluate(() => {
    const g = [...document.querySelectorAll(".board-cells input")].find((i) => i.value);
    g?.focus();
    const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
    set.call(g, "7");
    g.dispatchEvent(new Event("input", { bubbles: true }));
  });

/** Install a per-frame sampler that records EVERY `.margin-note-previous` it ever sees. */
const SAMPLER = () => {
  window.__seen = [];
  window.__t0 = performance.now();
  const tick = () => {
    for (const el of document.querySelectorAll(".margin-note-previous")) {
      const cs = getComputedStyle(el);
      window.__seen.push({
        t: Math.round(performance.now() - window.__t0),
        cls: el.className,
        animationName: cs.animationName,
        animationDuration: cs.animationDuration,
        animationTimingFunction: cs.animationTimingFunction,
        animationFillMode: cs.animationFillMode,
        transitionDuration: cs.transitionDuration,
        text: el.textContent.trim().slice(0, 34),
        opacity: cs.opacity,
      });
    }
    window.__raf = requestAnimationFrame(tick);
  };
  tick();
};

async function run(engineName, reduce) {
  const browser = await pw[engineName].launch();
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: engineName === "chromium",
    hasTouch: true,
  });
  const page = await ctx.newPage();
  await page.emulateMedia({
    reducedMotion: reduce ? "reduce" : "no-preference",
    colorScheme: "light",
  });
  await boardReady(page);

  const rungs = await page.evaluate(() => ({
    note: getComputedStyle(document.documentElement).getPropertyValue("--motion-note").trim(),
    whisper: getComputedStyle(document.documentElement)
      .getPropertyValue("--motion-whisper")
      .trim(),
    publisher: !!document.querySelector("style[data-motion-rungs]"),
  }));

  // depth 1 → a record; depth 2 → a refusal pushes it to line two.
  await focusEmpty(page, 0);
  await page.keyboard.press("h");
  await page.waitForTimeout(600);
  await refuse(page);
  await page.waitForTimeout(700);
  const depth2 = await page.evaluate(() => ({
    one: document.querySelector(".board-margin .margin-note")?.textContent?.trim() ?? "",
    two: document.querySelector(".margin-note-previous")?.textContent?.trim() ?? "",
  }));

  // THE PUSH, sampled: arm a second hint. Line two takes the refusal, and the mover animates.
  await page.evaluate(SAMPLER);
  await focusEmpty(page, 1);
  await page.keyboard.press("h");
  // Sample the WAAPI animation on the mover within the push's own window.
  const pushAnims = await page.evaluate(async () => {
    await new Promise((r) => requestAnimationFrame(r));
    await new Promise((r) => requestAnimationFrame(r));
    const two = document.querySelector(".margin-note-previous");
    const one = document.querySelector(".board-margin .margin-note");
    return {
      bodySize: one && parseFloat(getComputedStyle(one).fontSize),
      tagSize: two && parseFloat(getComputedStyle(two).fontSize),
      ratio:
        one && two
          ? Math.round(
              (parseFloat(getComputedStyle(one).fontSize) /
                parseFloat(getComputedStyle(two).fontSize)) *
                1000,
            ) / 1000
          : null,
      anims: two
        ? two.getAnimations().map((a) => {
            const t = a.effect.getComputedTiming();
            return {
              kind: a.constructor.name,
              duration: t.duration,
              fill: t.fill,
              easing: t.easing,
              playState: a.playState,
            };
          })
        : [],
    };
  });
  await page.waitForTimeout(500);
  const restTransform = await page.evaluate(
    () =>
      document.querySelector(".margin-note-previous") &&
      getComputedStyle(document.querySelector(".margin-note-previous")).transform,
  );

  // THE LEAVE: a THIRD record pushes line two off. The sampler is already running.
  await page.evaluate(() => {
    window.__seen = [];
    window.__t0 = performance.now();
    window.__mark = performance.now();
  });
  await focusEmpty(page, 2);
  await page.keyboard.press("h");
  await page.waitForTimeout(600);
  const seen = await page.evaluate(() => {
    cancelAnimationFrame(window.__raf);
    return window.__seen;
  });
  // Compress: the distinct (cls, animationName, duration) states with their first/last t.
  const states = [];
  for (const s of seen) {
    const key = `${s.cls}|${s.animationName}|${s.animationDuration}|${s.transitionDuration}|${s.text}`;
    const last = states.at(-1);
    if (last && last.key === key) {
      last.tEnd = s.t;
      last.frames++;
    } else states.push({ key, ...s, tEnd: s.t, frames: 1 });
  }
  const leaveStates = states.filter((s) => /leave/.test(s.cls));
  const absentAt = await page.evaluate(
    () => document.querySelectorAll(".margin-note-previous.note-previous-leave-active").length,
  );

  const out = {
    engine: engineName,
    reduce,
    rungs,
    depth2,
    push: { ...pushAnims, restTransform },
    leaveStates,
    allStates: states.slice(0, 20),
    leaveActiveNodesAfter600ms: absentAt,
    twoNow: await page.evaluate(
      () => document.querySelector(".margin-note-previous")?.textContent?.trim() ?? null,
    ),
  };
  await ctx.close();
  await browser.close();
  bank(`P3-motion-${engineName}${reduce ? "-reduce" : ""}.json`, out);
  console.log(`motion done ${engineName} reduce=${reduce}`);
}

await run(process.argv[2], process.argv[3] === "reduce");
