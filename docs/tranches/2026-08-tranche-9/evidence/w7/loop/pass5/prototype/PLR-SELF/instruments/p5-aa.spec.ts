/** PLR-SELF pass 5 — AA from PAINTED BYTES: the head sheets' edge (the stroke vs the ground it
 *  abuts, per column, with the frame-OFF subtraction) and the lobby's text (with the sensitivity
 *  row). Dist 4231 vs control dist 4230, desk 1280×800 fine, both themes. */
import { test, expect, type Page } from "@playwright/test";
import sharp from "sharp";
import { writeFileSync, mkdirSync } from "node:fs";
const CTRL = "http://127.0.0.1:4230", PROTO = "http://127.0.0.1:4231";
const OUT = process.env.PLR_OUT ?? "/tmp";
const lum = ([r, g, b]: number[]) => { const f = (c: number) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const ratio = (a: number[], b: number[]) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
async function grab(page: Page, x: number, y: number, w: number, h: number) {
  const buf = await page.screenshot({ clip: { x, y, width: w, height: h }, scale: "css" });
  const { data, info } = await sharp(buf).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const px = (i: number, j: number) => [data[(j * info.width + i) * 3], data[(j * info.width + i) * 3 + 1], data[(j * info.width + i) * 3 + 2]];
  return { w: info.width, h: info.height, px };
}
const stats = (v: number[]) => { const s = [...v].sort((a, b) => a - b); const q = (p: number) => +s[Math.min(s.length - 1, Math.floor(p * s.length))].toFixed(3); return { n: s.length, max: +s[s.length - 1].toFixed(3), p30: q(0.3), median: q(0.5), under3: +(s.filter((x) => x < 3).length / s.length).toFixed(3) }; };
/** The top edge band of a box: for each column in the middle 60%, the stroke pixel is the one in
 *  rows [top-2, top+4] furthest from the INSIDE ground (read 10px in); ratios against the inside
 *  ground and the outside ground (read 5px above). */
async function edge(page: Page, sel: string) {
  const r = await page.locator(sel).first().evaluate((e) => { const b = e.getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width }; });
  const x0 = Math.round(r.x + r.w * 0.2), x1 = Math.round(r.x + r.w * 0.8), y0 = Math.round(r.y) - 6;
  const g = await grab(page, x0, y0, x1 - x0, 22);
  const inside: number[] = [], outside: number[] = [];
  for (let i = 0; i < g.w; i++) {
    const gin = g.px(i, 16), gout = g.px(i, 1);
    let best = gin, bd = -1;
    for (let j = 4; j <= 10; j++) { const p = g.px(i, j); const d = Math.abs(lum(p) - lum(gin)); if (d > bd) { bd = d; best = p; } }
    inside.push(ratio(best, gin)); outside.push(ratio(best, gout));
  }
  return { inside: stats(inside), outside: stats(outside) };
}
/** Text AA with the sensitivity row: ground = the modal pixel; per column, ink mass = pixels off
 *  the ground by > 8/255 luminance-weighted; the column's ratio is its most distant pixel. */
