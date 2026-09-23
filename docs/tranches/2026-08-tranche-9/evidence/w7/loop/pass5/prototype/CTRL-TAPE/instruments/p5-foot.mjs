/**
 * T9-W7 pass 5 · CTRL-TAPE — T9-M18's edge on the foot, READ FROM PAINT (intake G-BAR G1–G6).
 *
 * Every read is a DIFFERENTIAL at DPR 2: the surface photographed with the frame shown and with
 * its `<svg>` hidden, the changed pixels are the frame's ink and the same pixel in the hidden
 * frame is the ground it abuts. `reducedMotion: reduce` parks the boil so the case's own stroke
 * cannot move between the two photographs (the intake's 136–153px² of case noise); the lip is
 * `:pose="0"` either way.
 *
 *   node p5-foot.mjs <out.json> <baseURL> [cells,comma] [themes,comma]
 *
 * Per cell: the lip's paths and stroke width; the max computed border in the bar's subtree
 * (kbd exempt); the foot's computed padding-bottom; per-side COVERAGE (columns/rows of the side's
 * run carrying ink); the painted extent outside the bar box; the LOWEST INK above the viewport
 * bottom (lip, and the case's own bottom stroke); the core contrast with its sensitivity row;
 * and at the scroll END the rhythm (box gap and ink daylight, last well → lip, per column) and
 * the ALIGNMENT (painted centroid of the lip's side strokes vs the last well's).
 */
import { writeFileSync } from "node:fs";
import { ENGINES, CELLS, open, differential, coreContrast, givens } from "./p5-lib.mjs";

const OUT = process.argv[2];
const BASE = process.argv[3];
const cellKeys = (process.argv[4] || "rail1280,rail1440,coarse1280,dock390,dock430,land844,land812").split(",");
const themes = (process.argv[5] || "light").split(",");

const HIDE_LIP = ".bar-frame > .outline-svg, .bar-frame .outline-svg { visibility: hidden !important }";
const HIDE_WELLS = ".tray-well > .outline-svg { visibility: hidden !important }";
const HIDE_CASE = ".drawer-case > .outline-svg { visibility: hidden !important }";
const DPR = 2;

function clampClip(r, vw, vh) {
  const x = Math.max(0, Math.floor(r.x));
  const y = Math.max(0, Math.floor(r.y));
  const w = Math.min(vw, Math.ceil(r.x + r.w)) - x;
  const h = Math.min(vh, Math.ceil(r.y + r.h)) - y;
  return { x, y, width: w, height: h };
}

/** ink extent + per-side coverage for a mask relative to a css box, inside a clip. */
function readMask(d, clip, box) {
  const { mask, w, h } = d;
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity, n = 0;
  for (let i = 0; i < w * h; i++) {
    if (!mask[i]) continue;
    n++;
    const x = clip.x + (i % w) / DPR;
    const y = clip.y + Math.floor(i / w) / DPR;
    minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y);
  }
  if (!n) return { n: 0 };
  const inset = 8; // stay out of the corners
  const colHas = (x0, x1, y0, y1) => {
    let hit = 0, all = 0;
    for (let px = Math.ceil((x0 - clip.x) * DPR); px < (x1 - clip.x) * DPR; px++) {
      if (px < 0 || px >= w) continue;
      all++;
      for (let py = Math.max(0, Math.floor((y0 - clip.y) * DPR)); py < Math.min(h, (y1 - clip.y) * DPR); py++)
        if (mask[py * w + px]) { hit++; break; }
    }
    return all ? +(hit / all).toFixed(3) : null;
  };
  const rowHas = (y0, y1, x0, x1) => {
    let hit = 0, all = 0;
    for (let py = Math.ceil((y0 - clip.y) * DPR); py < (y1 - clip.y) * DPR; py++) {
      if (py < 0 || py >= h) continue;
      all++;
      for (let px = Math.max(0, Math.floor((x0 - clip.x) * DPR)); px < Math.min(w, (x1 - clip.x) * DPR); px++)
        if (mask[py * w + px]) { hit++; break; }
    }
    return all ? +(hit / all).toFixed(3) : null;
  };
  const band = 10; // css px either side of the box edge
  return {
    n,
    extent: {
      left: +(box.x - minX).toFixed(2),
      right: +(maxX - (box.x + box.w)).toFixed(2),
      top: +(box.y - minY).toFixed(2),
      bottom: +(maxY - (box.y + box.h)).toFixed(2),
    },
    maxY: +maxY.toFixed(2),
    minY: +minY.toFixed(2),
    coverage: {
      top: colHas(box.x + inset, box.x + box.w - inset, box.y - band, box.y + band),
      bottom: colHas(box.x + inset, box.x + box.w - inset, box.y + box.h - band, box.y + box.h + band),
      left: rowHas(box.y + inset, box.y + box.h - inset, box.x - band, box.x + band),
      right: rowHas(box.y + inset, box.y + box.h - inset, box.x + box.w - band, box.x + box.w + band),
    },
  };
}

