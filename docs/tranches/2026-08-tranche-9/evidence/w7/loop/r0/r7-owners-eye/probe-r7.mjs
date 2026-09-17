// T9-W7 round zero · lane R7 (THE OWNER'S EYE) — scratch probe. READ-ONLY on the product.
// Re-derives the pixel behind each owner mark on THIS tree, both engines, and crops the
// region the mark names. Nothing here is a product file; it is banked as evidence.
//
//   node probe-r7.mjs            (dev server must be up at 127.0.0.1:4247)
//
const { chromium, webkit } = await import(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs"
);
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, "frames");
mkdirSync(OUT, { recursive: true });
const BASE = "http://127.0.0.1:4247/";

const out = {};
const note = (k, v) => {
  out[k] = v;
};

async function newCtx(engine, { width, height, dark, mobile, dsf = 2 }) {
  const browser = await (engine === "webkit" ? webkit : chromium).launch();
  const ctx = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: dsf,
    isMobile: mobile ? true : undefined,
    hasTouch: !!mobile,
    colorScheme: dark ? "dark" : "light",
  });
  await ctx.addInitScript(
    (d) => {
      try {
        localStorage.setItem("sudoku-color-scheme", d ? "dark" : "light");
      } catch {
        /* private mode */
      }
    },
    !!dark,
  );
  return { browser, ctx };
}