async function text(page: Page, sel: string) {
  const r = await page.locator(sel).first().evaluate((e) => { const b = e.getBoundingClientRect(); return { x: b.x, y: b.y, w: b.width, h: b.height }; });
  const g = await grab(page, Math.floor(r.x), Math.floor(r.y), Math.ceil(r.w), Math.ceil(r.h));
  const count = new Map<string, number>(); for (let i = 0; i < g.w; i++) for (let j = 0; j < g.h; j++) { const k = g.px(i, j).join(","); count.set(k, (count.get(k) ?? 0) + 1); }
  const ground = [...count.entries()].sort((a, b) => b[1] - a[1])[0][0].split(",").map(Number);
  // INK MASS IS COVERAGE, not a pixel count over a haze threshold (pass-5 incident: the count
  // made antialias haze read as ink). Each pixel contributes its luminance distance from the
  // ground as a fraction of the element's own most distant pixel; a column is inked at ≥0.5.
  let far = 0; for (let i = 0; i < g.w; i++) for (let j = 0; j < g.h; j++) far = Math.max(far, Math.abs(lum(g.px(i, j)) - lum(ground)));
  const cols: { mass: number; ratio: number }[] = [];
  for (let i = 0; i < g.w; i++) { let mass = 0, best = 1; for (let j = 0; j < g.h; j++) { const p = g.px(i, j); mass += Math.abs(lum(p) - lum(ground)) / far; best = Math.max(best, ratio(p, ground)); } if (mass >= 0.5) cols.push({ mass, ratio: best }); }
  const med = [...cols].sort((a, b) => a.mass - b.mass)[Math.floor(cols.length / 2)].mass;
  const sens = Object.fromEntries([0.5, 0.7, 0.9, 1.0].map((q) => { const c = cols.filter((x) => x.mass >= q * med); return [q, c.length ? +Math.min(...c.map((x) => x.ratio)).toFixed(2) : null]; }));
  return { ground: ground.join(","), best: +Math.max(...cols.map((c) => c.ratio)).toFixed(2), sens, under45: +(cols.filter((c) => c.ratio < 4.5).length / cols.length).toFixed(3), cols: cols.length };
}
async function openCard(page: Page) {
  await page.locator(".corner-left .attribution-trigger").hover();
  const c = page.locator(".corner-left .hover-card.is-open");
  await expect(c).toBeVisible();
  let last = ""; await expect.poll(async () => { const v = await c.evaluate((e) => getComputedStyle(e).opacity + getComputedStyle(e).transform); const s = v === last && v.startsWith("1"); last = v; return s; }, { intervals: [150] }).toBe(true);
}
for (const theme of ["light", "dark"] as const)
  test(`aa ${theme}`, async ({ browser }, info) => {
    const res: any = { engine: info.project.name, theme };
    for (const [arm, base] of [["control", CTRL], ["proto", PROTO]] as const) {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, colorScheme: theme });
      const p = await ctx.newPage();
      await p.goto(base + "/?size=3&difficulty=EASY");
      await p.locator(".sudoku-cell .glyph-svg").first().waitFor({ state: "attached", timeout: 60000 });
      await p.evaluate(() => document.fonts.ready.then(() => 0));
      await openCard(p);
      res[`${arm}.card.edge`] = await edge(p, ".corner-left .hover-card");
      res[`${arm}.card.caption`] = await text(p, ".corner-left .hover-card p");
      if (arm === "proto") {
        await p.addStyleTag({ content: ".head-sheet-edge{visibility:hidden!important}" });
        res[`${arm}.card.edge.frameOFF`] = await edge(p, ".corner-left .hover-card");
        await p.evaluate(() => document.querySelectorAll("style").forEach((s) => s.textContent?.includes("head-sheet-edge{visibility") && s.remove()));
        await p.mouse.move(1270, 790);
        await expect(p.locator(".hover-card.is-open")).toHaveCount(0);
        await p.locator("[data-player-mark]:visible").click();
        const l = p.locator("[data-lobby].is-open");
        await expect(l).toBeVisible();
        let last = ""; await expect.poll(async () => { const v = await l.evaluate((e) => getComputedStyle(e).opacity + getComputedStyle(e).transform); const s = v === last && v.startsWith("1"); last = v; return s; }, { intervals: [150] }).toBe(true);
        res["proto.lobby.edge"] = await edge(p, "[data-lobby].is-open");
        res["proto.lobby.state"] = await text(p, "[data-lobby].is-open .pl-state");
        res["proto.lobby.you"] = await text(p, "[data-lobby].is-open .pl-qual");
      }
      await ctx.close();
    }
    mkdirSync(OUT, { recursive: true });
    writeFileSync(`${OUT}/aa-${info.project.name}-${theme}.json`, JSON.stringify(res, null, 1));
    console.log(`AA ${info.project.name} ${theme} ${JSON.stringify(res)}`);
  });
