// T9-W7 pass 2 · CRITIQUE · CTRL-TAPE — the critic's own re-run.
// Usage: node crit.mjs <engine> <baseURL>
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const { chromium, webkit } = require(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js",
);

const ENGINE = process.argv[2] || "chromium";
const BASE = process.argv[3] || "http://127.0.0.1:4233";
const launcher = ENGINE === "webkit" ? webkit : chromium;

const BOOT_HOOK = () => {
  window.__boot = [];
  const mo = new MutationObserver(() => {
    const card = document.querySelector(".controls-card");
    const sc = document.querySelector(".scene-controls");
    if (!card || window.__boot.length) return;
    const cs = getComputedStyle(card);
    window.__boot.push({
      at: performance.now(),
      maxHeight: cs.maxHeight,
      sheetChrome: sc ? getComputedStyle(sc).getPropertyValue("--sheet-chrome").trim() : null,
      caseOffset: getComputedStyle(document.documentElement)
        .getPropertyValue("--case-offset")
        .trim(),
      mastheadFoot: getComputedStyle(document.documentElement)
        .getPropertyValue("--masthead-foot")
        .trim(),
      cardH: card.getBoundingClientRect().height,
      innerH: window.innerHeight,
    });
    mo.disconnect();
  });
  mo.observe(document.documentElement, { childList: true, subtree: true });
};

async function openSheet(page, isDock) {
  if (!isDock) return;
  const tab = page.locator("#drawer-tab, .drawer-tab").first();
  if (await tab.count()) {
    await tab.click({ force: true }).catch(() => {});
    await page.waitForTimeout(900); // the sheet SLIDES
  }
}

const geom = () => {
  const out = {};
  const card = document.querySelector(".controls-card");
  const wrap = document.querySelector(".control-panel-wrap");
  const foot = document.querySelector("#card-foot");
  const bar = document.querySelector(".action-bar");
  const sc = document.querySelector(".scene-controls");
  if (!card) return { error: "no card" };
  const cs = getComputedStyle(card);
  out.cardPadTop = cs.paddingTop;
  out.pinBand = cs.getPropertyValue("--pin-band").trim();
  out.washiTagH = cs.getPropertyValue("--washi-tag-h").trim();
  out.cardMaxHeight = cs.maxHeight;
  out.cardClientH = card.clientHeight;
  out.cardScrollH = card.scrollHeight;
  out.cardW = card.getBoundingClientRect().width;
  out.wrapH = wrap ? wrap.getBoundingClientRect().height : null;
  out.sheetChrome = sc ? getComputedStyle(sc).getPropertyValue("--sheet-chrome").trim() : null;
  out.caseOffset = getComputedStyle(document.documentElement)
    .getPropertyValue("--case-offset")
    .trim();
  out.mastheadFoot = getComputedStyle(document.documentElement)
    .getPropertyValue("--masthead-foot")
    .trim();
  const cb = card.getBoundingClientRect();
  out.footFlush = foot
    ? {
        bottom: +foot.getBoundingClientRect().bottom.toFixed(2),
        innerH: window.innerHeight,
        topMinusCardBottom: +(foot.getBoundingClientRect().top - cb.bottom).toFixed(2),
        inCard: !!foot.closest(".controls-card"),
        h: +foot.getBoundingClientRect().height.toFixed(2),
      }
    : null;
  out.barInCard = bar ? !!bar.closest(".controls-card") : null;
  out.barPos = bar ? getComputedStyle(bar).position : null;

  // REST-STATE: every pinned/at-rest tape against every control below the exempt band.
  const clipTop = cb.top + card.clientTop;
  const band = clipTop + parseFloat(cs.paddingTop);
  const overlaps = [];
  const tapes = [...card.querySelectorAll(".washi-tag")];
  const controls = [
    ...card.querySelectorAll('button, [role="tab"], [role="radio"], input, select, [tabindex="0"]'),
  ];
  for (const t of tapes) {
    const tr = t.getBoundingClientRect();
    if (tr.width === 0) continue;
    for (const c of controls) {
      const cr = c.getBoundingClientRect();
      if (cr.width === 0 || cr.height === 0) continue;
      const w = Math.min(tr.right, cr.right) - Math.max(tr.left, cr.left);
      const h = Math.min(tr.bottom, cr.bottom) - Math.max(tr.top, cr.top);
      if (w > 0 && h > 0) {
        const belowBand = +(tr.bottom - band).toFixed(2);
        overlaps.push({
          tape: t.textContent.trim().slice(0, 14),
          ctl: (c.getAttribute("aria-label") || c.textContent || "").trim().slice(0, 14),
          area: +(w * h).toFixed(2),
          tapeBottomMinusBand: belowBand,
        });
      }
    }
  }
  out.tapeOverlaps = overlaps;
  out.worstBelowBand = tapes.length
    ? +Math.max(
        ...tapes
          .map((t) => t.getBoundingClientRect())
          .filter((r) => r.width > 0)
          .map((r) => r.bottom - band),
      ).toFixed(2)
    : null;

  // The BAR against visible controls (clipped to the port).
  if (bar) {
    const br = bar.getBoundingClientRect();
    let worst = 0;
    for (const c of controls) {
      const cr = c.getBoundingClientRect();
      const top = Math.max(cr.top, clipTop);
      const bot = Math.min(cr.bottom, clipTop + card.clientHeight);
      if (bot <= top) continue;
      const w = Math.min(br.right, cr.right) - Math.max(br.left, cr.left);
      const h = Math.min(br.bottom, bot) - Math.max(br.top, top);
      if (w > 0 && h > 0) worst = Math.max(worst, w * h);
    }
    out.barWorstCover = +worst.toFixed(2);
  }

  // The tape's crossing of its well's drawn stroke (the memorable thing).
  out.crossing = [...card.querySelectorAll(".tray-well")].map((well) => {
    const tag = well.querySelector(":scope > .washi-tag");
    const path = well.querySelector(".outline-svg .boil-pose.is-active path, .outline-svg path");
    if (!tag || !path) return null;
    const tr = tag.getBoundingClientRect();
    const pr = path.getBoundingClientRect();
    return {
      name: tag.textContent.trim().slice(0, 12),
      gap: +(pr.top - tr.bottom).toFixed(2), // >0 = tape ends ABOVE the stroke (no crossing)
      cross: +(tr.bottom - pr.top).toFixed(2),
    };
  });

  // The deck's tape voice (pi) — rung + box, read on the card's surface for contrast.
  out.docHeadings = document.querySelectorAll("h1,h2,h3,h4,h5,h6").length;
  out.cardHeadings = [...card.querySelectorAll("h1,h2,h3,h4,h5,h6")].map((h) =>
    h.textContent.trim().slice(0, 16),
  );
  out.tapeFontSizes = [
    ...new Set(tapes.filter((t) => t.getBoundingClientRect().width > 0).map((t) => getComputedStyle(t).fontSize)),
  ];
  return out;
};

