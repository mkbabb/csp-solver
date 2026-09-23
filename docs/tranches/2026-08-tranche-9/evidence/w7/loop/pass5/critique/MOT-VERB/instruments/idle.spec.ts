/** Critic idle read (T4-P1's gate shape, not its rig): the playing pose at rest with the boil
 *  running, 8 s of rAF intervals, after vs control interleaved x2; chromium adds the composited
 *  layer census (LayerTree) — count and summed area of layers. */
import { test } from "@playwright/test";
import { PAYLOAD, ARMS } from "./board";
test("idle", async ({ browser }, info) => {
  for (const round of [1, 2]) for (const arm of ["after", "control"] as const) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    await page.goto(`${ARMS[arm]}/?game=sudoku&board=${PAYLOAD}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(5000);
    let layers: any = null;
    if (info.project.name === "chromium") {
      const cdp = await ctx.newCDPSession(page);
      const got = new Promise<any>((res) => cdp.on("LayerTree.layerTreeDidChange", (e: any) => { if (e.layers) res(e.layers); }));
      await cdp.send("LayerTree.enable");
      const ls = await Promise.race([got, new Promise((r) => setTimeout(() => r(null), 3000))]) as any[] | null;
      if (ls) { const drawn = ls.filter((l) => l.drawsContent); layers = { n: ls.length, drawn: drawn.length, areaMpx: +(drawn.reduce((s, l) => s + l.width * l.height, 0) / 1e6).toFixed(2), big: drawn.filter((l) => l.width * l.height > 250000).length }; }
      await cdp.send("LayerTree.disable");
    }
    const r = await page.evaluate(() => new Promise<any>((res) => {
      const d: number[] = []; let last = performance.now(); const t0 = last;
      const tick = (now: number) => { d.push(now - last); last = now; if (now - t0 < 8000) requestAnimationFrame(tick); else res(d); };
      requestAnimationFrame(tick);
    }));
    const n = r.length; const onTime = r.filter((x: number) => x <= 20).length;
    console.log(`IDLE[${info.project.name}·${arm}·r${round}] frames ${n} onTime% ${(100 * onTime / n).toFixed(1)} long33 ${r.filter((x: number) => x > 33).length} max ${Math.max(...r).toFixed(1)} layers ${JSON.stringify(layers)}`);
    await ctx.close();
  }
});
