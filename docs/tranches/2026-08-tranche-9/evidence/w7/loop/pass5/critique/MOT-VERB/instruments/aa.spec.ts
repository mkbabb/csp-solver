/** Critic AA: the grid rules' painted contrast against the paper they abut, from painted bytes,
 *  after vs control, both themes, DPR 2, PRM-parked; with the sensitivity row (ink pixels at
 *  >= 50/70/90/100 % of the max ink deviation → median contrast, and fraction under 3.0). */
import { test, type Page } from "@playwright/test";
import sharp from "sharp";
import { PAYLOAD, ARMS } from "./board";
const lin = (c: number) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const L = (r: number, g: number, b: number) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const cr = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
async function read(page: Page, url: string) {
  await page.goto(`${url}/?game=sudoku&board=${PAYLOAD}`, { waitUntil: "networkidle" });
  await page.waitForTimeout(4000);
  // the grid's rules only: hide the cells' digits so the ink population is the rules
  await page.addStyleTag({ content: ".board-cells, .board-cells * { visibility: hidden !important; }" });
  await page.waitForTimeout(300);
  const buf = await page.locator(".board-peek-host .hand-drawn-grid").first().screenshot();
  const { data, info } = await sharp(buf).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const lum: number[] = [];
  for (let i = 0; i < data.length; i += 3) lum.push(L(data[i], data[i + 1], data[i + 2]));
  const sorted = [...lum].sort((a, b) => a - b);
  const paper = sorted[Math.floor(sorted.length / 2)]; // the ground: the median pixel
  const dev = lum.map((l) => Math.abs(l - paper));
  const maxDev = dev.reduce((m, x) => (x > m ? x : m), 0);
  const row: any = { paperL: +paper.toFixed(4) };
  for (const f of [0.5, 0.7, 0.9, 1.0]) {
    const inks = lum.filter((_, i) => dev[i] >= f * maxDev * (f === 1 ? 0.999 : 1));
    const crs = inks.map((l) => cr(l, paper)).sort((a, b) => a - b);
    row[`p${f * 100}`] = { n: crs.length, median: +crs[Math.floor(crs.length / 2)].toFixed(3), under3: +(crs.filter((c) => c < 3).length / crs.length).toFixed(3) };
  }
  row.px = lum.length; row.w = info.width;
  return row;
}
for (const dark of [false, true]) {
  test(`AA grid rules · ${dark ? "dark" : "light"}`, async ({ browser }, info) => {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, colorScheme: dark ? "dark" : "light", reducedMotion: "reduce" });
    const page = await ctx.newPage();
    const A = await read(page, ARMS.after), C = await read(page, ARMS.control), C2 = await read(page, ARMS.control);
    console.log(`AA[${info.project.name}·${dark ? "dark" : "light"}] after ${JSON.stringify(A)}`);
    console.log(`AA[${info.project.name}·${dark ? "dark" : "light"}] control ${JSON.stringify(C)}`);
    console.log(`AA[${info.project.name}·${dark ? "dark" : "light"}] control2 ${JSON.stringify(C2)}`);
    await ctx.close();
  });
}
