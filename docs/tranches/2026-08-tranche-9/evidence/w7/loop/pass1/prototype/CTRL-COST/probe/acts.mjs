#!/usr/bin/env node
/**
 * CTRL-COST PROTOTYPE · THE LADDER'S ACTS — G5 (what a press costs) and G6 (the confirm moves
 * nothing), measured on the real surface in both engines.
 *
 *   G5  tier 3 (`deal` / `clear`) on a DIRTY board: one press writes 0 cells and arms with TWO
 *       visible answers (`sure?` in the red, `no` under it). Tier 2 (`fill`, then `solve` after
 *       its reveal wave settles): the press writes N and ONE undo REACHABLE IN THE SAME POSE
 *       restores the board string exactly. Where that undo lives, and whether it is inert, is
 *       recorded — amendment A is the whole reason the row exists.
 *   G6  arm/disarm moves nothing: `getBoundingClientRect` on the `starting over` band and on
 *       BOTH faces before and after arming, plus the card's scrollHeight, Δ [0,0,0,0] / Δ 0.
 *   §8  tap counts from the PLAYING pose (sheet shut) at 390×844 and 844×390: `reach` is the
 *       presses needed to get to the control, `presses` is reach + the act's own press.
 *
 * Usage: node acts.mjs <acts.json> <zero-reflow.json> <taps.json>
 */
import fs from "node:fs";
import { chromium, webkit } from "playwright";

const BASE = process.env.BASE || "http://127.0.0.1:4233";
const [OUT_ACTS, OUT_REFLOW, OUT_TAPS] = process.argv.slice(2);

const CELLS = [
  { name: "desk-1280x800-coarse", w: 1280, h: 800, coarse: true, fine: false },
  { name: "desk-1280x800", w: 1280, h: 800, coarse: false, fine: true },
  { name: "dock-390x844", w: 390, h: 844, coarse: true, fine: false },
  { name: "land-900x500", w: 900, h: 500, coarse: true, fine: false },
];

// THE BOARD'S DIGITS ARE THE PER-CELL NATIVE INPUTS' VALUES — the gridcell's own text is
// empty (the ink is drawn SVG, and `role="gridcell"` carries no label), so a board string read
// off `innerText` OR `textContent` reports every act as writing nothing. Measured: the first
// two runs of this probe read `fill wrote 0` while the inputs went 9,_,6,_,4,_ → 9,3,6,8,4,5.
// `.cell-native-input` is the estate's own entry surface (`e2e/access.spec.ts:311`).
const boardString = (page) =>
  page.evaluate(() =>
    Array.from(document.querySelectorAll(".cell-native-input"))
      .map((i) => i.value || "")
      .join("|"),
  );

async function load(page, open) {
  await page.goto("./?size=3&difficulty=EASY");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.waitForSelector(".controls-card", { state: "attached", timeout: 30000 });
  await page.waitForSelector("g.boil-frame-layer.is-active", {
    state: "attached",
    timeout: 30000,
  });
  await page.waitForTimeout(1200);
  const shut = await page.evaluate(() =>
    document.documentElement.classList.contains("drawer-closed"),
  );
  if (open && shut) {
    await page.locator(".drawer-tab").click({ force: true });
    await page.waitForTimeout(950);
  }
  return { shut };
}

const press = async (page, sel) => {
  const el = page.locator(sel).first();
  await el.scrollIntoViewIfNeeded().catch(() => {});
  await el.click({ force: true });
};

/** The armed face, read: the shown word, its colour and weight, the answer's visibility. */
const readFace = (sel) =>
  ((s) => {
    const btn = document.querySelector(s);
    const shown = Array.from(btn.querySelectorAll(".act-word")).filter(
      (w) => getComputedStyle(w).visibility === "visible" && +getComputedStyle(w).opacity > 0.5,
    );
    const answer = btn.querySelector(".act-answer");
    return {
      words: shown.map((w) => ({
        text: w.innerText.trim(),
        color: getComputedStyle(w).color,
        weight: getComputedStyle(w).fontWeight,
      })),
      noVisible: !!answer && getComputedStyle(answer).visibility === "visible",
      aria: btn.getAttribute("aria-label"),
    };
  })(sel);