/** per-column: the lowest ink row of mask A in [y0, ySplit) and the highest of mask B in
 *  [ySplit, y1) — the split is the middle of the box gap, so neither mask can reach the other's
 *  side (pass 5's first inter-well read took both from one window and went negative). */
function daylight(dA, dB, clip, y0, y1, x0, x1, ySplit) {
  const { w, h } = dA;
  const gaps = [];
  const sp = Math.round((ySplit - clip.y) * DPR);
  for (let px = Math.ceil((x0 - clip.x) * DPR); px < (x1 - clip.x) * DPR; px++) {
    if (px < 0 || px >= w) continue;
    let aMax = -1, bMin = -1;
    for (let py = Math.max(0, Math.floor((y0 - clip.y) * DPR)); py < Math.min(h, (y1 - clip.y) * DPR); py++) {
      if (py < sp && dA.mask[py * w + px]) aMax = py;
      if (py >= sp && bMin < 0 && dB.mask[py * w + px]) bMin = py;
    }
    if (aMax >= 0 && bMin >= 0) gaps.push((bMin - aMax - 1) / DPR);
  }
  if (!gaps.length) return null;
  gaps.sort((a, b) => a - b);
  return { cols: gaps.length, min: gaps[0], median: gaps[Math.floor(gaps.length / 2)], max: gaps[gaps.length - 1] };
}

/** painted x-centroid of a side stroke: changed pixels within ±6 css of an x, over a y band. */
function centroidX(d, clip, xC, y0, y1) {
  const { mask, w, h } = d;
  let sx = 0, n = 0;
  for (let py = Math.max(0, Math.floor((y0 - clip.y) * DPR)); py < Math.min(h, (y1 - clip.y) * DPR); py++)
    for (let px = Math.max(0, Math.floor((xC - 6 - clip.x) * DPR)); px < Math.min(w, (xC + 6 - clip.x) * DPR); px++)
      if (mask[py * w + px]) { sx += clip.x + px / DPR; n++; }
  return n ? +(sx / n).toFixed(2) : null;
}

