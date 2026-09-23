// T9-W7 pass 5 · MRK-ABS — shared instrument helpers. COPIED RECIPES, named:
//  · the ledger read (pass-4 ABS / its critic): left side, max-changed pixel in a 3×3, WORST of 60;
//  · MRK-LIVE pass 5 `stations()` + `price()` verbatim in substance: ring-OFF subtraction (the same
//    pixels blurred), 60 stations ALONG THE PATH with a perpendicular scan, core max/p30/median/
//    fraction<3 (PAL-TIN critic), isTheRing Δ≤24 (PAL-WALK), the LAWS' sensitivity row (worst scan at
//    50/70/90/100 % of the median core change + the share under 3.0);
//  · added here: every station attributed to the cell SIDE it lies on, so a whole-ring worst names
//    its side (the ledger reads the left side only; LIVE's whole-ring worst on #4589d2@1.0 is not a
//    left-side number — this is the row that reconciles them).
import { expect, type Page } from "@playwright/test";
import sharp from "sharp";
import fs from "node:fs";
export const OUT = process.env.ABS_OUT ?? "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass5/prototype/MRK-ABS/logs";
fs.mkdirSync(OUT, { recursive: true });
export const bank = (n: string, d: unknown) => fs.writeFileSync(`${OUT}/${n}.json`, JSON.stringify(d, null, 1));
export type RGB = number[];
const lin = (c: number) => { const s = c / 255; return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };
export const Lum = (c: RGB) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
export const ratio = (a: RGB, b: RGB) => { const x = Lum(a), y = Lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
export const d1 = (a: RGB, b: RGB) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
const d2 = (a: RGB, b: RGB) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
export const q = (v: number[], p: number) => (v.length ? [...v].sort((x, y) => x - y)[Math.min(v.length - 1, Math.floor(p * v.length))] : NaN);
export const med = (v: number[]) => q(v, 0.5);
export const r3 = (x: number) => Math.round(x * 1000) / 1000;
export const hex = (h: string): RGB => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));

/** A REAL `?board=` payload (pass4 CHAIR-RULINGS addendum), the app's codec:
 *  base64url("\x01" + "<sub>.<cells base36>"), cells 0 and 1 EMPTY (frame crossing + paper). */
export function mintSudoku(sub: number): string {
  const n = sub * sub; let cells = "";
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    const i = r * n + c; const v = ((r * sub + Math.floor(r / sub) + c) % n) + 1;
    cells += (i > 1 && (r * 7 + c * 3) % 5 < 2 ? v : 0).toString(36);
  }
  return Buffer.from(String.fromCharCode(1) + `${sub}.${cells}`, "latin1").toString("base64url");
}
/** Load a board by payload and PROVE the arm read it back (the given set, not a 200). */
export async function loadBoard(page: Page, base: string, sub: number) {
  const payload = mintSudoku(sub); const n = sub ** 4;
  await page.goto(`${base}/?size=${sub}&board=${payload}`);
  await expect.poll(() => page.locator(".board-shell .game-cell").count(), { timeout: 120000 }).toBe(n);
  await expect.poll(() => page.evaluate(() => new URLSearchParams(location.search).get("board")), { timeout: 10000 }).toBe(payload);
  const givens = await page.evaluate(() => Array.from(document.querySelectorAll<HTMLInputElement>(".board-shell .game-cell input")).map((i, k) => (i.value ? k : -1)).filter((k) => k >= 0).join(","));
  return { payload, givens };
}
export async function setTheme(page: Page, want: "light" | "dark") {
  const isDark = () => page.evaluate(() => document.documentElement.classList.contains("dark"));
  if ((await isDark()) === (want === "dark")) return;
  await page.locator("button.sun-moon-toggle").first().evaluate((n: HTMLElement) => n.focus());
  await page.keyboard.press("Enter");
  await expect.poll(isDark, { timeout: 10000 }).toBe(want === "dark");
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.());
  await page.waitForTimeout(900);
}
export async function inject(page: Page, css: string, id = "abs-arm") {
  await page.evaluate(({ css, id }) => { document.getElementById(id)?.remove(); if (!css) return;
    const s = document.createElement("style"); s.id = id; s.textContent = css; document.head.appendChild(s); }, { css, id });
}
export async function grab(page: Page, clip: { x: number; y: number; width: number; height: number }) {
  const buf = await page.screenshot({ clip, scale: "css" });
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return (x: number, y: number): RGB | null => { const px = Math.round(x - clip.x), py = Math.round(y - clip.y);
    if (px < 0 || py < 0 || px >= info.width || py >= info.height) return null;
    const o = (py * info.width + px) * 4; return [data[o], data[o + 1], data[o + 2]]; };
}

