import { test, expect, type Page, type BrowserContext } from "@playwright/test";
import sharp from "sharp";
const PROTO = "http://127.0.0.1:4246"; const Q = "difficulty=EASY&wire=local";
async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect.poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 }).toBeGreaterThan(0);
}
async function invite(page: Page): Promise<string> {
  const verb = page.locator('.controls-card button[aria-label="Play together on this board"]');
  await expect(verb).toBeEnabled();
  const docked = !(await verb.isVisible());
  if (docked) {
    await page.locator(".drawer-tab").first().click();
    await page.waitForTimeout(700);
  }
  await verb.click();
  await expect.poll(() => page.locator(".players-roster .player-row").count()).toBe(1);
  if (docked) {
    await page.locator(".drawer-tab").first().click();
    await expect(page.locator("#controls-drawer .drawer-case")).toBeHidden();
    await page.waitForTimeout(700);
  }
  return page.url();
}
/** ONE ENCODED BOARD for every frame (chair addendum: a bare name pins nothing). The payload is
 *  the product's own share link's `?board=`, minted by the π probe and banked beside it. */
const BOARD = process.env.PLC_BOARD;
async function table(ctx: BrowserContext, n: number) {
  const a = await ctx.newPage();
  await a.goto(BOARD ? `${PROTO}/?board=${BOARD}&${Q}` : `${PROTO}/?size=3&${Q}`);
  await settled(a);
  const link = await invite(a);
  const pages = [a];
  for (let i = 1; i < n; i++) {
    const p = await ctx.newPage();
    await p.goto(link);
    await settled(p);
    pages.push(p);
  }
  await a.bringToFront();
  await expect.poll(() => a.locator(".players-roster .player-row").count(), { timeout: 20000 }).toBe(n);
  return pages;
}

const lum = (r: number, g: number, b: number) => {
  const f = (c: number) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const ratio = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

async function pixels(png: Buffer) {
  const { data, info } = await sharp(png).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const px: [number, number, number][] = [];
  for (let i = 0; i < data.length; i += 3) px.push([data[i], data[i + 1], data[i + 2]]);
  return { px, w: info.width };
}
function modal(px: [number, number, number][]) {
  const m = new Map<string, number>();
  for (const p of px) m.set(p.join(","), (m.get(p.join(",")) ?? 0) + 1);
  return [...m.entries()].sort((a, b) => b[1] - a[1])[0][0].split(",").map(Number) as [number, number, number];
}
async function inkRatio(page: Page, clip: { x: number; y: number; width: number; height: number }) {
  const { px } = await pixels(await page.screenshot({ clip }));
  const ground = modal(px);
  const lg = lum(...ground);
  let best = 1;
  for (const p of px) best = Math.max(best, ratio(lum(...p), lg));
  return { ground: ground.join(","), ratio: +best.toFixed(3) };
}

async function theme(page: Page, dark: boolean) {
  const isDark = await page.evaluate(() => document.documentElement.classList.contains("dark"));
  if (isDark !== dark) {
    await page.locator('button[aria-label^="Switch to"]').first().click();
    await page.waitForTimeout(1200);
  }
  expect(await page.evaluate(() => document.documentElement.classList.contains("dark"))).toBe(dark);
}

// CRITIC: the THRESHOLD-SENSITIVITY row (LAWS §Gates) for the two thin marks the prototype read
// as one best pixel: your ring (2px stroke, 8px across) and a peer dot, against the SHEET ground
// (the modal of the whole chart clip, which is paper), per ink column.
test("ring and dot sensitivity", async ({ browser }, info) => {
  test.setTimeout(300000);
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
  const [a, b] = await table(ctx, 2);
  await b.bringToFront(); await b.locator(".sudoku-cell input").nth(10).click();
  await a.bringToFront(); await a.locator(".sudoku-cell input").nth(40).click(); await a.waitForTimeout(900);
  const out: Record<string, unknown> = {};
  for (const dark of [false, true]) {
    await theme(a, dark);
    await a.locator(".sudoku-cell input").nth(40).click();
    await a.locator("[data-player-mark]:visible").click();
    await a.waitForTimeout(600);
    const g = await a.evaluate(() => {
      const bb = (q: string) => { const r = document.querySelector(`[data-lobby].is-open ${q}`)!.getBoundingClientRect(); return { x: Math.floor(r.x) - 1, y: Math.floor(r.y) - 1, width: Math.ceil(r.width) + 3, height: Math.ceil(r.height) + 3 }; };
      return { chart: bb(".place-chart"), ring: bb(".chart-self"), dot: bb(".chart-dot") };
    });
    const ground = modal((await pixels(await a.screenshot({ clip: g.chart }))).px);
    const lg = lum(...ground);
    const row: Record<string, unknown> = { ground: ground.join(",") };
    for (const k of ["ring", "dot"] as const) {
      const { px, w } = await pixels(await a.screenshot({ clip: g[k] }));
      const h = px.length / w;
      const cols: { best: number; mass: number }[] = [];
      for (let x = 0; x < w; x++) {
        let best = 1, mass = 0;
        for (let y = 0; y < h; y++) { const r = ratio(lum(...px[y * w + x]), lg); if (r > 1.15) { mass++; best = Math.max(best, r); } }
        if (mass) cols.push({ best, mass });
      }
      const med = [...cols].map((c) => c.mass).sort((p, q) => p - q)[Math.floor(cols.length / 2)];
      const at = (f: number) => { const s = cols.filter((c) => c.mass >= f * med).map((c) => c.best).sort((p, q) => p - q); return s.length ? +s[0].toFixed(3) : null; };
      const inkPx = px.map((p) => ratio(lum(...p), lg)).filter((r) => r > 1.15).sort((p, q) => p - q);
      row[k] = { cols: cols.length, worstCol: +Math.min(...cols.map((c) => c.best)).toFixed(3), worstAt50: at(0.5), worstAt70: at(0.7), worstAt90: at(0.9), worstAt100: at(1), colsUnder3: +(cols.filter((c) => c.best < 3).length / cols.length).toFixed(3), inkPx: inkPx.length, inkPxP50: +inkPx[Math.floor(inkPx.length / 2)].toFixed(3), inkPxUnder3: +(inkPx.filter((r) => r < 3).length / inkPx.length).toFixed(3), best: +inkPx[inkPx.length - 1].toFixed(3) };
    }
    out[dark ? "dark" : "light"] = row;
    await a.keyboard.press("Escape"); await a.waitForTimeout(300);
  }
  console.log(`CRIT|${info.project.name}|SENS|${JSON.stringify(out)}`);
  await ctx.close();
});