const rects = () => {
  const r = (s) => {
    const el = document.querySelector(s);
    if (!el) return null;
    const b = el.getBoundingClientRect();
    return [+b.x.toFixed(2), +b.y.toFixed(2), +b.width.toFixed(2), +b.height.toFixed(2)];
  };
  const card = document.querySelector(".controls-card");
  return {
    band: r(".cost-band:has(.deal-btn)") ?? r(".deal-btn"),
    deal: r(".deal-btn"),
    clear: r(".clear-btn"),
    scrollH: card.scrollHeight,
  };
};
const dEq = (a, b) => (a && b ? a.map((v, i) => +(b[i] - v).toFixed(2)) : null);

async function measure(page, cell, engine) {
  const acts = {};
  const S0 = await boardString(page);

  // ── TIER 2 · fill writes, and ONE undo IN THE SAME POSE puts it back ────────────────────
  await press(page, 'button[aria-label^="Fill in every cell"]');
  await page.waitForTimeout(1600);
  const S1 = await boardString(page);
  const wrote = S0.split("|").filter((c, i) => c !== S1.split("|")[i]).length;
  const undoHome = await page.evaluate(() => {
    const u = document.querySelector('button[aria-label="Undo last move"]');
    if (!u) return { present: false };
    const band = u.closest(".cost-band")?.querySelector(".section-heading")?.innerText.trim();
    const r = u.getBoundingClientRect();
    const mid = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2);
    return {
      present: true,
      inert: !!u.closest("[inert]"),
      home: band ?? (u.closest(".fold-tools") ? "the fold's ribbon" : "—"),
      box: [+r.x.toFixed(1), +r.y.toFixed(1), +r.width.toFixed(1), +r.height.toFixed(1)],
      hit: !!mid && (mid === u || u.contains(mid)),
    };
  });
  await press(page, 'button[aria-label="Undo last move"]');
  await page.waitForTimeout(700);
  acts.fill = { wrote, undo: undoHome, restored: (await boardString(page)) === S0 };

  // ── TIER 3 · a dirty board must be dirty first: fill again, then ask ────────────────────
  await press(page, 'button[aria-label^="Fill in every cell"]');
  await page.waitForTimeout(1600);
  const dirty = await boardString(page);

  const reflow = {};
  for (const [act, sel] of [
    ["deal", ".deal-btn"],
    ["clear", ".clear-btn"],
  ]) {
    // SCROLL FIRST, THEN READ: `press` scrolls the face into view, and a rect read before that
    // scroll measures the scroll, not the arm (the first run of this probe reported a 229px
    // "reflow" that was the card scrolling under a click helper).
    await page
      .locator(sel)
      .first()
      .scrollIntoViewIfNeeded()
      .catch(() => {});
    await page.waitForTimeout(250);
    const before = await page.evaluate(rects);
    await press(page, sel);
    await page.waitForTimeout(300);
    const armed = await page.evaluate(readFace, sel);
    const after = await page.evaluate(rects);
    const wroteNow = (await boardString(page)) === dirty ? 0 : 1;
    if (act === "deal") {
      reflow.armedShows = {
        word: armed.words.map((w) => w.text),
        no: armed.noVisible ? "visible" : "hidden",
      };
      reflow.bandDelta = dEq(before.band, after.band);
      reflow.dealDelta = dEq(before.deal, after.deal);
      reflow.clearDelta = dEq(before.clear, after.clear);
      reflow.scrollHDelta = after.scrollH - before.scrollH;
    }
    // the second answer: `no` is a press on the same button, and it must disarm, not act
    await press(page, `${sel} .act-answer`);
    await page.waitForTimeout(250);
    const rest = await page.evaluate(readFace, sel);
    if (act === "deal") {
      const back = await page.evaluate(rects);
      reflow.disarmBandDelta = dEq(before.band, back.band);
      reflow.disarmScrollHDelta = back.scrollH - before.scrollH;
    }
    acts[act] = {
      wrote: wroteNow,
      armed: {
        words: armed.words,
        noVisible: armed.noVisible,
        aria: armed.aria,
      },
      answersVisible: armed.words.length + (armed.noVisible ? 1 : 0),
      disarmedByNo: rest.words.map((w) => w.text).join() !== "sure?" && !rest.noVisible,
    };
  }

  // ── TIER 2 · solve, after its reveal wave settles ───────────────────────────────────────
  const beforeSolve = await boardString(page);
  await press(page, 'button[aria-label="Solve puzzle"]');
  let prev = "";
  let stableSince = Date.now();
  const t0 = Date.now();
  // A 5s FLOOR under the stability rule: the wave is a worker round trip and then a per-cell
  // reveal, and "stable for 1s" fires at 1.25s on a board that has not started writing yet —
  // which is how a solve that works reads as `wrote 0` (measured, twice).
  for (;;) {
    await page.waitForTimeout(250);
    const now = await boardString(page);
    if (now !== prev) {
      prev = now;
      stableSince = Date.now();
    }
    const settled = Date.now() - stableSince > 1000 && Date.now() - t0 > 5000;
    if (settled || Date.now() - t0 > 20000) break;
  }
  const afterSolve = await boardString(page);
  const solveWrote = beforeSolve
    .split("|")
    .filter((c, i) => c !== afterSolve.split("|")[i]).length;
  await press(page, 'button[aria-label="Undo last move"]');
  await page.waitForTimeout(800);
  acts.solve = {
    wrote: solveWrote,
    settleMs: Date.now() - t0,
    // A solve that wrote nothing records nothing (`useGameState.ts:687` is inside
    // `if (cellsToAnimate.size > 0)`), so the undo row is N/A rather than failed: the press
    // that follows undoes whatever came BEFORE the solve.
    restored: solveWrote === 0 ? null : (await boardString(page)) === beforeSolve,
    undoRowApplies: solveWrote > 0,
  };
  return { acts, reflow, engine, cell: cell.name };
}

