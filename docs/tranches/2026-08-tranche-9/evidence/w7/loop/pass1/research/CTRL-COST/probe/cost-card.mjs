// CTRL-COST pass-1 · THE OVERLAY PROBE.
//
// Reads the live card CONTROL, applies the consequence-ladder overlay (proto/cost-card.css +
// proto/cost-card.js) and reads it again, at three cells in both engines. Read-only on the
// product: every change is an injected stylesheet and a DOM re-parent inside the page.
//
//   node cost-card.mjs        (lane dev server at 127.0.0.1:4233)
//
const { chromium, webkit } = await import(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs"
);
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const PROTO = resolve(HERE, "../proto");
const OUT = resolve(HERE, "../readings");
const BASE = "http://127.0.0.1:4233/";
const CSS = readFileSync(resolve(PROTO, "cost-card.css"), "utf8");
const JS_SRC = readFileSync(resolve(PROTO, "cost-card.js"), "utf8")
  .replace(/^export const costCard = /m, "window.__costCard = ")
  .replace(/;\s*$/, ";");

const CELLS = [
  { name: "desk-1280x800", w: 1280, h: 800, coarse: false, dock: false },
  { name: "dock-390x844", w: 390, h: 844, coarse: true, dock: true },
  { name: "land-900x500", w: 900, h: 500, coarse: true, dock: true },
];

