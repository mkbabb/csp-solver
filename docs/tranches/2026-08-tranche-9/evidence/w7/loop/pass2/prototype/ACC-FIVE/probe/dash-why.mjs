/**
 * dash-why.mjs — four evenly-spaced runs of exactly the right length. What is the four?
 *
 * Arms, all in WebKit at p=0.05, chromium as the control:
 *   pose      per-pose opacity / getTotalLength / computed dash + offset
 *   solo      the three inactive poses REMOVED from the DOM
 *   nogroup   the active path re-parented out of its .progress-pose <g>
 *   halfpath  a fresh <path> with a plain 4-point rect `d`, same dash form
 *
 *   ACC_FIVE_OUT=<dir> node dash-why.mjs
 */
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";
import { rgbToOklch } from "./oklch.mjs";
import { OUT, GOLD, board, writeOne, ringSamples, runsAndShare, raw } from "./lib.mjs";

const N = 1440;
const P = 0.05;
const SEL = ".progress-pose.is-active .progress-trace";
const out = {};

async function measure(page, grid) {
  const b = await grid.boundingBox();
  const clip = {
    x: Math.max(0, Math.floor(b.x - 14)),
    y: Math.max(0, Math.floor(b.y - 14)),
    width: Math.ceil(b.width + 28),
    height: Math.ceil(b.height + 28),
  };
  const { data, info, ch } = await raw(await page.screenshot({ clip, type: "png" }));
  const pts = await ringSamples(page, SEL, N);
  if (!pts) return null;
  const inked = pts.map(([vx, vy]) => {
    let best = 0;
    let bh = null;
    for (let dx = -2; dx <= 2; dx++)
      for (let dy = -2; dy <= 2; dy++) {
        const x = Math.round(vx - clip.x) + dx;
        const y = Math.round(vy - clip.y) + dy;
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
  ["webkit", webkit],
  ["chromium", chromium],
]) {
  const browser = await type.launch();
  const ctx = await browser.newContext({
    colorScheme: "light",
    reducedMotion: "reduce",
    viewport: { width: 1280, height: 800 },
  });
  const page = await ctx.newPage();
  const grid = await board(page);
  await writeOne(page);
  await page.evaluate((p) => {
    for (const el of document.querySelectorAll(".progress-trace"))
      el.style.strokeDashoffset = String(el.getTotalLength() * (1 - p));
  }, P);
  await page.waitForTimeout(400);

  const rec = {};
  rec.poses = await page.evaluate(() =>
    Array.from(document.querySelectorAll(".progress-pose")).map((g) => {
      const p = g.querySelector(".progress-trace");
      const cs = p ? getComputedStyle(p) : null;
      return {
        groupOpacity: getComputedStyle(g).opacity,
        groupClass: g.className.baseVal ?? String(g.className),
        totalLength: p ? +p.getTotalLength().toFixed(2) : null,
        subpaths: p ? (p.getAttribute("d").match(/M/gi) || []).length : null,
        points: p ? (p.getAttribute("d").match(/L/gi) || []).length : null,
        dash: cs ? cs.strokeDasharray : null,
        offset: cs ? cs.strokeDashoffset : null,
      };
    }),
  );
  rec.base = await measure(page, grid);

  // solo: remove the three inactive poses
  await page.evaluate(() => {
    for (const g of document.querySelectorAll(".progress-pose:not(.is-active)")) g.remove();
  });
  await page.waitForTimeout(300);
  rec.solo = await measure(page, grid);

  // nogroup: hoist the active path to the svg root, keeping its dash
  await page.evaluate(() => {
    const p = document.querySelector(".progress-pose.is-active .progress-trace");
    if (p) p.ownerSVGElement.appendChild(p);
  });
  await page.waitForTimeout(300);
  rec.nogroup = await measure(page, grid);

  // halfpath: same dash form on a plain 4-corner rect path
  rec.plainRect = await page.evaluate((p) => {
    const t = document.querySelector(".progress-trace");
    const svg = t.ownerSVGElement;
    const el = document.createElementNS("http://www.w3.org/2000/svg", "path");
    el.setAttribute("d", "M12,0 L988,0 L988,1000 L12,1000 Z");
    el.setAttribute("fill", "none");
    el.setAttribute("stroke", "#ff00ff");
    el.setAttribute("stroke-width", "8");
    svg.appendChild(el);
    const L = el.getTotalLength();
    el.setAttribute("stroke-dasharray", `${L} ${L}`);
    el.style.strokeDashoffset = String(L * (1 - p));
    return { totalLength: +L.toFixed(2) };
  }, P);
  await page.waitForTimeout(300);
  rec.plainRectPaint = await page.evaluate(() => {
    const el = document.querySelector('path[stroke="#ff00ff"]');
    const total = el.getTotalLength();
    const m = el.getScreenCTM();
    const svg = el.ownerSVGElement;
    const o = [];
    for (let i = 0; i < 720; i++) {
      const q = el.getPointAtLength((i / 720) * total);
      const sp = svg.createSVGPoint();
      sp.x = q.x;
      sp.y = q.y;
      const r = sp.matrixTransform(m);
      o.push([r.x, r.y]);
    }
    return o;
  });
  {
    const b = await grid.boundingBox();
    const clip = {
      x: Math.max(0, Math.floor(b.x - 14)),
      y: Math.max(0, Math.floor(b.y - 14)),
      width: Math.ceil(b.width + 28),
      height: Math.ceil(b.height + 28),
    };
    const { data, info, ch } = await raw(await page.screenshot({ clip, type: "png" }));
    const inked = rec.plainRectPaint.map(([vx, vy]) => {
      for (let dx = -2; dx <= 2; dx++)
        for (let dy = -2; dy <= 2; dy++) {
          const x = Math.round(vx - clip.x) + dx;
          const y = Math.round(vy - clip.y) + dy;
          if (x < 0 || y < 0 || x >= info.width || y >= info.height) continue;
          const o = (y * info.width + x) * ch;
          if (data[o] > 200 && data[o + 1] < 80 && data[o + 2] > 200) return true;
        }
      return false;
    });
    rec.plainRectRuns = runsAndShare(inked);
    delete rec.plainRectPaint;
  }

  out[engine] = rec;
  console.log(
    engine,
    "base",
    JSON.stringify(rec.base),
    "solo",
    JSON.stringify(rec.solo),
    "nogroup",
    JSON.stringify(rec.nogroup),
    "plainRect",
    JSON.stringify(rec.plainRectRuns),
  );
  await ctx.close();
  await browser.close();
}
writeFileSync(`${OUT}/dash-why.json`, JSON.stringify(out, null, 2));
