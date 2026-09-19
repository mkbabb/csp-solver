#!/usr/bin/env node
// T9-W7 pass 3 · CTRL-COST — THE PRESS-COUNT ROW (G14' · G5" · G6' · G15').
//
// Pass 2's blocking row was that the destructive verbs NEVER FIRE IN WEBKIT: the arm's own
// focus() was the only thing putting focus in the face, WebKit's pre-click blur carried a NULL
// relatedTarget, `leftFace` read the null as a departure, and the click arrived disarmed. So
// this probe does not ask "does it arm". It presses TWICE and reads the board.
//
//   pointer   press 1 arms · 0 focusouts land on the face · Δ scrollTop 0.00 · press 2 FIRES
//             (the board's signature CHANGES)
//   keyboard  Enter arms and focus lands on `no` · a second Enter DISARMS with the board
//             unchanged · Shift-Tab back to the verb + Enter DEALS · Escape disarms and the
//             sheet stays
//   boxes     the `no` button clears 44 in BOTH dimensions, with the control that FIRES
//   reflow    the band's and both faces' boxes move [0,0,0,0] between rest and armed
//
// Usage: node r1-focus-model.mjs <base-url> <engine> <viewport 390x844|1280x800> <out.json>
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";

const base = process.argv[2] ?? "http://127.0.0.1:4233";
const engine = process.argv[3] ?? "chromium";
const vp = (process.argv[4] ?? "390x844").split("x").map(Number);
const out = process.argv[5] ?? "/tmp/r1.json";
const touch = vp[0] < 1024;

