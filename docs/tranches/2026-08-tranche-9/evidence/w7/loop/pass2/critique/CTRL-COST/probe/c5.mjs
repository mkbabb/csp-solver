#!/usr/bin/env node
/** CTRL-COST critic c5 — THE TWO-TAP, INSTRUMENTED.
 *  c4 row A read chromium dealing on the second tap at the same point and WEBKIT NOT DEALING
 *  (still armed, board unchanged). This probe watches the event grammar on the face while the
 *  same two taps happen, and gives the deal 3.5s to land before calling it.
 *  It also measures THE ARM'S OWN SCROLL from a mid-scroll parking spot (the card not at its
 *  foot), which is the state a reader is actually in when the acts band is on screen.
 */
import fs from "node:fs";
import {
  chromium,
  webkit,
} from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";

const BASE = process.env.BASE || "http://127.0.0.1:4241";
const OUT = process.argv[2] || "./c5.json";

const SIG = () =>
  Array.from(document.querySelectorAll(".game-cell input"))
    .map((i) => i.value || ".")
    .join("");

const TRACE = () => {
  window.__t = [];
  const face = document.querySelector(".deal-face");
  const log = (n, e) =>
    window.__t.push({
      ev: n,
      target: (e.target?.className?.baseVal ?? e.target?.className ?? e.target?.tagName ?? "")
        .toString()
        .slice(0, 34),
      related:
        e.relatedTarget === undefined
          ? "n/a"
          : e.relatedTarget === null
            ? "NULL"
            : (e.relatedTarget.className || e.relatedTarget.tagName || "").toString().slice(0, 34),
      armed: !!document.querySelector(".deal-face .act-word.is-armed.is-shown"),
      t: Math.round(performance.now()),
    });
  for (const n of ["pointerdown", "focusout", "focusin", "click"])
    face.addEventListener(n, (e) => log(n, e), true);
};

async function run(engine, name) {
  const br = await engine.launch();
  const ctx = await br.newContext({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/?size=3&difficulty=EASY`);
  await page.waitForSelector(".controls-card", { state: "attached", timeout: 30000 });
  await page.waitForTimeout(1200);
  if (
    await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))
  ) {
    await page.locator(".drawer-tab").click({ force: true });
    await page.waitForTimeout(950);
  }
  await page.locator('button[aria-label^="Fill in every cell"]').click();
  await page.waitForTimeout(900);

  // ── the mid-scroll park: the acts band fully on screen, the card NOT at its foot.
  const mid = await page.evaluate(() => {
    const c = document.querySelector(".controls-card");
    const f = document.querySelector(".deal-face");
    const fb = f.getBoundingClientRect();
    const cb = c.getBoundingClientRect();
    // bring the face's foot 40px above the card's own foot, then back off 60px of scroll.
    c.scrollTop += fb.bottom - cb.bottom + 40;
    c.scrollTop = Math.max(0, c.scrollTop - 60);
    return c.scrollTop;
  });
  await page.waitForTimeout(600);
  await page.evaluate(TRACE);
  const rd = () =>
    page.evaluate(() => {
      const c = document.querySelector(".controls-card");
      const f = document.querySelector(".deal-face");
      const b = f.getBoundingClientRect();
      return {
        scrollTop: +c.scrollTop.toFixed(2),
        faceY: +b.y.toFixed(2),
        armed: !!document.querySelector(".deal-face .act-word.is-armed.is-shown"),
        focus: (document.activeElement?.className || document.activeElement?.tagName || "")
          .toString()
          .slice(0, 34),
      };
    });
  const sig0 = await page.evaluate(SIG);
  const before = await rd();
  const pt = await page.evaluate(() => {
    const b = document.querySelector(".deal-face .act-verb").getBoundingClientRect();
    return { x: +(b.x + b.width / 2).toFixed(1), y: +(b.y + b.height / 2).toFixed(1) };
  });
  await page.touchscreen.tap(pt.x, pt.y);
  await page.waitForTimeout(800);
  const afterArm = await rd();
  const under = await page.evaluate(
    ([x, y]) => {
      const e = document.elementFromPoint(x, y);
      const btn = e?.closest("button");
      return {
        tag: e?.tagName,
        btn: btn ? btn.getAttribute("aria-label") || btn.className : null,
      };
    },
    [pt.x, pt.y],
  );
  await page.touchscreen.tap(pt.x, pt.y);
  await page.waitForTimeout(3500);
  const afterSecond = await rd();
  const sig1 = await page.evaluate(SIG);
  const trace = await page.evaluate(() => window.__t);
  // THIRD TAP — if the second only re-armed, does a third ever get through?
  await page.touchscreen.tap(pt.x, pt.y);
  await page.waitForTimeout(3500);
  const sig2 = await page.evaluate(SIG);
  const afterThird = await rd();
  await ctx.close();
  await br.close();
  return {
    engine: name,
    parkedAt: mid,
    pt,
    before,
    afterArm,
    armScrollDelta: +(afterArm.scrollTop - before.scrollTop).toFixed(2),
    faceMovedPx: +(afterArm.faceY - before.faceY).toFixed(2),
    underOldPoint: under,
    secondTapDealt: sig0 !== sig1,
    afterSecond,
    thirdTapDealt: sig1 !== sig2,
    afterThird,
    trace,
  };
}

const out = [];
for (const [e, n] of [
  [chromium, "chromium"],
  [webkit, "webkit"],
]) {
  try {
    out.push(await run(e, n));
  } catch (err) {
    out.push({ engine: n, error: String(err).slice(0, 600) });
  }
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
}
console.log("DONE", OUT);