/** Tap counts from the PLAYING pose (sheet shut). */
const tapCounts = () => {
  const named = {
    undo: 'button[aria-label="Undo last move"]',
    redo: 'button[aria-label="Redo move"]',
    hint: 'button[aria-label^="Reveal a hint"]',
    peek: ".peek-chip",
    fill: 'button[aria-label^="Fill in every cell"]',
    solve: 'button[aria-label="Solve puzzle"]',
    deal: ".deal-btn",
    clear: ".clear-btn",
    share: ".share-btn, button[aria-label^='Share board']",
  };
  const out = {};
  for (const [act, sel] of Object.entries(named)) {
    const el = document.querySelector(sel);
    if (!el) {
      out[act] = { reach: 1, presses: 2, why: "not in the playing pose" };
      continue;
    }
    const r = el.getBoundingClientRect();
    const onScreen =
      r.width > 0 && r.top >= 0 && r.bottom <= innerHeight && r.left >= 0 && r.right <= innerWidth;
    const inert = !!el.closest("[inert]");
    const mid = onScreen ? document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2) : null;
    const hit = !!mid && (mid === el || el.contains(mid) || mid.contains(el));
    const reachable = onScreen && !inert && hit;
    out[act] = {
      reach: reachable ? 0 : 1,
      presses: reachable ? 1 : 2,
      onScreen,
      inert,
    };
  }
  return out;
};

const actsOut = {};
const reflowOut = {};
const tapsOut = {};
for (const [engine, type] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const browser = await type.launch();
  for (const cell of CELLS) {
    const ctx = await browser.newContext({
      viewport: { width: cell.w, height: cell.h },
      hasTouch: cell.coarse,
      isMobile: cell.coarse && engine === "chromium",
      deviceScaleFactor: 1,
      baseURL: BASE,
    });
    const page = await ctx.newPage();
    await load(page, true);
    const r = await measure(page, cell, engine);
    const key = `${cell.name}-${engine}`;
    actsOut[key] = r.acts;
    reflowOut[key] = r.reflow;
    console.log(key, JSON.stringify(r.acts));
    console.log(key, "reflow", JSON.stringify(r.reflow));
    await ctx.close();
  }
  // tap counts in the PLAYING pose, the two phone poses
  for (const [name, w, h] of [
    ["phone-390x844", 390, 844],
    ["phone-844x390", 844, 390],
  ]) {
    const ctx = await browser.newContext({
      viewport: { width: w, height: h },
      hasTouch: true,
      isMobile: engine === "chromium",
      deviceScaleFactor: 1,
      baseURL: BASE,
    });
    const page = await ctx.newPage();
    await load(page, false);
    tapsOut[`${name}-${engine}`] = await page.evaluate(tapCounts);
    console.log(`${name}-${engine}`, JSON.stringify(tapsOut[`${name}-${engine}`]));
    await ctx.close();
  }
  await browser.close();
}
fs.writeFileSync(OUT_ACTS, JSON.stringify(actsOut, null, 1));
fs.writeFileSync(OUT_REFLOW, JSON.stringify(reflowOut, null, 1));
fs.writeFileSync(OUT_TAPS, JSON.stringify(tapsOut, null, 1));
console.log("wrote", OUT_ACTS, OUT_REFLOW, OUT_TAPS);
