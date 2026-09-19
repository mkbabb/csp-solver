/**
 * T9-W7 pass 3 · MRK-ABS CRITIC — the DECISION ROW, re-taken independently.
 * Three arms at the SAME pixels: the shipped one value (#3a7bc4), the REFUSED alias
 * (var(--color-crayon-blue)) whose 1.39:1 the return asserts with no banked log, and
 * law 39's stroke-opacity 0.9 (the value gameCell.css carried before MRK-LIVE's 0.95,
 * which this family does not own).
 */
import { test, expect, type Page } from "@playwright/test";
import fs from "node:fs";
import sharp from "sharp";

const OUT = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/critique/MRK-ABS/logs";
const lin = (c: number) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4); };
const L = (r: number, g: number, b: number) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a: number[], b: number[]) => { const la = L(a[0],a[1],a[2]), lb = L(b[0],b[1],b[2]); return (Math.max(la,lb)+0.05)/(Math.min(la,lb)+0.05); };
const dist = (a: number[], b: number[]) => Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1])+Math.abs(a[2]-b[2]);
const med = (v: number[]) => (v.length ? [...v].sort((x,y)=>x-y)[v.length>>1] : NaN);

async function setTheme(page: Page, want: "light"|"dark") {
  const isDark = () => page.evaluate(() => document.documentElement.classList.contains("dark"));
  if ((await isDark()) === (want === "dark")) return;
  await page.locator("button.sun-moon-toggle").click();
  await expect.poll(isDark, { timeout: 10000 }).toBe(want === "dark");
  await page.waitForTimeout(600);
}
const ringGeom = (page: Page, idx: number) => page.evaluate((i) => {
  const cell = document.querySelectorAll(".board-shell .game-cell")[i] as HTMLElement;
  const p = cell.querySelector(".cell-ghost-path") as SVGPathElement;
  const m = p.getScreenCTM()!; const pts: number[][] = [];
  for (const g of p.getAttribute("d")!.matchAll(/([ML])\s*(-?[\d.eE+]+),(-?[\d.eE+]+)/g))
    pts.push([m.e + m.a*parseFloat(g[2]), m.f + m.d*parseFloat(g[3])]);
  const r = cell.getBoundingClientRect();
  const cs = getComputedStyle(p);
  return { pts, strokePx: parseFloat(cs.strokeWidth)*m.a, strokeOpacity: cs.strokeOpacity,
           stroke: cs.stroke, cell: { x:r.x, y:r.y, w:r.width, h:r.height } };
}, idx);
async function grab(page: Page, clip: {x:number;y:number;width:number;height:number}) {
  const buf = await page.screenshot({ clip, scale: "css" });
  const { data, info } = await sharp(buf).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  return (x: number, y: number) => { const px = Math.round(x-clip.x), py = Math.round(y-clip.y);
    if (px<0||py<0||px>=info.width||py>=info.height) return null;
    const o = (py*info.width+px)*4; return [data[o],data[o+1],data[o+2]]; };
}
function leftSide(pts: number[][], n = 60) {
  const side = pts.slice(12).concat([pts[0]]); const out: number[][] = [];
  for (let i=0;i<n;i++){ const t=((i+0.5)/n)*(side.length-1); const k=Math.min(side.length-2,Math.floor(t)), f=t-k;
    out.push([side[k][0]+f*(side[k+1][0]-side[k][0]), side[k][1]+f*(side[k+1][1]-side[k][1])]); }
  return out;
}
const rows: Record<string, unknown>[] = [];

for (const theme of ["dark","light"] as const) {
  test(`decision row · 16x16 · cell0 · ${theme}`, async ({ page }, info) => {
    const engine = info.project.name;
    await page.goto(`/?size=4`);
    await page.waitForSelector(".board-shell .game-cell", { timeout: 120000 });
    await expect.poll(() => page.locator(".board-shell .game-cell").count(), { timeout: 120000 }).toBe(256);
    await setTheme(page, theme);
    await page.waitForTimeout(900);

    const g0 = await ringGeom(page, 0);
    const clip = { x: Math.floor(g0.cell.x-20), y: Math.floor(g0.cell.y-20),
                   width: Math.ceil(g0.cell.w+40), height: Math.ceil(g0.cell.h+40) };
    const before = await grab(page, clip);

    const ARMS: { name: string; css: string }[] = [
      { name: "shipped-one-value", css: "" },
      { name: "REFUSED-alias-crayon-blue", css: `:root, .dark { --color-focus-sketch: var(--color-crayon-blue) !important; }` },
      { name: "law39-opacity-0.9", css: `.game-cell:has(input:focus-visible) .cell-ghost-path { stroke-opacity: 0.9 !important; }` },
    ];
    for (const arm of ARMS) {
      await page.evaluate((css) => {
        document.getElementById("crit-arm")?.remove();
        if (!css) return;
        const s = document.createElement("style"); s.id = "crit-arm"; s.textContent = css;
        document.head.appendChild(s);
      }, arm.css);
      await page.evaluate(() => { (document.querySelectorAll<HTMLInputElement>(".board-shell .game-cell .cell-native-input")[0])?.focus(); });
      await page.keyboard.press("Shift");
      await page.waitForTimeout(500);
      const g1 = await ringGeom(page, 0);
      const after = await grab(page, clip);
      const samples = leftSide(g1.pts);
      type S = { ink: number[]; ground: number[]; r: number };
      const took: S[] = [];
      for (const [x,y] of samples) {
        let best: S|null = null, bestD = 0;
        for (let dx=-1;dx<=1;dx++) for (let dy=-1;dy<=1;dy++) {
          const b = before(x+dx,y+dy), a = after(x+dx,y+dy);
          if (!b||!a) continue; const d = dist(a,b);
          if (d>bestD) { bestD=d; best={ ink:a, ground:b, r:ratio(a,b) }; }
        }
        if (best && bestD>=8) took.push(best);
      }
      const row = { engine, theme, arm: arm.name, strokeOpacity: g1.strokeOpacity, stroke: g1.stroke,
        strokePx: +g1.strokePx.toFixed(3), samples: samples.length, painted: took.length,
        inkMedian: [0,1,2].map(c=>Math.round(med(took.map(s=>s.ink[c])))),
        groundMedian: [0,1,2].map(c=>Math.round(med(took.map(s=>s.ground[c])))),
        worst: took.length ? +Math.min(...took.map(s=>s.r)).toFixed(3) : null,
        median: took.length ? +med(took.map(s=>s.r)).toFixed(3) : null };
      rows.push(row); console.log("CRIT " + JSON.stringify(row));
      await page.evaluate(() => (document.activeElement as HTMLElement)?.blur());
      await page.waitForTimeout(250);
    }
    fs.mkdirSync(OUT, { recursive: true });
    fs.writeFileSync(`${OUT}/decision-${engine}.json`, JSON.stringify(rows, null, 2));
    expect(rows.length).toBeGreaterThan(0);
  });
}
