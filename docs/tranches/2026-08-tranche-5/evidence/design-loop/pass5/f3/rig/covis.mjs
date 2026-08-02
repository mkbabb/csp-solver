/**
 * PASS-5 F3 · covis.mjs — the trigger-(b) instrument, re-derived at citation.
 *
 * Metric identity with pass-4 `rigF3/covis.mjs` is asserted by SHAPE, not by trust: every key
 * this file emits also exists in `pass4/rigF3/out-covis-p4head-chromium.json`, and the base arm
 * is re-run here so pass 4's numbers are reproduced rather than quoted (the loop's own law).
 *
 * ADDITION over pass 4: `ledger` — the itemized decomposition of docScrollH at the case cell.
 * Pass 4 banked the total (1132) and never printed what it is made of, so no adjudicator could
 * price a re-scope. The ledger is measured, never modelled: each row is a real element rect.
 *
 * Usage: node covis.mjs <baseURL> <engine> <outfile> [cells]
 */
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";

const CELLS = {
  "coarse-390x664-THE-CASE": { w: 390, h: 664, coarse: true },
  "coarse-390x844": { w: 390, h: 844, coarse: true },
  "coarse-375x812": { w: 375, h: 812, coarse: true },
  "coarse-430x932": { w: 430, h: 932, coarse: true },
  "coarse-820x1180-iPadP": { w: 820, h: 1180, coarse: true },
  "coarse-844x390-land": { w: 844, h: 390, coarse: true },
  "coarse-1280x800-rail": { w: 1280, h: 800, coarse: true },
  "fine-1440x900-rail": { w: 1440, h: 900, coarse: false },
  "fine-390x844-NEGCTRL": { w: 390, h: 844, coarse: false },
};

