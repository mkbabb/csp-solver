// T9-W7 pass 1 · CTRL-TAPE — THE LANE PROBE.
//
//   node ctrl-tape.probe.mjs            # HEAD, no overlay
//   node ctrl-tape.probe.mjs --overlay  # the family's prototype
//   node ctrl-tape.probe.mjs --naive    # + the charter's literal `--type-tag` re-point
//
// Dev server: 127.0.0.1:4230 (`npx vite --host 127.0.0.1 --port 4230 --strictPort` from
// web/frontend). Read-only on the product; the overlay is `addStyleTag` + `evaluate` only.
// Every reading is taken in BOTH engines at the cell it belongs to.

const ROOT = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion";
const { chromium, webkit } = await import(`${ROOT}/web/frontend/node_modules/playwright/index.mjs`);
const sharp = (await import(`${ROOT}/web/frontend/node_modules/sharp/dist/index.cjs`)).default;
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { OVERLAY_CSS, DOM_PATCH, VARIANT_NAIVE } from "../proto/overlay.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "..");
const BASE = "http://127.0.0.1:4230/";
const WITH_OVERLAY = process.argv.includes("--overlay") || process.argv.includes("--naive");
const NAIVE = process.argv.includes("--naive");
const TAG = NAIVE ? "naive" : WITH_OVERLAY ? "after" : "before";

const engines = { chromium, webkit };
const report = { tag: TAG, base: BASE, at: new Date().toISOString(), cells: {} };
const put = (cell, engine, key, value) => {
  ((report.cells[cell] ??= {})[engine] ??= {})[key] = value;
};

