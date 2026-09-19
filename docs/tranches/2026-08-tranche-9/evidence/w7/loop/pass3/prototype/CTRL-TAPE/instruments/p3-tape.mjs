/**
 * T9-W7 pass 2 · PROTOTYPE · CTRL-TAPE — the measurement pass over the built prototype.
 *
 * One server (:4230, the worktree), two engines, the cells the brief names. Every row is a
 * number the brief calls for; nothing here writes to the product.
 *
 *   node p2-tape.mjs <outfile.json> [chromium|webkit]
 */
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
import { writeFileSync } from "node:fs";

const OUT = process.argv[2];
const ONLY = process.argv[3] === "chromium" || process.argv[3] === "webkit" ? process.argv[3] : undefined;
const BASE = process.argv[4] || "http://127.0.0.1:4230";

async function loadBoard(page) {
  await page.goto("/?size=3&difficulty=EASY");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 30000 });
  await page.waitForSelector("g.boil-frame-layer.is-active", {
    state: "attached",
    timeout: 30000,
  });
}

/** B + C · the card at one scroll state — the pass-2 research predicate, unchanged. */
const CARD = () => {
  const card = document.querySelector(".controls-card");
  if (!card) return null;
  const s = getComputedStyle(card);
  const cb = card.getBoundingClientRect();
  const padTop = parseFloat(s.paddingTop) || 0;
  const liveTop = cb.top + card.clientTop + padTop;
  const inter = [
    ...card.querySelectorAll(
      'button, [role="button"], input, select, a[href], [tabindex]:not([tabindex="-1"])',
    ),
  ].filter((e) => {
    const b = e.getBoundingClientRect();
    return b.width > 0 && b.height > 0;
  });
  const tapes = [];
  for (const tape of card.querySelectorAll(".washi-tag, .zone-row-label")) {
    const ts = getComputedStyle(tape);
    if (ts.display === "none" || ts.visibility === "hidden" || +ts.opacity < 0.05)
      continue;
    const t = tape.getBoundingClientRect();
    if (t.width === 0 || t.height === 0) continue;
    const pinned = ts.position === "sticky" && !tape.hasAttribute("data-released");
    const hits = [];
    for (const el of inter) {
      const b = el.getBoundingClientRect();
      const w = Math.max(0, Math.min(b.right, t.right) - Math.max(b.left, t.left));
      const hGate = Math.max(
        0,
        Math.min(b.bottom, t.bottom) -
          Math.max(
            b.top,
            t.top,
            card.hasAttribute("data-fold-above") ? liveTop : -Infinity,
          ),
      );
      const hRaw = Math.max(0, Math.min(b.bottom, t.bottom) - Math.max(b.top, t.top));
      if (w * hRaw <= 0.5) continue;
      const px = (Math.max(b.left, t.left) + Math.min(b.right, t.right)) / 2;
      const py = (Math.max(b.top, t.top) + Math.min(b.bottom, t.bottom)) / 2;
      const hit = document.elementFromPoint(px, py);
      hits.push({
        target: el.getAttribute("aria-label") || (el.textContent || "").trim().slice(0, 24),
        gatePx: +(w * hGate).toFixed(1),
        rawPx: +(w * hRaw).toFixed(1),
        hitIsTarget: hit === el || (hit ? el.contains(hit) : false),
        hitWas: hit ? (hit.className && String(hit.className).slice(0, 28)) || hit.tagName : null,
      });
    }
    tapes.push({
      text: (tape.textContent || "").trim().slice(0, 20),
      tagName: tape.tagName,
      pinned,
      released: tape.hasAttribute("data-released"),
      fontPx: +parseFloat(ts.fontSize).toFixed(2),
      box: {
        top: +(t.top - cb.top).toFixed(2),
        h: +t.height.toFixed(2),
        w: +t.width.toFixed(2),
      },
      belowExemptBand: +(t.bottom - liveTop).toFixed(2),
      hits,
    });
  }
  /** THE BAR, now a sibling of the card: its overlap with any control, anywhere. */
  const bar = document.querySelector(".action-bar");
  let barRow = null;
  if (bar) {
    const bb = bar.getBoundingClientRect();
    let worst = 0;
    let who = null;
    // A control's VISIBLE box, clipped to the scrollport it lives in: a row scrolled out of the
    // card still has a rect down there, and an intersection with an unclipped rect reports a
    // burial of something nobody can see (it read 3,738px² against `Deal` that way).
    const clipT = cb.top + card.clientTop;
    const clipB = clipT + card.clientHeight;
    for (const el of inter) {
      const b = el.getBoundingClientRect();
      const vt = Math.max(b.top, clipT);
      const vb = Math.min(b.bottom, clipB);
      if (vb - vt <= 0) continue;
      const w = Math.max(0, Math.min(b.right, bb.right) - Math.max(b.left, bb.left));
      const h = Math.max(0, Math.min(vb, bb.bottom) - Math.max(vt, bb.top));
      if (w * h > worst) {
        worst = w * h;
        who = el.getAttribute("aria-label") || (el.textContent || "").trim().slice(0, 20);
      }
    }
    barRow = {
      position: getComputedStyle(bar).position,
      inCard: card.contains(bar),
      topMinusCardBottom: +(bb.top - cb.bottom).toFixed(2),
      coverPx: +worst.toFixed(2),
      coverWho: who,
      h: +bb.height.toFixed(2),
    };
  }
  /** THE STRADDLE — where each tape's top sits against its own well's drawn top stroke. */
  const straddle = [];
  for (const well of card.querySelectorAll(".tray-well")) {
    const tape = well.querySelector(":scope > .washi-tag");
    const path = well.querySelector(":scope > svg path");
    if (!tape || !path) continue;
    const t = tape.getBoundingClientRect();
    const p = path.getBoundingClientRect();
    const wb = well.getBoundingClientRect();
    straddle.push({
      text: (tape.textContent || "").trim().slice(0, 12),
      pinned: getComputedStyle(tape).position === "sticky" && !tape.hasAttribute("data-released"),
      /** how much of the tape sits ABOVE the well's drawn stroke (the crossing) */
      aboveStrokePx: +(p.top + 0.75 - t.top).toFixed(2),
      tapeH: +t.height.toFixed(2),
      wellPadTop: +parseFloat(getComputedStyle(well).paddingTop).toFixed(2),
      tapeBottomToWellContent: +(wb.top + parseFloat(getComputedStyle(well).paddingTop) - t.bottom).toFixed(2),
    });
  }
  return {
    padTop: +padTop.toFixed(2),
    padBottom: +(parseFloat(s.paddingBottom) || 0).toFixed(2),
    pinBand: getComputedStyle(card).getPropertyValue("--pin-band").trim(),
    washiTagH: getComputedStyle(card).getPropertyValue("--washi-tag-h").trim(),
    cardFootH: getComputedStyle(card).getPropertyValue("--card-foot-h").trim(),
    clientH: card.clientHeight,
    scrollH: card.scrollHeight,
    cardW: +cb.width.toFixed(2),
    cardTop: +cb.top.toFixed(2),
    foldAbove: card.hasAttribute("data-fold-above"),
    foldBelow: card.hasAttribute("data-fold-below"),
    tapes,
    bar: barRow,
    straddle,
  };
};