/** Geometry of cell i's ring: path vertices on screen, 60 stations along it, the cell rect. */
const ringGeom = (page: Page, i: number) => page.evaluate((i) => {
  const cell = document.querySelectorAll(".board-shell .game-cell")[i] as HTMLElement;
  const p = cell.querySelector(".cell-ghost-path") as SVGPathElement;
  const m = p.getScreenCTM()!; const T = (x: number, y: number) => [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f];
  const pts: number[][] = [];
  for (const g of p.getAttribute("d")!.matchAll(/([ML])\s*(-?[\d.eE+]+),(-?[\d.eE+]+)/g)) pts.push(T(parseFloat(g[2]), parseFloat(g[3])));
  const L = p.getTotalLength(); const bb = p.getBBox(); const [cx, cy] = T(bb.x + bb.width / 2, bb.y + bb.height / 2);
  const st: { x: number; y: number; nx: number; ny: number }[] = [];
  for (let k = 0; k < 60; k++) {
    const t = ((k + 0.5) / 60) * L; const a = p.getPointAtLength(Math.max(0, t - 0.5)), b = p.getPointAtLength(Math.min(L, t + 0.5)), c = p.getPointAtLength(t);
    const [x, y] = T(c.x, c.y), [ax, ay] = T(a.x, a.y), [bx, by] = T(b.x, b.y);
    let nx = -(by - ay), ny = bx - ax; const n = Math.hypot(nx, ny) || 1; nx /= n; ny /= n;
    if ((cx - x) * nx + (cy - y) * ny < 0) { nx = -nx; ny = -ny; }
    st.push({ x, y, nx, ny });
  }
  const r = cell.getBoundingClientRect(); const cs = getComputedStyle(p);
  return { pts, st, strokePx: parseFloat(cs.strokeWidth) * Math.hypot(m.a, m.b), strokeOpacity: cs.strokeOpacity, stroke: cs.stroke, cell: { x: r.x, y: r.y, w: r.width, h: r.height } };
}, i);
function leftSide(pts: number[][], n = 60) { const nv = pts.length % 4 === 1 ? pts.length - 1 : pts.length; const side = pts.slice((3 * nv) / 4, nv).concat([pts[0]]); const out: number[][] = [];
  for (let i = 0; i < n; i++) { const t = ((i + 0.5) / n) * (side.length - 1); const k = Math.min(side.length - 2, Math.floor(t)), f = t - k;
    out.push([side[k][0] + f * (side[k + 1][0] - side[k][0]), side[k][1] + f * (side[k + 1][1] - side[k][1])]); } return out; }
const sideOf = (s: { x: number; y: number }, c: { x: number; y: number; w: number; h: number }) => {
  const d = { top: Math.abs(s.y - c.y), bottom: Math.abs(c.y + c.h - s.y), left: Math.abs(s.x - c.x), right: Math.abs(c.x + c.w - s.x) };
  return (Object.entries(d).sort((a, b) => a[1] - b[1])[0][0]) as "top" | "bottom" | "left" | "right";
};

type Grab = (x: number, y: number) => RGB | null;
/** LIVE's price(), with per-side attribution added. */
export function price(before: Grab, after: Grab, st: { x: number; y: number; nx: number; ny: number }[], strokePx: number, expectInk: RGB | null, op: number, cell?: { x: number; y: number; w: number; h: number }) {
  const R = Math.max(5, strokePx * 1.5);
  const scans: { d: number; r: number }[][] = []; const core: { r: number; px: RGB; ground: RGB; side: string; at: number[] }[] = [];
  for (const s of st) {
    const scan: { d: number; r: number }[] = []; let best: { d: number; r: number; px: RGB; ground: RGB } | null = null;
    for (let t = -R; t <= R; t += 0.5) {
      const x = s.x + s.nx * t, y = s.y + s.ny * t; const a = after(x, y), b = before(x, y); if (!a || !b) continue;
      const d = d1(a, b), r = ratio(a, b); scan.push({ d, r }); if (!best || d > best.d) best = { d, r, px: a, ground: b };
    }
    scans.push(scan);
    if (best && best.d >= 8) core.push({ r: best.r, px: best.px, ground: best.ground, side: cell ? sideOf(s, cell) : "-", at: [r3(s.x), r3(s.y)] });
  }
  const rs = core.map((c) => c.r);
  const inkMed = [0, 1, 2].map((i) => med(core.map((c) => c.px[i]))); const groundMed = [0, 1, 2].map((i) => med(core.map((c) => c.ground[i])));
  const composite = expectInk ? groundMed.map((g, i) => Math.round(g * (1 - op) + expectInk[i] * op)) : null;
  const delta = composite ? d2(inkMed, composite) : null;
  const M = med(scans.map((s) => Math.max(0, ...s.map((p) => p.d))));
  const sensitivity = [0.5, 0.7, 0.9, 1.0].map((f) => { const per = scans.map((s) => s.filter((p) => p.d >= f * M * 0.999)).filter((c) => c.length).map((c) => Math.min(...c.map((p) => p.r)));
    return { at: `${Math.round(f * 100)}%`, worst: per.length ? r3(Math.min(...per)) : null, under3: `${per.filter((v) => v < 3).length}/${per.length}` }; });
  const bySide: Record<string, { n: number; worst: number; median: number; under3: number }> = {};
  for (const sd of ["top", "right", "bottom", "left"]) { const v = core.filter((c) => c.side === sd).map((c) => c.r); if (v.length) bySide[sd] = { n: v.length, worst: r3(Math.min(...v)), median: r3(med(v)), under3: v.filter((x) => x < 3).length }; }
  const under = core.filter((c) => c.r < 3).sort((a, b) => a.r - b.r).slice(0, 4).map((c) => ({ side: c.side, r: r3(c.r), ink: c.px, ground: c.ground, at: c.at }));
  return { under3Stations: under, painted: core.length, core: rs.length ? { max: r3(Math.max(...rs)), p30: r3(q(rs, 0.3)), median: r3(med(rs)), worst: r3(Math.min(...rs)), fracUnder3: r3(rs.filter((v) => v < 3).length / rs.length) } : null,
    sensitivity, bySide, inkMed, groundMed, isTheRing: delta === null ? null : delta <= 24, deltaToComposite: delta === null ? null : r3(delta) };
}