async function loadBoard(page, query = "?size=3&difficulty=EASY") {
  await page.goto(BASE + query, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
  await page.addStyleTag({ content: ".tuner-toggle { display: none !important; }" });
  await page
    .waitForFunction(() => document.querySelectorAll(".sudoku-cell .glyph-svg").length > 0, {
      timeout: 20000,
    })
    .catch(() => {});
  await page.waitForTimeout(1400); // draw-in → boil steady state
}

const boxOf = (page, sel, i = 0) =>
  page.evaluate(
    ([s, idx]) => {
      const e = document.querySelectorAll(s)[idx];
      if (!e) return null;
      const r = e.getBoundingClientRect();
      const cs = getComputedStyle(e);
      return {
        sel: s,
        text: (e.textContent || "").trim().slice(0, 40),
        x: +r.x.toFixed(1),
        y: +r.y.toFixed(1),
        w: +r.width.toFixed(1),
        h: +r.height.toFixed(1),
        fontSize: cs.fontSize,
        fontFamily: cs.fontFamily.split(",")[0].replace(/["']/g, ""),
        fontWeight: cs.fontWeight,
        color: cs.color,
        opacity: cs.opacity,
        position: cs.position,
        display: cs.display,
        border: cs.borderTopWidth + " " + cs.borderTopStyle + " " + cs.borderTopColor,
        boxShadow: cs.boxShadow === "none" ? "none" : cs.boxShadow.slice(0, 60),
        bg: cs.backgroundColor,
      };
    },
    [sel, i],
  );

const allBoxes = (page, sel) =>
  page.evaluate(
    (s) =>
    [...document.querySelectorAll(s)].map((e) => {
      const r = e.getBoundingClientRect();
      const cs = getComputedStyle(e);
      return {
        text: (e.textContent || "").trim().slice(0, 32),
        x: +r.x.toFixed(1),
        y: +r.y.toFixed(1),
        w: +r.width.toFixed(1),
        h: +r.height.toFixed(1),
        fontSize: cs.fontSize,
        fontFamily: cs.fontFamily.split(",")[0].replace(/["']/g, ""),
        fontWeight: cs.fontWeight,
        color: cs.color,
        opacity: cs.opacity,
        position: cs.position,
        letterSpacing: cs.letterSpacing,
        textTransform: cs.textTransform,
      };
    }),
    sel,
  );

async function shot(page, name, clip) {
  const p = resolve(OUT, name + ".png");
  await page.screenshot({ path: p, clip });
  return p;
}

// ───────────────────────────────────────────────────────────── POSE 1+2+3: the phone
async function phone(engine, dark) {
  const tag = `${engine}-${dark ? "dark" : "light"}`;
  const { browser, ctx } = await newCtx(engine, {
    width: 390,
    height: 844,
    dark,
    mobile: true,
  });
  const page = await ctx.newPage();
  await loadBoard(page);

  const r = {};

  // ── M10 · the tab on the board's bottom edge vs. the stranded chip ──────────
  r.tab = await page.evaluate(() => {
    const t = document.querySelector(".drawer-tab");
    const paper = document.querySelector("#board-edge") || document.querySelector(".board-wrapper");
    if (!t) return { present: false };
    const tb = t.getBoundingClientRect();
    const pb = paper ? paper.getBoundingClientRect() : null;
    const cs = getComputedStyle(t);
    return {
      present: true,
      box: [+tb.x.toFixed(1), +tb.y.toFixed(1), +tb.width.toFixed(1), +tb.height.toFixed(1)],
      display: cs.display,
      zIndex: cs.zIndex,
      paperBottom: pb ? +pb.bottom.toFixed(1) : null,
      paperRight: pb ? +pb.right.toFixed(1) : null,
      gapToPaperBottom: pb ? +(tb.top - pb.bottom).toFixed(1) : null,
      label: (t.textContent || "").trim(),
      labelCount: t.querySelectorAll("*").length,
      quickActions: t.querySelectorAll("button").length,
      ariaExpanded: t.getAttribute("aria-expanded"),
    };
  });

  // ── M01/M04 · the fold's play controls (the owner's bottom toolbar) ─────────
  r.playControls = await page.evaluate(() => {
    const host = document.querySelector(".play-controls");
    if (!host) return null;
    const hb = host.getBoundingClientRect();
    const hcs = getComputedStyle(host);
    const btns = [...host.querySelectorAll("button")].map((b) => {
      const bb = b.getBoundingClientRect();
      const lbl = b.querySelector(".icon-sublabel, span:last-child");
      const lcs = lbl ? getComputedStyle(lbl) : null;
      return {
        name: (b.getAttribute("aria-label") || b.textContent || "").trim().slice(0, 28),
        w: +bb.width.toFixed(1),
        h: +bb.height.toFixed(1),
        labelPx: lcs ? lcs.fontSize : null,
        labelFamily: lcs ? lcs.fontFamily.split(",")[0].replace(/["']/g, "") : null,
      };
    });
    return {
      box: [+hb.x.toFixed(1), +hb.y.toFixed(1), +hb.width.toFixed(1), +hb.height.toFixed(1)],
      border:
        hcs.borderTopWidth +
        " " +
        hcs.borderTopStyle +
        " " +
        hcs.borderTopColor +
        " | b:" +
        hcs.borderBottomWidth,
      outline: hcs.outlineWidth + " " + hcs.outlineStyle,
      boxShadow: hcs.boxShadow === "none" ? "none" : hcs.boxShadow.slice(0, 70),
      bg: hcs.backgroundColor,
      hasDrawnOutline: !!host.querySelector("svg.hand-drawn-outline, .outline-container"),
      buttons: btns,
    };
  });

  // ── M14 · the player mark, top left ────────────────────────────────────────
  r.topLeft = await page.evaluate(() => {
    const hits = [...document.querySelectorAll("body *")]
      .filter((e) => {
        const b = e.getBoundingClientRect();
        return b.width > 0 && b.height > 0 && b.top < 140 && b.left < 170 && b.width < 260;
      })
      .map((e) => {
        const b = e.getBoundingClientRect();
        return {
          tag: e.tagName.toLowerCase(),
          cls: (e.className && e.className.baseVal !== undefined
            ? e.className.baseVal
            : String(e.className || "")
          ).slice(0, 44),
          text: (e.textContent || "").trim().slice(0, 24),
          box: [+b.x.toFixed(0), +b.y.toFixed(0), +b.width.toFixed(0), +b.height.toFixed(0)],
        };
      });
    return {
      candidates: hits.slice(0, 14),
      playerIconPresent: !!document.querySelector(
        "[data-player-mark], .player-mark, .presence-mark, .player-icon",
      ),
    };
  });

  // ── T8-M20 · does the wordmark lie on the grid? ────────────────────────────
  r.wordmarkFloat = await page.evaluate(() => {
    const w = document.querySelector("svg.handwritten-logo");
    const g = document.querySelector(".board-wrapper, .sudoku-board, .board-paper");
    if (!w || !g) return null;
    const wb = w.getBoundingClientRect();
    const gb = g.getBoundingClientRect();
    const overlap =
      Math.max(0, Math.min(wb.bottom, gb.bottom) - Math.max(wb.top, gb.top)) *
      Math.max(0, Math.min(wb.right, gb.right) - Math.max(wb.left, gb.left));
    return {
      wordmark: [+wb.x.toFixed(1), +wb.y.toFixed(1), +wb.width.toFixed(1), +wb.height.toFixed(1)],
      board: [+gb.x.toFixed(1), +gb.y.toFixed(1), +gb.width.toFixed(1), +gb.height.toFixed(1)],
      gapWordmarkBottomToBoardTop: +(gb.top - wb.bottom).toFixed(1),
      overlapPx2: +overlap.toFixed(1),
    };
  });

  // crop: the board's bottom edge + the tongue + the fold's bar (the M10/M04/M01 region)
  const tabY = r.tab.present ? r.tab.box[1] : 600;
  await shot(page, `p1-${tag}-boardedge-tab-bar`, {
    x: 0,
    y: Math.max(0, tabY - 60),
    width: 390,
    height: Math.min(300, 844 - Math.max(0, tabY - 60)),
  });

  // ── M12 · dirty board + a destructive act ──────────────────────────────────
  // write into the first empty cell, then reach for the destructive set.
  r.confirm = await (async () => {
    try {
      const cell = page.locator(".sudoku-cell input").first();
      await cell.focus({ timeout: 4000 });
      await page.keyboard.type("5");
      await page.waitForTimeout(400);
      const dirty = await page.evaluate(
        () => document.querySelectorAll(".sudoku-cell .glyph-svg").length,
      );
      return { wroteCell: true, glyphs: dirty };
    } catch (e) {
      return { wroteCell: false, why: String(e).slice(0, 80) };
    }
  })();

  // ── the sheet ─────────────────────────────────────────────────────────────
  await page.locator(".drawer-tab").click();
  await page.waitForTimeout(900); // the sheet SLIDES — settle before measuring

  r.sheet = {};
  r.sheet.case = await boxOf(page, "#controls-drawer .drawer-case");
  r.sheet.headings = await allBoxes(page, ".section-heading");
  r.sheet.washiTags = await allBoxes(page, ".tray-well .washi-tag");
  r.sheet.zoneLabels = await allBoxes(page, ".zone-row-label");
  r.sheet.actionBar = await page.evaluate(() => {
    const b = document.querySelector(".action-bar");
    if (!b) return null;
    const r2 = b.getBoundingClientRect();
    const cs = getComputedStyle(b);
    return {
      box: [+r2.x.toFixed(1), +r2.y.toFixed(1), +r2.width.toFixed(1), +r2.height.toFixed(1)],
      borderTop: cs.borderTopWidth + " " + cs.borderTopStyle + " " + cs.borderTopColor,
      borderAll: [
        cs.borderTopWidth,
        cs.borderRightWidth,
        cs.borderBottomWidth,
        cs.borderLeftWidth,
      ].join("/"),
      outline: cs.outlineWidth + " " + cs.outlineStyle,
      boxShadow: cs.boxShadow === "none" ? "none" : cs.boxShadow.slice(0, 80),
      bg: cs.backgroundColor,
      position: cs.position,
      hasDrawnOutline: !!b.querySelector("svg, .outline-container"),
      verbs: [...b.querySelectorAll("button")].map((x) => {
        const xb = x.getBoundingClientRect();
        const sub = x.querySelector(".icon-sublabel");
        return {
          t: (x.textContent || "").trim().slice(0, 14),
          w: +xb.width.toFixed(1),
          h: +xb.height.toFixed(1),
          subPx: sub ? getComputedStyle(sub).fontSize : null,
          subFamily: sub ? getComputedStyle(sub).fontFamily.split(",")[0].replace(/["']/g, "") : null,
        };
      }),
    };
  });
  // option buttons inside the sheet (M01's "all buttons and text larger")
  r.sheet.options = await page.evaluate(() => {
    const host = document.querySelector("#controls-drawer");
    if (!host) return [];
    return [...host.querySelectorAll(".option-selector button, .zone-row button")]
      .slice(0, 12)
      .map((b) => {
        const bb = b.getBoundingClientRect();
        const cs = getComputedStyle(b);
        return {
          t: (b.textContent || "").trim().slice(0, 14),
          w: +bb.width.toFixed(1),
          h: +bb.height.toFixed(1),
          px: cs.fontSize,
          family: cs.fontFamily.split(",")[0].replace(/["']/g, ""),
        };
      });
  });
  // M03 · the sheet's top border vs. the wordmark
  r.sheet.topEdgeVsWordmark = await page.evaluate(() => {
    const c = document.querySelector("#controls-drawer .drawer-case");
    const w = document.querySelector("svg.handwritten-logo");
    if (!c || !w) return null;
    const cb = c.getBoundingClientRect();
    const wb = w.getBoundingClientRect();
    const covered =
      Math.max(0, Math.min(wb.bottom, cb.bottom) - Math.max(wb.top, cb.top)) *
      Math.max(0, Math.min(wb.right, cb.right) - Math.max(wb.left, cb.left));
    return {
      caseTop: +cb.top.toFixed(1),
      wordmark: [+wb.x.toFixed(1), +wb.y.toFixed(1), +wb.width.toFixed(1), +wb.height.toFixed(1)],
      caseTopCrossesWordmark: cb.top > wb.top && cb.top < wb.bottom,
      wordmarkAreaCoveredPx2: +covered.toFixed(1),
      wordmarkFracCovered: +(covered / (wb.width * wb.height)).toFixed(4),
    };
  });
  // M03 · sticky: scroll the sheet and see which headings hold
  r.sheet.sticky = await page.evaluate(async () => {
    const sc =
      document.querySelector("#controls-drawer .drawer-scroll") ||
      document.querySelector("#controls-drawer .controls-card") ||
      document.querySelector("#controls-drawer");
    if (!sc) return null;
    const before = [...document.querySelectorAll(".tray-well .washi-tag, .section-heading")].map(
      (e) => ({ t: (e.textContent || "").trim().slice(0, 18), y: +e.getBoundingClientRect().y.toFixed(1), pos: getComputedStyle(e).position }),
    );
    sc.scrollTop = 240;
    await new Promise((r2) => setTimeout(r2, 260));
    const after = [...document.querySelectorAll(".tray-well .washi-tag, .section-heading")].map(
      (e) => {
        const b = e.getBoundingClientRect();
        const scb = sc.getBoundingClientRect();
        return {
          t: (e.textContent || "").trim().slice(0, 18),
          y: +b.y.toFixed(1),
          pos: getComputedStyle(e).position,
          insideScroller: b.top >= scb.top - 1 && b.bottom <= scb.bottom + 1,
        };
      },
    );
    const scrolled = sc.scrollTop;
    sc.scrollTop = 0;
    await new Promise((r2) => setTimeout(r2, 200));
    return { scrollTop: scrolled, scrollerH: +sc.getBoundingClientRect().height.toFixed(1), before, after };
  });

  const ct = r.sheet.case ? r.sheet.case.y : 150;
  await shot(page, `p2-${tag}-sheet-top-wordmark`, {
    x: 0,
    y: Math.max(0, ct - 110),
    width: 390,
    height: 230,
  });
  await shot(page, `p2-${tag}-sheet-bar`, {
    x: 0,
    y: Math.max(0, (r.sheet.actionBar ? r.sheet.actionBar.box[1] : 700) - 30),
    width: 390,
    height: 150,
  });

  await browser.close();
  return r;
}

// ───────────────────────────────────────────────────────────── POSE 4: landscape 900×500
async function landscape(engine) {
  const { browser, ctx } = await newCtx(engine, {
    width: 900,
    height: 500,
    dark: true,
    mobile: false,
    dsf: 1,
  });
  const page = await ctx.newPage();
  await loadBoard(page);
  const r = await page.evaluate(() => {
    const t = document.querySelector(".drawer-tab");
    const paper = document.querySelector(".board-wrapper, .sudoku-board");
    const pc = document.querySelector(".play-controls");
    const tb = t ? t.getBoundingClientRect() : null;
    const pb = paper ? paper.getBoundingClientRect() : null;
    const cb = pc ? pc.getBoundingClientRect() : null;
    return {
      tab: t
        ? {
            box: [+tb.x.toFixed(1), +tb.y.toFixed(1), +tb.width.toFixed(1), +tb.height.toFixed(1)],
            display: getComputedStyle(t).display,
            edge: tb.left > (pb ? pb.right - 60 : 0) ? "right flank" : "elsewhere",
          }
        : null,
      board: pb ? [+pb.x.toFixed(1), +pb.y.toFixed(1), +pb.width.toFixed(1), +pb.height.toFixed(1)] : null,
      playControls: cb
        ? { box: [+cb.x.toFixed(1), +cb.y.toFixed(1), +cb.width.toFixed(1), +cb.height.toFixed(1)], reachable: cb.bottom <= innerHeight }
        : null,
      docScrollH: document.documentElement.scrollHeight,
      innerH: innerHeight,
    };
  });
  await shot(page, `p4-${engine}-landscape900x500`, { x: 0, y: 0, width: 900, height: 500 });
  await browser.close();
  return r;
}

// ───────────────────────────────────────────────────────────── POSE 5: T8-M20 wordmark float
async function wordmarkFloat(engine) {
  const { browser, ctx } = await newCtx(engine, {
    width: 900,
    height: 760,
    dark: true,
    mobile: false,
    dsf: 1,
  });
  const page = await ctx.newPage();
  await loadBoard(page);
  const r = await page.evaluate(() => {
    const w = document.querySelector("svg.handwritten-logo");
    const paper = document.querySelector(".board-wrapper, .sudoku-board");
    const wb = w.getBoundingClientRect();
    const pb = paper.getBoundingClientRect();
    const ov =
      Math.max(0, Math.min(wb.bottom, pb.bottom) - Math.max(wb.top, pb.top)) *
      Math.max(0, Math.min(wb.right, pb.right) - Math.max(wb.left, pb.left));
    return {
      wordmark: [+wb.x.toFixed(1), +wb.y.toFixed(1), +wb.width.toFixed(1), +wb.height.toFixed(1)],
      board: [+pb.x.toFixed(1), +pb.y.toFixed(1), +pb.width.toFixed(1), +pb.height.toFixed(1)],
      gap: +(pb.top - wb.bottom).toFixed(1),
      overlapPx2: +ov.toFixed(1),
      lies: ov > 0,
      innerH: innerHeight,
      docScrollH: document.documentElement.scrollHeight,
    };
  });
  await shot(page, `p5-${engine}-wordmark-float-900`, {
    x: Math.max(0, r.wordmark[0] - 40),
    y: Math.max(0, r.wordmark[1] - 24),
    width: Math.min(560, 900),
    height: Math.min(230, 760),
  });
  await browser.close();
  return r;
}

// ───────────────────────────────────────────────────────────── POSE 6: the W2 residual, 1280×800
async function residual(engine) {
  const { browser, ctx } = await newCtx(engine, {
    width: 1280,
    height: 800,
    dark: false,
    mobile: false,
    dsf: 1,
  });
  const page = await ctx.newPage();
  await loadBoard(page);
  const r = await page.evaluate(async () => {
    const card = document.querySelector(".controls-card") || document.querySelector(".control-panel-wrap");
    if (!card) return { card: false };
    const sc = card.scrollHeight > card.clientHeight ? card : card.querySelector("*");
    const scroller = card.scrollHeight > card.clientHeight ? card : document.querySelector(".controls-card, .control-panel-filtered");
    if (scroller) scroller.scrollTop = 327;
    await new Promise((r2) => setTimeout(r2, 300));
    const cb = card.getBoundingClientRect();
    const opts = [...document.querySelectorAll("button, [role=radio]")]
      .filter((e) => /^(Easy|Medium|Hard|Expert)$/i.test((e.textContent || "").trim()))
      .map((e) => {
        const b = e.getBoundingClientRect();
        const inside =
          Math.max(0, Math.min(b.bottom, cb.bottom) - Math.max(b.top, cb.top)) *
          Math.max(0, Math.min(b.right, cb.right) - Math.max(b.left, cb.left));
        return {
          t: (e.textContent || "").trim(),
          box: [+b.x.toFixed(1), +b.y.toFixed(1), +b.width.toFixed(1), +b.height.toFixed(1)],
          insideFrac: +(inside / (b.width * b.height)).toFixed(4),
        };
      });
    const tag = [...document.querySelectorAll(".washi-tag")]
      .map((e) => {
        const b = e.getBoundingClientRect();
        return {
          t: (e.textContent || "").trim().slice(0, 14),
          box: [+b.x.toFixed(1), +b.y.toFixed(1), +b.width.toFixed(1), +b.height.toFixed(1)],
          pos: getComputedStyle(e).position,
        };
      })
      .filter((x) => /new game/i.test(x.t));
    return {
      card: [+cb.x.toFixed(1), +cb.y.toFixed(1), +cb.width.toFixed(1), +cb.height.toFixed(1)],
      scrollTop: scroller ? scroller.scrollTop : null,
      foldAbove: document.documentElement.getAttribute("data-fold-above") ||
        (card.getAttribute("data-fold-above") ?? null),
      cardPadT: getComputedStyle(card).paddingTop,
      options: opts,
      newGameTag: tag,
      unused: !!sc,
    };
  });
  if (r.card) {
    await shot(page, `p6-${engine}-residual-1280x800`, {
      x: Math.max(0, r.card[0] - 10),
      y: Math.max(0, r.card[1] - 20),
      width: Math.min(360, 1280),
      height: 170,
    });
  }
  await browser.close();
  return r;
}

// ───────────────────────────────────────────────────────────── the ink/hue census (M07)
async function hues(engine) {
  const { browser, ctx } = await newCtx(engine, {
    width: 390,
    height: 844,
    dark: true,
    mobile: true,
  });
  const page = await ctx.newPage();
  await loadBoard(page);
  const r = await page.evaluate(() => {
    const cs = getComputedStyle(document.documentElement);
    const names = [
      "--color-accent",
      "--color-primary",
      "--color-ring",
      "--color-selection",
      "--color-peer",
      "--color-foreground",
      "--color-card",
      "--color-background",
      "--ink-given",
      "--ink-entered",
      "--ink-conflict",
      "--progress-ink",
      "--color-progress",
      "--peer-wash",
      "--sheet-washi-neutral",
    ];
    const tok = {};
    for (const n of names) {
      const v = cs.getPropertyValue(n).trim();
      if (v) tok[n] = v;
    }
    // every custom property the root actually declares, filtered to colour-looking values
    const all = {};
    for (const sheet of [...document.styleSheets]) {
      let rules;
      try {
        rules = sheet.cssRules;
      } catch {
        continue;
      }
      for (const rule of rules || []) {
        if (!rule.style || !rule.selectorText) continue;
        if (!/:root|^html$/.test(rule.selectorText)) continue;
        for (const p of rule.style) {
          if (!p.startsWith("--")) continue;
          const v = rule.style.getPropertyValue(p).trim();
          if (/^(#|rgb|hsl|oklch|color\()/.test(v)) all[p] = v;
        }
      }
    }
    return { tokens: tok, rootColorVars: all };
  });
  await browser.close();
  return r;
}

// ───────────────────────────────────────────────────────────── run
const engines = ["webkit", "chromium"];
for (const e of engines) {
  note(`phone-dark-${e}`, await phone(e, true));
  note(`phone-light-${e}`, await phone(e, false));
  note(`landscape-${e}`, await landscape(e));
  note(`wordmarkFloat-${e}`, await wordmarkFloat(e));
  note(`residual-${e}`, await residual(e));
}
note("hues-webkit", await hues("webkit"));

writeFileSync(resolve(HERE, "probe-r7.json"), JSON.stringify(out, null, 2));
console.log("OK →", resolve(HERE, "probe-r7.json"));
