/**
 * T9-W7 pass 3 · CTRL-TAPE — π ON THE SURFACES THIS WAVE DOES NOT CLAIM, and the voice census.
 *
 * The control commit is 74a2b5d9, served on :4235 from the MAIN tree. The same five readings are
 * taken on both servers and differenced. A non-zero Δ on the deck is a shared-rule leak.
 *
 *   node p3-pi.mjs <out.json> <base> [chromium|webkit]
 */
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
import { writeFileSync } from "node:fs";

const OUT = process.argv[2];
const BASE = process.argv[3] || "http://127.0.0.1:4230";
const ONLY = process.argv[4];

/** THE DECK — the gallery, which this wave does not touch and whose tape rung the registration
 *  was measured against (the `--washi-tag-rung` amendment). */
const DECK = () => {
  const band = document.querySelector(".staging-band");
  const card = document.querySelector(".game-card, .gallery-card, [class*='card']");
  const tape = document.querySelector(".washi-tag, .staging-axis-label");
  const label = document.querySelector(".staging-axis-label");
  const b = band?.getBoundingClientRect();
  const c = card?.getBoundingClientRect();
  const t = tape?.getBoundingClientRect();
  return {
    bandH: b ? +b.height.toFixed(2) : null,
    bandTop: b ? +b.top.toFixed(2) : null,
    firstCardY: c ? +c.top.toFixed(2) : null,
    tapeW: t ? +t.width.toFixed(2) : null,
    tapeH: t ? +t.height.toFixed(2) : null,
    tapeFont: tape ? getComputedStyle(tape).fontSize : null,
    axisFont: label ? getComputedStyle(label).fontSize : null,
    axisFamily: label ? getComputedStyle(label).fontFamily.split(",")[0] : null,
    axisWeight: label ? getComputedStyle(label).fontWeight : null,
    axisTransform: label ? getComputedStyle(label).textTransform : null,
    axisTracking: label ? getComputedStyle(label).letterSpacing : null,
  };
};

