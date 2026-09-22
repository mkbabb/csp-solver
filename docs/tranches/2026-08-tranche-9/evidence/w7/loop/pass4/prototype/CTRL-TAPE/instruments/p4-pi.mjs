/**
 * T9-W7 pass 4 · CTRL-TAPE — π ON THE SURFACES THIS WAVE DOES NOT CLAIM, read from computed
 * PAINT properties and tag names, never from rects alone (registry §2.13).
 *
 * Pass 3's instrument took `document.querySelector(".washi-tag, .staging-axis-label")`, which on
 * `/?view=gallery` is index 0 — the CONTROLS CARD's own hidden tape, box 0×0. Every "Δ 0.00"
 * it printed compared 0 to 0. This one:
 *   · selects the deck's LIVE tape with `:not(.controls-card *)`, and asserts it has a box;
 *   · reads font-size, font-family, font-weight, line-height, colour AND tagName per element;
 *   · counts the document's h2 population and the aria heading roster on the gallery route;
 *   · reads the dock's name/chip ratio in three pointer regimes (the 1.618 was the probe's
 *     pointer, not the dock — pass-3 critique §3.3).
 * Both arms deal the same board (`?board=`).
 *
 *   node p4-pi.mjs <out.json> <protoURL> <controlURL>
 */
import {
  chromium,
  webkit,
} from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
import { writeFileSync } from "node:fs";

const OUT = process.argv[2];
const PROTO = process.argv[3] || "http://127.0.0.1:4230";
const CTRL = process.argv[4] || "http://127.0.0.1:4231";