/** ONE focus cycle on board cell i → the ledger statistic AND the whole-ring core statistic,
 *  both from the same two photographs (ring-OFF = the cell blurred). `ink` = the hex the arm
 *  claims (for isTheRing), `op` its tier-2 opacity. */
export async function readCell(page: Page, i: number, ink: string, op: number, css = "") {
  const g0 = await ringGeom(page, i);
  const clip = { x: Math.floor(g0.cell.x - 20), y: Math.floor(g0.cell.y - 20), width: Math.ceil(g0.cell.w + 40), height: Math.ceil(g0.cell.h + 40) };
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.());
  await inject(page, css); await page.waitForTimeout(300);
  const before = await grab(page, clip);
  await page.evaluate((i) => document.querySelectorAll<HTMLInputElement>(".board-shell .game-cell .cell-native-input")[i]?.focus(), i);
  await page.keyboard.press("Shift"); await page.waitForTimeout(500);
  const g = await ringGeom(page, i); const after = await grab(page, clip);
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.()); await inject(page, "");
  const took: { r: number; ground: RGB; d: number }[] = [];
  for (const [x, y] of leftSide(g.pts)) { let best: { r: number; ground: RGB; d: number } | null = null;
    for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) { const b = before(x + dx, y + dy), a = after(x + dx, y + dy); if (!a || !b) continue;
      const d = d1(a, b); if (!best || d > best.d) best = { r: ratio(a, b), ground: b, d }; }
    if (best && best.d >= 8) took.push(best); }
  const ledger = { painted: took.length, worst: took.length ? r3(Math.min(...took.map((s) => s.r))) : null, median: took.length ? r3(med(took.map((s) => s.r))) : null,
    ground: [0, 1, 2].map((c) => Math.round(med(took.map((s) => s.ground[c])))) };
  return { strokeOpacity: g.strokeOpacity, stroke: g.stroke, ledger, ring: price(before, after, g.st, g.strokePx, hex(ink), op, g.cell) };
}

/** Device-pixel grab: CSS coordinates in, the device pixel under them out (dpr 1/2/3 density row). */
export async function grabDev(page: Page, clip: { x: number; y: number; width: number; height: number }, dpr: number) {
  const buf = await page.screenshot({ clip, scale: "device" });
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return (x: number, y: number): RGB | null => { const px = Math.floor((x - clip.x) * dpr), py = Math.floor((y - clip.y) * dpr);
    if (px < 0 || py < 0 || px >= info.width || py >= info.height) return null;
    const o = (py * info.width + px) * 4; return [data[o], data[o + 1], data[o + 2]]; };
}
/** Ring ON vs ring HIDDEN on the SAME focus (FACE's ring-differencing): a keypad or sheet that
 *  moves the layout on a tap cannot mis-register the two photographs. how = "key" | "tap". */
export async function readCellHidden(page: Page, i: number, ink: string, op: number, how: "key" | "tap", dpr: number) {
  if (how === "tap") { const b = (await page.locator(".board-shell .game-cell").nth(i).boundingBox())!; await page.touchscreen.tap(b.x + b.width / 2, b.y + b.height / 2); }
  else { await page.evaluate((i) => document.querySelectorAll<HTMLInputElement>(".board-shell .game-cell .cell-native-input")[i]?.focus(), i); await page.keyboard.press("Shift"); }
  await page.waitForTimeout(900);
  const fv = await page.evaluate((i) => !!document.querySelectorAll(".board-shell .game-cell")[i]?.querySelector("input:focus-visible"), i);
  const g = await ringGeom(page, i);
  const clip = { x: Math.floor(g.cell.x - 12), y: Math.floor(g.cell.y - 12), width: Math.ceil(g.cell.w + 24), height: Math.ceil(g.cell.h + 24) };
  const after = await grabDev(page, clip, dpr);
  await inject(page, ".cell-ghost-path{visibility:hidden!important}", "abs-hide");
  await page.evaluate(() => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r()))));
  const before = await grabDev(page, clip, dpr);
  await inject(page, "", "abs-hide");
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.());
  return { focusVisible: fv, strokeOpacity: g.strokeOpacity, boardPx: null as number | null, ring: price(before, after, g.st, g.strokePx, hex(ink), op, g.cell) };
}