const deckGeom = () => {
  const band = document.querySelector(".staging-band, [class*='staging']");
  const tape = document.querySelector(".staging-band .washi-label, .washi-label");
  const card = document.querySelector(".game-card, [class*='card-wordmark']");
  return {
    bandH: band ? +band.getBoundingClientRect().height.toFixed(2) : null,
    tapeTag: tape ? tape.tagName : null,
    tapeBox: tape
      ? `${tape.getBoundingClientRect().width.toFixed(2)}x${tape.getBoundingClientRect().height.toFixed(2)}`
      : null,
    tapeFontSize: tape ? getComputedStyle(tape).fontSize : null,
    firstCardY: card ? +card.getBoundingClientRect().top.toFixed(2) : null,
    headings: document.querySelectorAll("h1,h2,h3,h4,h5,h6").length,
  };
};

const CELLS = [
  { name: "rail-1440x900", w: 1440, h: 900, dock: false, coarse: false },
  { name: "seal-1280x800-coarse", w: 1280, h: 800, dock: false, coarse: true },
  { name: "dock-390x844", w: 390, h: 844, dock: true, coarse: true },
  { name: "landscape-844x390", w: 844, h: 390, dock: true, coarse: true },
  { name: "landscape-900x500", w: 900, h: 500, dock: true, coarse: true },
];

const res = { engine: ENGINE, cells: {}, boot: {}, deck: {}, theme: {} };
const browser = await launcher.launch();

for (const cell of CELLS) {
  const ctx = await browser.newContext({
    viewport: { width: cell.w, height: cell.h },
    deviceScaleFactor: 1,
    hasTouch: cell.coarse,
    isMobile: false,
    colorScheme: "light",
  });
  const page = await ctx.newPage();
  await page.addInitScript(BOOT_HOOK);
  await page.goto(`${BASE}/sudoku`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  res.boot[cell.name] = await page.evaluate(() => window.__boot[0] || null);
  await openSheet(page, cell.dock);
  await page.waitForTimeout(400);
  res.cells[cell.name] = await page.evaluate(geom);
  await ctx.close();
}

// The DECK (pi on a surface this family does not claim).
for (const cell of [
  { name: "deck-390x844", w: 390, h: 844 },
  { name: "deck-1280x800", w: 1280, h: 800 },
]) {
  const ctx = await browser.newContext({ viewport: { width: cell.w, height: cell.h }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  res.deck[cell.name] = await page.evaluate(deckGeom);
  // STALE GLOBAL: does --case-offset survive on the deck / after a scene unmounts?
  res.deck[cell.name].caseOffsetOnDeck = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue("--case-offset").trim(),
  );
  await ctx.close();
}

console.log(JSON.stringify(res, null, 1));
await browser.close();
