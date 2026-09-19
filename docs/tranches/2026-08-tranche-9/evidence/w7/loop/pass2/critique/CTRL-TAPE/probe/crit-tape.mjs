/**
 * T9-W7 pass 2 · CRITIQUE · CTRL-TAPE — the adversarial re-measure.
 * node crit-tape.mjs <out.json> <chromium|webkit> <port>
 */
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
import { writeFileSync } from "node:fs";

const OUT = process.argv[2];
const ENGINE = process.argv[3] || "chromium";
const PORT = process.argv[4] || "4234";
const BASE = `http://127.0.0.1:${PORT}`;

async function loadBoard(page) {
  await page.goto("/?size=3&difficulty=EASY");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 40000 });
  await page.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 40000 });
  await page.waitForTimeout(900);
}

const TAPES = () => {
  const card = document.querySelector(".controls-card");
  if (!card) return { err: "no card" };
  const cs = getComputedStyle(card);
  const cb = card.getBoundingClientRect();
  const padTop = parseFloat(cs.paddingTop) || 0;
  const exempt = cb.top + card.clientTop + padTop;
  const rows = [];
  for (const t of card.querySelectorAll(".washi-tag")) {
    const s = getComputedStyle(t);
    const r = t.getBoundingClientRect();
    const fs = parseFloat(s.fontSize);
    const lh = parseFloat(s.lineHeight);
    const pad = parseFloat(s.paddingTop) + parseFloat(s.paddingBottom);
    const tilt = parseFloat(s.getPropertyValue("--washi-tilt")) || 0;
    // the un-rotated line box the pin band's derivation models
    const honest = lh + pad;
    rows.push({
      text: (t.textContent || "").trim(),
      tag: t.tagName,
      pos: s.position,
      released: t.hasAttribute("data-released"),
      w: +r.width.toFixed(2),
      h: +r.height.toFixed(2),
      tiltDeg: +tilt.toFixed(2),
      fontSize: +fs.toFixed(3),
      lineHeight: +lh.toFixed(3),
      honestH: +honest.toFixed(2),
      rotGrowth: +(r.height - honest).toFixed(2),
      predictedRot: +(r.width * Math.abs(Math.sin((tilt * Math.PI) / 180))).toFixed(2),
      below: +(r.bottom - exempt).toFixed(2),
    });
  }
  return {
    padTop: +padTop.toFixed(2),
    pinBand: cs.getPropertyValue("--pin-band").trim(),
    tagH: cs.getPropertyValue("--washi-tag-h").trim(),
    rung: cs.getPropertyValue("--washi-tag-rung").trim(),
    scrollPadTop: cs.scrollPaddingTop,
    scrollPadBottom: cs.scrollPaddingBottom,
    cardTop: +cb.top.toFixed(2),
    exempt: +exempt.toFixed(2),
    rows,
  };
};

/** widen every tape's text and force the seeder's max tilt; re-read `below`. */
const STRESS = (deg) => {
  const card = document.querySelector(".controls-card");
  const cs = getComputedStyle(card);
  const cb = card.getBoundingClientRect();
  const exempt = cb.top + card.clientTop + (parseFloat(cs.paddingTop) || 0);
  const out = [];
  for (const t of card.querySelectorAll(".washi-tag")) {
    t.style.setProperty("--washi-tilt", `${deg}deg`);
  }
  for (const t of card.querySelectorAll(".washi-tag")) {
    const r = t.getBoundingClientRect();
    out.push({
      text: (t.textContent || "").trim(),
      w: +r.width.toFixed(2),
      h: +r.height.toFixed(2),
      below: +(r.bottom - exempt).toFixed(2),
    });
  }
  return out;
};

