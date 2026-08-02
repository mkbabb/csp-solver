/**
 * AUDIT rig — pass-6 non-author audit. Independently authored; the schema is deliberately
 * MINIMAL: the number under audit is pageVh = documentElement.scrollHeight / innerHeight at
 * the case cell, plus the covis gate's own predicates. Nothing here is copied from the LAND
 * lane's fold.mjs; the cell list is the one the record cites, because the cell is the claim.
 *
 * Usage: node audit-fold.mjs <baseURL> <engine> <outfile> [isMobileMode: auto|true|false]
 */
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";

const CELLS = [
  ["coarse-390x664-THE-CASE", 390, 664, true],
  ["coarse-390x844", 390, 844, true],
  ["coarse-375x812", 375, 812, true],
  ["coarse-430x932", 430, 932, true],
  ["coarse-820x1180", 820, 1180, true],
  ["coarse-844x390-land", 844, 390, true],
  ["coarse-1280x800-rail", 1280, 800, true],
  ["fine-1440x900-rail", 1440, 900, false],
  ["fine-390x844-NEGCTRL", 390, 844, false],
];

const probe = () => {
  const rr = (n) => (n == null ? null : Math.round(n * 100) / 100);
  const doc = document.documentElement;
  const vh = window.innerHeight;
  const q = (s) => document.querySelector(s);
  const box = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { x: rr(r.x), y: rr(r.y), w: rr(r.width), h: rr(r.height) };
  };
  const verbs = [...document.querySelectorAll("#fold-tools .icon-btn, .play-controls .icon-btn")]
    .filter((el) => {
      const cs = getComputedStyle(el);
      return cs.display !== "none" && cs.visibility !== "hidden";
    })
    .map((el) => ({
      label: el.getAttribute("aria-label"),
      w: rr(el.getBoundingClientRect().width),
      h: rr(el.getBoundingClientRect().height),
      bottom: rr(el.getBoundingClientRect().bottom + window.scrollY),
      inFold: el.getBoundingClientRect().bottom + window.scrollY <= vh,
    }));
  const tab = q(".drawer-tab");
  const drawer = q("#controls-drawer");
  return {
    vh,
    innerW: window.innerWidth,
    docScrollH: doc.scrollHeight,
    maxScroll: doc.scrollHeight - vh,
    pageVh: Math.round((doc.scrollHeight / vh) * 1000) / 1000,
    mq: {
      coarse: matchMedia("(pointer: coarse)").matches,
      hover: matchMedia("(hover: hover)").matches,
      portrait: matchMedia("(orientation: portrait)").matches,
      row: matchMedia("(min-width: 1024px)").matches,
    },
    boardCells: box(q(".board-cells")),
    boardWrapper: box(q(".board-wrapper")),
    boardShell: box(q(".board-shell")),
    marginBand: box(q(".board-margin")),
    marginText: (q(".board-margin") || {}).textContent
      ? q(".board-margin").textContent.trim().slice(0, 90)
      : null,
    foldTools: box(q("#fold-tools")),
    foldToolsPresent: !!q("#fold-tools"),
    verbs,
    verbFloorOk: verbs.length > 0 && verbs.every((v) => v.w >= 44 && v.h >= 44),
    verbsInFold: verbs.length > 0 && verbs.every((v) => v.inFold),
    tongue: tab
      ? {
          ...box(tab),
          display: getComputedStyle(tab).display,
          visible: getComputedStyle(tab).display !== "none" && getComputedStyle(tab).visibility !== "hidden",
        }
      : null,
    drawer: drawer
      ? {
          position: getComputedStyle(drawer).position,
          ...box(drawer),
          inert: drawer.hasAttribute("inert"),
          visibility: getComputedStyle(drawer).visibility,
          role: drawer.getAttribute("role"),
          ariaLabel: drawer.getAttribute("aria-label"),
        }
      : null,
    mastheadBottom: rr(q(".masthead") ? q(".masthead").getBoundingClientRect().bottom + window.scrollY : null),
    tallyAria: q(".difficulty-tally") ? q(".difficulty-tally").getAttribute("aria-label") : null,
  };
};

const [, , baseURL, engineName, outfile, mobileMode = "auto"] = process.argv;
const engine = engineName === "webkit" ? webkit : chromium;
const browser = await engine.launch();
const out = {};
for (const [key, w, h, coarse] of CELLS) {
  const isMobile =
    mobileMode === "true" ? coarse : mobileMode === "false" ? false : coarse && engineName !== "webkit";
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    hasTouch: coarse,
    isMobile,
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();
  await page.goto(`${baseURL}/?size=3&difficulty=EASY`, { waitUntil: "load" });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
  await page.addStyleTag({ content: ".tuner-toggle{display:none !important}" });
  await page
    .waitForFunction(() => document.querySelectorAll(".sudoku-cell .glyph-svg").length > 0, {
      timeout: 20000,
    })
    .catch(() => {});
  await page.waitForTimeout(700);
  const v = await page.evaluate(probe);
  v.isMobileFlag = isMobile;
  // OPEN arm at the case cell.
  if (key === "coarse-390x664-THE-CASE" && v.tongue && v.tongue.visible) {
    v.boardBefore = await page.evaluate(() => {
      const r = document.querySelector(".board-cells").getBoundingClientRect();
      return { x: +r.x.toFixed(2), y: +r.y.toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2) };
    });
    await page.locator(".drawer-tab").click();
    await page.waitForTimeout(1000);
    v.openState = await page.evaluate(() => {
      const d = document.querySelector("#controls-drawer");
      const p = document.querySelector(".control-panel-wrap");
      const r = document.querySelector(".board-cells").getBoundingClientRect();
      return {
        sheetTop: d ? +d.getBoundingClientRect().top.toFixed(2) : null,
        sheetH: d ? +d.getBoundingClientRect().height.toFixed(2) : null,
        interiorScroll: p && d ? Math.max(0, p.scrollHeight - d.clientHeight) : null,
        gridVisibleAbove: d ? +d.getBoundingClientRect().top.toFixed(2) : null,
        boardRect: { x: +r.x.toFixed(2), y: +r.y.toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2) },
        pageVhOpen:
          Math.round((document.documentElement.scrollHeight / window.innerHeight) * 1000) / 1000,
      };
    });
    await page.locator(".drawer-tab").click();
    await page.waitForTimeout(900);
    v.boardAfter = await page.evaluate(() => {
      const r = document.querySelector(".board-cells").getBoundingClientRect();
      return { x: +r.x.toFixed(2), y: +r.y.toFixed(2), w: +r.width.toFixed(2), h: +r.height.toFixed(2) };
    });
  }
  out[key] = v;
  await ctx.close();
}
await browser.close();
writeFileSync(outfile, JSON.stringify(out, null, 2));
for (const [k, v] of Object.entries(out)) {
  console.log(
    `${k}\tpageVh=${v.pageVh}\tdoc=${v.docScrollH}\tvh=${v.vh}\tmaxScroll=${v.maxScroll}\tcoarse=${v.mq.coarse}\trow=${v.mq.row}\tportrait=${v.mq.portrait}\ttongue=${v.tongue ? v.tongue.visible : "none"}\tverbFloorOk=${v.verbFloorOk}`,
  );
}
