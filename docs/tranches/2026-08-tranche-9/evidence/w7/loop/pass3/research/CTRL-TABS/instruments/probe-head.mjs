/**
 * CTRL-TABS · pass 3 · RESEARCH — the HEAD control's own numbers (main @ 74a2b5d9, :4232).
 *
 * Four questions the pass-3 spec cannot be written without:
 *   A. THE TUCK. `#board-edge`'s top against the paper's bottom (the δ), and the shut tongue's
 *      top against both — so the gate the charter asks for (−8) is written against the edge the
 *      estate actually draws rather than against the CSS literal.
 *   B. THE RAIL. `.controls-card`'s box across 1024…1600 with the fluid type tokens it is made
 *      of, so the pin can be DERIVED (chair §6.3b: one token, derived, no literal).
 *   C. THE SHORT END. the card's client box against the viewport at 360×560 / 360×500 / 844×390,
 *      to close `clientHeight = vh − chrome − 24` in the estate's own numbers.
 *   D. W2 §2.2's reachability inputs at 844×390 (chair §6.2), read the way `viewport-law.spec`
 *      reads them.
 *
 * Read-only: no product file is touched, no ablation is injected. Both engines.
 */
// registry §3.22: a script under `docs/` cannot resolve `@playwright/test` by bare specifier
// (ESM ignores NODE_PATH). The estate's own install is imported by absolute path instead.
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
import { writeFileSync } from "node:fs";

const BASE = "http://127.0.0.1:4232/";
const OUT = process.argv[2] ?? "./head.json";

const rect = (el) => {
  if (!el) return null;
  const b = el.getBoundingClientRect();
  return {
    x: +b.left.toFixed(2),
    y: +b.top.toFixed(2),
    w: +b.width.toFixed(2),
    h: +b.height.toFixed(2),
    bottom: +b.bottom.toFixed(2),
    right: +b.right.toFixed(2),
  };
};

async function load(page) {
  await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "load" });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.waitForFunction(
    () => document.querySelectorAll(".sudoku-cell .glyph-svg").length > 0,
    null,
    { timeout: 30000 },
  );
  await page.waitForSelector("g.boil-frame-layer.is-active", {
    state: "attached",
    timeout: 30000,
  });
}

const EDGE = String(rect);

/** A · the tuck, read shut. */
async function tuck(page) {
  return page.evaluate((rectSrc) => {
    const R = eval("(" + rectSrc + ")");
    const paper = document.querySelector(".board-wrapper");
    const edge = document.querySelector("#board-edge");
    const tongue = document.querySelector(".drawer-tab");
    const shell = document.querySelector(".board-shell");
    const margin = document.querySelector(".board-margin");
    // The PAINTED paper: the board's own drawn outline path, if one wraps it.
    const outline = document.querySelector(
      ".board-shell .outline-container svg path, .board-wrapper svg.outline-svg path",
    );
    const paintedBottom = outline
      ? +outline.getBoundingClientRect().bottom.toFixed(2)
      : null;
    const cs = tongue ? getComputedStyle(tongue) : null;
    return {
      paper: R(paper),
      edge: R(edge),
      tongue: R(tongue),
      shell: R(shell),
      margin: R(margin),
      paintedBottom,
      tonguePose: cs
        ? { top: cs.top, right: cs.right, position: cs.position, z: cs.zIndex, display: cs.display }
        : null,
      // the two numbers the spec is written from
      delta_edgeTop_minus_paperBottom: paper && edge ? +(edge.getBoundingClientRect().top - paper.getBoundingClientRect().bottom).toFixed(2) : null,
      tuck_tongueTop_minus_paperBottom: paper && tongue ? +(tongue.getBoundingClientRect().top - paper.getBoundingClientRect().bottom).toFixed(2) : null,
      tuck_tongueTop_minus_paintedBottom: paintedBottom && tongue ? +(tongue.getBoundingClientRect().top - paintedBottom).toFixed(2) : null,
      protrusion_below_paper: paper && tongue ? +(tongue.getBoundingClientRect().bottom - paper.getBoundingClientRect().bottom).toFixed(2) : null,
      boardY: R(document.querySelector(".board-wrapper"))?.y ?? null,
      docScrollH: document.documentElement.scrollHeight,
      innerH: window.innerHeight,
    };
  }, EDGE);
}

/** D · W2 §2.2's reachability inputs, exactly as viewport-law.spec reads them. */
async function reach(page) {
  return page.evaluate(() => {
    const inFirstScreen = (el) => {
      if (!el) return false;
      const cs = getComputedStyle(el);
      if (cs.display === "none" || cs.visibility === "hidden" || +cs.opacity < 0.05)
        return false;
      const b = el.getBoundingClientRect();
      return b.width > 0 && b.height > 0 && b.top < window.innerHeight && b.bottom > 0;
    };
    const openers = {
      drawerTab: document.querySelector(".drawer-tab"),
      foldTools: document.querySelector(".fold-tools"),
      drawerHandle: document.querySelector(".drawer-handle"),
    };
    const deal = document.querySelector(".controls-card .deal-btn");
    const level = document.querySelector(
      '.controls-card [aria-label="Difficulty"], .controls-card .ctrl-btn',
    );
    return {
      openersVisible: Object.fromEntries(
        Object.entries(openers).map(([k, v]) => [k, inFirstScreen(v)]),
      ),
      openerBoxes: Object.fromEntries(
        Object.entries(openers).map(([k, v]) => [
          k,
          v ? [+v.getBoundingClientRect().left.toFixed(1), +v.getBoundingClientRect().top.toFixed(1), +v.getBoundingClientRect().width.toFixed(1), +v.getBoundingClientRect().height.toFixed(1)] : null,
        ]),
      ),
      dealInFirstScreen: inFirstScreen(deal),
      levelInFirstScreen: inFirstScreen(level),
      docScrollH: document.documentElement.scrollHeight,
      innerH: window.innerHeight,
    };
  });
}

