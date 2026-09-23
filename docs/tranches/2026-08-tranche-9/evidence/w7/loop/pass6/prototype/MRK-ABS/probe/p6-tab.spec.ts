/** T9-W7 pass 6 · MRK-ABS — law 39's tab, PARKED (PRM), both themes, the tree's dashed currentColor vs
 *  arm L39 (the rule deleted; the base token), one payload. G-ABS-3's band reader (copied): lines
 *  per side along the normal, ring OFF = blurred, the changed pixel must BE the computed ink; both
 *  statistics (the worst line and the core median + fraction under 3), two bare photographs. */
import { test, expect, type Page } from "@playwright/test";
import { mint, setTheme, settled, grab, ratio, dist, r3, q } from "./p6-lib";
async function band(page: Page, photo: number) {
  await page.keyboard.press("Shift");
  await page.evaluate(async () => { (document.activeElement as HTMLElement)?.blur?.(); await new Promise((r) => requestAnimationFrame(r)); (document.querySelector("button.drawer-tab") as HTMLElement).focus(); });
  await settled(page);
  const g = await page.evaluate(() => { const el = document.activeElement as HTMLElement; const cs = getComputedStyle(el); const r = el.getBoundingClientRect();
    const cv = document.createElement("canvas").getContext("2d")!; cv.fillStyle = cs.outlineColor; cv.fillRect(0, 0, 1, 1); const px = cv.getImageData(0, 0, 1, 1).data;
    return { fv: el.matches(":focus-visible"), ink: [px[0], px[1], px[2]], a: px[3] / 255, style: cs.outlineStyle, w: parseFloat(cs.outlineWidth) || 0, off: parseFloat(cs.outlineOffset) || 0, rect: { x: r.x, y: r.y, w: r.width, h: r.height } }; });
  const M = Math.max(0, g.off) + g.w + 8; const clip = { x: Math.floor(g.rect.x - M), y: Math.floor(g.rect.y - M), width: Math.ceil(g.rect.w + 2 * M), height: Math.ceil(g.rect.h + 2 * M) };
  const on = await grab(page, clip, 1); const on2 = photo > 1 ? await grab(page, clip, 1) : on;
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.()); await settled(page);
  const off = await grab(page, clip, 1);
  const read = (onG: typeof on) => { const lines: number[] = []; const R = g.rect;
    for (const side of ["top", "bottom", "left", "right"]) for (const t of [0.2, 0.26, 0.32, 0.38, 0.44, 0.5, 0.56, 0.62, 0.68, 0.74, 0.8]) {
      let best: { d: number; r: number } | null = null;
      for (let s = Math.max(-1, g.off - 2); s <= g.off + g.w + 2; s += 0.5) for (let lat = -1; lat <= 1; lat++) {
        const x = side === "left" ? R.x - s : side === "right" ? R.x + R.w + s : R.x + R.w * t + lat; const y = side === "top" ? R.y - s : side === "bottom" ? R.y + R.h + s : R.y + R.h * t + lat;
        const a = off(x, y), b = onG(x, y); if (!a || !b) continue; if (dist(b, g.ink.map((c, i) => g.a * c + (1 - g.a) * a[i])) > 60) continue;
        const d = dist(a, b); if (!best || d > best.d) best = { d, r: ratio(b, a) }; }
      if (best && best.d > 12) lines.push(best.r); }
    return { lines: lines.length, worst: lines.length ? r3(Math.min(...lines)) : null, median: lines.length ? r3(q(lines, 0.5)) : null, under3: lines.length ? r3(lines.filter((v) => v < 3).length / lines.length) : null }; };
  return { outline: `${g.w}px ${g.style} ${g.ink}@${r3(g.a)} offset ${g.off}`, fv: g.fv, first: read(on), second: read(on2) };
}
test("law 39 tab", async ({ browser }, info) => {
  test.setTimeout(300000);
  for (const [arm, url] of [["tree", "http://127.0.0.1:4239"], ["L39", "http://127.0.0.1:4247"], ["HEAD", "http://127.0.0.1:4240"]] as const)
    for (const theme of ["light", "dark"] as const) {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" }); const page = await ctx.newPage();
      await page.goto(`${url}/?size=3&board=${mint(3)}`);
      await expect.poll(() => page.locator(".board-shell .game-cell").count(), { timeout: 60000 }).toBe(81);
      await setTheme(page, theme); await page.mouse.move(2, 790);
      console.log(JSON.stringify({ engine: info.project.name, arm, theme, ...(await band(page, 2)) }));
      await ctx.close();
    }
});