async function open(engine, { w, h, mobile = false, dark = false, sheet = false }) {
  const browser = await engines[engine].launch();
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 1,
    hasTouch: mobile,
    isMobile: mobile && engine === "chromium",
    colorScheme: dark ? "dark" : "light",
  });
  await ctx.addInitScript((d) => {
    try {
      localStorage.clear();
      localStorage.setItem("sudoku-color-scheme", d ? "dark" : "light");
    } catch {}
  }, dark);
  const page = await ctx.newPage();
  await page.goto(`${BASE}?size=3&difficulty=EASY`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.waitForSelector(".controls-card", { state: "attached", timeout: 30000 });
  await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await page.waitForTimeout(1400);
  if (sheet && (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed")))) {
    await page.locator(".drawer-tab").click({ force: true });
    await page.waitForTimeout(950); // the dock sheet SLIDES
  }
  if (WITH_OVERLAY) {
    if (NAIVE) await page.addStyleTag({ content: VARIANT_NAIVE });
    await page.addStyleTag({ content: OVERLAY_CSS });
    const patched = await page.evaluate(DOM_PATCH);
    await page.waitForTimeout(500);
    return { browser, page, patched };
  }
  return { browser, page, patched: null };
}

/* ══ 1 · THE VOICE — eight names, one tuple, one rank, and the tape's overhang ══════════ */
const NAMES = () => {
  const card = document.querySelector(".controls-card") ?? document;
  const rows = [];
  const pick = (sel, kind) => {
    for (const el of card.querySelectorAll(sel)) {
      const cs = getComputedStyle(el);
      const b = el.getBoundingClientRect();
      const host = el.closest("h1,h2,h3,h4,h5,h6");
      const well = el.closest(".tray-well");
      rows.push({
        kind,
        text: (el.innerText || el.textContent || "").replace(/\s+/g, " ").trim(),
        voice: [
          cs.fontFamily.split(",")[0].replace(/["']/g, "").trim(),
          (+parseFloat(cs.fontSize)).toFixed(2),
          cs.fontWeight,
          cs.textTransform,
        ].join(" · "),
        rank: host ? host.tagName : "—",
        ink: cs.color,
        box: [b.x, b.y, b.width, b.height].map((n) => +n.toFixed(2)),
        /* the tape's OVERHANG: how far its box rises above the well's own border-box top */
        overhang: well && kind === "compartment tape" ? +(well.getBoundingClientRect().top - b.top).toFixed(2) : null,
      });
    }
  };
  pick(".section-heading", "staged name");
  pick(".tray-well > .washi-tag", "compartment tape");
  pick(".zone-row-label", "row caption");
  const chip = card.querySelector(".ctrl-btn");
  const optionPx = chip ? +parseFloat(getComputedStyle(chip).fontSize).toFixed(2) : null;
  const namePx = rows.length ? Math.max(...rows.map((r) => +r.voice.split(" · ")[1])) : null;
  /* the other consumers of `--type-tag`, so the collision is priced rather than asserted */
  const px = (s) => {
    const e = document.querySelector(s);
    return e ? +parseFloat(getComputedStyle(e).fontSize).toFixed(2) : null;
  };
  return {
    rows,
    voices: [...new Set(rows.map((r) => r.voice))],
    docHeadings: rows.filter((r) => r.rank !== "—").length,
    names: rows.length,
    optionPx,
    namePx,
    ratio: namePx && optionPx ? +(namePx / optionPx).toFixed(4) : null,
    tagConsumers: {
      "--type-tag": getComputedStyle(document.documentElement).getPropertyValue("--type-tag").trim(),
      headingValue: px(".heading-value"),
      playersLeave: px(".players-leave"),
      playerRow: px(".player-row"),
      playersStatus: px(".players-status"),
    },
    cardTopClearance: (() => {
      const c = document.querySelector(".controls-card");
      const t = card.querySelector(".tray-well .washi-tag");
      if (!c || !t) return null;
      return +(t.getBoundingClientRect().top - c.getBoundingClientRect().top).toFixed(2);
    })(),
  };
};

/* ══ 2 · THE CHROME — the bar, the card's scroll, the radii, the z ladder ══════════════ */
const CHROME = () => {
  const card = document.querySelector(".controls-card");
  const wrap = document.querySelector(".controls-card .control-panel-wrap");
  const bar = document.querySelector(".action-bar");
  const cs = bar && getComputedStyle(bar);
  const bb = bar && bar.getBoundingClientRect();
  let worst = 0, who = null;
  if (bb)
    for (const w of document.querySelectorAll(".tray-well")) {
      const wb = w.getBoundingClientRect();
      const ov =
        Math.max(0, Math.min(wb.bottom, bb.bottom) - Math.max(wb.top, bb.top)) *
        Math.max(0, Math.min(wb.right, bb.right) - Math.max(wb.left, bb.left));
      const f = ov / Math.max(1, wb.width * wb.height);
      if (f > worst) { worst = f; who = (w.querySelector(".washi-tag")?.textContent || "?").trim(); }
    }
  /* THE BURIAL ROW, added BESIDE I2. I2 reads raw rects, so a well clipped away by the card's
     own scrollport still counts as "covered". What the owner's mark means by buried is the
     VISIBLE part of a group lying under the bar, so the well's box is clipped to the card's
     client box first and the overlap is read against that. */
  let buried = 0, buriedWho = null;
  if (bb && card) {
    const cb = card.getBoundingClientRect();
    const clip = {
      top: cb.top + card.clientTop, left: cb.left + card.clientLeft,
      bottom: cb.top + card.clientTop + card.clientHeight, right: cb.left + card.clientLeft + card.clientWidth,
    };
    for (const w of document.querySelectorAll(".tray-well")) {
      const r = w.getBoundingClientRect();
      const vt = Math.max(r.top, clip.top), vb = Math.min(r.bottom, clip.bottom);
      const vl = Math.max(r.left, clip.left), vr = Math.min(r.right, clip.right);
      const vh = Math.max(0, vb - vt), vw = Math.max(0, vr - vl);
      if (vh * vw <= 0) continue;
      const ov =
        Math.max(0, Math.min(vb, bb.bottom) - Math.max(vt, bb.top)) *
        Math.max(0, Math.min(vr, bb.right) - Math.max(vl, bb.left));
      const f = ov / (vh * vw);
      if (f > buried) { buried = f; buriedWho = (w.querySelector(".washi-tag")?.textContent || "?").trim(); }
    }
  }
  const radii = {};
  for (const sel of [".ctrl-btn", ".icon-btn", ".icon-btn.deal-btn", ".info-btn", ".info-glyph", ".mobile-heading-btn", ".action-bar", ".peek-chip"]) {
    const e = document.querySelector(sel);
    if (e) radii[sel] = getComputedStyle(e).borderRadius;
  }
  const drawn = {};
  for (const sel of [".tray-well", ".action-bar", ".icon-btn.deal-btn", ".info-glyph"]) {
    const e = document.querySelector(sel);
    if (!e) continue;
    const svg = e.querySelector(":scope > svg.outline-svg, :scope > .outline-container > svg.outline-svg");
    drawn[sel] = {
      border: getComputedStyle(e).borderTopWidth,
      outline: getComputedStyle(e).outlineStyle,
      shadow: getComputedStyle(e).boxShadow,
      drawnStroke: svg ? svg.querySelector("path")?.getAttribute("stroke-width") ?? null : null,
    };
  }
  return {
    bar: bb
      ? {
          box: [bb.x, bb.y, bb.width, bb.height].map((n) => +n.toFixed(2)),
          position: cs.position,
          zIndex: cs.zIndex,
          border: cs.borderTopWidth,
          shadow: cs.boxShadow,
          ownChrome:
            parseFloat(cs.borderTopWidth) > 0 ||
            cs.outlineStyle !== "none" ||
            cs.boxShadow !== "none" ||
            !!bar.querySelector(":scope > .outline-container, :scope > svg.outline-svg"),
          worstWellCoverage: +worst.toFixed(4),
          worstWell: who,
          worstVisibleBurial: +buried.toFixed(4),
          worstVisibleWell: buriedWho,
        }
      : null,
    card: card
      ? {
          box: [card.getBoundingClientRect().x, card.getBoundingClientRect().y, card.getBoundingClientRect().width, card.getBoundingClientRect().height].map((n) => +n.toFixed(2)),
          scrollHeight: card.scrollHeight,
          clientHeight: card.clientHeight,
          overflow: card.scrollHeight - card.clientHeight,
          overflowY: getComputedStyle(card).overflowY,
          panelHeight: wrap ? +wrap.getBoundingClientRect().height.toFixed(2) : null,
          padBottom: getComputedStyle(card).paddingBottom,
        }
      : null,
    radii,
    drawn,
    filters: [...document.querySelectorAll("*")].filter((e) => {
      const f = getComputedStyle(e).filter;
      return f && f !== "none" && f.includes("url(");
    }).length,
  };
};

/* ══ 3 · THE STICKY LAW — R7 I3's own sweep, verbatim in its measure ══════════════════ */
const STICKY = async () => {
  const sc = [...document.querySelectorAll(".controls-card")].find((e) => e.scrollHeight - e.clientHeight > 40);
  if (!sc) return { scrollport: false };
  const states = [];
  for (const st of [0, 160, 327, 500, 9999]) {
    sc.scrollTop = st;
    await new Promise((r) => setTimeout(r, 280));
    const scb = sc.getBoundingClientRect();
    const seen = [];
    for (const tag of document.querySelectorAll(".tray-well .washi-tag")) {
      const b = tag.getBoundingClientRect();
      const well = tag.closest(".tray-well");
      const wb = well.getBoundingClientRect();
      const frac =
        Math.max(0, Math.min(wb.bottom, scb.bottom) - Math.max(wb.top, scb.top)) / Math.max(1, wb.height);
      seen.push({
        tag: tag.textContent.trim(),
        topRel: +(b.top - scb.top).toFixed(2),
        /* I3's own pinned-test, unchanged */
        i3Pinned: b.top <= scb.top + 30,
        /* the family's own row, added BESIDE I3: a tape only READS as the card's title while
           its box is inside the card's pin band — above it, the tape has left the scrollport */
        inBand: b.top <= scb.top + 30 && b.bottom >= scb.top,
        groupFrac: +frac.toFixed(3),
      });
    }
    states.push({ at: sc.scrollTop, tapes: seen });
  }
  sc.scrollTop = 0;
  const i3Bad = states.flatMap((s) => s.tapes.filter((t) => t.i3Pinned && t.groupFrac < 0.5).map((t) => ({ at: s.at, ...t })));
  const bandBad = states.flatMap((s) => s.tapes.filter((t) => t.inBand && t.groupFrac < 0.5).map((t) => ({ at: s.at, ...t })));
  return { scrollport: true, states, i3Violations: i3Bad, bandViolations: bandBad };
};

/* ══ 4 · THE TABS — the 44 floor in BOTH dimensions, with a per-dimension control ══════ */
const TABS = () => {
  const row = document.querySelector(".mobile-heading-row");
  if (!row) return { present: false };
  const tabs = [...row.querySelectorAll(".mobile-heading-btn")].map((b) => {
    const r = b.getBoundingClientRect();
    const cs = getComputedStyle(b);
    const head = b.querySelector(".section-heading");
    const hcs = head && getComputedStyle(head);
    return {
      text: (b.innerText || "").replace(/\s+/g, " ").trim(),
      box: [r.x, r.y, r.width, r.height].map((n) => +n.toFixed(2)),
      w: +r.width.toFixed(2),
      h: +r.height.toFixed(2),
      widthOk: r.width >= 44,
      heightOk: r.height >= 44,
      minW: cs.minWidth,
      minH: cs.minHeight,
      active: b.getAttribute("aria-expanded") === "true",
      decoration: hcs ? hcs.textDecorationLine : null,
      transform: hcs ? hcs.transform : null,
      opacity: hcs ? hcs.opacity : null,
      ground: hcs ? hcs.backgroundColor : null,
    };
  });
  /* the inactive panel's options — W2's one-panel mechanic must be UNCHANGED */
  const hidden = [...document.querySelectorAll(".controls-card .ctrl-options")].map((o) => {
    const r = o.getBoundingClientRect();
    return { box: [+r.width.toFixed(2), +r.height.toFixed(2)], display: getComputedStyle(o).display, n: o.querySelectorAll(".ctrl-btn").length };
  });
  return { present: true, tabs, optionRows: hidden };
};

/* NEGATIVE CONTROL for the floor, per dimension: strip the min on ONE axis and the same
   reading must break on THAT axis alone (e2e/zone-grammar.spec.ts's pair-branch precedent). */
const TAB_FLOOR_CONTROL = (axis) => {
  const s = document.createElement("style");
  s.id = "proto-floor-control";
  s.textContent =
    axis === "w"
      ? ".controls-card .mobile-heading-btn{min-width:0!important;width:12px!important}"
      : ".controls-card .mobile-heading-btn{min-height:0!important;height:12px!important;padding:0!important}";
  document.head.appendChild(s);
};
const TAB_FLOOR_CONTROL_OFF = () => document.getElementById("proto-floor-control")?.remove();

/* ══ 5 · THE 390 SEAM — the case's drawn stroke against the wordmark's foot ════════════ */
const SEAM = () => {
  /* THE CASE's own drawn frame (GameScene.vue:182 HandDrawnOutline stroke 3 on `.drawer-case`),
     never the tongue's or a well's — `HandDrawnOutline` renders `<slot/>` BEFORE its own
     `.outline-svg`, so a descendant query finds a child's frame first (R1's own correction). */
  const caseEl = document.querySelector(".drawer-case");
  const out = caseEl ? caseEl.querySelector(":scope > svg.outline-svg") : null;
  const mast = document.querySelector("svg.handwritten-logo");
  const sc = document.querySelector(".scene-controls");
  const board = document.querySelector(".board-cells, [role=grid]");
  if (!out || !mast) return null;
  const ob = out.getBoundingClientRect();
  const mb = mast.getBoundingClientRect();
  const sw = parseFloat(out.querySelector("path")?.getAttribute("stroke-width") || "3");
  const caseTop = document.querySelector(".drawer-case")?.getBoundingClientRect().top ?? ob.top;
  return {
    strokeWidth: sw,
    caseTop: +caseTop.toFixed(2),
    outlineTop: +ob.top.toFixed(2),
    wordmarkBox: [mb.x, mb.y, mb.width, mb.height].map((n) => +n.toFixed(2)),
    wordmarkBottom: +mb.bottom.toFixed(2),
    /* positive = clear; negative = the stroke's band lies inside the wordmark's box */
    clearance: +(ob.top - mb.bottom).toFixed(2),
    twoStrokeWidths: +(sw * 2).toFixed(2),
    sheetChrome: sc ? getComputedStyle(sc).getPropertyValue("--sheet-chrome").trim() : null,
    mastheadToBoard: board ? +(board.getBoundingClientRect().top - mb.bottom).toFixed(2) : null,
  };
};

/* ══ 6 · CONTRAST — the estate's own composite (e2e/access.spec.ts's method) ═══════════ */
const CONTRAST = (selectors) => {
  const parse = (c) => {
    const m = c.match(/-?[\d.]+(e-?\d+)?/g)?.map(Number) ?? [];
    if (c.startsWith("rgb")) return [m[0], m[1], m[2], m.length > 3 ? m[3] : 1];
    const cv = document.createElement("canvas").getContext("2d");
    cv.fillStyle = c;
    const hex = cv.fillStyle;
    if (hex.startsWith("#")) return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16), 1];
    const n = hex.match(/[\d.]+/g).map(Number);
    return [n[0], n[1], n[2], n.length > 3 ? n[3] : 1];
  };
  const over = (f, b) => {
    const a = f[3] + b[3] * (1 - f[3]);
    if (!a) return [0, 0, 0, 0];
    const ch = (i) => (f[i] * f[3] + b[i] * b[3] * (1 - f[3])) / a;
    return [ch(0), ch(1), ch(2), a];
  };
  const lum = (c) => {
    const f = (x) => { const v = x / 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
  };
  const out = [];
  for (const sel of selectors)
    for (const el of document.querySelectorAll(sel)) {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      const layers = [];
      for (let n = el; n; n = n.parentElement) {
        const c = parse(getComputedStyle(n).backgroundColor);
        if (c[3] > 0) layers.push(c);
        if (c[3] >= 1) break;
      }
      let bg = [255, 255, 255, 1];
      for (let i = layers.length - 1; i >= 0; i--) bg = over(layers[i], bg);
      const fg = over(parse(getComputedStyle(el).color), bg);
      const [l1, l2] = [lum(fg), lum(bg)].sort((a, b) => b - a);
      out.push({
        sel,
        text: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 18),
        ratio: Math.round(((l1 + 0.05) / (l2 + 0.05)) * 100) / 100,
        fg: getComputedStyle(el).color,
        bg: `rgb(${bg.slice(0, 3).map(Math.round).join(", ")})`,
      });
    }
  return out;
};

/* ══ 7 · THE DASHED RING, from PAINTED BYTES ══════════════════════════════════════════
   `currentColor` on a quiet-rung control may fall under the 3:1 non-text floor, so the ring is
   read off the engine's own pixels: focus the control, clip a crop around its box, and take
   the extreme luminance inside the ring band against the ground just outside it. */
async function ringFromBytes(page, selector, label) {
  /* The ring is read as a DIFFERENCE of two paints of the same clip — focused and blurred — so
     the ring's own pixels are the ones that changed and the ground is what those same pixels
     were before. No guessing which row of the crop is "ground", and no arithmetic on a colour
     token: both terms come off the engine's bytes. Keyboard modality is set first (a real Tab
     press), because ':focus-visible' after a pointer gesture is false by construction. */
  await page.keyboard.press("Tab");
  const box = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    el.scrollIntoView({ block: "center" });
    const r = el.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height, color: getComputedStyle(el).color, vw: innerWidth, vh: innerHeight };
  }, selector);
  if (!box || box.w < 2) return { label, selector, skipped: "not painted" };
  const pad = 12;
  const x0 = Math.max(0, Math.floor(box.x - pad));
  const y0 = Math.max(0, Math.floor(box.y - pad));
  const clip = {
    x: x0, y: y0,
    width: Math.min(Math.ceil(box.w + pad * 2), box.vw - x0),
    height: Math.min(Math.ceil(box.h + pad * 2), box.vh - y0),
  };
  if (clip.width < 6 || clip.height < 6 || box.y < 0 || box.y + box.h > box.vh)
    return { label, selector, skipped: "outside the viewport at this pose", box: [box.x, box.y, box.w, box.h] };

  await page.evaluate((sel) => document.querySelector(sel).blur(), selector);
  await page.waitForTimeout(80);
  const off = await page.screenshot({ clip });
  const focused = await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    el.focus();
    return el.matches(":focus-visible");
  }, selector);
  await page.waitForTimeout(80);
  const on = await page.screenshot({ clip });

  const A = await sharp(off).raw().toBuffer({ resolveWithObject: true });
  const B = await sharp(on).raw().toBuffer({ resolveWithObject: true });
  const ch = A.info.channels;
  const lum = (r, g, b) => {
    const f = (x) => { const v = x / 255; return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  let n = 0, worst = 1, ringL = null, groundL = null;
  for (let i = 0; i < A.data.length; i += ch) {
    const d = Math.abs(A.data[i] - B.data[i]) + Math.abs(A.data[i + 1] - B.data[i + 1]) + Math.abs(A.data[i + 2] - B.data[i + 2]);
    if (d < 24) continue; // unchanged: not the ring
    n++;
    const lb = lum(B.data[i], B.data[i + 1], B.data[i + 2]);      // the ring, painted
    const la = lum(A.data[i], A.data[i + 1], A.data[i + 2]);      // what it covered
    const [hi, lo] = [lb, la].sort((x, y) => y - x);
    const ratio = (hi + 0.05) / (lo + 0.05);
    if (ratio > worst) { worst = ratio; ringL = lb; groundL = la; }
  }
  return {
    label, selector, focusVisible: focused, currentColor: box.color,
    changedPx: n,
    ratio: +worst.toFixed(2),
    ringLum: ringL === null ? null : +ringL.toFixed(4),
    groundLum: groundL === null ? null : +groundL.toFixed(4),
  };
}

/* ══ RUN ══════════════════════════════════════════════════════════════════════════════ */
const CELLS = [
  { name: "dock-390x844", w: 390, h: 844, mobile: true, sheet: true },
  { name: "desk-1280x800", w: 1280, h: 800 },
  /* THE SEAL'S OWN CELL: 1280×800 COARSE is where `visual-regression.spec.ts` test 10 bounds
     `.control-panel-wrap` at 1227.5px. Any voice that grows the card is priced HERE. */
  { name: "ipad-1280x800-coarse", w: 1280, h: 800, mobile: true },
  { name: "rail-1440x900", w: 1440, h: 900 },
  { name: "land-900x500", w: 900, h: 500, mobile: true, sheet: true },
];

for (const cell of CELLS) {
  for (const engine of ["chromium", "webkit"]) {
    const { browser, page, patched } = await open(engine, cell);
    if (patched) put(cell.name, engine, "patch", patched);
    put(cell.name, engine, "names", await page.evaluate(NAMES));
    put(cell.name, engine, "chrome", await page.evaluate(CHROME));
    put(cell.name, engine, "sticky", await page.evaluate(STICKY));
    put(cell.name, engine, "tabs", await page.evaluate(TABS));
    if (cell.sheet) put(cell.name, engine, "seam", await page.evaluate(SEAM));
    put(
      cell.name,
      engine,
      "contrast",
      await page.evaluate(CONTRAST, [".icon-sublabel", ".ctrl-btn", ".zone-row-label", ".washi-tag", ".section-heading", ".heading-value", ".players-leave"]),
    );
    /* the tab floor's per-dimension negative control */
    if (cell.name === "dock-390x844") {
      const ctl = {};
      for (const axis of ["w", "h"]) {
        await page.evaluate(TAB_FLOOR_CONTROL, axis);
        await page.waitForTimeout(150);
        ctl[axis] = await page.evaluate(TABS);
        await page.evaluate(TAB_FLOOR_CONTROL_OFF);
        await page.waitForTimeout(150);
      }
      put(cell.name, engine, "tabFloorControl", ctl);
      /* the ring, from painted bytes, on four grounds */
      const rings = [];
      for (const [sel, label] of [
        [".controls-card .ctrl-btn", "option chip · the well's paper (quiet rung)"],
        [".controls-card .icon-btn.deal-btn", "the primary act · the well's paper"],
        [".controls-card .action-bar .icon-btn", "a bar verb · the bar's own plane"],
        [".controls-card .players-leave", "the leave control · the well's paper (quiet rung)"],
        [".drawer-tab", "the tongue · the page"],
      ])
        rings.push(await ringFromBytes(page, sel, label));
      put(cell.name, engine, "ringBytes", rings);
    }
    await browser.close();
  }
}

/* ══ THE SEAM LADDER — three portrait widths, sheet up, both engines ══════════════════ */
report.seamLadder = {};
for (const [w, h] of [[390, 844], [375, 812], [430, 932]]) {
  for (const engine of ["chromium", "webkit"]) {
    const { browser, page } = await open(engine, { w, h, mobile: true, sheet: true });
    (report.seamLadder[`${w}x${h}`] ??= {})[engine] = await page.evaluate(SEAM);
    await browser.close();
  }
}

/* ══ THE DARK ARM — contrast is a two-theme law ═══════════════════════════════════════ */
report.dark = {};
for (const engine of ["chromium", "webkit"]) {
  const { browser, page } = await open(engine, { w: 390, h: 844, mobile: true, sheet: true, dark: true });
  report.dark[engine] = {
    contrast: await page.evaluate(CONTRAST, [".icon-sublabel", ".ctrl-btn", ".zone-row-label", ".washi-tag", ".section-heading"]),
    armed: await page.evaluate(() => {
      const s = document.querySelector(".controls-card .icon-sublabel");
      if (!s) return null;
      s.classList.add("is-armed");
      s.textContent = "sure?";
      return getComputedStyle(s).color;
    }),
  };
  await browser.close();
}

mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, `readings-${TAG}.json`), JSON.stringify(report, null, 1));
console.log(`banked readings-${TAG}.json`);