const out = { base: BASE, when: new Date().toISOString(), rows: [] };
for (const [eng, L] of ENGINES) {
  const br = await L.launch();
  for (const key of cellKeys) {
    for (const theme of themes) {
      const cell = CELLS[key];
      const row = { eng, cell: key, theme };
      let ctx;
      try {
        const o = await open(br, BASE, cell, { theme, prm: "reduce", dpr: DPR });
        ctx = o.ctx;
        const page = o.page;
        row.regime = o.regime;
        row.givens = await givens(page);
        if (process.env.PAD)
          await page.addStyleTag({
            content: `.card-foot { padding-bottom: max(${process.env.PAD}, env(safe-area-inset-bottom)) !important }`,
          });
        await page.waitForTimeout(process.env.PAD ? 300 : 0);
        row.pad = process.env.PAD ?? "shipped";
        const geo = await page.evaluate(() => {
          const R = (e) => { if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: b.height }; };
          const bar = document.querySelector(".action-bar");
          const foot = document.getElementById("card-foot");
          const caseEl = document.querySelector(".drawer-case");
          const paths = [...document.querySelectorAll(".bar-frame .outline-svg path")].filter(
            (p) => getComputedStyle(p.closest("g") || p).display !== "none",
          );
          let maxBorder = 0;
          if (bar)
            for (const e of [bar, ...bar.querySelectorAll("*")]) {
              if (e.tagName === "KBD") continue;
              const cs = getComputedStyle(e);
              for (const s of ["Top", "Right", "Bottom", "Left"])
                if (cs[`border${s}Style`] !== "none") maxBorder = Math.max(maxBorder, parseFloat(cs[`border${s}Width`]) || 0);
            }
          return {
            vw: innerWidth, vh: innerHeight,
            bar: R(bar), foot: R(foot), case: R(caseEl), card: R(document.querySelector(".controls-card")),
            barInFoot: !!(foot && bar && foot.contains(bar)),
            footPadB: foot ? getComputedStyle(foot).paddingBottom : null,
            lipPaths: paths.length,
            lipStroke: paths[0]?.getAttribute("stroke-width") ?? null,
            maxBorder,
          };
        });
        row.geo = geo;
        if (!geo.bar) throw new Error("no bar");
        const b = geo.bar;
        // 1 · the lip at rest
        const clip = clampClip({ x: b.x - 12, y: b.y - 12, w: b.w + 24, h: b.h + 24 }, geo.vw, geo.vh);
        const dl = await differential(page, clip, HIDE_LIP);
        row.lip = readMask(dl, clip, b);
        row.lip.lowestInkAboveBottom = row.lip.n ? +(geo.vh - row.lip.maxY).toFixed(2) : null;
        row.lipContrast = coreContrast(dl);
        // 2 · the case's own bottom stroke (lowest ink)
        if (geo.case) {
          const c = geo.case;
          // the case's BOTTOM stroke only: a band ±12 css about the case box's bottom edge, the
          // side strokes' last 16 css cropped off each end
          const cy0 = Math.max(b.y + b.h - 2, c.y + c.h - 12);
          const cclip = clampClip({ x: c.x + 16, y: cy0, w: c.w - 32, h: c.y + c.h + 12 - cy0 }, geo.vw, geo.vh);
          if (cclip.height > 2) {
            const dc = await differential(page, cclip, HIDE_CASE);
            const m = readMask(dc, cclip, c);
            row.caseBottom = m.n ? { n: m.n, lowestInkAboveBottom: +(geo.vh - m.maxY).toFixed(2), caseBoxBottom: +(c.y + c.h).toFixed(2) } : { n: 0, caseBoxBottom: +(c.y + c.h).toFixed(2) };
            // lip bottom → case bottom daylight
            if (m.n && row.lip.n) row.caseBottom.lipToCase = +(m.minY - row.lip.maxY).toFixed(2);
          }
        }
        // 3 · scroll END: rhythm + alignment against the last well
        const end = await page.evaluate(() => {
          const card = document.querySelector(".controls-card");
          card.scrollTop = card.scrollHeight;
          const wells = [...card.querySelectorAll(".tray-well")];
          const R = (e) => { const b = e.getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: b.height }; };
          return { last: R(wells[wells.length - 1]), prev: R(wells[wells.length - 2]), bar: R(document.querySelector(".action-bar")), scroll: card.scrollTop };
        });
        await page.waitForTimeout(250);
        const lw = end.last, pw = end.prev, eb = end.bar;
        const top = Math.max(0, Math.min(pw.y + pw.h - 30, lw.y - 30));
        const eclip = clampClip({ x: Math.min(lw.x, eb.x) - 12, y: top, w: Math.max(lw.w, eb.w) + 24, h: eb.y + eb.h + 12 - top }, geo.vw, geo.vh);
        const dW = await differential(page, eclip, HIDE_WELLS);
        const dL = await differential(page, eclip, HIDE_LIP);
        const x0 = Math.max(lw.x, eb.x) + 8, x1 = Math.min(lw.x + lw.w, eb.x + eb.w) - 8;
        const mid = Math.max(lw.y + 12, Math.min(lw.y + lw.h / 2, lw.y + lw.h - 12));
        row.end = {
          boxGap: +(eb.y - (lw.y + lw.h)).toFixed(2),
          interWellBoxGap: +(lw.y - (pw.y + pw.h)).toFixed(2),
          // the last well's bottom ink → the lip's top ink, per column
          daylight: daylight(dW, dL, eclip, lw.y + lw.h / 2, eb.y + 12, x0, x1, (lw.y + lw.h + eb.y) / 2),
          // the same statistic between two WELLS (the rhythm the lip is asked to keep)
          interWellDaylight:
            pw.y + pw.h - 30 >= eclip.y
              ? daylight(dW, dW, eclip, pw.y + pw.h - 20, lw.y + 20, x0, x1, (pw.y + pw.h + lw.y) / 2)
              : null,
          centroids: {
            wellL: centroidX(dW, eclip, lw.x, mid - 8, mid + 8),
            lipL: centroidX(dL, eclip, eb.x, eb.y + 16, eb.y + eb.h - 16),
            wellR: centroidX(dW, eclip, lw.x + lw.w, mid - 8, mid + 8),
            lipR: centroidX(dL, eclip, eb.x + eb.w, eb.y + 16, eb.y + eb.h - 16),
          },
        };
        const c = row.end.centroids;
        row.end.dxL = c.wellL !== null && c.lipL !== null ? +(c.lipL - c.wellL).toFixed(2) : null;
        row.end.dxR = c.wellR !== null && c.lipR !== null ? +(c.lipR - c.wellR).toFixed(2) : null;
      } catch (e) {
        row.error = String(e).slice(0, 200);
      }
      out.rows.push(row);
      console.log(
        eng, key, theme,
        row.error ?? JSON.stringify({ paths: row.geo?.lipPaths, sw: row.geo?.lipStroke, border: row.geo?.maxBorder, padB: row.geo?.footPadB, cov: row.lip?.coverage, low: row.lip?.lowestInkAboveBottom, caseLow: row.caseBottom?.lowestInkAboveBottom, lipToCase: row.caseBottom?.lipToCase, med: row.lipContrast?.median, gap: row.end?.boxGap, day: row.end?.daylight?.min, iwGap: row.end?.interWellBoxGap, iwDay: row.end?.interWellDaylight?.min, dx: [row.end?.dxL, row.end?.dxR] }),
      );
      await ctx?.close();
    }
  }
  await br.close();
}
writeFileSync(OUT, JSON.stringify(out, null, 1));