// ── the readings ────────────────────────────────────────────────────────────────────────
// One function, run identically on the control and on the overlay, so every row is a pair.
const READ = () => {
  const card = document.querySelector(".controls-card");
  const R = (e) => {
    const b = e.getBoundingClientRect();
    return { x: +b.x.toFixed(2), y: +b.y.toFixed(2), w: +b.width.toFixed(2), h: +b.height.toFixed(2) };
  };
  const voiceOf = (e) => {
    const cs = getComputedStyle(e);
    return [
      cs.fontFamily.split(",")[0].replace(/["']/g, "").trim(),
      (+parseFloat(cs.fontSize)).toFixed(2),
      cs.fontWeight,
      cs.textTransform,
    ].join(" · ");
  };

  // (a) the §1 instrument's OWN closed set, read here so the pair is in one file
  const pick = (sel) => [...(card || document).querySelectorAll(sel)];
  const nameNodes = [
    ...pick(".section-heading"),
    ...pick(".tray-well > .washi-tag"),
    ...pick(".zone-row-label"),
  ].filter((e) => e.getClientRects().length);
  const names = nameNodes.map((e) => ({
    text: e.textContent.replace(/\s+/g, " ").trim(),
    voice: voiceOf(e),
    rank: e.closest("h1,h2,h3,h4,h5,h6")?.tagName ?? "—",
  }));
  const chip = (card || document).querySelector(".ctrl-btn");
  const optionPx = chip ? +parseFloat(getComputedStyle(chip).fontSize).toFixed(2) : null;
  const namePx = names.length ? Math.max(...names.map((n) => +n.voice.split(" · ")[1])) : null;

  // (b) THE HARDENED ROWS — the same law over a SEMANTIC set, so a taxonomy cannot green it
  //     by renaming a class. A group name is the `aria-labelledby` target of a `[role=group]`
  //     inside the card. ROW 1′ one voice · ROW 2′ every one a document heading.
  const groups = [...(card || document).querySelectorAll('[role="group"]')];
  const labelled = [];
  for (const g of groups) {
    for (const id of (g.getAttribute("aria-labelledby") || "").split(/\s+/).filter(Boolean)) {
      const t = document.getElementById(id);
      if (t && t.getClientRects().length) labelled.push(t);
    }
  }
  const uniq = [...new Set(labelled)];
  const hardened = {
    n: uniq.length,
    names: uniq.map((e) => e.textContent.replace(/\s+/g, " ").trim()),
    voices: [...new Set(uniq.map(voiceOf))],
    docHeadings: uniq.filter((e) => !!e.closest("h1,h2,h3,h4,h5,h6")).length,
  };

  // (c) HEIGHT — content against scrollport
  const sc = card;
  const height = sc
    ? {
        scrollHeight: sc.scrollHeight,
        clientHeight: sc.clientHeight,
        overflow: sc.scrollHeight - sc.clientHeight,
        belowFoldFrac: +(1 - sc.clientHeight / sc.scrollHeight).toFixed(4),
      }
    : null;

  // (d) THE DESK RAIL'S AT-A-GLANCE READ — of the five settings, how many have their CHOSEN
  //     option fully inside the scrollport at rest (scrollTop 0)?
  if (sc) sc.scrollTop = 0;
  const scb = sc ? sc.getBoundingClientRect() : null;
  const chosen = [];
  for (const g of (card || document).querySelectorAll(".ctrl-options")) {
    const on =
      g.querySelector(".ctrl-btn[aria-pressed='true'], .ctrl-btn[aria-checked='true'], .ctrl-btn.is-selected") ||
      [...g.querySelectorAll(".ctrl-btn")].find((b) =>
        /true/.test(b.getAttribute("aria-pressed") || b.getAttribute("aria-checked") || ""),
      ) ||
      g.querySelector(".ctrl-btn");
    if (!on || !scb) continue;
    const b = on.getBoundingClientRect();
    const vis =
      (Math.max(0, Math.min(b.bottom, scb.bottom) - Math.max(b.top, scb.top)) *
        Math.max(0, Math.min(b.right, scb.right) - Math.max(b.left, scb.left))) /
      Math.max(1, b.width * b.height);
    chosen.push({
      text: on.textContent.replace(/\s+/g, " ").trim(),
      visFrac: +vis.toFixed(3),
      displayed: getComputedStyle(g).display !== "none",
    });
  }

  // (e) I2's shape — the bar's own chrome and what it buries
  const bar = (card || document).querySelector(".action-bar");
  let barRow = { present: false };
  if (bar) {
    const cs = getComputedStyle(bar);
    const bb = bar.getBoundingClientRect();
    const own =
      parseFloat(cs.borderTopWidth) > 0 ||
      cs.outlineStyle !== "none" ||
      cs.boxShadow !== "none" ||
      !!bar.querySelector(":scope > .outline-container, :scope > svg.outline-svg");
    let worst = 0;
    let who = null;
    for (const w of document.querySelectorAll(".tray-well")) {
      if (getComputedStyle(w).display === "none") continue;
      const wb = w.getBoundingClientRect();
      const ov =
        Math.max(0, Math.min(wb.bottom, bb.bottom) - Math.max(wb.top, bb.top)) *
        Math.max(0, Math.min(wb.right, bb.right) - Math.max(wb.left, bb.left));
      const frac = ov / Math.max(1, wb.width * wb.height);
      if (frac > worst) {
        worst = frac;
        who = (w.querySelector(".washi-tag")?.textContent || "?").trim();
      }
    }
    barRow = {
      present: true,
      display: cs.display,
      position: cs.position,
      zIndex: cs.zIndex,
      own,
      worstWellFrac: +worst.toFixed(3),
      worstWell: who,
      box: R(bar),
    };
  }

  // (f) the bands, when they exist
  const band = (sel) => {
    const e = document.querySelector(sel);
    return e ? R(e) : null;
  };

  // (g) the drawn stroke ladder actually in force
  const strokes = [...document.querySelectorAll(".controls-card svg.outline-svg")]
    .filter((s) => s.closest(".tray-well, .drawer-case"))
    .map((s) => ({
      host: (s.parentElement.className || "").toString().split(" ")[0],
      w: getComputedStyle(s.querySelector("path") || s).strokeWidth,
    }));

  return {
    names,
    voices: [...new Set(names.map((n) => n.voice))],
    docHeadings: names.filter((n) => n.rank !== "—").length,
    ratio: namePx && optionPx ? +(namePx / optionPx).toFixed(4) : null,
    namePx,
    optionPx,
    hardened,
    height,
    glance: chosen,
    bar: barRow,
    bands: {
      looking: band(".cost-band:nth-of-type(1)"),
      writing: band(".cost-band:nth-of-type(2)"),
      over: band(".cost-band:nth-of-type(3)"),
    },
    strokes,
  };
};

// ── the zero-reflow probe ───────────────────────────────────────────────────────────────
const REFLOW = async () => {
  const faces = [...document.querySelectorAll(".cost-face-destructive")];
  const bandEl = faces[0]?.closest(".cost-band") || null;
  const R = (e) => {
    const b = e.getBoundingClientRect();
    return [+b.top.toFixed(3), +b.right.toFixed(3), +b.bottom.toFixed(3), +b.left.toFixed(3)];
  };
  const before = {
    band: bandEl ? R(bandEl) : null,
    faces: faces.map((f) => R(f)),
    cardScrollH: document.querySelector(".controls-card")?.scrollHeight ?? null,
  };
  faces[0]?.click(); // arms — the overlay's own handler stops the act
  await new Promise((r) => setTimeout(r, 250));
  const armedWord = faces[0]?.querySelector(".cost-word-armed");
  const after = {
    band: bandEl ? R(bandEl) : null,
    faces: faces.map((f) => R(f)),
    cardScrollH: document.querySelector(".controls-card")?.scrollHeight ?? null,
    armedVisible: armedWord ? getComputedStyle(armedWord).visibility : null,
    armedBox: armedWord ? (() => { const b = armedWord.getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height }; })() : null,
    secondLine: faces[0]?.querySelector(".cost-secondline")
      ? getComputedStyle(faces[0].querySelector(".cost-secondline")).visibility
      : null,
  };
  const delta = {
    band: before.band && after.band ? before.band.map((v, i) => +(after.band[i] - v).toFixed(3)) : null,
    faces: before.faces.map((f, i) => f.map((v, j) => +(after.faces[i][j] - v).toFixed(3))),
    cardScrollH: after.cardScrollH - before.cardScrollH,
  };
  window.__costDisarm && window.__costDisarm();
  await new Promise((r) => setTimeout(r, 120));
  const restored = {
    band: bandEl ? R(bandEl) : null,
  };
  return { before, after, delta, restored };
};

// ── the estate's own 2.3 compositing contrast read (access.spec.ts:440) ─────────────────
const CONTRAST = (selectors) => {
  const parse = (c) => {
    const s = (c || "").trim();
    if (!s || s === "transparent") return [0, 0, 0, 0];
    let m = /^color\(\s*srgb\s+([^)]+)\)$/i.exec(s);
    if (m) {
      const parts = m[1].split("/");
      const rgb = parts[0].trim().split(/\s+/).map(Number);
      const a = parts[1] === undefined ? 1 : Number(parts[1].trim().replace("%", "")) / (parts[1].includes("%") ? 100 : 1);
      return [rgb[0] * 255, rgb[1] * 255, rgb[2] * 255, a];
    }
    m = /^rgba?\(([^)]+)\)$/i.exec(s);
    if (m) {
      const p = m[1].split(/[,/]/).map((x) => x.trim());
      const n = p.map((x) => (x.endsWith("%") ? Number(x.slice(0, -1)) / 100 : Number(x)));
      return [n[0], n[1], n[2], p[3] === undefined ? 1 : n[3]];
    }
    m = /^#([0-9a-f]{3,8})$/i.exec(s);
    if (m) {
      const h = m[1].length <= 4 ? [...m[1]].map((x) => x + x).join("") : m[1];
      const v = (i) => parseInt(h.slice(i * 2, i * 2 + 2), 16);
      return [v(0), v(1), v(2), h.length === 8 ? v(3) / 255 : 1];
    }
    return [0, 0, 0, 0];
  };
  const over = (fg, bg) => {
    const a = fg[3] + bg[3] * (1 - fg[3]);
    if (a === 0) return [0, 0, 0, 0];
    const ch = (i) => (fg[i] * fg[3] + bg[i] * bg[3] * (1 - fg[3])) / a;
    return [ch(0), ch(1), ch(2), a];
  };
  const lum = (c) => {
    const f = (x) => {
      const v = x / 255;
      return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    };
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
      const [l1, l2] = [lum(fg), lum(bg)].sort((x, y) => y - x);
      out.push({
        sel,
        text: (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 18),
        ratio: Math.round(((l1 + 0.05) / (l2 + 0.05)) * 100) / 100,
        fg: getComputedStyle(el).color,
        bg: `rgb(${bg.slice(0, 3).map(Math.round).join(", ")})`,
        px: +parseFloat(getComputedStyle(el).fontSize).toFixed(2),
      });
    }
  return out;
};