const probe = () => {
  const r = (el) => (el ? el.getBoundingClientRect() : null);
  const round = (n) => (n === null || n === undefined ? null : Math.round(n * 100) / 100);
  const doc = document.documentElement;
  const board =
    document.querySelector(".board-shell") ?? document.querySelector(".board-wrapper");
  const square = document.querySelector(".board-cells") ?? board;
  const margin = document.querySelector(".board-margin");
  const mobileCard = document.querySelector(".mobile-board-width");
  const rail = document.querySelector("#controls-drawer");
  const controls = mobileCard ?? rail;
  const panel = document.querySelector(".control-panel-wrap");
  const chip = document.querySelector(".control-panel-wrap .ctrl-btn");
  const deal = document.querySelector(".deal-btn");
  const scrollY = () => window.scrollY;

  const bRect = r(board);
  const sRect = r(square);
  const mRect = r(margin);
  const cRect = r(controls);
  const vh = window.innerHeight;

  // ── the ledger: docScrollH decomposed into measured, non-overlapping bands ──────────
  const top = (el) => (el ? r(el).top + scrollY() : null);
  const bot = (el) => (el ? r(el).bottom + scrollY() : null);
  const host = document.querySelector(".board-peek-host");
  const ledger = {
    docScrollH: doc.scrollHeight,
    chromeAboveBoard: round(top(host ?? board)), // masthead + gallery furniture
    boardHostH: round(host ? r(host).height : null),
    bandTop: round(top(margin)),
    bandH: round(mRect ? mRect.height : null),
    controlsTop: round(top(controls)),
    controlsH: round(cRect ? cRect.height : null),
    controlsBottom: round(bot(controls)),
    tailBelowControls: round(
      cRect ? doc.scrollHeight - (r(controls).bottom + scrollY()) : null,
    ),
    // the mobile card's own interior, well by well — the re-scope price list
    wells: [...document.querySelectorAll(".control-panel-wrap > *")].map((el) => ({
      cls: el.className.toString().slice(0, 60),
      h: round(r(el).height),
      mt: getComputedStyle(el).marginTop,
      mb: getComputedStyle(el).marginBottom,
    })),
  };

  return {
    regime: {
      mqCoarse: matchMedia("(pointer: coarse)").matches,
      mqHover: matchMedia("(hover: hover)").matches,
      sublabelBlock:
        getComputedStyle(document.querySelector(".icon-sublabel") ?? document.body)
          .display === "block",
      rowRegime: matchMedia("(min-width: 1024px)").matches,
    },
    vh,
    docScrollH: doc.scrollHeight,
    maxScroll: doc.scrollHeight - vh,
    board: {
      top: round(bRect ? bRect.top + scrollY() : null),
      shellH: round(bRect ? bRect.height : null),
      squareH: round(sRect ? sRect.height : null),
      squareW: round(sRect ? sRect.width : null),
    },
    band: {
      present: !!margin,
      position: margin ? getComputedStyle(margin).position : null,
      inFlow: margin ? getComputedStyle(margin).position === "static" : null,
      h: margin ? margin.offsetHeight : null,
      rectH: round(mRect ? mRect.height : null),
      marginTop: margin ? getComputedStyle(margin).marginTop : null,
      tallyInMargin: !!document.querySelector(".board-margin .difficulty-tally"),
    },
    controls: {
      cls: controls ? controls.className.toString().slice(0, 40) : null,
      h: round(cRect ? cRect.height : null),
      panelH: panel ? panel.offsetHeight : null,
    },
    stackPx: round(cRect && bRect ? r(controls).bottom + scrollY() : null),
    stackVh: round(
      cRect ? Math.round(((r(controls).bottom + scrollY()) / vh) * 1000) / 1000 : null,
    ),
    pageVh: Math.round((doc.scrollHeight / vh) * 1000) / 1000,
    tallyHome: document.querySelector(".deal-row .difficulty-tally")
      ? "control-panel"
      : document.querySelector(".board-margin .difficulty-tally")
        ? "board-margin"
        : "none",
    covis: {
      vh,
      squareH: round(sRect ? sRect.height : null),
      boardFits: sRect ? sRect.height <= vh : null,
      needAnyPx: round(cRect ? r(controls).top + scrollY() : null),
      needChipPx: round(chip ? r(chip).bottom + scrollY() : null),
      needDealPx: round(deal ? r(deal).bottom + scrollY() : null),
      coVisible: chip ? r(chip).bottom + scrollY() <= vh : null,
      dealCoVisible: deal ? r(deal).bottom + scrollY() <= vh : null,
    },
    ledger,
  };
};

const [, , baseURL, engineName, outfile] = process.argv;
const engine = engineName === "webkit" ? webkit : chromium;

const browser = await engine.launch();
const out = {};
for (const [key, cell] of Object.entries(CELLS)) {
  const ctx = await browser.newContext({
    viewport: { width: cell.w, height: cell.h },
    hasTouch: cell.coarse,
    isMobile: cell.coarse && engineName !== "webkit" ? true : false,
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();
  // coarse regime is asserted from observables below, never assumed from the flags above
  if (cell.coarse) await ctx.addInitScript(() => {});
  await page.goto(`${baseURL}/?size=3&difficulty=EASY`, { waitUntil: "load" });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
  await page.addStyleTag({ content: ".tuner-toggle{display:none !important}" });
  await page
    .waitForFunction(() => document.querySelectorAll(".sudoku-cell .glyph-svg").length > 0, {
      timeout: 20000,
    })
    .catch(() => {});
  await page.waitForTimeout(600);
  const v = await page.evaluate(probe);
  v.regimeOk = cell.coarse
    ? v.regime.mqCoarse === true && v.regime.rowRegime === cell.w >= 1024
    : v.regime.mqCoarse === false;
  out[key] = v;
  await ctx.close();
}
await browser.close();
writeFileSync(outfile, JSON.stringify(out, null, 2));
console.log(
  Object.entries(out)
    .map(([k, v]) => `${k}\tpageVh=${v.pageVh}\tdoc=${v.docScrollH}\tvh=${v.vh}\tregimeOk=${v.regimeOk}`)
    .join("\n"),
);