/** focus-scroll: does a keyboard-focused control park clear of the pin band? */
const FOCUSPARK = () => {
  const card = document.querySelector(".controls-card");
  const cs = getComputedStyle(card);
  const cb = card.getBoundingClientRect();
  const padTop = parseFloat(cs.paddingTop) || 0;
  const exempt = cb.top + card.clientTop + padTop;
  const ctrls = [
    ...card.querySelectorAll('button, [role="button"], [tabindex]:not([tabindex="-1"])'),
  ].filter((e) => {
    const b = e.getBoundingClientRect();
    return b.width > 4 && b.height > 4;
  });
  const results = [];
  for (const el of ctrls) {
    card.scrollTop = 0;
    el.focus();
    const b = el.getBoundingClientRect();
    // how far the control's TOP sits below the exempt line (negative = inside the band)
    const clear = +(b.top - exempt).toFixed(2);
    if (clear < 24) {
      // check what a pinned tape does to it
      let worst = 0;
      let who = null;
      for (const t of card.querySelectorAll(".washi-tag")) {
        const s = getComputedStyle(t);
        if (s.position !== "sticky" || t.hasAttribute("data-released")) continue;
        const tr = t.getBoundingClientRect();
        const w = Math.max(0, Math.min(tr.right, b.right) - Math.max(tr.left, b.left));
        const h = Math.max(0, Math.min(tr.bottom, b.bottom) - Math.max(tr.top, b.top));
        if (w * h > worst) {
          worst = w * h;
          who = (t.textContent || "").trim();
        }
      }
      results.push({
        label: (el.getAttribute("aria-label") || el.textContent || "").trim().slice(0, 22),
        clear,
        scrollTop: +card.scrollTop.toFixed(1),
        tapeOverlapPx: +worst.toFixed(1),
        tape: who,
        sentinelOn: card.hasAttribute("data-fold-above"),
      });
    }
  }
  return { padTop: +padTop.toFixed(2), scrollPadTop: cs.scrollPaddingTop, results };
};

/** the deck (unclaimed surface) — pi census */
const DECK = () => {
  const band = document.querySelector(".staging-band");
  const card0 = document.querySelector(".staging-band .game-card, .staging-band [class*=card]");
  const tape = document.querySelector(".staging-band .washi-label, .staging-band .washi-tag");
  const r = (e) => (e ? e.getBoundingClientRect() : null);
  const f = (b) =>
    b ? { x: +b.x.toFixed(2), y: +b.y.toFixed(2), w: +b.width.toFixed(2), h: +b.height.toFixed(2) } : null;
  return {
    band: f(r(band)),
    firstCard: f(r(card0)),
    tape: f(r(tape)),
    tapeTag: tape ? tape.tagName : null,
    h2count: document.querySelectorAll("h2").length,
  };
};

const run = async () => {
  const b = await (ENGINE === "webkit" ? webkit : chromium).launch();
  const out = { engine: ENGINE, cells: {} };

  // ── rail 1440×900
  let ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, baseURL: BASE });
  let page = await ctx.newPage();
  await loadBoard(page);
  out.cells.rail1440 = { tapes: await page.evaluate(TAPES) };
  out.cells.rail1440.stress1_5 = await page.evaluate(STRESS, 1.5);
  await page.reload();
  await loadBoard(page);
  out.cells.rail1440.focuspark = await page.evaluate(FOCUSPARK);
  out.deck = await page.evaluate(DECK);
  await ctx.close();

  // ── dock 390×844 (sheet up)
  ctx = await b.newContext({ viewport: { width: 390, height: 844 }, baseURL: BASE, isMobile: false });
  page = await ctx.newPage();
  await loadBoard(page);
  const tab = page.locator(".drawer-tab, [data-drawer-tab]").first();
  if (await tab.count()) {
    await tab.click({ timeout: 5000 }).catch(() => {});
    await page.waitForTimeout(900);
  }
  out.cells.dock390 = { tapes: await page.evaluate(TAPES) };
  out.cells.dock390.stress1_5 = await page.evaluate(STRESS, 1.5);
  out.cells.dock390.focuspark = await page.evaluate(FOCUSPARK);
  await ctx.close();

  await b.close();
  writeFileSync(OUT, JSON.stringify(out, null, 1));
  console.log("WROTE", OUT);
};
run().then(
  () => console.log("EXIT 0"),
  (e) => {
    console.error("FAIL", e);
    process.exit(1);
  },
);
