/**
 * front-live.mjs — G0 re-armed against the CURED gauge (the front is geometry, not a dash).
 *
 * Two arms, both engines, dpr 1 and 3:
 *   forced  the active pose's `d` cut at p in {0.05,0.25,0.50,1.00} by arc length, in-page —
 *           the gate's own four points, on the renderer rather than on the component.
 *   app     the four natural fill checkpoints the board actually reaches, read off
 *           aria-valuenow, so the number is the product's and not the probe's.
 *
 * The reading is the painted share of the RING (1440 samples of the FULL pose by arc length),
 * so a front at p must ink p of the ring in one run, in both engines.
 *
 *   ACC_FIVE_OUT=<dir> node front-live.mjs
 */
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";
import { rgbToOklch } from "./oklch.mjs";
import { OUT, GOLD, board, writeOne, runsAndShare, raw } from "./lib.mjs";

const N = 1440;
const FRACS = [0.05, 0.25, 0.5, 1.0];
const out = {};

const cutInPage = (page, p) =>
  page.evaluate((frac) => {
    const cut = (d, f) => {
      const nums = d.match(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi).map(Number);
      const pts = [];
      for (let i = 0; i + 1 < nums.length; i += 2) pts.push([nums[i], nums[i + 1]]);
      if (/z\s*$/i.test(d)) pts.push(pts[0]);
      let total = 0;
      for (let i = 1; i < pts.length; i++)
        total += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
      if (f >= 1) return d;
      const target = total * f;
      const o = [pts[0]];
      let run = 0;
      for (let k = 1; k < pts.length; k++) {
        const seg = Math.hypot(pts[k][0] - pts[k - 1][0], pts[k][1] - pts[k - 1][1]);
        if (run + seg >= target) {
          const t = seg === 0 ? 0 : (target - run) / seg;
          o.push([
            pts[k - 1][0] + (pts[k][0] - pts[k - 1][0]) * t,
            pts[k - 1][1] + (pts[k][1] - pts[k - 1][1]) * t,
          ]);
          break;
        }
        run += seg;
        o.push(pts[k]);
      }
      return "M" + o.map((q) => `${q[0]},${q[1]}`).join(" L");
    };
    for (const el of document.querySelectorAll(".progress-trace")) {
      if (!el.dataset.full) el.dataset.full = el.getAttribute("d");
      el.setAttribute("d", cut(el.dataset.full, frac));
    }
  }, p);

/** Samples of the FULL ring (the untruncated pose), in viewport coords. */
const fullRingSamples = (page, n) =>
  page.evaluate((n) => {
    const el = document.querySelector(".progress-pose.is-active .progress-trace");
    if (!el) return null;
    const svg = el.ownerSVGElement;
    const ghost = document.createElementNS("http://www.w3.org/2000/svg", "path");
    ghost.setAttribute("d", el.dataset.full || el.getAttribute("d"));
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

async function paintedShare(page, grid, dpr) {
  const b = await grid.boundingBox();
  const clip = {
    x: Math.max(0, Math.floor(b.x - 14)),
    y: Math.max(0, Math.floor(b.y - 14)),
    width: Math.ceil(b.width + 28),
    height: Math.ceil(b.height + 28),
  };
  const { data, info, ch } = await raw(await page.screenshot({ clip, type: "png" }));
  const pts = await fullRingSamples(page, N);
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
    const d = bh == null ? 999 : Math.abs(bh - GOLD.light);
    return best >= 0.05 && Math.min(d, 360 - d) <= 25;
  });
  return runsAndShare(inked);
}

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

    const geom = await page.evaluate(() => {
      const p = document.querySelector(".progress-pose.is-active .progress-trace");
      return {
        pathLengthAttr: p.getAttribute("pathLength"),
        dasharrayAttr: p.getAttribute("stroke-dasharray"),
        dasharrayComputed: getComputedStyle(p).strokeDasharray,
        segments: (p.getAttribute("d").match(/L/gi) || []).length,
        stroke: getComputedStyle(p).stroke,
      };
    });

    const forced = {};
    for (const p of FRACS) {
      await cutInPage(page, p);
      await page.waitForTimeout(320);
      forced[p] = await paintedShare(page, grid, dpr);
      console.log(`  ${engine} dpr${dpr} forced p=${p} runs=${forced[p].runs} share=${forced[p].share}`);
    }

    // app arm: restore, then fill in four steps and read the product's own number
    await page.evaluate(() => {
      for (const el of document.querySelectorAll(".progress-trace"))
        if (el.dataset.full) el.setAttribute("d", el.dataset.full);
    });
    const app = [];
    for (const step of [0, 8, 20, 40]) {
      for (let k = 0; k < step; k++) {
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
        await page.waitForTimeout(25);
      }
      await page.waitForTimeout(450);
      const valuenow = await page.evaluate(() => {
        const el = document.querySelector('[role="progressbar"]');
        return el ? +el.getAttribute("aria-valuenow") : null;
      });
      app.push({ valuenow, ...(await paintedShare(page, grid, dpr)) });
      console.log(`  ${engine} dpr${dpr} app valuenow=${valuenow} runs=${app.at(-1).runs} share=${app.at(-1).share}`);
    }

    out[`${engine}/dpr${dpr}`] = { geom, forced, app };
    await ctx.close();
  }
  await browser.close();
}

const gate = {};
for (const dpr of [1, 3]) {
  for (const p of FRACS) {
    const c = out[`chromium/dpr${dpr}`].forced[p];
    const w = out[`webkit/dpr${dpr}`].forced[p];
    gate[`forced/dpr${dpr}/p${p}`] = {
      chromium: c.share,
      webkit: w.share,
      deltaPoints: +(Math.abs(c.share - w.share) * 100).toFixed(2),
      runs: [c.runs, w.runs],
      within2: Math.abs(c.share - w.share) * 100 <= 2,
    };
  }
  const ca = out[`chromium/dpr${dpr}`].app;
  const wa = out[`webkit/dpr${dpr}`].app;
  ca.forEach((c, i) => {
    const w = wa[i];
    gate[`app/dpr${dpr}/#${i}`] = {
      valuenow: [c.valuenow, w.valuenow],
      chromium: c.share,
      webkit: w.share,
      deltaPoints: +(Math.abs(c.share - w.share) * 100).toFixed(2),
      runs: [c.runs, w.runs],
      within2: Math.abs(c.share - w.share) * 100 <= 2,
    };
  });
}
out.gate = gate;
writeFileSync(`${OUT}/front-live.json`, JSON.stringify(out, null, 2));
console.log("G0:", Object.values(gate).every((r) => r.within2) ? "GREEN" : "RED");
for (const [k, v] of Object.entries(gate)) if (!v.within2) console.log("   RED", k, JSON.stringify(v));
