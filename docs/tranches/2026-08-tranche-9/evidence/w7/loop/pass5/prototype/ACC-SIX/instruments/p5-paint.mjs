// ACC-SIX pass-5 — THE ESCAPE BYTE AND THE USER-INK ROW, PAINTED, WITH THE SENSITIVITY ROW.
// (A copy of pass4 p4-paint.mjs, re-pointed; the statistic is the section's: ACC-FIVE's
// ring-DIFFERENCING — each pixel's ratio against the SAME pixel with the stroke hidden, i.e.
// the ground that pixel actually abuts, never a ground picked elsewhere in the crop.)
//
// TRACE: two LEGAL writes (the solution's digits, never a repeated 5), the board's top band;
// per arm (as built / #8b5cf6 / #9b74f7 / #7c3aed via --color-progress-ink) one crop with the
// trace, one with `.progress-trace` hidden, after the computed stroke settles. Core at
// k = 0.5/0.7/0.9/1.0 of the max luminance move: n, p30, median, max, fraction < 3.10 (the
// rule's trigger) and < 3.0 (the 1.4.11 floor); the COLUMN form: per x-column core median,
// the worst column and the fraction of columns under 3.10 at each k. The pass-4 modal-core
// figure (the rule as WRITTEN, against the pinned frame-line ground) is carried beside it.
// USER INK: one player digit in ROW 5 (cells 36-44, away from the trace), hidden vs shown
// differencing on that cell's glyph, BLUE-HUE GATED (C > 0.04, within 25° of 250°), floor 4.5.
// usage: BASE=http://127.0.0.1:4237 node p5-paint.mjs <out.json>
import sharp from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.mjs";
import { writeFileSync } from "node:fs";
import { rgbToOklch, hueDist } from "./oklch.COPY.mjs";
import { ENGINES, BOARD, DEAL, SOL, cells, asset, writeLegal, open } from "./p5-common.mjs";
const BASE = process.env.BASE || "http://127.0.0.1:4237";
const DPRS = (process.env.DPRS || "1,2,3").split(",").map(Number);
const lin = (c) => ((c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const Yd = (d, i) => 0.2126 * lin(d[i]) + 0.7152 * lin(d[i + 1]) + 0.0722 * lin(d[i + 2]);
const raw = async (b) => sharp(b).raw().toBuffer({ resolveWithObject: true });

/** Differencing core + sensitivity row. `gate(rgb)` optionally restricts to hue-true pixels. */
async function differ(shownBuf, hiddenBuf, floor, gate) {
  const a = await raw(shownBuf), b = (await raw(hiddenBuf)).data;
  const { width: w, channels: ch } = a.info;
  const px = [];
  for (let i = 0; i < a.data.length; i += ch) {
    const ya = Yd(a.data, i), yb = Yd(b, i), dy = Math.abs(ya - yb);
    if (dy < 0.01) continue;
    if (gate && !gate([a.data[i], a.data[i + 1], a.data[i + 2]])) continue;
    px.push({ x: (i / ch) % w, dy, r: (Math.max(ya, yb) + 0.05) / (Math.min(ya, yb) + 0.05) });
  }
  if (!px.length) return { changed: 0 };
  const max = Math.max(...px.map((p) => p.dy));
  const med = (xs) => xs.sort((p, q) => p - q)[Math.floor(xs.length / 2)];
  const row = {};
  for (const k of [0.5, 0.7, 0.9, 1.0]) {
    const core = px.filter((p) => p.dy >= k * max - 1e-9);
    const rs = core.map((p) => p.r).sort((x, y) => x - y);
    const byCol = new Map();
    for (const p of core) (byCol.get(p.x) ?? byCol.set(p.x, []).get(p.x)).push(p.r);
    const colMed = [...byCol.values()].map((v) => med(v));
    row[k] = {
      n: rs.length, p30: +rs[Math.floor(rs.length * 0.3)].toFixed(3), median: +rs[Math.floor(rs.length / 2)].toFixed(3), max: +rs[rs.length - 1].toFixed(3),
      underFloor: +(rs.filter((r) => r < floor).length / rs.length).toFixed(3),
      under300: +(rs.filter((r) => r < 3.0).length / rs.length).toFixed(3),
      columns: colMed.length, worstColumn: +Math.min(...colMed).toFixed(3),
      columnsUnderFloor: +(colMed.filter((r) => r < floor).length / colMed.length).toFixed(3),
    };
  }
  return { changed: px.length, row };
}
const settle = async (page, sel, prop) => {
  let last = null;
  for (let i = 0; i < 40; i++) {
    const v = await page.evaluate(([s, p]) => { const e = document.querySelector(s); return e ? getComputedStyle(e)[p] : null; }, [sel, prop]);
    if (v === last) return v;
    last = v; await page.waitForTimeout(120);
  }
  return last;
};
const out = { board: BOARD, base: BASE, control: "74a2b5d9", rule: "keep #9b74f7 only if #8b5cf6 reads UNDER 3.10 (worst of line, paper) on either engine", cells: {} };
for (const [eng, L] of ENGINES) {
  const br = await L.launch();
  for (const scheme of ["light", "dark"]) for (const dpr of DPRS) {
    const C = { viewport: { width: 1280, height: 800 }, dpr, scheme, reduce: true };
    const { ctx, page } = await open(br, BASE, C);
    const R = (out.cells[`${eng}/${scheme}/dpr${dpr}`] = { asset: await asset(page), dealOk: (await cells(page)) === DEAL });
    await writeLegal(page, 250); await writeLegal(page, 250);
    await page.evaluate(() => document.activeElement?.blur?.()); await page.mouse.move(2, 2); await page.waitForTimeout(800);
    const box = await page.locator("svg.hand-drawn-grid").first().boundingBox();
    const clip = { x: Math.round(box.x + box.width * 0.15), y: Math.round(box.y - 10), width: Math.round(box.width * 0.4), height: 26 };
    const shot = () => page.screenshot({ clip, type: "png" });
    R.arms = {};
    for (const [name, hex] of [["asBuilt", null], ["incumbent_8b5cf6", "#8b5cf6"], ["escape_9b74f7", "#9b74f7"], ["deep_7c3aed", "#7c3aed"]]) {
      await page.evaluate((h) => { document.getElementById("acc6-arm")?.remove(); if (!h) return; const s = document.createElement("style"); s.id = "acc6-arm"; s.textContent = `:root { --color-progress-ink: ${h} !important; }`; document.head.appendChild(s); }, hex);
      const stroke = await settle(page, ".progress-trace", "stroke");
      const shown = await shot();
      await page.evaluate(() => { const s = document.createElement("style"); s.id = "acc6-hide"; s.textContent = ".progress-trace { visibility: hidden !important; }"; document.head.appendChild(s); });
      await page.waitForTimeout(150);
      const hidden = await shot();
      await page.evaluate(() => document.getElementById("acc6-hide")?.remove());
      R.arms[name] = { stroke, ...(await differ(shown, hidden, 3.10)) };
    }
    await page.evaluate(() => document.getElementById("acc6-arm")?.remove());
    // USER INK, row 5.
    const idx = await page.evaluate(() => { const cs = Array.from(document.querySelectorAll(".sudoku-cell")); for (let i = 36; i < 45; i++) { const x = cs[i].querySelector("input"); if (x && !x.value) { x.focus(); return i; } } return -1; });
    await page.keyboard.type(SOL[idx]); await page.waitForTimeout(300);
    await page.evaluate(() => document.activeElement?.blur?.()); await page.mouse.move(2, 2); await page.waitForTimeout(900);
    const b = await page.evaluate((i) => { const r = document.querySelectorAll(".sudoku-cell")[i].getBoundingClientRect(); return { x: r.x, y: r.y, w: r.width, h: r.height }; }, idx);
    const dclip = { x: Math.round(b.x + b.w * 0.12), y: Math.round(b.y + b.h * 0.12), width: Math.round(b.w * 0.76), height: Math.round(b.h * 0.76) };
    const dShown = await page.screenshot({ clip: dclip, type: "png" });
    await page.evaluate((i) => { const g = document.querySelectorAll(".sudoku-cell")[i].querySelector(".glyph-svg"); if (g) g.style.visibility = "hidden"; }, idx);
    await page.waitForTimeout(150);
    const dHidden = await page.screenshot({ clip: dclip, type: "png" });
    const blue = (rgb) => { const o = rgbToOklch(...rgb); return o.C > 0.04 && hueDist(o.h, 250) < 25; };
    const hb = await raw(dHidden); const freq = new Map();
    for (let i = 0; i < hb.data.length; i += hb.info.channels) { const k = `${hb.data[i]},${hb.data[i + 1]},${hb.data[i + 2]}`; freq.set(k, (freq.get(k) || 0) + 1); }
    R.userInk = { idx, row: Math.floor(idx / 9) + 1, token: await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--color-user-ink").trim()), stroke: await page.evaluate((i) => getComputedStyle(document.querySelectorAll(".sudoku-cell")[i].querySelector(".glyph-svg path")).stroke, idx), groundModal: [...freq.entries()].sort((p, q) => q[1] - p[1])[0][0], ...(await differ(dShown, dHidden, 4.5, blue)) };
    await ctx.close();
    console.error("done", eng, scheme, dpr);
  }
  await br.close();
}
writeFileSync(process.argv[2], JSON.stringify(out, null, 1));
console.error("wrote");
