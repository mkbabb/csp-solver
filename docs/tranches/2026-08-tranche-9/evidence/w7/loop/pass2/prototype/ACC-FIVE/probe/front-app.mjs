/**
 * front-app.mjs — G0's APP arm, re-cut. `front-live.mjs`'s app arm was an instrument defect:
 * it restored the full `d` by hand and Vue never re-rendered it, so every checkpoint read a
 * full ring. This one never touches the DOM — it fills cells, reads the product's own
 * aria-valuenow, and measures the painted share of the ring. Both engines, dpr 1 and 3.
 *
 *   ACC_FIVE_OUT=<dir> node front-app.mjs
 */
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";
import { rgbToOklch } from "./oklch.mjs";
import { OUT, GOLD, board, runsAndShare, raw } from "./lib.mjs";

const N = 1440;
const STEPS = [1, 6, 16, 32];
const out = {};

const fullRing = (page, n) =>
  page.evaluate((n) => {
    const el = document.querySelector(".progress-pose.is-active .progress-trace");
    if (!el) return null;
    const svg = el.ownerSVGElement;
    // the RING, not the front: rebuild the closed rect from the front's own extent is wrong,
    // so read the frame's own geometry instead — same rect, same source (gridPaths).
    const frame = document.querySelector(".grid-line, path.grid-frame") || el;
    const ghost = document.createElementNS("http://www.w3.org/2000/svg", "path");
    ghost.setAttribute("d", "M12,0 L988,0 L988,1000 L12,1000 Z");
    ghost.setAttribute("fill", "none");
    ghost.setAttribute("stroke", "none");
    svg.appendChild(ghost);
    const total = ghost.getTotalLength();
    const m = el.getScreenCTM();
    const o = [];
    for (let i = 0; i < n; i++) {
      const q = ghost.getPointAtLength((i / n) * total);
      const sp = svg.createSVGPoint();
      sp.x = q.x;
      sp.y = q.y;
      const r = sp.matrixTransform(m);
      o.push([r.x, r.y]);
    }
    ghost.remove();
    return o;
  }, n);

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
    const rows = [];
    let written = 0;
    for (const target of STEPS) {
      while (written < target) {
        const done = await page.evaluate(() => {
          const ins = Array.from(document.querySelectorAll(".sudoku-cell input")).filter(
            (i) => !i.readOnly && !i.value,
          );
          if (!ins.length) return true;
          ins[0].focus();
          return false;
        });
        if (done) break;
        await page.keyboard.type("1");
        written++;
        await page.waitForTimeout(30);
      }
      await page.waitForTimeout(500);
      const valuenow = await page.evaluate(() => {
        const el = document.querySelector('[role="progressbar"]');
        return el ? +el.getAttribute("aria-valuenow") : null;
      });
      const b = await grid.boundingBox();
      const clip = {
        x: Math.max(0, Math.floor(b.x - 14)),
        y: Math.max(0, Math.floor(b.y - 14)),
        width: Math.ceil(b.width + 28),
        height: Math.ceil(b.height + 28),
      };
      const { data, info, ch } = await raw(await page.screenshot({ clip, type: "png" }));
      const pts = await fullRing(page, N);
      const sx = info.width / clip.width;
      const sy = info.height / clip.height;
      const inked = pts.map(([vx, vy]) => {
        let best = 0;
        let bh = null;
        for (let dx = -3; dx <= 3; dx++)
          for (let dy = -3; dy <= 3; dy++) {
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
        const d = bh == null ? 999 : Math.abs(bh - GOLD.light);
        return best >= 0.05 && Math.min(d, 360 - d) <= 25;
      });
      const r = runsAndShare(inked);
      rows.push({ written, valuenow, ...r });
      console.log(`  ${engine} dpr${dpr} written=${written} valuenow=${valuenow} runs=${r.runs} share=${r.share}`);
    }
    out[`${engine}/dpr${dpr}`] = rows;
    await ctx.close();
  }
  await browser.close();
}
const gate = {};
for (const dpr of [1, 3])
  out[`chromium/dpr${dpr}`].forEach((c, i) => {
    const w = out[`webkit/dpr${dpr}`][i];
    gate[`dpr${dpr}/#${i}`] = {
      valuenow: [c.valuenow, w.valuenow],
      chromium: c.share,
      webkit: w.share,
      deltaPoints: +(Math.abs(c.share - w.share) * 100).toFixed(2),
      runs: [c.runs, w.runs],
      within2: Math.abs(c.share - w.share) * 100 <= 2,
    };
  });
out.gate = gate;
writeFileSync(`${OUT}/front-app.json`, JSON.stringify(out, null, 2));
console.log("G0 app:", Object.values(gate).every((r) => r.within2) ? "GREEN" : "RED");
