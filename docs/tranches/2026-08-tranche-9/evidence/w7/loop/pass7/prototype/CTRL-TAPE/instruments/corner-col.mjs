// corner-col.mjs — CTRL-TAPE pass 7 row 4: the junction's zero column, IDENTIFIED. At the pose the junction
// probe reports a 0-css column, dump that column row by row: the lip's mask (frame shown vs hidden), the
// wells' mask (well svgs shown vs hidden), the case's mask (the case outline shown vs hidden) and the ON
// pixel, plus every svg/element whose painted box covers the column over the rows in question.
//   BASE=<url> ENG=chromium CELL=land844 FRAC=0.9 node corner-col.mjs
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
import sharp from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.cjs";
const PAYLOAD = "ATMuNTA4MDAwMDAwMDAzMDAwMDAwNjA5MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAw";
const eng = process.env.ENG === "webkit" ? webkit : chromium;
const [vw, vh] = process.env.CELL === "dock390" ? [390, 844] : [844, 390];
const FRAC = +(process.env.FRAC ?? 0.9);
const b = await eng.launch();
const ctx = await b.newContext({ baseURL: process.env.BASE, viewport: { width: vw, height: vh }, hasTouch: true, colorScheme: "dark", deviceScaleFactor: 2, reducedMotion: "reduce" });
const page = await ctx.newPage(); await page.goto("/?board=" + PAYLOAD); await page.waitForSelector(".controls-card", { state: "attached" }); await page.waitForTimeout(800);
await page.locator(".drawer-tab").first().click(); let last = null; for (let i = 0; i < 80; i++) { await page.waitForTimeout(80); const t = await page.evaluate(() => document.querySelector("#controls-drawer").getBoundingClientRect().top); if (last !== null && Math.abs(t - last) < 0.05) break; last = t; }
if (process.env.INJECT) await page.addStyleTag({ content: process.env.INJECT });
await page.evaluate((f) => { const c = document.querySelector("#controls-drawer .controls-card"); c.scrollTop = Math.round((c.scrollHeight - c.clientHeight) * f); }, FRAC);
await page.waitForTimeout(400);
const bar = await page.evaluate(() => { const r = document.querySelector(".action-bar").getBoundingClientRect(); return { l: r.left, r: r.right, t: r.top }; });
const sentinel = await page.evaluate(() => { const c = document.querySelector("#controls-drawer .controls-card"); const cs = getComputedStyle(c, "::after"); const r = c.getBoundingClientRect(); return { cardPaddingBoxBottom: +(r.top + c.clientTop + c.clientHeight).toFixed(2), afterBottom: cs.bottom, afterHeight: cs.height, fold: c.hasAttribute("data-fold-below") }; });
console.log(JSON.stringify({ sentinel }));
const clip = { x: 0, y: Math.floor(bar.t - 30), width: vw, height: 36 };
const grab = async () => { const buf = await page.screenshot({ clip, animations: "allow" }); return sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true }); };
const hideGrab = async (css) => { const h = await page.addStyleTag({ content: css }); await page.waitForTimeout(150); const g = await grab(); await h.evaluate((n) => n.remove()); await page.waitForTimeout(80); return g; };
const on = await grab();
const noLip = await hideGrab(".bar-frame svg { visibility: hidden !important }");
const noWell = await hideGrab(".controls-card .tray-well > svg, .controls-card .tray-well > .outline-svg, .controls-card svg.outline-svg { visibility: hidden !important }");
const noCase = await hideGrab(".drawer-case > .outline-svg { visibility: hidden !important }");
const noCard = await hideGrab("#controls-drawer .controls-card { visibility: hidden !important }");
const w = on.info.width;
const COLS = (process.env.COLS ?? "").split(",").filter(Boolean).map(Number);
const cols = COLS.length ? COLS : [Math.round(840.5 * 2) - 0, Math.round(3 * 2), Math.round((vw - 3.5) * 2)];
const d = (a, bb, o) => Math.max(...[0, 1, 2].map((k) => Math.abs(a.data[o + k] - bb.data[o + k])));
for (const dx of cols) {
  const rows = [];
  for (let y = 0; y < on.info.height; y++) { const o = (y * w + dx) * 4; const L = d(on, noLip, o) > 24, Wl = d(on, noWell, o) > 24, C = d(on, noCase, o) > 24, K = d(on, noCard, o) > 24; if (L || Wl || C || K) rows.push(`${(clip.y + y / 2).toFixed(1)}:${L ? "L" : "-"}${Wl ? "W" : "-"}${C ? "C" : "-"}${K ? "K" : "-"}(${on.data[o]},${on.data[o + 1]},${on.data[o + 2]})`); }
  console.log(JSON.stringify({ eng: process.env.ENG ?? "chromium", cell: process.env.CELL ?? "land844", frac: FRAC, col: dx / 2, rows }));
}
const who = await page.evaluate(({ x, y0, y1 }) => { const out = new Set(); for (let y = y0; y <= y1; y += 1) for (const e of document.elementsFromPoint(x, y)) { const c = typeof e.className === "string" ? e.className : e.className?.baseVal ?? ""; out.add(`${e.tagName.toLowerCase()}.${c.trim().split(/\s+/).slice(0, 2).join(".")}`); } return [...out].slice(0, 20); }, { x: cols[0] / 2, y0: clip.y, y1: clip.y + 35 });
const boxes = await page.evaluate(() => { const R = (e) => { const r = e.getBoundingClientRect(); return [r.left, r.top, r.right, r.bottom].map((v) => +v.toFixed(2)); }; const card = document.querySelector("#controls-drawer .controls-card"); const wells = [...card.querySelectorAll(".tray-well")].map((w) => ({ well: R(w), svg: w.querySelector(":scope > .outline-svg, :scope > svg") ? R(w.querySelector(":scope > .outline-svg, :scope > svg")) : null })).filter((x) => x.well[3] > card.getBoundingClientRect().bottom - 60); return { card: R(card), cardPad: getComputedStyle(card).paddingRight, clientW: card.clientWidth, offsetW: card.offsetWidth, sentinel: getComputedStyle(card, "::after").borderImageOutset, frame: R(document.querySelector(".bar-frame")), frameSvg: R(document.querySelector(".bar-frame svg")), caseSvg: R(document.querySelector(".drawer-case > .outline-svg")), lastWells: wells }; });
console.log(JSON.stringify({ elementsAtCol: who, boxes }));
await b.close();