const browser = await (engine === "webkit" ? webkit : chromium).launch();
const ctx = await browser.newContext({
  viewport: { width: vp[0], height: vp[1] },
  hasTouch: touch,
  isMobile: false,
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();
await page.emulateMedia({ reducedMotion: "reduce" });
await page.goto(`${base}/`);
await page.waitForSelector(".controls-card", { timeout: 25000, state: "attached" });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(400);

// Dirty the board: a tier-3 press only ASKS on a dirty board (that is the ladder's own gate).
// The writable cells are the empty ones; the first `.cell-native-input` that is not readonly
// and holds no digit takes a keystroke and pushes one undo entry.
//
// ON THE PHONE THIS HAPPENS WITH THE SHEET DOWN. The risen sheet covers the board, so a cell
// focused through it takes no key and the probe would measure a PRISTINE board's press — which
// deals at once, and would have read as "the ask does not arm" rather than as the probe's own
// mistake. Pass 2's phone rows were written the other way round.
const dirty = async () => {
  const wasUp = await page.evaluate(
    () => !document.documentElement.classList.contains("drawer-closed"),
  );
  if (touch && wasUp) {
    await page.keyboard.press("Escape").catch(() => {});
    await page.waitForTimeout(900);
  }
  const ok = await page.evaluate(() => {
    const inputs = [...document.querySelectorAll("input.cell-native-input")];
    const free = inputs.find((i) => !i.readOnly && !i.disabled && !i.value);
    if (!free) return false;
    free.focus();
    return true;
  });
  if (ok) {
    await page.keyboard.press("5");
    await page.waitForTimeout(400);
  }
  if (touch) {
    const tab = await page.$(
      ".drawer-tab, .drawer-handle, [aria-controls='controls-drawer']",
    );
    if (tab) await tab.click({ force: true }).catch(() => {});
    await page.waitForTimeout(900); // the dock sheet SLIDES
  }
  return ok;
};
await dirty();

// The focusout tape: every focusout whose target is inside a face, with its relatedTarget.
await page.evaluate(() => {
  window.__tape = [];
  const rec = (t) => (e) => {
    const inFace = e.target instanceof Element && e.target.closest(".act-face");
    window.__tape.push({
      t,
      inFace: !!inFace,
      target: e.target instanceof Element ? e.target.className : String(e.target),
      related:
        e.relatedTarget instanceof Element ? e.relatedTarget.className : String(e.relatedTarget),
      armed: !!document.querySelector(".act-face[data-armed]"),
    });
  };
  for (const t of ["focusin", "focusout", "pointerdown", "click"])
    document.addEventListener(t, rec(t), true);
});

const snap = () =>
  page.evaluate(() => {
    const r2 = (n) => +n.toFixed(2);
    const box = (sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return [r2(r.x), r2(r.y), r2(r.width), r2(r.height)];
    };
    const card = document.querySelector(".controls-card");
    // THE BOARD'S SIGNATURE is the cells' VALUES and their givenness, not their textContent —
    // a digit lives in the cell's native input, so a textContent scan reads every board as the
    // same empty string and a "press 2 fires" row written on it can never fail.
    const digits = [...document.querySelectorAll("input.cell-native-input")]
      .map((i) => `${i.value || "."}${i.readOnly ? "G" : ""}`)
      .join("");
    return {
      band: box("section.cost-band:nth-of-type(3)") ?? box(".deal-face")?.slice(0, 2),
      dealFace: box(".deal-face"),
      clearFace: box(".clear-face"),
      dealAnswer: box(".deal-face .act-answer"),
      armed: !!document.querySelector(".act-face[data-armed]"),
      dealArmed: !!document.querySelector(".deal-face[data-armed]"),
      focus: document.activeElement?.className || document.activeElement?.tagName || "",
      scrollTop: r2(card?.scrollTop ?? 0),
      scrollHeight: card?.scrollHeight ?? 0,
      cardH: card?.clientHeight ?? 0,
      sig: digits.slice(0, 400),
      answerVisible:
        !!document.querySelector(".deal-face .act-answer") &&
        getComputedStyle(document.querySelector(".deal-face .act-answer")).visibility,
    };
  });

const tape = () => page.evaluate(() => window.__tape.splice(0));

const verb = ".deal-face .act-verb";
await page.$eval(verb, (el) => el.scrollIntoView({ block: "center" }));
await page.waitForTimeout(250);

const rest = await snap();
await tape();

// ── POINTER: press 1 ────────────────────────────────────────────────────────────────────
if (touch) await page.tap(verb).catch(async () => page.click(verb));
else await page.click(verb);
await page.waitForTimeout(260);
const armedSnap = await snap();
const armTape = await tape();

// ── POINTER: press 2 — THE ROW ──────────────────────────────────────────────────────────
if (touch) await page.tap(verb).catch(async () => page.click(verb));
else await page.click(verb);
await page.waitForTimeout(900);
const firedSnap = await snap();
const fireTape = await tape();

// ── KEYBOARD, on a fresh dirty board ────────────────────────────────────────────────────
await page.waitForTimeout(700);
await dirty();
await page.$eval(verb, (el) => el.focus());
await page.keyboard.press("Enter");
await page.waitForTimeout(260);
const kbArm = await snap();
await page.keyboard.press("Enter"); // the second Enter lands on `no` → DISARMS
await page.waitForTimeout(260);
const kbSecond = await snap();
// Shift-Tab back to the verb, Enter deals.
await page.$eval(verb, (el) => el.focus());
await page.keyboard.press("Enter");
await page.waitForTimeout(200);
await page.keyboard.press("Escape"); // Escape disarms, the sheet stays
await page.waitForTimeout(300);
const afterEscape = await snap();
const sheetUp = await page.evaluate(() => {
  const d = document.querySelector("#controls-drawer");
  return d ? +d.getBoundingClientRect().top.toFixed(2) : null;
});

const d4 = (a, b) =>
  a && b ? a.map((v, i) => +(b[i] - v).toFixed(2)) : null;

const result = {
  engine,
  viewport: `${vp[0]}x${vp[1]}`,
  pointerClass: touch ? "touch" : "mouse",
  base,
  rest,
  armedSnap,
  firedSnap,
  kbArm,
  kbSecond,
  afterEscape,
  sheetTopAfterEscape: sheetUp,
  rows: {
    press1Arms: armedSnap.dealArmed === true,
    armFocusoutsOnFace: armTape.filter((e) => e.t === "focusout" && e.inFace).length,
    armScrollDelta: +(armedSnap.scrollTop - rest.scrollTop).toFixed(2),
    press2Fires: firedSnap.sig !== armedSnap.sig,
    press2Disarmed: firedSnap.dealArmed === false,
    reflowBand: d4(rest.dealFace, armedSnap.dealFace),
    reflowClear: d4(rest.clearFace, armedSnap.clearFace),
    scrollHeightDelta: armedSnap.scrollHeight - rest.scrollHeight,
    answerBox: armedSnap.dealAnswer
      ? { w: armedSnap.dealAnswer[2], h: armedSnap.dealAnswer[3] }
      : null,
    answerVisibleArmed: armedSnap.answerVisible,
    answerVisibleRest: rest.answerVisible,
    kbArmFocus: kbArm.focus,
    kbSecondDisarms: kbSecond.dealArmed === false && kbSecond.sig === kbArm.sig,
    escapeDisarms: afterEscape.dealArmed === false,
    cardClientHeight: rest.cardH,
  },
  fireTape: fireTape.slice(0, 20),
  armTape: armTape.slice(0, 20),
};

writeFileSync(out, JSON.stringify(result, null, 2));
console.log(
  `${engine} ${vp[0]}x${vp[1]} ${result.pointerClass}  arms ${result.rows.press1Arms}  ` +
    `focusoutsOnFace ${result.rows.armFocusoutsOnFace}  dScroll ${result.rows.armScrollDelta}  ` +
    `press2FIRES ${result.rows.press2Fires}  reflow ${JSON.stringify(result.rows.reflowBand)}  ` +
    `no ${result.rows.answerBox?.w}x${result.rows.answerBox?.h}  ` +
    `kbArmFocus "${result.rows.kbArmFocus}"  kb2Disarms ${result.rows.kbSecondDisarms}  ` +
    `esc ${result.rows.escapeDisarms} sheetTop ${sheetUp}  cardH ${result.rows.cardClientHeight}`,
);
await browser.close();
