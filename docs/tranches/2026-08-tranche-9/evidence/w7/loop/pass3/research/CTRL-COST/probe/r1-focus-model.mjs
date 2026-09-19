#!/usr/bin/env node
/** CTRL-COST pass-3 RESEARCH r1 — THE FOCUS MODEL UNDER THE ASK.
 *
 *  The pass-2 critic proved the tier-3 verb never deals in WebKit and named the mechanism
 *  (focusout with `relatedTarget: null` on the next pointerdown → `leftFace` disarms →
 *  the click arrives with `armed === false`). This probe does NOT re-prove that. It measures
 *  the four facts a cure has to be chosen on, read-only, on the pass-2 prototype tree:
 *
 *  A · DOES A PRESS FOCUS THE BUTTON AT ALL in this engine? (WebKit/macOS does not focus a
 *      clicked <button> by default — if true, the arm's `answerEl.focus()` is the ONLY thing
 *      putting focus inside the face on a pointer arm, and not moving it is a cure at source.)
 *  B · THE TRACE WITH `activeElement` AT EVERY EVENT (pass 2 logged `armed`, not focus), so
 *      the rAF-recheck candidate can be evaluated against a real frame rather than a guess.
 *  C · IF NOTHING IN THE FACE IS FOCUSED, does a press fire ANY focusout on the face?
 *      (= does candidate (c) "a pointer arm does not move focus" remove the event entirely?)
 *  D · `focus()` vs `focus({preventScroll:true})` on the answer from a mid-scroll park:
 *      the scrollport delta the critic's row 8 asks to gate.
 *  E · boxes (`.act-face`, `.act-verb`, `.act-answer`) — the 73.59-vs-56 correction.
 *  F · `--tap-floor` read off documentElement vs its real owner (the banked trap).
 */
import fs from "node:fs";
import {
  chromium,
  webkit,
} from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-30/web/frontend/node_modules/playwright/index.mjs";

const BASE = process.env.BASE || "http://127.0.0.1:4233";
const OUT = process.argv[2] || "./r1.json";

const desc = (el) =>
  !el
    ? "NONE"
    : `${el.tagName}.${(el.className?.baseVal ?? el.className ?? "").toString().trim().split(/\s+/).slice(0, 3).join(".")}`;

const TRACE = () => {
  window.__t = [];
  window.__d = (el) =>
    !el
      ? "NONE"
      : `${el.tagName}.${(el.className?.baseVal ?? el.className ?? "").toString().trim().split(/\s+/).slice(0, 3).join(".")}`;
  const face = document.querySelector(".deal-face");
  const log = (n, e) =>
    window.__t.push({
      ev: n,
      target: window.__d(e.target),
      related:
        e.relatedTarget === undefined
          ? "n/a"
          : e.relatedTarget === null
            ? "NULL"
            : window.__d(e.relatedTarget),
      active: window.__d(document.activeElement),
      armed: !!document.querySelector(".deal-face .act-word.is-armed.is-shown"),
      t: Math.round(performance.now()),
    });
  for (const n of ["pointerdown", "focusout", "focusin", "mouseup", "click"])
    face.addEventListener(n, (e) => log(n, e), true);
  // The rAF-recheck candidate, recorded rather than asserted: one frame after the FIRST
  // pointerdown of the run, what does `document.activeElement` read and is it inside the face?
  window.__raf = null;
  face.addEventListener(
    "pointerdown",
    () => {
      if (window.__raf) return;
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          window.__raf = {
            active: window.__d(document.activeElement),
            insideFace: !!document.activeElement && face.contains(document.activeElement),
            armed: !!document.querySelector(".deal-face .act-word.is-armed.is-shown"),
            t: Math.round(performance.now()),
          };
        }),
      );
    },
    true,
  );
};

const SIG = () =>
  Array.from(document.querySelectorAll(".game-cell input"))
    .map((i) => i.value || ".")
    .join("");

async function openCard(page, coarse) {
  await page.goto(`${BASE}/?size=3&difficulty=EASY`);
  await page.waitForSelector(".controls-card", { state: "attached", timeout: 40000 });
  await page.waitForTimeout(1200);
  if (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
    await page.locator(".drawer-tab").click({ force: true });
    await page.waitForTimeout(950);
  }
  // dirty the board so the ask arms
  await page.locator('button[aria-label^="Fill in every cell"]').click();
  await page.waitForTimeout(900);
  // park the acts band on screen, card not at its foot
  await page.evaluate(() => {
    const c = document.querySelector(".controls-card");
    const f = document.querySelector(".deal-face");
    if (!c || !f) return;
    const fb = f.getBoundingClientRect();
    const cb = c.getBoundingClientRect();
    c.scrollTop += fb.bottom - cb.bottom + 40;
    c.scrollTop = Math.max(0, c.scrollTop - 60);
  });
  await page.waitForTimeout(500);
}

const read = (page) =>
  page.evaluate(() => {
    const c = document.querySelector(".controls-card");
    const f = document.querySelector(".deal-face");
    const v = document.querySelector(".deal-face .act-verb");
    const a = document.querySelector(".deal-face .act-answer");
    const r = (el) => {
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return {
        w: +b.width.toFixed(2),
        h: +b.height.toFixed(2),
        x: +b.x.toFixed(2),
        y: +b.y.toFixed(2),
      };
    };
    return {
      scrollTop: +(c?.scrollTop ?? -1).toFixed(2),
      armed: !!document.querySelector(".deal-face .act-word.is-armed.is-shown"),
      active: window.__d
        ? window.__d(document.activeElement)
        : (document.activeElement?.tagName ?? "NONE"),
      face: r(f),
      verb: r(v),
      answer: r(a),
    };
  });