/** THE SEAM + THE PUBLISHER — read on the risen sheet. */
const SEAM = () => {
  const root = getComputedStyle(document.documentElement);
  const rail = document.querySelector("#controls-drawer");
  const path = document.querySelector("#controls-drawer .drawer-case svg path");
  const ink = document.querySelector(".handwritten-logo")?.closest("button, a, div") ?? null;
  const logo = document.querySelector("svg.handwritten-logo");
  const casePath = document.querySelector(
    "#controls-drawer .drawer-case > .outline-svg .boil-pose.is-active path",
  );
  const pub = parseFloat(root.getPropertyValue("--masthead-foot"));
  const off = parseFloat(root.getPropertyValue("--case-offset"));
  const chrome = rail ? getComputedStyle(rail).getPropertyValue("--sheet-chrome").trim() : null;
  const logoBox = logo ? logo.getBoundingClientRect() : null;
  const inkBox = ink ? ink.getBoundingClientRect() : null;
  const strokeTop = casePath ? casePath.getBoundingClientRect().top : null;
  return {
    publishedFoot: isNaN(pub) ? null : +pub.toFixed(2),
    measuredFoot: inkBox ? +inkBox.bottom.toFixed(2) : null,
    logoFoot: logoBox ? +logoBox.bottom.toFixed(2) : null,
    caseOffset: isNaN(off) ? null : +off.toFixed(2),
    sheetChrome: chrome,
    railTop: rail ? +rail.getBoundingClientRect().top.toFixed(2) : null,
    strokeTop: strokeTop === null ? null : +strokeTop.toFixed(2),
    /** the air the reader sees: the case's stroke against the wordmark's foot */
    seam:
      strokeTop !== null && logoBox ? +(strokeTop - logoBox.bottom).toFixed(2) : null,
    cardMaxH: (() => {
      const c = document.querySelector(".controls-card");
      return c ? getComputedStyle(c).maxHeight : null;
    })(),
  };
};

