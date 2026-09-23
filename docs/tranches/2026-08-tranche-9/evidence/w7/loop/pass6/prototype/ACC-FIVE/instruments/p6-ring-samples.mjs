/** ACC-FIVE pass 6 · row 6's witness: join-language's poll prints only its LAST sample, so a capped
 *  ring that drew, never closed, and unmounted at rest reads "-1" there. This samples the same
 *  reading (−1 no ring, 0 open front, 1000 closed `Z` pose) every animation frame through one real
 *  local-wire join, both engines, and prints the set of values seen.   node p6-ring-samples.mjs <base> <label> */
import { chromium, webkit } from "./p6-lib.mjs";
const [BASE, LABEL] = process.argv.slice(2);
for (const [name, type] of [["chromium", chromium], ["webkit", webkit]]) {
  const b = await type.launch();
  const ctx = await b.newContext({ reducedMotion: "no-preference" });
  await ctx.addInitScript(() => {
    const w = window;
    w.__ring = new Map();
    const tick = () => {
      const p = document.querySelector(".join-trace");
      const v = !p ? -1 : /Z\s*$/i.test(p.getAttribute("d") ?? "") ? 1000 : 0;
      w.__ring.set(v, (w.__ring.get(v) ?? 0) + 1);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  const a = await ctx.newPage();
  await a.goto(BASE + "/?wire=local");
  await a.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 60000 });
  await a.locator('.controls-card button[aria-label="Play together on this board"]').click();
  for (let k = 0; k < 100 && !new URL(a.url()).searchParams.get("s"); k++) await a.waitForTimeout(100);
  await a.waitForTimeout(1600);
  await a.evaluate(() => window.__ring.clear());
  const p2 = await ctx.newPage();
  await p2.goto(a.url());
  await p2.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 60000 });
  await a.waitForTimeout(4000);
  console.log(`${LABEL} ${name}: frames by reading ${JSON.stringify(Object.fromEntries(await a.evaluate(() => [...window.__ring.entries()])))}`);
  await b.close();
}