/** Open the sheet / pull the rail, then settle (it SLIDES). */
async function openSheet(page) {
  const tab = page.locator(".drawer-tab").first();
  if (await tab.count()) {
    await tab.click({ force: true }).catch(() => {});
    await page.waitForTimeout(950);
  }
}

/** B+C · the card's box, its content, and the tokens it is made of. */
async function card(page) {
  return page.evaluate((rectSrc) => {
    const R = eval("(" + rectSrc + ")");
    const card = document.querySelector(".controls-card");
    const sheet = document.querySelector(".scene-controls");
    const paper = document.querySelector(".board-wrapper");
    if (!card) return null;
    const cs = getComputedStyle(card);
    const root = getComputedStyle(document.documentElement);
    const tok = (n, el) => (el ?? root).getPropertyValue(n).trim();
    // the widest thing inside: the row whose scrollWidth exceeds its box by the most, and the
    // five widest rows by scrollWidth, so a width law can name its driver.
    const rows = [...card.querySelectorAll("*")]
      .filter((e) => e.scrollWidth > 0)
      .map((e) => ({
        sel:
          e.tagName.toLowerCase() +
          (e.className && typeof e.className === "string"
            ? "." + e.className.trim().split(/\s+/).slice(0, 2).join(".")
            : ""),
        w: +e.getBoundingClientRect().width.toFixed(2),
        sw: e.scrollWidth,
        over: +(e.scrollWidth - e.getBoundingClientRect().width).toFixed(2),
      }))
      .sort((a, b) => b.sw - a.sw)
      .slice(0, 6);
    return {
      card: R(card),
      sheet: R(sheet),
      paper: R(paper),
      clientHeight: card.clientHeight,
      scrollHeight: card.scrollHeight,
      clientWidth: card.clientWidth,
      scrollWidth: card.scrollWidth,
      pad: {
        t: cs.paddingTop,
        r: cs.paddingRight,
        b: cs.paddingBottom,
        l: cs.paddingLeft,
      },
      maxH: cs.maxHeight,
      innerH: window.innerHeight,
      innerW: window.innerWidth,
      vh_minus_clientHeight: +(window.innerHeight - card.clientHeight).toFixed(2),
      overflow: +(card.scrollHeight - card.clientHeight).toFixed(2),
      sheetChrome: sheet ? getComputedStyle(sheet).getPropertyValue("--sheet-chrome").trim() : null,
      tokens: {
        typeCaption: tok("--type-caption", cs),
        typeSmall: tok("--type-small", cs),
        typeBody: tok("--type-body", cs),
        typeOption: tok("--type-option", cs),
        typeHeading: tok("--type-heading", cs),
        typeAct: tok("--type-act", cs),
        tapFloor: tok("--tap-floor", cs),
        boardCol: tok("--board-col", cs),
      },
      rows,
      fontSizes: {
        card: cs.fontSize,
        rowLabel: (() => {
          const e = card.querySelector(".zone-row-label");
          return e ? getComputedStyle(e).fontSize : null;
        })(),
        washiTag: (() => {
          const e = card.querySelector(".washi-tag, .washi-label");
          return e ? getComputedStyle(e).fontSize : null;
        })(),
        sectionHeading: (() => {
          const e = card.querySelector(".section-heading");
          return e ? getComputedStyle(e).fontSize : null;
        })(),
      },
    };
  }, EDGE);
}

const PORTRAIT = [
  { w: 390, h: 844 },
  { w: 375, h: 812 },
  { w: 430, h: 932 },
  { w: 360, h: 560 },
  { w: 360, h: 500 },
];
const LANDSCAPE = [{ w: 844, h: 390 }];
const DESK = [1024, 1280, 1360, 1440, 1600];

const out = {};

for (const [name, type] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const browser = await type.launch();
  const bag = { coarse: {}, desk: {} };

  // ── coarse cells (portrait + landscape): shut readings, then the sheet opened.
  for (const cell of [...PORTRAIT, ...LANDSCAPE]) {
    const ctx = await browser.newContext({
      viewport: { width: cell.w, height: cell.h },
      isMobile: name === "chromium",
      hasTouch: true,
      deviceScaleFactor: 2,
    });
    const page = await ctx.newPage();
    try {
      await load(page);
      const shut = await tuck(page);
      const r = cell.w > cell.h ? await reach(page) : null;
      await openSheet(page);
      const open = await card(page);
      bag.coarse[`${cell.w}x${cell.h}`] = { shut, reach: r, open };
    } catch (e) {
      bag.coarse[`${cell.w}x${cell.h}`] = { error: String(e).slice(0, 300) };
    }
    await ctx.close();
  }

  // ── the desk band: one context, resized, the rail pulled at every width.
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  try {
    await load(page);
    await openSheet(page);
    for (const w of DESK) {
      await page.setViewportSize({ width: w, height: 800 });
      await page.waitForTimeout(500);
      bag.desk[w] = await card(page);
    }
  } catch (e) {
    bag.desk.error = String(e).slice(0, 300);
  }
  await ctx.close();
  await browser.close();
  out[name] = bag;
}

writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log("banked", OUT);
