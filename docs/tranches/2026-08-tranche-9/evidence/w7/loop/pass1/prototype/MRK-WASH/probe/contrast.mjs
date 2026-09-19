/**
 * MRK-WASH pass-1 PROTOTYPE · the two media arms, read from computed style.
 *
 *   prefers-contrast: more   the RIM presses to opacity 1; the body does not move (the digit
 *                            reads through the body, so pressing it would cost the digit).
 *   prefers-reduced-motion   every other reading in this lane was taken under
 *                            `reducedMotion: reduce`, so the end state landing under PRM is
 *                            already proven by them; `animationName` is banked here to say it
 *                            in one line.
 */
import { chromium, webkit } from "playwright";
import { bank } from "./lib.mjs";

const out = {};
for (const [n, e] of Object.entries({ chromium, webkit })) {
  const b = await e.launch();
  for (const contrast of ["no-preference", "more"]) {
    const ctx = await b.newContext({
      viewport: { width: 1280, height: 800 },
      colorScheme: "light",
      contrast,
      reducedMotion: "reduce",
    });
    const p = await ctx.newPage();
    await p.goto("http://127.0.0.1:4240/?size=3&difficulty=EASY");
    await p.waitForSelector("path.cell-line", { state: "attached", timeout: 30000 });
    await p.waitForTimeout(1400);
    await p.evaluate(() => document.querySelectorAll(".game-cell input")[40]?.focus());
    await p.waitForTimeout(400);
    out[`${n}-${contrast}`] = await p.evaluate(() => {
      const path = document.querySelector(".game-cell:has(input:focus-visible) .cell-ghost-path");
      const cs = getComputedStyle(path);
      const peer = document.querySelector(".cell-peer");
      return {
        strokeOpacity: cs.strokeOpacity,
        strokeWidth: cs.strokeWidth,
        fillOpacity: cs.fillOpacity,
        paintOrder: cs.paintOrder,
        animationName: cs.animationName,
        unitWash: peer ? getComputedStyle(peer).backgroundColor : null,
      };
    });
    console.log(`CONTRAST ${n} ${contrast} :: ${JSON.stringify(out[`${n}-${contrast}`])}`);
    await ctx.close();
  }
  await b.close();
}
bank("contrast.json", out);
