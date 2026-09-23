/** CRITIC k2 — the drawn edge on the @mbabb card, painted bytes, dist vs dist on one minted payload:
 *  top-band column medians (the lane's statistic re-derived independently), and the CORNERS —
 *  ink painted outside the card's own 1rem-rounded ground (the frame's radius is 3). */
import { test, expect, type Page, type Browser } from "@playwright/test";
import sharp from "sharp";
const CTRL = "http://127.0.0.1:4244", MINE = "http://127.0.0.1:4245";
async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect.poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 }).toBeGreaterThan(0);
}
const givens = (p: Page) => p.evaluate(() => [...document.querySelectorAll<HTMLInputElement>(".sudoku-cell input")].map((i) => (/given clue/.test(i.getAttribute("aria-label") ?? "") && i.value ? i.value : "0")).join(""));
const lum = (r: number, g: number, b: number) => { const f = (c: number) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const ratio = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
async function arm(browser: Browser, base: string, q: string, theme: "light" | "dark") {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, colorScheme: theme });
  const p = await ctx.newPage();
  await p.goto(base + "/?size=3&difficulty=EASY" + q);
  await settled(p);
  return { ctx, p };
}
async function read(p: Page) {
  await p.locator(".corner-left .attribution-trigger").hover();
  const card = p.locator(".corner-left .hover-card");
  await expect(card).toHaveClass(/is-open/);
  let last = ""; await expect.poll(async () => { const v = JSON.stringify(await card.evaluate((e) => { const r = e.getBoundingClientRect(); return [r.x, r.y, r.width, r.height, getComputedStyle(e).opacity]; })); const s = v === last; last = v; return s; }, { intervals: [150], timeout: 8000 }).toBe(true);
  const box = await card.evaluate((e) => { const r = e.getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height, radius: getComputedStyle(e).borderTopLeftRadius, bw: getComputedStyle(e).borderTopWidth }; });
  const png = await p.screenshot({ scale: "css" });
  const { data, info } = await sharp(png).raw().toBuffer({ resolveWithObject: true });
  const px = (x: number, y: number) => { const i = (Math.round(y) * info.width + Math.round(x)) * info.channels; return [data[i], data[i + 1], data[i + 2]]; };
  // top band: middle 60% of the top edge; stroke = the pixel in rows y..y+5 furthest (in luminance) from the ground 12px inside.
  const cols: number[] = [];
  for (let x = box.x + box.w * 0.2; x < box.x + box.w * 0.8; x++) {
    const g = lum(...(px(x, box.y + 12) as [number, number, number]));
    let best = 1;
    for (let y = box.y; y < box.y + 5; y++) best = Math.max(best, ratio(lum(...(px(x, y) as [number, number, number])), g));
    cols.push(best);
  }
  cols.sort((a, b) => a - b);
  const med = cols[Math.floor(cols.length / 2)], under3 = cols.filter((c) => c < 3).length / cols.length;
  // corners: pixels inside the box but OUTSIDE the ground's rounded corner (radius R), top-left and bottom-left.
  const R = parseFloat(box.radius);
  const corner = (cx: number, cy: number, sx: number, sy: number) => { const out: [number, number][] = []; for (let dy = 0; dy < R; dy++) for (let dx = 0; dx < R; dx++) { const ox = R - dx - 0.5, oy = R - dy - 0.5; if (Math.hypot(ox, oy) > R + 0.5) out.push([cx + sx * dx, cy + sy * dy]); } return out; };
  const pts = [...corner(Math.ceil(box.x), Math.ceil(box.y), 1, 1), ...corner(Math.ceil(box.x), Math.floor(box.y + box.h - 1), 1, -1)];
  return { box, med: +med.toFixed(3), under3: +under3.toFixed(3), n: cols.length, pts, px };
}
for (const theme of ["light", "dark"] as const)
  test(`k2 edge ${theme}`, async ({ browser }, info) => {
    const c0 = await arm(browser, CTRL, "", theme);
    const g = await givens(c0.p);
    const payload = await c0.p.evaluate((g) => btoa(String.fromCharCode(1) + "3." + g).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""), g);
    await c0.ctx.close();
    const q = `&board=${payload}`;
    const c = await arm(browser, CTRL, q, theme), m = await arm(browser, MINE, q, theme);
    expect(await givens(c.p)).toBe(g); expect(await givens(m.p)).toBe(g);
    const rc = await read(c.p), rm = await read(m.p);
    // corner ink: same pixels, both arms; a pixel "moved" when it differs by >= 40 in any channel
    let moved = 0, darker = 0;
    for (const [x, y] of rc.pts) { const a = rc.px(x, y), b = rm.px(x, y); const d = Math.max(...a.map((v, i) => Math.abs(v - b[i]))); if (d >= 40) moved++; if (d >= 40 && lum(...(b as [number, number, number])) !== lum(...(a as [number, number, number]))) darker++; }
    console.log(`K2 ${info.project.name} ${theme} payload=${payload.slice(0, 14)}… givens=${g.replace(/0/g, "").length} CTRL box=${JSON.stringify(rc.box)} med=${rc.med} under3=${rc.under3} n=${rc.n} | MINE box=${JSON.stringify(rm.box)} med=${rm.med} under3=${rm.under3} | cornerPx outside ground=${rc.pts.length} moved>=40=${moved}`);
    await c.ctx.close(); await m.ctx.close();
  });