async function run(engine, name, coarse) {
  const br = await engine.launch();
  const ctx = await br.newContext(
    coarse
      ? { viewport: { width: 390, height: 844 }, hasTouch: true, deviceScaleFactor: 2 }
      : { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 },
  );
  const page = await ctx.newPage();
  await openCard(page, coarse);
  await page.evaluate(TRACE);
  const pt = await page.evaluate(() => {
    const b = document.querySelector(".deal-face .act-verb").getBoundingClientRect();
    return { x: +(b.x + b.width / 2).toFixed(1), y: +(b.y + b.height / 2).toFixed(1) };
  });

  // ── C · nothing focused inside the face yet: does the FIRST press fire any focusout on it?
  const before = await read(page);
  const sig0 = await page.evaluate(SIG);
  if (coarse) await page.touchscreen.tap(pt.x, pt.y);
  else await page.mouse.click(pt.x, pt.y);
  await page.waitForTimeout(700);
  const afterArm = await read(page);
  const traceArm = await page.evaluate(() => window.__t.slice());
  const rafArm = await page.evaluate(() => window.__raf);

  // ── B · the second press, with activeElement at every event
  await page.evaluate(() => {
    window.__t = [];
    window.__raf = null;
  });
  if (coarse) await page.touchscreen.tap(pt.x, pt.y);
  else await page.mouse.click(pt.x, pt.y);
  await page.waitForTimeout(3000);
  const afterSecond = await read(page);
  const sig1 = await page.evaluate(SIG);
  const traceSecond = await page.evaluate(() => window.__t.slice());
  const rafSecond = await page.evaluate(() => window.__raf);

  // ── A · does a plain press focus a plain button in this engine?  Measured on a control
  //        the family does not touch (the undo/redo rung's first icon button) so the ask's
  //        own focus move cannot be mistaken for the browser's.
  const plainPress = await page.evaluate(() => null);
  const plain = await (async () => {
    const box = await page.evaluate(() => {
      const b = document
        .querySelector(".band-acts .icon-btn:not(.act-verb), .play-controls .icon-btn")
        ?.getBoundingClientRect();
      return b ? { x: +(b.x + b.width / 2).toFixed(1), y: +(b.y + b.height / 2).toFixed(1) } : null;
    });
    if (!box) return { ok: false };
    if (coarse) await page.touchscreen.tap(box.x, box.y);
    else await page.mouse.click(box.x, box.y);
    await page.waitForTimeout(350);
    return {
      ok: true,
      at: box,
      active: await page.evaluate(() =>
        window.__d ? window.__d(document.activeElement) : document.activeElement?.tagName,
      ),
    };
  })();

  // ── D · focus() vs focus({preventScroll}) on the answer from the same park
  const scrollProbe = await page.evaluate(() => {
    const c = document.querySelector(".controls-card");
    const a = document.querySelector(".deal-face .act-answer");
    if (!c || !a) return null;
    const park = c.scrollTop;
    document.body.focus?.();
    a.focus();
    const afterPlain = c.scrollTop;
    c.scrollTop = park;
    a.blur();
    a.focus({ preventScroll: true });
    const afterPrevent = c.scrollTop;
    c.scrollTop = park;
    return {
      park: +park.toFixed(2),
      plainDelta: +(afterPlain - park).toFixed(2),
      preventDelta: +(afterPrevent - park).toFixed(2),
    };
  });

  // ── F · the token trap
  const tokens = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    const card = document.querySelector(".controls-card");
    const cs = card ? getComputedStyle(card) : null;
    const g = (el, n) => (el ? el.getPropertyValue(n).trim() : "");
    return {
      tapFloorOnRoot: g(root, "--tap-floor"),
      tapFloorOnCard: g(cs, "--tap-floor"),
      pinBandOnCard: g(cs, "--pin-band"),
      costHeadOnCard: g(cs, "--cost-head-h"),
      cardPadTop: cs ? cs.paddingTop : "",
      ringInkOnRoot: g(root, "--ring-ink"),
      motionWhisper: g(root, "--motion-whisper"),
      sheetChromeOnRoot: g(root, "--sheet-chrome"),
    };
  });

  await ctx.close();
  await br.close();
  return {
    engine: name,
    pointer: coarse ? "coarse-390x844" : "fine-1280x800",
    pressFocusesPlainButton: plain,
    before,
    afterArm,
    armFiredFocusoutOnFace: traceArm.filter((r) => r.ev === "focusout").length,
    traceArm,
    rafAfterFirstPointerdown: rafArm,
    afterSecond,
    secondPressDealt: sig0 !== sig1,
    traceSecond,
    rafAfterSecondPointerdown: rafSecond,
    scrollProbe,
    tokens,
    plainPress,
  };
}

const out = [];
for (const [e, n, coarse] of [
  [webkit, "webkit", true],
  [webkit, "webkit", false],
  [chromium, "chromium", true],
  [chromium, "chromium", false],
]) {
  try {
    out.push(await run(e, n, coarse));
  } catch (err) {
    out.push({ engine: n, coarse, error: String(err).slice(0, 700) });
  }
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
}
console.log("DONE", OUT);
