/**
 * dash-why2.mjs — the four runs are not the four poses (dash-why: `solo` still read 4) and not
 * the dash spelling (dash-discriminate: all four arms identical). A plain 4-corner rect dashed
 * correctly in WebKit. So the subject is the POSE GEOMETRY. This decimates it.
 *
 * Arms, all fresh magenta <path>s appended to the same svg, dash `L L` + offset L*(1-p):
 *   rect4      M/L/L/L/Z, 4 corners
 *   dense      the same rectangle, every side subdivided into K equal points (no wobble)
 *   poseFull   the live pose's own `d`
 *   poseEveryN the pose's points decimated by N
 *
 *   ACC_FIVE_OUT=<dir> node dash-why2.mjs
 */
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";
import { OUT, board, writeOne, runsAndShare, raw } from "./lib.mjs";

const P = 0.05;
const N = 1440;
const out = {};

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

  const arms = await page.evaluate(() => {
    const t = document.querySelector(".progress-trace");
    const d = t.getAttribute("d");
    const pts = d
      .replace(/[MLZ]/gi, " ")
      .trim()
      .split(/\s+/)
      .map((s) => s.split(",").map(Number));
    const mk = (points) =>
      "M" + points.map((p) => `${p[0]},${p[1]}`).join(" L") + " Z";
    const rect4 = "M12,0 L988,0 L988,1000 L12,1000 Z";
    const dense = (() => {
      const cs = [
        [12, 0],
        [988, 0],
        [988, 1000],
        [12, 1000],
      ];
      const o = [];
      for (let i = 0; i < 4; i++) {
        const a = cs[i];
        const b = cs[(i + 1) % 4];
        for (let k = 0; k < 150; k++)
          o.push([a[0] + ((b[0] - a[0]) * k) / 150, a[1] + ((b[1] - a[1]) * k) / 150]);
      }
      return mk(o);
    })();
    return {
      pointCount: pts.length,
      rect4,
      dense,
      poseFull: d,
      poseEvery4: mk(pts.filter((_, i) => i % 4 === 0)),
      poseEvery16: mk(pts.filter((_, i) => i % 16 === 0)),
      poseEvery64: mk(pts.filter((_, i) => i % 64 === 0)),
    };
  });

  const rec = { pointCount: arms.pointCount };
  for (const name of ["rect4", "dense", "poseFull", "poseEvery4", "poseEvery16", "poseEvery64"]) {
    const info = await page.evaluate(
      ({ d, p }) => {
        for (const old of document.querySelectorAll("path.__probe")) old.remove();
        const svg = document.querySelector(".progress-trace").ownerSVGElement;
        const el = document.createElementNS("http://www.w3.org/2000/svg", "path");
        el.setAttribute("class", "__probe");
        el.setAttribute("d", d);
        el.setAttribute("fill", "none");
        el.setAttribute("stroke", "#ff00ff");
        el.setAttribute("stroke-width", "8");
        svg.appendChild(el);
        const L = el.getTotalLength();
        el.setAttribute("stroke-dasharray", `${L} ${L}`);
        el.style.strokeDashoffset = String(L * (1 - p));
        const m = el.getScreenCTM();
        const o = [];
        for (let i = 0; i < 1440; i++) {
          const q = el.getPointAtLength((i / 1440) * L);
          const sp = svg.createSVGPoint();
          sp.x = q.x;
          sp.y = q.y;
          const r = sp.matrixTransform(m);
          o.push([r.x, r.y]);
        }
        return { L: +L.toFixed(2), pts: o, segs: (d.match(/L/gi) || []).length };
      },
      { d: arms[name], p: P },
    );
    await page.waitForTimeout(280);
    const b = await grid.boundingBox();
    const clip = {
      x: Math.max(0, Math.floor(b.x - 14)),
      y: Math.max(0, Math.floor(b.y - 14)),
      width: Math.ceil(b.width + 28),
      height: Math.ceil(b.height + 28),
    };
    const { data, info: im, ch } = await raw(await page.screenshot({ clip, type: "png" }));
    const inked = info.pts.map(([vx, vy]) => {
      for (let dx = -2; dx <= 2; dx++)
        for (let dy = -2; dy <= 2; dy++) {
          const x = Math.round(vx - clip.x) + dx;
          const y = Math.round(vy - clip.y) + dy;
          if (x < 0 || y < 0 || x >= im.width || y >= im.height) continue;
          const o = (y * im.width + x) * ch;
          if (data[o] > 190 && data[o + 1] < 90 && data[o + 2] > 190) return true;
        }
      return false;
    });
    rec[name] = { segs: info.segs, L: info.L, ...runsAndShare(inked) };
    console.log(`  ${engine} ${name} segs=${info.segs} runs=${rec[name].runs} share=${rec[name].share}`);
  }
  out[engine] = rec;
  await ctx.close();
  await browser.close();
}
writeFileSync(`${OUT}/dash-why2.json`, JSON.stringify(out, null, 2));