/** THE DECK'S OWN TAPE — outside the card, by construction. */
const DECK = () => {
  const PAINT = (el) => {
    const cs = getComputedStyle(el);
    const b = el.getBoundingClientRect();
    return {
      tag: el.tagName,
      w: +b.width.toFixed(2),
      h: +b.height.toFixed(2),
      top: +b.top.toFixed(2),
      left: +b.left.toFixed(2),
      fontSize: cs.fontSize,
      fontFamily: cs.fontFamily.split(",")[0].replace(/["']/g, ""),
      fontWeight: cs.fontWeight,
      lineHeight: cs.lineHeight,
      color: cs.color,
      letterSpacing: cs.letterSpacing,
      textTransform: cs.textTransform,
    };
  };
  const out = {};
  const live = [...document.querySelectorAll(".washi-tag")].filter(
    (e) => !e.closest(".controls-card"),
  );
  out.deckTapes = live.map((e) => ({ text: (e.textContent || "").trim(), ...PAINT(e) }));
  out.axisLabels = [...document.querySelectorAll(".staging-axis-label")].map((e) => ({
    text: (e.textContent || "").trim(),
    ...PAINT(e),
  }));
  const band = document.querySelector(".staging-band");
  const card = document.querySelector(".staging-band .staging-card, .deck-card");
  out.band = band ? PAINT(band) : null;
  out.firstCard = card ? PAINT(card) : null;
  out.h2Population = document.querySelectorAll("h2").length;
  out.h2Texts = [...document.querySelectorAll("h2")].map((h) =>
    (h.textContent || "").trim().slice(0, 24),
  );
  out.headingRoles = [
    ...document.querySelectorAll('h1,h2,h3,h4,h5,h6,[role="heading"]'),
  ].length;
  return out;
};

/** THE BOARD and the case, on the play route. */
const BOARD = () => {
  const PAINT = (el) => {
    const cs = getComputedStyle(el);
    const b = el.getBoundingClientRect();
    return {
      tag: el.tagName,
      w: +b.width.toFixed(2),
      h: +b.height.toFixed(2),
      top: +b.top.toFixed(2),
      left: +b.left.toFixed(2),
      fontSize: cs.fontSize,
      fontFamily: cs.fontFamily.split(",")[0].replace(/["']/g, ""),
      fontWeight: cs.fontWeight,
      lineHeight: cs.lineHeight,
      color: cs.color,
      letterSpacing: cs.letterSpacing,
      textTransform: cs.textTransform,
    };
  };
  const b = document.querySelector(".board-wrapper, .sudoku-board");
  const cell = document.querySelector(".sudoku-cell");
  const root = document.querySelector(".page-root");
  return {
    board: b ? PAINT(b) : null,
    cell: cell ? PAINT(cell) : null,
    root: root ? PAINT(root) : null,
  };
};

/** THE NAME ÷ CHIP RATIO, read where the design claims it. */
const RATIO = () => {
  const name = document.querySelector(".controls-card .washi-tag");
  const chip = document.querySelector(".controls-card .ctrl-btn");
  const n = name ? parseFloat(getComputedStyle(name).fontSize) : null;
  const c = chip ? parseFloat(getComputedStyle(chip).fontSize) : null;
  return {
    coarse: matchMedia("(pointer: coarse)").matches,
    name: n,
    chip: c,
    ratio: n && c ? +(n / c).toFixed(4) : null,
    typeOption: getComputedStyle(document.documentElement)
      .getPropertyValue("--type-option")
      .trim(),
  };
};

async function openDock(page) {
  await page.locator(".drawer-tab").click();
  await page.waitForSelector("#controls-drawer .drawer-case", { state: "visible" });
  await page.waitForTimeout(900); // the sheet SLIDES
}

const CELLS = [
  { name: "rail-1440x900", w: 1440, h: 900, touch: false },
  { name: "rail-1280x800", w: 1280, h: 800, touch: false },
  { name: "dock-390x844", w: 390, h: 844, touch: true },
  { name: "land-844x390", w: 844, h: 390, touch: true },
];

const out = {};
for (const [eng, launcher] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const br = await launcher.launch();
  for (const [arm, base] of [
    ["proto", PROTO],
    ["control", CTRL],
  ]) {
    for (const cell of CELLS) {
      const key = `${eng}|${arm}|${cell.name}`;
      const ctx = await br.newContext({
        baseURL: base,
        viewport: { width: cell.w, height: cell.h },
        hasTouch: cell.touch,
      });
      const page = await ctx.newPage();
      try {
        // ── the GALLERY route: the deck's tape, the axis labels, the heading population ──
        await page.goto("/?view=gallery");
        await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
        await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
        await page.waitForTimeout(700);
        const deck = await page.evaluate(DECK);

        // ── the PLAY route: the board and the case ──
        await page.goto("/?size=3&difficulty=EASY&board=pi");
        await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
        await page.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 30000 });
        await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
        await page.waitForTimeout(700);
        const board = await page.evaluate(BOARD);
        let ratio = null;
        if (cell.touch && cell.h > cell.w) {
          await openDock(page);
          ratio = await page.evaluate(RATIO);
        } else if (!cell.touch && cell.w >= 1024) {
          ratio = await page.evaluate(RATIO);
        }
        out[key] = { deck, board, ratio };
      } catch (e) {
        out[key] = { error: String(e).slice(0, 240) };
      }
      await ctx.close();
    }
  }

  // ── THE POINTER, NOT THE DOCK (pass-3 critique §3.3): three regimes at one cell ─────────
  for (const regime of [
    { name: "no-touch", opts: {} },
    { name: "hasTouch", opts: { hasTouch: true } },
    { name: "hasTouch+isMobile", opts: { hasTouch: true, isMobile: true } },
  ]) {
    const ctx = await br.newContext({
      baseURL: PROTO,
      viewport: { width: 390, height: 844 },
      ...regime.opts,
    });
    const page = await ctx.newPage();
    try {
      await page.goto("/?size=3&difficulty=EASY&board=pi");
      await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
      await page.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 30000 });
      await openDock(page);
      out[`${eng}|ratio-390x844|${regime.name}`] = await page.evaluate(RATIO);
    } catch (e) {
      out[`${eng}|ratio-390x844|${regime.name}`] = { error: String(e).slice(0, 200) };
    }
    await ctx.close();
  }
  await br.close();
}
writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log("BANKED", OUT);