// ── the tap floor, with a PER-DIMENSION negative control ────────────────────────────────
const TAPFLOOR = () => {
  const rows = [];
  for (const e of document.querySelectorAll(
    ".cost-face, .cost-row .ctrl-btn, .drawer-tab, .play-controls button",
  )) {
    const b = e.getBoundingClientRect();
    if (!b.width || !b.height) continue;
    rows.push({
      what: (e.className || "").toString().split(" ").slice(0, 2).join("."),
      text: (e.textContent || "").replace(/\s+/g, " ").trim().slice(0, 12),
      w: +b.width.toFixed(2),
      h: +b.height.toFixed(2),
      wOK: b.width >= 44,
      hOK: b.height >= 44,
    });
  }
  return {
    rows,
    worstW: rows.length ? Math.min(...rows.map((r) => r.w)) : null,
    worstH: rows.length ? Math.min(...rows.map((r) => r.h)) : null,
    failW: rows.filter((r) => !r.wOK).length,
    failH: rows.filter((r) => !r.hOK).length,
  };
};

// ── 2.1 / 2.2 shapes ────────────────────────────────────────────────────────────────────
const ACCESS = () => {
  const focusable = [
    ...document.querySelectorAll(
      ".controls-card button:not([disabled]), .controls-card [tabindex='0'], .play-controls button:not([disabled])",
    ),
  ];
  const buried = [];
  for (const e of focusable) {
    const b = e.getBoundingClientRect();
    if (!b.width || !b.height) continue;
    const pts = [
      [b.left + b.width * 0.5, b.top + b.height * 0.5],
      [b.left + 2, b.top + 2],
      [b.right - 2, b.bottom - 2],
    ];
    let hit = 0;
    for (const [x, y] of pts) {
      const t = document.elementFromPoint(x, y);
      if (t && (t === e || e.contains(t) || t.contains(e))) hit++;
    }
    if (hit === 0)
      buried.push({
        what: (e.className || "").toString().split(" ")[0],
        text: (e.textContent || "").replace(/\s+/g, " ").trim().slice(0, 14),
      });
  }
  const covered = [...document.querySelectorAll(".drawer-case [inert] button, [inert] button")].length;
  return { focusable: focusable.length, buried, coveredTabbable: covered };
};

