// CTRL-TABS · probe 3 — WHERE THE TALLEST TRAY'S PIXELS GO, and WHAT THE BOARD'S EDGE HAS.
//   node tray-and-strip.probe.mjs
// (a) the `new game` tray decomposed at every cell (the height that must fit 284px);
// (b) the board's free edge on each mobile pose — the one tool home's budget;
// (c) the tab word's PAINTED contrast at the quiet rung (canvas read-back, both themes);
// (d) the heading-voice rows (R1 ROW1/2/3) read under the overlay.
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const BASE = process.env.LANE_BASE || "http://127.0.0.1:4232/";
const CELLS = [
  { name: "dock-390x844", w: 390, h: 844, mobile: true, sheet: true },
  { name: "dock-375x812", w: 375, h: 812, mobile: true, sheet: true },
  { name: "dock-430x932", w: 430, h: 932, mobile: true, sheet: true },
  { name: "land-900x500", w: 900, h: 500, mobile: true, sheet: true },
  { name: "land-844x390", w: 844, h: 390, mobile: true, sheet: true },
  { name: "desk-1280x800", w: 1280, h: 800, mobile: false, sheet: false },
];
const out = {};

const decompose = () => {
  const b = (el) => {
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return { w: +r.width.toFixed(2), h: +r.height.toFixed(2), x: +r.x.toFixed(2), y: +r.y.toFixed(2) };
  };
  const ng = document.querySelector(".tray-well.new-game-zone");
  const kids = ng
    ? Array.from(ng.children).map((el) => ({
        cls: String(el.className?.baseVal ?? el.className).slice(0, 44),
        h: +el.getBoundingClientRect().height.toFixed(2),
        display: getComputedStyle(el).display,
      }))
    : [];
  const filtered = document.querySelector(".control-panel-filtered");
  const inner = filtered
    ? Array.from(filtered.children).map((el) => ({
        cls: String(el.className?.baseVal ?? el.className).slice(0, 44),
        h: +el.getBoundingClientRect().height.toFixed(2),
        display: getComputedStyle(el).display,
        text: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 24),
      }))
    : [];
  return {
    newGame: b(ng),
    newGamePad: ng ? [getComputedStyle(ng).paddingTop, getComputedStyle(ng).paddingBottom, getComputedStyle(ng).gap] : null,
    newGameKids: kids,
    filteredKids: inner,
    dealRow: b(document.querySelector(".deal-row")),
    dealBtn: b(document.querySelector(".deal-btn")),
    tally: b(document.querySelector(".difficulty-tally")),
    ctrlOptions: Array.from(document.querySelectorAll(".new-game-zone .ctrl-options")).map((e) => ({
      h: +e.getBoundingClientRect().height.toFixed(2),
      display: getComputedStyle(e).display,
      chips: e.querySelectorAll(".ctrl-btn").length,
    })),
    stagedSections: Array.from(document.querySelectorAll(".staged-section")).map((e) => ({
      h: +e.getBoundingClientRect().height.toFixed(2),
      head: (e.querySelector(".section-heading")?.textContent || "").trim(),
      headH: +(e.querySelector(".section-heading")?.getBoundingClientRect().height ?? 0).toFixed(2),
    })),
    // (b) the board's free edge
    boardPaper: b(document.querySelector(".board-paper")) || b(document.querySelector(".board-wrapper")),
    boardCells: b(document.querySelector(".board-cells")),
    boardEdge: b(document.querySelector("#board-edge")),
    drawerTab: b(document.querySelector(".drawer-tab")),
    foldTools: b(document.querySelector("#fold-tools")),
    playControls: b(document.querySelector(".play-controls")),
    playButtons: Array.from(document.querySelectorAll(".play-controls button")).map((btn) => ({
      label: (btn.getAttribute("aria-label") || btn.innerText || "").trim().slice(0, 26),
      ...b(btn),
    })),
    toggle: b(document.querySelector(".celestial-toggle, .dark-mode-toggle, [class*='toggle-hit']")),
    masthead: b(document.querySelector(".masthead")),
    wordmark: b(document.querySelector("svg.handwritten-logo")),
  };
};

