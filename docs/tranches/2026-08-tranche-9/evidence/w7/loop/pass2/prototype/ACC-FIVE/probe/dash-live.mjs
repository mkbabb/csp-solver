/**
 * dash-live.mjs — G0, the LIVE arm on the prototype.
 *
 * The research lane measured HEAD: at p=0.25 the shipped gauge painted 1 run at share 0.228 in
 * Chromium and 4 runs at 0.921 in WebKit, because `pathLength="1000"` plus a dash spelled as a
 * PRESENTATION ATTRIBUTE makes WebKit scale the dash by totalLength/pathLength. This asks the
 * same question of the cured tree, where there is no `pathLength` at all and the dash is in the
 * pose's own units.
 *
 * Both engines, dpr 1 and 3, p in {0.05,0.25,0.50,1.00}. The front is driven through the
 * element's OWN computed dasharray — the identical quantity the component computes.
 *
 *   ACC_FIVE_OUT=<dir> node dash-live.mjs
 */
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";
import { rgbToOklch } from "./oklch.mjs";
import { BASE, OUT, GOLD, board, writeOne, setFront, ringSamples, runsAndShare, raw } from "./lib.mjs";

const N = 1440;
const FRACS = [0.05, 0.25, 0.5, 1.0];
const SEL = ".progress-pose.is-active .progress-trace";
const out = {};

for (const [engine, type] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const browser = await type.launch();
  for (const dpr of [1, 3]) {
    const ctx = await browser.newContext({
      colorScheme: "light",
      reducedMotion: "reduce",
      viewport: { width: 1280, height: 800 },
      deviceScaleFactor: dpr,
    });
    const page = await ctx.newPage();
    const grid = await board(page);
    await writeOne(page);

    const geom = await page.evaluate((sel) => {
      const p = document.querySelector(sel);
      if (!p) return null;
      const cs = getComputedStyle(p);
      return {
        totalLength: +p.getTotalLength().toFixed(2),
        pathLengthAttr: p.getAttribute("pathLength"),
        dasharrayAttr: p.getAttribute("stroke-dasharray"),
        dasharrayComputed: cs.strokeDasharray,
        stroke: cs.stroke,
        strokeWidth: cs.strokeWidth,
        poseLengths: Array.from(document.querySelectorAll(".progress-trace")).map((e) =>
          +e.getTotalLength().toFixed(2),
        ),
      };
    }, SEL);

    const arms = {};
    for (const p of FRACS) {
      await setFront(page, ".progress-trace", p);
      const b = await grid.boundingBox();
      const clip = {
        x: Math.max(0, Math.floor(b.x - 14)),
        y: Math.max(0, Math.floor(b.y - 14)),
        width: Math.ceil(b.width + 28),
        height: Math.ceil(b.height + 28),
      };
      const { data, info, ch } = await raw(await page.screenshot({ clip, type: "png" }));
      const pts = await ringSamples(page, SEL, N);
      const sx = info.width / clip.width;
      const sy = info.height / clip.height;
      const inked = pts.map(([vx, vy]) => {
        let best = 0;
        let bh = null;
        for (let dx = -2; dx <= 2; dx++)
          for (let dy = -2; dy <= 2; dy++) {
            const x = Math.round((vx - clip.x) * sx) + dx;
            const y = Math.round((vy - clip.y) * sy) + dy;
            if (x < 0 || y < 0 || x >= info.width || y >= info.height) continue;
            const o = (y * info.width + x) * ch;
            const c = rgbToOklch(data[o], data[o + 1], data[o + 2]);
            if (c.C > best) {
              best = c.C;
              bh = c.h;
            }
          }
        const dh = bh == null ? 999 : Math.min(Math.abs(bh - GOLD.light), 360 - Math.abs(bh - GOLD.light));
        return best >= 0.05 && dh <= 25;
      });
      arms[p] = runsAndShare(inked);
      console.log(`  ${engine} dpr${dpr} p=${p} runs=${arms[p].runs} share=${arms[p].share}`);
    }
    out[`${engine}/dpr${dpr}`] = { geom, arms };
    await ctx.close();
  }
  await browser.close();
}

// the gate: engine agreement within 2 points at every p and every dpr
const cross = {};
for (const dpr of [1, 3])
  for (const p of FRACS) {
    const c = out[`chromium/dpr${dpr}`].arms[p];
    const w = out[`webkit/dpr${dpr}`].arms[p];
    cross[`dpr${dpr}/p${p}`] = {
      chromium: c.share,
      webkit: w.share,
      deltaPoints: +(Math.abs(c.share - w.share) * 100).toFixed(2),
      runs: [c.runs, w.runs],
      within2: Math.abs(c.share - w.share) * 100 <= 2,
    };
  }
out.gate = cross;
writeFileSync(`${OUT}/dash-live.json`, JSON.stringify(out, null, 2));
console.log("G0 live:", Object.values(cross).every((r) => r.within2) ? "GREEN" : "RED");
