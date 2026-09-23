/** T9-W7 pass 6 · MRK-ABS — the deck's centre-card ring: how much of it paints, per arm, PRM
 *  (boil parked), both themes, 1280×800 fine, one codec payload. A perimeter position (1 px steps
 *  along the ring's centre line) is VISIBLE when some pixel across the band both changed (ring ON vs
 *  the same pixels blurred, d > 12) and IS the computed outline ink over its ground (Δ ≤ 60). Also:
 *  the first-impression state at load, and the end cards' air (the ring must stay WHOLE). */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync } from "node:fs";
import { mint, grab, ratio, dist, r3, q, settled, inject, setTheme } from "./p6-lib";
const ARMS: Record<string, { url: string; css?: string }> = {
  A: { url: "http://127.0.0.1:4239" },
  "A+off5": { url: "http://127.0.0.1:4239", css: ".gallery-viewport:focus-visible .game-card.is-center{outline-offset:5px!important}" },
  "A+off6": { url: "http://127.0.0.1:4239", css: ".gallery-viewport:focus-visible .game-card.is-center{outline-offset:6px!important}" },
  "A+off7": { url: "http://127.0.0.1:4239", css: ".gallery-viewport:focus-visible .game-card.is-center{outline-offset:7px!important}" },
  D: { url: "http://127.0.0.1:4244" },
  HEAD: { url: "http://127.0.0.1:4240" },
};
const PICK = (process.env.ARMS ?? "A,A+off5,A+off6,A+off7,HEAD").split(",");
for (const a of PICK) { const m = a.match(/^A\+off(-?\d+)$/); if (m && !ARMS[a]) ARMS[a] = { url: "http://127.0.0.1:4239", css: `.gallery-viewport:focus-visible .game-card.is-center{outline-offset:${m[1]}px!important}` }; }
const OUT = process.env.OUT!;
async function ring(page: Page) {
  return page.evaluate(() => {
    const host = document.querySelector(".game-card.is-center") as HTMLElement; const cs = getComputedStyle(host); const r = host.getBoundingClientRect();
    const vp = (document.querySelector(".gallery-viewport") as HTMLElement).getBoundingClientRect();
    const cv = document.createElement("canvas").getContext("2d")!; cv.fillStyle = cs.outlineColor; cv.fillRect(0, 0, 1, 1); const px = cv.getImageData(0, 0, 1, 1).data;
    return { fv: document.querySelector(".gallery-viewport")!.matches(":focus-visible"), ink: [px[0], px[1], px[2]], a: px[3] / 255, w: parseFloat(cs.outlineWidth) || 0, off: parseFloat(cs.outlineOffset) || 0, style: cs.outlineStyle, rect: { x: r.x, y: r.y, w: r.width, h: r.height }, vp: { x: vp.x, y: vp.y, w: vp.width, h: vp.height } };
  });
}
test("deck ring", async ({ browser }, info) => {
  test.setTimeout(900000);
  const engine = info.project.name; const res: unknown[] = [];
  for (const arm of PICK)
    for (const theme of ["light", "dark"] as const) {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" }); const page = await ctx.newPage();
      await page.goto(`${ARMS[arm].url}/?view=gallery&size=3&board=${mint(3)}`);
      await expect(page.locator(".staging-band")).toBeVisible({ timeout: 30000 }); await settled(page);
      const atLoad = await page.evaluate(() => ({ active: (document.activeElement as HTMLElement)?.className?.toString().split(" ")[0], fv: document.querySelector(".gallery-viewport")!.matches(":focus-visible") }));
      await setTheme(page, theme);
      if (ARMS[arm].css) await inject(page, ARMS[arm].css!, "p6-deck-arm");
      await page.locator(".gallery-viewport").focus(); await page.keyboard.press("Shift"); await settled(page);
      const g = await ring(page);
      const M = g.off + g.w + 6; const clip = { x: Math.floor(g.rect.x - M), y: Math.floor(g.rect.y - M), width: Math.ceil(g.rect.w + 2 * M), height: Math.ceil(g.rect.h + 2 * M) };
      const on = await grab(page, clip, 1);
      await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.()); await settled(page);
      const off = await grab(page, clip, 1);
      // centre line of the ring
      const c = g.off + g.w / 2; const R = g.rect; const L = { x0: R.x - c, y0: R.y - c, x1: R.x + R.w + c, y1: R.y + R.h + c };
      const pos: number[][] = [];
      for (let x = L.x0; x <= L.x1; x += 1) { pos.push([x, L.y0, 0, -1]); pos.push([x, L.y1, 0, 1]); }
      for (let y = L.y0 + 1; y < L.y1; y += 1) { pos.push([L.x0, y, -1, 0]); pos.push([L.x1, y, 1, 0]); }
      const vis: number[] = [];
      for (const [x, y, nx, ny] of pos) {
        let best: { d: number; r: number } | null = null;
        for (let t = -(g.w / 2 + 1); t <= g.w / 2 + 1; t += 0.5) {
          const a = off(x + nx * t, y + ny * t), b = on(x + nx * t, y + ny * t); if (!a || !b) continue;
          const want = g.ink.map((v, i) => g.a * v + (1 - g.a) * a[i]); if (dist(b, want) > 60) continue;
          const d = dist(a, b); if (d > 12 && (!best || d > best.d)) best = { d, r: ratio(b, a) };
        }
        if (best) vis.push(best.r);
      }
      const outer = { l: R.x - g.off - g.w - g.vp.x, r: g.vp.x + g.vp.w - (R.x + R.w + g.off + g.w) };
      const row = { engine, arm, theme, atLoad, outline: `${g.w}px ${g.style} ${g.ink}@${r3(g.a)} offset ${g.off}`, positions: pos.length, visible: vis.length, pct: r3((100 * vis.length) / pos.length), worst: vis.length ? r3(Math.min(...vis)) : null, median: vis.length ? r3(q(vis, 0.5)) : null, under3: vis.filter((v) => v < 3).length, centreAir: { l: r3(outer.l), r: r3(outer.r) } };
      // the end cards: WHOLE inside the scrollport at the arm's offset
      await page.locator(".gallery-viewport").focus();
      const ends: Record<string, unknown> = {};
      for (const [k, key, n] of [["first", "ArrowLeft", 6], ["last", "ArrowRight", 12]] as const) {
        for (let i = 0; i < n; i++) { await page.keyboard.press(key); await settled(page); }
        const e = await ring(page);
        ends[k] = { airL: r3(e.rect.x - e.off - e.w - e.vp.x), airR: r3(e.vp.x + e.vp.w - (e.rect.x + e.rect.w + e.off + e.w)) };
      }
      Object.assign(row, { ends });
      res.push(row); console.log(JSON.stringify(row));
      await ctx.close();
    }
  writeFileSync(`${OUT}/deck-${process.env.TAG ?? "x"}-${engine}.json`, JSON.stringify(res));
});
