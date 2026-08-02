/**
 * PASS-6 LAND · fold.mjs — the covis/fold instrument for THE DRAWER COMES DOWN TO PORTRAIT.
 *
 * Schema INHERITED from pass 5's `f3/rig/covis.mjs` (every key it emitted is emitted here, so
 * the base arm reproduces pass 5's nine cells rather than quoting them — the loop's law), plus
 * the pass-6 additions the apotheosis §2-G4 orders:
 *   · FOLD CENSUS at the case cell — masthead end, board box, reserved line, verbs band, tongue.
 *   · THE TONGUE-TOP COLUMN governs the capladder (the card-top proxy scored a rung "masthead
 *     clear" while its tongue struck the wordmark — proxy≠surface in miniature).
 *   · OPEN-STATE arm — sheet top, interior scroll, and the board rect ACROSS the gesture
 *     (the no-relayout claim written as a rect identity, not as a phrase).
 *   · LANDSCAPE IDENTITY cell — the HOLD's gate (G1).
 *
 * Usage: node fold.mjs <baseURL> <engine> <outfile> [--open]
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

  const top = (el) => (el ? r(el).top + scrollY() : null);
  const bot = (el) => (el ? r(el).bottom + scrollY() : null);
  const host = document.querySelector(".board-peek-host");
  const ledger = {
    docScrollH: doc.scrollHeight,
    chromeAboveBoard: round(top(host ?? board)),
    boardHostH: round(host ? r(host).height : null),
    bandTop: round(top(margin)),
    bandH: round(mRect ? mRect.height : null),
    controlsTop: round(top(controls)),
    controlsH: round(cRect ? cRect.height : null),
    controlsBottom: round(bot(controls)),
    tailBelowControls: round(
      cRect ? doc.scrollHeight - (r(controls).bottom + scrollY()) : null,
    ),
    wells: [...document.querySelectorAll(".control-panel-wrap > *")].map((el) => ({
      cls: el.className.toString().slice(0, 60),
      h: round(r(el).height),
      mt: getComputedStyle(el).marginTop,
      mb: getComputedStyle(el).marginBottom,
    })),
  };

  // ── PASS-6 · the fold census ────────────────────────────────────────────────────────
  const masthead = document.querySelector(".masthead") ?? document.querySelector("h1");
  const foldTools = document.querySelector("#fold-tools");
  const tab = document.querySelector(".drawer-tab");
  const drawer = document.querySelector("#controls-drawer");
  const dRect = r(drawer);
  const tRect = r(tab);
  const tabCs = tab ? getComputedStyle(tab) : null;
  const drawerCs = drawer ? getComputedStyle(drawer) : null;
  // Every play-verb target that is actually painted, with BOTH dimensions (the 44px floor
  // is a two-dimension rule and a one-dimension read has scored it green before).
  const verbTargets = [
    ...document.querySelectorAll("#fold-tools .icon-btn, .play-controls .icon-btn"),
  ]
    .filter((el) => {
      const cs = getComputedStyle(el);
      return cs.display !== "none" && cs.visibility !== "hidden";
    })
    .map((el) => ({
      label: el.getAttribute("aria-label"),
      w: round(r(el).width),
      h: round(r(el).height),
    }));

  const fold = {
    mastheadBottom: round(masthead ? bot(masthead) : null),
    boardTop: round(top(host ?? board)),
    boardBottom: round(bot(host ?? board)),
    boardSquare: round(sRect ? sRect.height : null),
    reservedLineH: margin ? margin.offsetHeight : null,
    foldToolsPresent: !!foldTools,
    foldToolsRect: foldTools
      ? {
          top: round(top(foldTools)),
          bottom: round(bot(foldTools)),
          h: round(r(foldTools).height),
        }
      : null,
    verbTargets,
    verbFloorOk: verbTargets.length > 0 && verbTargets.every((t) => t.w >= 44 && t.h >= 44),
    tongue: tRect
      ? {
          display: tabCs.display,
          w: round(tRect.width),
          h: round(tRect.height),
          // THE TONGUE-TOP COLUMN — the governing number of the cap ladder.
          topAbs: round(tRect.top + scrollY()),
          bottomAbs: round(tRect.bottom + scrollY()),
          visible: tabCs.display !== "none" && tabCs.visibility !== "hidden",
          // does the tongue strike the masthead? (the shot's own finding)
          clearsMasthead: masthead ? tRect.top + scrollY() >= bot(masthead) : null,
        }
      : null,
    drawer: dRect
      ? {
          position: drawerCs.position,
          top: round(dRect.top),
          height: round(dRect.height),
          inert: drawer.hasAttribute("inert"),
          hidden: drawerCs.visibility === "hidden" || drawerCs.display === "none",
          role: drawer.getAttribute("role"),
          ariaLabel: drawer.getAttribute("aria-label"),
        }
      : null,
    // interior-scroll census (Fable's cell): how much the sheet's own content must scroll
    interiorScroll:
      panel && drawer ? Math.max(0, panel.scrollHeight - drawer.clientHeight) : null,
    docEqualsVh: doc.scrollHeight === vh,
  };

  return {
    regime: {
      mqCoarse: matchMedia("(pointer: coarse)").matches,
      mqHover: matchMedia("(hover: hover)").matches,
      mqPortrait: matchMedia("(orientation: portrait)").matches,
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
    fold,
  };
};

const [, , baseURL, engineName, outfile, ...flags] = process.argv;
const wantOpen = flags.includes("--open");
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
  await page.goto(`${baseURL}/?size=3&difficulty=EASY`, { waitUntil: "load" });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
  await page.addStyleTag({ content: ".tuner-toggle{display:none !important}" });
  await page
    .waitForFunction(
      () => document.querySelectorAll(".sudoku-cell .glyph-svg").length > 0,
      { timeout: 20000 },
    )
    .catch(() => {});
  await page.waitForTimeout(600);
  const v = await page.evaluate(probe);
  v.regimeOk = cell.coarse
    ? v.regime.mqCoarse === true && v.regime.rowRegime === cell.w >= 1024
    : v.regime.mqCoarse === false;

  // ── THE OPEN ARM (case cell only, and only when asked) ────────────────────────────
  // The board rect is read before, during-settle and after — the no-relayout claim as a
  // rect identity. A tongue that does not exist parks the arm rather than faking it.
  if (wantOpen && key === "coarse-390x664-THE-CASE") {
    const boardBefore = await page.evaluate(() => {
      const b = document.querySelector(".board-cells");
      const r = b.getBoundingClientRect();
      return { x: +r.x.toFixed(2), y: +r.y.toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2) };
    });
    const tabVisible = await page
      .locator(".drawer-tab")
      .isVisible()
      .catch(() => false);
    if (tabVisible) {
      await page.locator(".drawer-tab").click();
      await page.waitForTimeout(900);
      v.open = await page.evaluate(probe);
      v.open.boardRect = await page.evaluate(() => {
        const r = document.querySelector(".board-cells").getBoundingClientRect();
        return { x: +r.x.toFixed(2), y: +r.y.toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2) };
      });
      v.open.sheetTop = await page.evaluate(() => {
        const d = document.querySelector("#controls-drawer");
        return d ? +d.getBoundingClientRect().top.toFixed(2) : null;
      });
      await page.locator(".drawer-tab").click();
      await page.waitForTimeout(900);
      v.boardRectAfter = await page.evaluate(() => {
        const r = document.querySelector(".board-cells").getBoundingClientRect();
        return { x: +r.x.toFixed(2), y: +r.y.toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2) };
      });
    } else {
      v.open = { parked: "no tongue at this cell on this tree" };
    }
    v.boardRectBefore = boardBefore;
  }

  out[key] = v;
  await ctx.close();
}
await browser.close();
writeFileSync(outfile, JSON.stringify(out, null, 2));
console.log(
  Object.entries(out)
    .map(
      ([k, v]) =>
        `${k}\tpageVh=${v.pageVh}\tdoc=${v.docScrollH}\tvh=${v.vh}\tmaxScroll=${v.maxScroll}\tregimeOk=${v.regimeOk}\ttongue=${v.fold.tongue ? v.fold.tongue.visible : "none"}`,
    )
    .join("\n"),
);
