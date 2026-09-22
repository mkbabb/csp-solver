// T9-W7 pass 4 · MRK-ABS — shared instrument helpers (copied recipes: pass-3 band read,
// the critic's max-changed-pixel-in-3x3 board read; theme flipped BY KEYBOARD).
import { expect, type Page } from "@playwright/test";
import sharp from "sharp";
import fs from "node:fs";
export const OUT = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass4/prototype/MRK-ABS/logs";
fs.mkdirSync(OUT, { recursive: true });
export const bank = (n: string, d: unknown) => fs.writeFileSync(`${OUT}/${n}.json`, JSON.stringify(d, null, 1));
export type RGB = number[];
const lin = (c: number) => { const s = c / 255; return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };
export const L = (c: RGB) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
export const ratio = (a: RGB, b: RGB) => { const x = L(a), y = L(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
export const dist = (a: RGB, b: RGB) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
export const med = (v: number[]) => (v.length ? [...v].sort((x, y) => x - y)[v.length >> 1] : NaN);
export const hex = (h: string): RGB => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
export const r3 = (x: number) => Math.round(x * 1000) / 1000;

/** A REAL `?board=` payload (pass4 CHAIR-RULINGS addendum): the app's own codec,
 *  `toBase64Url("\x01" + "<size>.<cells base36>")`. A valid pattern solution, ~half given,
 *  cells 0 and 1 held EMPTY (the frame crossing and the paper cell the rows read). */
export function mintSudoku(sub: number): string {
  const n = sub * sub; let cells = "";
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    const i = r * n + c; const v = ((r * sub + Math.floor(r / sub) + c) % n) + 1;
    const keep = i > 1 && ((r * 7 + c * 3) % 5 < 2);
    cells += (keep ? v : 0).toString(36);
  }
  return Buffer.from(String.fromCharCode(1) + `${sub}.${cells}`, "latin1").toString("base64url");
}

export async function setTheme(page: Page, want: "light" | "dark") {
  const isDark = () => page.evaluate(() => document.documentElement.classList.contains("dark"));
  if ((await isDark()) === (want === "dark")) return;
  await page.locator("button.sun-moon-toggle").first().evaluate((n: HTMLElement) => n.focus());
  await page.keyboard.press("Enter");
  await expect.poll(isDark, { timeout: 10000 }).toBe(want === "dark");
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.());
  await page.waitForTimeout(700);
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

export const ringGeom = (page: Page, idx: number) => page.evaluate((i) => {
  const cell = document.querySelectorAll(".board-shell .game-cell")[i] as HTMLElement;
  const p = cell.querySelector(".cell-ghost-path") as SVGPathElement;
  const m = p.getScreenCTM()!; const pts: number[][] = [];
  for (const g of p.getAttribute("d")!.matchAll(/([ML])\s*(-?[\d.eE+]+),(-?[\d.eE+]+)/g))
    pts.push([m.e + m.a * parseFloat(g[2]), m.f + m.d * parseFloat(g[3])]);
  const r = cell.getBoundingClientRect(); const cs = getComputedStyle(p);
  return { pts, strokeOpacity: cs.strokeOpacity, stroke: cs.stroke, cell: { x: r.x, y: r.y, w: r.width, h: r.height } };
}, idx);
function leftSide(pts: number[][], n = 60) { const side = pts.slice(12).concat([pts[0]]); const out: number[][] = [];
  for (let i = 0; i < n; i++) { const t = ((i + 0.5) / n) * (side.length - 1); const k = Math.min(side.length - 2, Math.floor(t)), f = t - k;
    out.push([side[k][0] + f * (side[k + 1][0] - side[k][0]), side[k][1] + f * (side[k + 1][1] - side[k][1])]); } return out; }

export async function readRing(page: Page, cellIdx: number, css: string) {
  const g0 = await ringGeom(page, cellIdx);
  const clip = { x: Math.floor(g0.cell.x - 20), y: Math.floor(g0.cell.y - 20), width: Math.ceil(g0.cell.w + 40), height: Math.ceil(g0.cell.h + 40) };
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.());
  await page.waitForTimeout(250);
  const before = await grab(page, clip);
  await inject(page, css);
  await page.evaluate((i) => { document.querySelectorAll<HTMLInputElement>(".board-shell .game-cell .cell-native-input")[i]?.focus(); }, cellIdx);
  await page.keyboard.press("Shift");
  await page.waitForTimeout(450);
  const g1 = await ringGeom(page, cellIdx);
  const after = await grab(page, clip);
  const took: { r: number; ground: number[] }[] = [];
  for (const [x, y] of leftSide(g1.pts)) {
    let best: { r: number; ground: number[] } | null = null, bd = 0;
    for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) {
      const b = before(x + dx, y + dy), a = after(x + dx, y + dy); if (!a || !b) continue;
      const d = dist(a, b); if (d > bd) { bd = d; best = { r: ratio(a, b), ground: b }; } }
    if (best && bd >= 8) took.push(best);
  }
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.());
  await inject(page, "");
  await page.waitForTimeout(200);
  return { painted: took.length, strokeOpacity: g1.strokeOpacity, stroke: g1.stroke,
    ground: [0, 1, 2].map((c) => Math.round(med(took.map((s) => s.ground[c])))),
    worst: took.length ? r3(Math.min(...took.map((s) => s.r))) : null, median: took.length ? r3(med(took.map((s) => s.r))) : null };
}

