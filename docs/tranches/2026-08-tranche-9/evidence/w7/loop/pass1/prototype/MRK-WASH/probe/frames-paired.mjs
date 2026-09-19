/**
 * MRK-WASH pass-1 PROTOTYPE · THE ONE LONG WEBKIT FRAME, PRICED PROPERLY.
 *
 * phone2.mjs saw 3 frames over 33ms across 5 webkit runs (597 frames). A number with no control
 * beside it prices nothing — the machine is running a dev server and two browsers. So this is
 * PAIRED and INTERLEAVED: CONTROL (HEAD's tier-2 paint restored by overlay) and PROTO alternate
 * in the same process, same context settings, 6 runs each, so drift falls on both arms equally.
 */
import { webkit, chromium } from "playwright";
import { bank, r2 } from "./lib.mjs";

const HEAD_CSS = `
.game-cell:has(input:focus-visible):not(#never):not(#never) .cell-ghost-path {
  paint-order: normal;
  fill: var(--color-focus-sketch, var(--color-crayon-blue));
  fill-opacity: 0.08;
  stroke: var(--color-focus-sketch, var(--color-crayon-blue));
  stroke-width: 7;
  stroke-opacity: 0.9;
  stroke-dasharray: 1;
  stroke-dashoffset: 0;
  animation: ghost-draw-on 180ms var(--ease-ghostDraw) backwards;
}`;

const engines = { webkit, chromium };
const out = {};
for (const engineName of ["webkit"]) {
  const browser = await engines[engineName].launch();
  const runs = [];
  for (let n = 0; n < 12; n++) {
    const arm = n % 2 === 0 ? "CONTROL" : "PROTO";
    const ctx = await browser.newContext({
      viewport: { width: 393, height: 699 },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
      colorScheme: "light",
    });
    const page = await ctx.newPage();
    await page.goto("http://127.0.0.1:4240/?size=3&difficulty=EASY");
    await page.waitForSelector("path.cell-line", { state: "attached", timeout: 30000 });
    await page.waitForTimeout(1800);
    if (arm === "CONTROL") await page.addStyleTag({ content: HEAD_CSS });
    await page.evaluate(() => document.querySelectorAll(".game-cell input")[30]?.focus());
    await page.waitForTimeout(400);
    await page.evaluate(() => {
      window.__f = [];
      let last = performance.now();
      const tick = (t) => {
        window.__f.push(t - last);
        last = t;
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
    for (let i = 0; i < 14; i++) {
      await page.keyboard.press(i % 2 ? "ArrowRight" : "ArrowDown");
      await page.waitForTimeout(140);
    }
    const f = await page.evaluate(() => window.__f.slice(2));
    const s = [...f].sort((a, b) => a - b);
    runs.push({
      run: n,
      arm,
      frames: f.length,
      median: r2(s[Math.floor(s.length / 2)]),
      p95: r2(s[Math.floor(s.length * 0.95)]),
      over33: f.filter((x) => x > 33).length,
      max: r2(Math.max(...f)),
    });
    console.log(
      `TRACE ${engineName} run ${n} ${arm} :: ${f.length}f med=${runs.at(-1).median} p95=${runs.at(-1).p95} >33ms=${runs.at(-1).over33} max=${runs.at(-1).max}`,
    );
    await ctx.close();
  }
  const sum = (arm) => {
    const r = runs.filter((x) => x.arm === arm);
    return {
      runs: r.length,
      frames: r.reduce((a, b) => a + b.frames, 0),
      over33: r.reduce((a, b) => a + b.over33, 0),
      worstMax: Math.max(...r.map((x) => x.max)),
      medianOfMedians: r2(r.map((x) => x.median).sort((a, b) => a - b)[Math.floor(r.length / 2)]),
    };
  };
  out[engineName] = { runs, CONTROL: sum("CONTROL"), PROTO: sum("PROTO") };
  console.log(`PAIRED ${engineName} CONTROL=${JSON.stringify(sum("CONTROL"))}`);
  console.log(`PAIRED ${engineName} PROTO  =${JSON.stringify(sum("PROTO"))}`);
  await browser.close();
}
bank("frames-paired.json", out);