/** THE TABS — the accessible names, and the tap floor on the tab's own box. */
const TABS = () => {
  const out = [];
  for (const head of document.querySelectorAll(".mobile-heading-head")) {
    const h2 = head.querySelector("h2");
    const btn = head.querySelector("button");
    const b = head.getBoundingClientRect();
    out.push({
      headingText: h2 ? (h2.textContent || "").trim() : null,
      headingTag: h2 ? h2.tagName : null,
      btnLabelledby: btn ? btn.getAttribute("aria-labelledby") : null,
      btnBox: btn
        ? (() => {
            const r = btn.getBoundingClientRect();
            return { w: +r.width.toFixed(2), h: +r.height.toFixed(2) };
          })()
        : null,
      tabBox: { w: +b.width.toFixed(2), h: +b.height.toFixed(2) },
    });
  }
  return out;
};

const CELLS = [
  { name: "rail-1440x900", w: 1440, h: 900, dock: false },
  { name: "rail-1280x800", w: 1280, h: 800, dock: false },
  { name: "dock-390x844", w: 390, h: 844, dock: true },
  { name: "dock-375x812", w: 375, h: 812, dock: true },
  { name: "dock-430x932", w: 430, h: 932, dock: true },
  { name: "land-900x500", w: 900, h: 500, dock: true },
  { name: "land-844x390", w: 844, h: 390, dock: true },
];

const out = {};
for (const [engName, eng] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  if (ONLY && ONLY !== engName) continue;
  const browser = await eng.launch();
  for (const cell of CELLS) {
    const ctx = await browser.newContext({
      baseURL: BASE,
      viewport: { width: cell.w, height: cell.h },
      hasTouch: cell.dock,
    });
    const page = await ctx.newPage();
    const key = `${engName}|${cell.name}`;
    try {
      await loadBoard(page);
      const shut = await page.evaluate(SEAM);
      if (cell.dock) {
        await page.locator(".drawer-tab").click();
        await page.waitForSelector("#controls-drawer .drawer-case", { state: "visible" });
        await page.waitForTimeout(900); // the sheet SLIDES
      }
      const open = await page.evaluate(SEAM);
      const tabs = await page.evaluate(TABS);
      const range = await page.evaluate(() => {
        const c = document.querySelector(".controls-card");
        return c ? c.scrollHeight - c.clientHeight : 0;
      });
      const states = [];
      for (const f of [0, 0.25, 0.5, 0.75, 1]) {
        await page.evaluate((y) => {
          const c = document.querySelector(".controls-card");
          if (c) c.scrollTop = y;
        }, Math.round(range * f));
        await page.waitForTimeout(260);
        states.push({ frac: f, ...(await page.evaluate(CARD)) });
      }
      out[key] = { range, shut, open, tabs, states };
    } catch (e) {
      out[key] = { error: String(e).slice(0, 220) };
    }
    await ctx.close();
  }
  await browser.close();
}
writeFileSync(OUT, JSON.stringify(out, null, 1));
console.log("banked", OUT);