// ── driver ──────────────────────────────────────────────────────────────────────────────
async function open(engine, cell, { dark = false } = {}) {
  const browser = await (engine === "webkit" ? webkit : chromium).launch();
  const ctx = await browser.newContext({
    viewport: { width: cell.w, height: cell.h },
    deviceScaleFactor: 1,
    hasTouch: cell.coarse,
    isMobile: cell.coarse && engine === "chromium",
    colorScheme: dark ? "dark" : "light",
  });
  await ctx.addInitScript((d) => {
    try {
      localStorage.clear();
      localStorage.setItem("sudoku-color-scheme", d ? "dark" : "light");
    } catch {}
  }, dark);
  const page = await ctx.newPage();
  await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.waitForSelector(".controls-card", { state: "attached", timeout: 30000 });
  await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await page.waitForTimeout(1400);
  return { browser, page };
}
const openSheet = async (page) => {
  if (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
    await page.locator(".drawer-tab").click({ force: true });
    await page.waitForTimeout(950); // the sheet SLIDES
  }
};

const results = { base: BASE, cells: {} };
for (const cell of CELLS) {
  for (const engine of ["chromium", "webkit"]) {
    const key = `${cell.name}-${engine}`;
    const { browser, page } = await open(engine, cell);

    // the shut-sheet pose FIRST (what the phone shows with no bar) — control
    const shutControl = await page.evaluate(() => {
      const vis = (sel) =>
        [...document.querySelectorAll(sel)]
          .filter((e) => {
            const b = e.getBoundingClientRect();
            return b.width > 0 && b.height > 0 && b.top < innerHeight && b.bottom > 0;
          })
          .map((e) => (e.textContent || "").replace(/\s+/g, " ").trim().slice(0, 12));
      return {
        drawerClosed: document.documentElement.classList.contains("drawer-closed"),
        ribbonActs: vis(".play-controls button"),
        tongue: vis(".drawer-tab").length,
      };
    });

    await openSheet(page);
    const control = await page.evaluate(READ);
    const accessControl = await page.evaluate(ACCESS);

    // ── the overlay ──
    await page.addStyleTag({ content: CSS });
    const applied = await page.evaluate(`(() => { ${JS_SRC} ; return window.__costCard(); })()`);
    await page.waitForTimeout(400);
    const overlay = await page.evaluate(READ);
    const reflow = await page.evaluate(REFLOW);
    const taps = await page.evaluate(TAPFLOOR);
    const accessOverlay = await page.evaluate(ACCESS);
    const contrast = await page.evaluate(CONTRAST, [
      ".cost-band-name",
      ".cost-row-caption",
      ".cost-word-armed",
      ".cost-secondline",
      ".ctrl-btn",
      ".icon-sublabel",
    ]);

    results.cells[key] = {
      cell: cell.name,
      engine,
      shutControl,
      applied,
      control,
      overlay,
      reflow,
      taps,
      access: { control: accessControl, overlay: accessOverlay },
      contrast,
    };
    console.log(
      `${key.padEnd(24)} voices ${control.voices.length}→${overlay.voices.length} · ` +
        `ranks ${control.docHeadings}/${control.names.length}→${overlay.docHeadings}/${overlay.names.length} · ` +
        `ratio ${control.ratio}→${overlay.ratio} · ` +
        `overflow ${control.height.overflow}→${overlay.height.overflow} · ` +
        `Δband ${JSON.stringify(reflow.delta.band)}`,
    );
    await browser.close();
  }
}
writeFileSync(resolve(OUT, "cost-card.json"), JSON.stringify(results, null, 1));
console.log("\nbanked readings/cost-card.json");