/** THE CARD'S VOICE — R1's census: how many distinct rungs speak the eight names. */
const VOICE = () => {
  const card = document.querySelector(".controls-card");
  if (!card) return null;
  const names = [...card.querySelectorAll(".washi-tag, .zone-row-label, .section-heading")]
    .filter((e) => {
      const s = getComputedStyle(e);
      return s.display !== "none" && s.visibility !== "hidden" && +s.opacity > 0.05;
    })
    .map((e) => ({
      text: (e.textContent || "").trim(),
      font: getComputedStyle(e).fontSize,
      family: getComputedStyle(e).fontFamily.split(",")[0].replace(/["']/g, ""),
      tag: e.tagName,
    }));
  const rungs = [...new Set(names.map((n) => n.font))];
  const chip = document.querySelector(".ctrl-btn, .option-chip, [role='radio']");
  const chipFont = chip ? parseFloat(getComputedStyle(chip).fontSize) : null;
  return {
    count: names.length,
    texts: names.map((n) => n.text),
    voices: rungs.length,
    rungs,
    families: [...new Set(names.map((n) => n.family))],
    chipFont,
    ratio: chipFont ? +(parseFloat(rungs[0]) / chipFont).toFixed(4) : null,
  };
};

/** THE RING — the value actually read, on the four grounds the section names. */
const RING = () => {
  const card = document.querySelector(".controls-card");
  const btn = card?.querySelector("button");
  if (!btn) return null;
  btn.focus();
  const cs = getComputedStyle(btn);
  return {
    outline: cs.outline,
    outlineColor: cs.outlineColor,
    outlineStyle: cs.outlineStyle,
    outlineWidth: cs.outlineWidth,
    outlineOffset: cs.outlineOffset,
    ringInk: getComputedStyle(document.documentElement).getPropertyValue("--ring-ink").trim(),
    color: cs.color,
  };
};

/** THE BOARD — the other surface this wave does not claim. */
const BOARD = () => {
  const board = document.querySelector(".board-wrapper, .sudoku-board");
  const b = board?.getBoundingClientRect();
  const cell = document.querySelector(".sudoku-cell");
  const cb = cell?.getBoundingClientRect();
  return {
    boardW: b ? +b.width.toFixed(2) : null,
    boardH: b ? +b.height.toFixed(2) : null,
    boardTop: b ? +b.top.toFixed(2) : null,
    boardLeft: b ? +b.left.toFixed(2) : null,
    cellW: cb ? +cb.width.toFixed(2) : null,
  };
};

const out = {};
for (const [engName, eng] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  if (ONLY && ONLY !== engName) continue;
  const browser = await eng.launch();
  for (const cell of [
    { name: "rail-1440x900", w: 1440, h: 900 },
    { name: "rail-1280x800", w: 1280, h: 800 },
    { name: "dock-390x844", w: 390, h: 844 },
    { name: "land-900x500", w: 900, h: 500 },
  ]) {
    const key = `${engName}|${cell.name}`;
    const ctx = await browser.newContext({
      baseURL: BASE,
      viewport: { width: cell.w, height: cell.h },
    });
    const page = await ctx.newPage();
    try {
      // THE DECK first — the gallery view, untouched by this wave.
      await page.goto("/?view=gallery");
      await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
      await page.waitForTimeout(1200);
      const deck = await page.evaluate(DECK);
      const deckAx = await page.locator("body").ariaSnapshot();
      const deckHeadings = (deckAx.match(/^\s*- heading/gm) || []).length;

      // ── THE `--washi-tag-rung` ABLATION (the §1.1 amendment's own number) ─────────────────
      // The spec's registration block listed `--washi-tag-rung` with `initial-value: 14px`. The
      // token is declared on `.controls-card` and READ by every washi tape in the estate,
      // including the deck's, which fall back to `var(--type-tag)` = `--type-caption` =
      // `clamp(0.75rem, 0.71rem + 0.21vw, 1rem)` — viewport-dependent, so no absolute initial
      // can stand for it. Registering the name at runtime here is exactly what the CSS block
      // would have done, and the deck's own tape is measured before and after.
      const rungAblation = await page.evaluate(() => {
        const before = (() => {
          const t = document.querySelector(".washi-tag, .staging-axis-label");
          const b = t?.getBoundingClientRect();
          return t
            ? { font: getComputedStyle(t).fontSize, w: +b.width.toFixed(2), h: +b.height.toFixed(2) }
            : null;
        })();
        try {
          CSS.registerProperty({
            name: "--washi-tag-rung",
            syntax: "<length>",
            inherits: true,
            initialValue: "14px",
          });
        } catch (e) {
          return { before, after: null, threw: String(e).slice(0, 80) };
        }
        const t = document.querySelector(".washi-tag, .staging-axis-label");
        const b = t?.getBoundingClientRect();
        return {
          before,
          after: t
            ? { font: getComputedStyle(t).fontSize, w: +b.width.toFixed(2), h: +b.height.toFixed(2) }
            : null,
        };
      });

      // THE BOARD + THE CARD.
      await page.goto("/?size=3&difficulty=EASY");
      await page.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 30000 });
      await page.waitForSelector("g.boil-frame-layer.is-active", {
        state: "attached",
        timeout: 30000,
      });
      if (cell.w < 1024) {
        await page.locator(".drawer-tab").click();
        await page.waitForTimeout(900);
      }
      out[key] = {
        deck,
        deckHeadings,
        rungAblation,
        board: await page.evaluate(BOARD),
        voice: await page.evaluate(VOICE),
        ring: await page.evaluate(RING),
      };
    } catch (e) {
      out[key] = { error: String(e).slice(0, 260) };
    }
    await ctx.close();
  }
  await browser.close();
}
writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log("BANKED", OUT);
