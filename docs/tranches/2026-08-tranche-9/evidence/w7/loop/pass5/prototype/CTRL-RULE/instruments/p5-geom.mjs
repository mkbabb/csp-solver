// T9-W7 pass 5 · CTRL-RULE — ONE PROBE, THE CHARTER'S GEOMETRY ROWS, one arm per run.
//  row 1/29  the card's scroll extent: scrollWidth − clientWidth on `.controls-card`, and the
//            elements that overhang it (named, amount), at the desk cells + 1280 coarse.
//  row 2     the toggle's hit box vs every interactive element in the case (px², the 4×4 chip).
//  row 3     W2 §2.6's STICKY_CENSUS, copied verbatim from viewport-law.spec.ts (the re-aimed
//            form on the ruled page), at the rail (1440×900) and the drawer (375×667 coarse).
//  row 5     every HORIZONTAL DRAWN LINE in the case, PAINTED (the path's own bbox, not the
//            svg box): rules, the BoilDivider, the foot's rule — nearest-neighbour gaps over
//            three scroll states (top / mid / end), the foot's rule compared across the
//            scrollport's bottom edge (a line inside the card and the foot's rule are both on
//            screen at once).
//  row 8     the card's content view (clientHeight) and the foot's height per cell.
// node p5-geom.mjs <chromium|webkit> <BASE> <arm-label> [light|dark]
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
const NM = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/";
const { chromium, webkit } = await import(NM + "playwright/index.mjs");
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "readings");
mkdirSync(OUT, { recursive: true });
const [ENGINE = "chromium", BASE = "http://127.0.0.1:4231/", ARM = "proto", THEME = "light"] = process.argv.slice(2);
// "\x01" + "3." + 81 cells (30 givens), base64url — persistence.ts encodeBoard's shape (pass-4 payload).
const BOARD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const CELLS = [
  { w: 1024, h: 768, touch: false }, { w: 1280, h: 800, touch: false }, { w: 1440, h: 900, touch: false },
  { w: 1280, h: 800, touch: true }, { w: 390, h: 844, touch: true }, { w: 430, h: 932, touch: true },
  { w: 375, h: 667, touch: true }, { w: 320, h: 568, touch: true }, { w: 844, h: 390, touch: true },
  { w: 812, h: 375, touch: true }, { w: 390, h: 844, touch: false },
];
const ONLY = process.env.CELLS ? process.env.CELLS.split(",") : null;
const browser = await (ENGINE === "webkit" ? webkit : chromium).launch();
const out = { engine: ENGINE, arm: ARM, base: BASE, theme: THEME, board: BOARD, cells: {} };