const headingRows = () => {
  const card = document.querySelector(".controls-card") ?? document;
  const pick = (sel, kind) =>
    Array.from(card.querySelectorAll(sel)).map((el) => {
      const cs = getComputedStyle(el);
      const host = el.closest("h1,h2,h3,h4,h5,h6");
      return {
        kind,
        text: (el.innerText || "").replace(/\s+/g, " ").trim(),
        voice: [
          cs.fontFamily.split(",")[0].replace(/["']/g, "").trim(),
          (+parseFloat(cs.fontSize)).toFixed(2),
          cs.fontWeight,
          cs.textTransform,
        ].join(" · "),
        rank: host ? host.tagName : el.getAttribute("role") === "heading" ? "role=heading" : "—",
      };
    });
  const names = [
    ...pick(".section-heading", "staged eyebrow"),
    ...pick(".tray-well > .washi-tag", "compartment tape"),
    ...pick(".zone-row-label", "row caption"),
    ...pick(".proto-tab-word", "proto tab"),
  ].filter((n) => n.text);
  const chip = card.querySelector(".ctrl-btn");
  return {
    names,
    voices: Array.from(new Set(names.map((n) => n.voice))),
    ranks: Array.from(new Set(names.map((n) => n.rank))),
    docHeadings: names.filter((n) => n.rank !== "—").length,
    optionPx: chip ? +parseFloat(getComputedStyle(chip).fontSize).toFixed(2) : null,
    namePx: names.length ? Math.max(...names.map((n) => +n.voice.split(" · ")[1])) : null,
  };
};

for (const engine of ["chromium", "webkit"]) {
  for (const cell of CELLS) {
    const browser = await (engine === "webkit" ? webkit : chromium).launch();
    const ctx = await browser.newContext({
      viewport: { width: cell.w, height: cell.h },
      deviceScaleFactor: 1,
      isMobile: cell.mobile && engine === "chromium" ? true : undefined,
      hasTouch: cell.mobile,
    });
    await ctx.addInitScript(() => {
      try {
        localStorage.clear();
      } catch {}
    });
    const page = await ctx.newPage();
    await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
    await page.waitForSelector(".controls-card", { state: "attached", timeout: 30000 });
    await page.waitForTimeout(1400);
    const shutGeom = await page.evaluate(decompose); // SHUT: the board's own edge
    if (cell.sheet) {
      await page.locator(".drawer-tab").click({ force: true });
      await page.waitForTimeout(950);
    }
    const openGeom = await page.evaluate(decompose);
    out[`${cell.name}-${engine}`] = { shut: shutGeom, open: openGeom };
    await browser.close();
  }
}
writeFileSync(join(HERE, "tray-and-strip.json"), JSON.stringify(out, null, 1));

for (const [k, v] of Object.entries(out)) {
  if (!k.includes("chromium")) continue;
  const o = v.open,
    s = v.shut;
  console.log(`\n=== ${k}`);
  console.log(
    `  new game ${o.newGame?.h}  pad/gap ${JSON.stringify(o.newGamePad)}  deal-row ${o.dealRow?.h} (btn ${o.dealBtn?.h} tally ${o.tally?.h})`,
  );
  console.log(`  filtered kids: ${o.filteredKids.map((x) => `${x.cls.split(" ")[0]}=${x.h}${x.display === "none" ? "(none)" : ""}`).join(" ")}`);
  console.log(`  ctrlOptions: ${JSON.stringify(o.ctrlOptions)}  staged: ${JSON.stringify(o.stagedSections)}`);
  console.log(
    `  SHUT board paper ${JSON.stringify(s.boardPaper)} edge ${JSON.stringify(s.boardEdge)} tab ${JSON.stringify(s.drawerTab)}`,
  );
  console.log(`  SHUT foldTools ${JSON.stringify(s.foldTools)} playControls ${JSON.stringify(s.playControls)}`);
  console.log(`  SHUT play buttons ${s.playButtons.map((b) => `${b.label}:${b.w}x${b.h}`).join(" ")}`);
}