for (const c of CELLS) {
  const key = `${c.w}x${c.h}-${c.touch ? "coarse" : "fine"}`;
  if (ONLY && !ONLY.includes(key)) continue;
  const ctx = await browser.newContext({ viewport: { width: c.w, height: c.h }, deviceScaleFactor: 1, colorScheme: THEME,
    hasTouch: c.touch, isMobile: c.touch && ENGINE === "chromium" });
  await ctx.addInitScript((t) => { try { localStorage.clear(); localStorage.setItem("sudoku-color-scheme", t); } catch {} }, THEME);
  const p = await ctx.newPage();
  await p.goto(`${BASE}?size=3&board=${BOARD}`, { waitUntil: "domcontentloaded" });
  await p.waitForSelector(".sudoku-cell", { timeout: 45000 });
  await p.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await p.waitForTimeout(2200);
  if (await p.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
    await p.locator(".drawer-tab").first().click({ force: true });
  }
  // the sheet SLIDES (~700 ms): poll the case's top until two reads 100 ms apart agree
  let last = -1;
  for (let i = 0; i < 30; i++) {
    await p.waitForTimeout(100);
    const t = await p.evaluate(() => document.querySelector(".drawer-case")?.getBoundingClientRect().top ?? 0);
    if (Math.abs(t - last) < 0.01) break; last = t;
  }
  const r = await p.evaluate(() => {
    const R = (b) => ({ l: +b.left.toFixed(2), t: +b.top.toFixed(2), r: +b.right.toFixed(2), b: +b.bottom.toFixed(2), w: +b.width.toFixed(2), h: +b.height.toFixed(2) });
    const name = (e) => e.tagName.toLowerCase() + (e.id ? "#" + e.id : "") + (typeof e.className === "string" && e.className ? "." + e.className.trim().split(/\s+/).slice(0, 2).join(".") : (e.className?.baseVal ? "." + e.className.baseVal.trim().split(/\s+/).slice(0, 2).join(".") : ""));
    const o = { coarse: matchMedia("(pointer: coarse)").matches, givens: document.querySelectorAll(".sudoku-cell .glyph-svg").length,
      boardKept: new URLSearchParams(location.search).has("board") };
    const card = document.querySelector(".controls-card"); const cas = document.querySelector(".drawer-case");
    const foot = document.getElementById("card-foot"); const bar = document.querySelector(".action-bar");
    if (!card) return { ...o, card: null };
    const cb = card.getBoundingClientRect();
    o.card = { ...R(cb), scrollW: card.scrollWidth, clientW: card.clientWidth, clientH: card.clientHeight, offsetH: card.offsetHeight, scrollH: card.scrollHeight,
      overflowX: card.scrollWidth - card.clientWidth };
    o.case = cas ? R(cas.getBoundingClientRect()) : null;
    o.foot = foot ? R(foot.getBoundingClientRect()) : null;
    o.bar = bar ? R(bar.getBoundingClientRect()) : null;
    // ROW 1/29 — who overhangs the card's CLIENT box horizontally (outermost offender only)
    const cl = cb.left + card.clientLeft, cr = cl + card.clientWidth;
    const over = [];
    for (const e of card.querySelectorAll("*")) {
      const b = e.getBoundingClientRect(); if (!b.width) continue;
      const d = Math.max(b.right - cr, cl - b.left);
      if (d > 0.5 && !(e.parentElement && over.some((x) => x.el.contains(e)))) over.push({ el: e, who: name(e), by: +d.toFixed(2), hidden: getComputedStyle(e).opacity === "0" || getComputedStyle(e).visibility === "hidden" });
    }
    o.overhang = over.map(({ el, ...x }) => x).slice(0, 8);
    // ROW 2 — the toggle's hit box vs interactive elements in the case
    const tg = document.querySelector("button.sun-moon-toggle");
    if (tg) {
      const t = tg.getBoundingClientRect(); o.toggle = R(t);
      o.toggleHits = [...(cas || card).querySelectorAll("button, [role=radio], a[href], input")].map((e) => {
        const b = e.getBoundingClientRect(); const w = Math.min(b.right, t.right) - Math.max(b.left, t.left); const h = Math.min(b.bottom, t.bottom) - Math.max(b.top, t.top);
        return w > 0 && h > 0 && b.width > 0 ? { who: (e.getAttribute("aria-label") || e.textContent || "").trim().slice(0, 20), px2: +(w * h).toFixed(1) } : null;
      }).filter(Boolean);
    }
    // ROW 5 — painted horizontal lines. A path's bbox via getBBox → screen through getScreenCTM.
    const lineBox = (svg) => { const path = svg.querySelector("path"); if (!path) return null; const bb = path.getBBox(); const m = path.getScreenCTM(); if (!m) return null;
      const pts = [[bb.x, bb.y], [bb.x + bb.width, bb.y + bb.height]].map(([x, y]) => { const pt = new DOMPoint(x, y).matrixTransform(m); return pt; });
      return { t: Math.min(pts[0].y, pts[1].y), b: Math.max(pts[0].y, pts[1].y), l: Math.min(pts[0].x, pts[1].x), r: Math.max(pts[0].x, pts[1].x) }; };
    const lines = () => {
      const L = [];
      for (const s of card.querySelectorAll("svg.ruled-line")) { const b = lineBox(s); if (b) L.push({ kind: "rule", ...b, inCard: true }); }
      for (const s of card.querySelectorAll(".peek-hold-surface svg")) { const b = lineBox(s); if (b && b.r - b.l > 100) L.push({ kind: "boil", ...b, inCard: true }); }
      if (bar) for (const s of bar.querySelectorAll(":scope > svg.ruled-line, :scope > .bar-rule, :scope > .outline-container svg")) { const b = lineBox(s); if (b) L.push({ kind: "foot", ...b, inCard: false }); }
      // only what is ON SCREEN: a card line must sit inside the card's client box to be seen
      const vis = L.filter((x) => !x.inCard || (x.b > cb.top && x.t < cb.top + card.clientHeight));
      vis.sort((a, b) => a.t - b.t);
      const gaps = []; for (let i = 1; i < vis.length; i++) gaps.push({ pair: `${vis[i - 1].kind}→${vis[i].kind}`, clear: +(vis[i].t - vis[i - 1].b).toFixed(2), centre: +(((vis[i].t + vis[i].b) - (vis[i - 1].t + vis[i - 1].b)) / 2).toFixed(2) });
      return gaps;
    };
    const max = card.scrollHeight - card.clientHeight;
    o.lineGaps = {};
    for (const [k, st] of [["top", 0], ["mid", Math.round(max / 2)], ["end", max]]) { card.scrollTop = st; o.lineGaps[k] = lines(); }
    // a sweep: the minimum clear gap per pair class over every 4 px of scroll
    const minBy = {};
    for (let st = 0; st <= max; st += 4) { card.scrollTop = st; for (const g of lines()) { if (!(g.pair in minBy) || g.clear < minBy[g.pair].clear) minBy[g.pair] = { clear: g.clear, at: st }; } }
    o.lineMin = minBy;
    card.scrollTop = 0;
    // ROW 3 helper — names: lines and widths
    o.names = [...card.querySelectorAll(".rp-name")].map((n) => { const b = n.getBoundingClientRect(); const lh = parseFloat(getComputedStyle(n).lineHeight); return { n: n.textContent.trim(), w: +b.width.toFixed(2), h: +b.height.toFixed(2), lines: Math.round(b.height / lh), sw: n.scrollWidth }; });
    o.fieldW = [...card.querySelectorAll(".rp-field")].map((f) => +f.getBoundingClientRect().width.toFixed(2));
    return o;
  });
  // ROW 3 — W2 §2.6's census, verbatim shape
  r.sticky = await p.evaluate(() => {
    window.__visFrac = window.__visFrac || ((el) => {
      const b = el.getBoundingClientRect(); if (!b.width || !b.height) return 0;
      let l = b.left, t = b.top, rr = b.right, bb = b.bottom;
      for (let a = el.parentElement; a; a = a.parentElement) { const cs = getComputedStyle(a); if (cs.overflowY !== "visible" || cs.overflowX !== "visible") { const ab = a.getBoundingClientRect(); l = Math.max(l, ab.left); t = Math.max(t, ab.top); rr = Math.min(rr, ab.right); bb = Math.min(bb, ab.bottom); } }
      l = Math.max(l, 0); t = Math.max(t, 0); rr = Math.min(rr, innerWidth); bb = Math.min(bb, innerHeight);
      return Math.max(0, rr - l) * Math.max(0, bb - t) / (b.width * b.height);
    });
    const card = document.querySelector(".controls-card"); const vis = window.__visFrac;
    const max = card.scrollHeight - card.clientHeight; const rows = [];
    for (const well of card.querySelectorAll("[data-ruled-group]")) {
      const tag = well.querySelector(".rp-name"); if (!tag) continue; const name = tag.textContent.trim();
      card.scrollTop = 0; const c0 = card.getBoundingClientRect(); const w0 = well.getBoundingClientRect();
      const want = w0.top - c0.top + Math.min(40, w0.height / 2);
      if (w0.height < 48) { rows.push({ tag: name, unreachable: `well ${w0.height.toFixed(1)}` }); continue; }
      if (want <= 0 || want > max) { rows.push({ tag: name, unreachable: `needs ${want.toFixed(1)} of ${max}` }); continue; }
      card.scrollTop = want; const c = card.getBoundingClientRect(); const w = well.getBoundingClientRect();
      rows.push({ tag: name, wellH: +w0.height.toFixed(1), wellInView: +((Math.min(w.bottom, c.bottom) - Math.max(w.top, c.top)) / w.height).toFixed(3), tagVisFrac: +vis(tag).toFixed(4) });
    }
    card.scrollTop = 0; return { max, rows };
  });
  out.cells[key] = r;
  await ctx.close();
}
writeFileSync(join(OUT, `p5-geom-${ARM}-${ENGINE}-${THEME}.json`), JSON.stringify(out, null, 1));
for (const [k, v] of Object.entries(out.cells)) {
  if (!v.card) { console.log(k, "no card"); continue; }
  console.log(k, JSON.stringify({ ovX: v.card.overflowX, over: v.overhang.map((x) => `${x.who}+${x.by}${x.hidden ? "(hid)" : ""}`).slice(0, 3), toggle: v.toggleHits,
    clientH: v.card.clientH, foot: v.foot?.h, lineMin: Object.fromEntries(Object.entries(v.lineMin).map(([a, b]) => [a, b.clear])),
    names2: v.names.filter((n) => n.lines > 1).map((n) => n.n), sticky: v.sticky.rows.filter((x) => x.tagVisFrac !== undefined).map((x) => `${x.tag}:${x.tagVisFrac}`) }));
}
await browser.close();
console.log("EXIT OK");
