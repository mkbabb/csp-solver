// PASS-6 COPY of pass5/critique/ACC-SIX/instruments/c5-trace.mjs (itself a copy of the lane's p5-trace), re-pointed: arms = as built (the tree now ships #8f61f6 @1 light) and T9-B-ACC6-1's other arm #8b5cf6 @1, injected on the same page; the control runs ARMSET=built. A SECOND bare photograph per arm (LAWS P5) is taken and the minimum over the two reported.
// ACC-SIX pass-5 — THE ESCAPE BYTE BY DIFFERENCING, SPLIT BY THE GROUND EACH PIXEL ABUTS.
// p5-paint.mjs's first trace cut ranked ONE core by luminance move, which silently picks the
// ground that moves most (paper in light, the line in dark) and hides the other — and a single
// max-dy pixel made k = 1.0 degenerate in four dark cells. Re-cut: three shots per arm — S
// (trace shown), H1 and H2 (trace hidden, twice: H1 vs H2 is the NOISE control, which must read
// ~0 changed pixels) — and every S-vs-H1 pixel is classed by its HIDDEN value, i.e. what the
// stroke sits on: LINE (the frame's graphite core: Y < 0.25 light / Y > 0.25 dark), EDGE (the
// hand line's own soft edge, 0.25..0.93 light / 0.02..0.25 dark) or PAPER (Y > 0.93 light /
// Y < 0.02 dark). A two-way split (the first 8-write cut) lumped the edge into PAPER and read
// 2.695 there where true paper reads 3.309 — the edge is its own ground and gets its own row. Per class: the core at k = 0.5/0.7/0.9/1.0 of the class's
// own max move — n, p30, median, fraction < 3.10 (the rule's trigger) and < 3.0 (the floor),
// the worst column and the fraction of columns under 3.10. Arms via --color-progress-ink.
// usage: BASE=… ARMSET=escape|built node p5-trace.mjs <out.json>
import sharp from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.mjs";
import { writeFileSync } from "node:fs";
import { ENGINES, BOARD, DEAL, cells, asset, writeLegal, open } from "./p6-common.mjs";
const BASE = process.env.BASE || "http://127.0.0.1:4237";
const ARMS = process.env.ARMSET === "built" ? [["asBuilt", null]] : [["asBuilt", null], ["arm_8b5cf6", "#8b5cf6"]];
const DPRS = (process.env.DPRS || "1,3").split(",").map(Number);
const lin = (c) => ((c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const Yd = (d, i) => 0.2126 * lin(d[i]) + 0.7152 * lin(d[i + 1]) + 0.0722 * lin(d[i + 2]);
const raw = async (b) => sharp(b).raw().toBuffer({ resolveWithObject: true });
const med = (xs) => [...xs].sort((p, q) => p - q)[Math.floor(xs.length / 2)];
function stats(px) {
  if (!px.length) return null;
  const max = Math.max(...px.map((p) => p.dy));
  const row = {};
  for (const k of [0.5, 0.7, 0.9, 1.0]) {
    const core = px.filter((p) => p.dy >= k * max - 1e-9);
    const rs = core.map((p) => p.r).sort((x, y) => x - y);
    const byCol = new Map();
    for (const p of core) (byCol.get(p.x) ?? byCol.set(p.x, []).get(p.x)).push(p.r);
    const colMed = [...byCol.values()].map(med);
    row[k] = { n: rs.length, p30: +rs[Math.floor(rs.length * 0.3)].toFixed(3), median: +rs[Math.floor(rs.length / 2)].toFixed(3), u310: +(rs.filter((r) => r < 3.1).length / rs.length).toFixed(3), u300: +(rs.filter((r) => r < 3.0).length / rs.length).toFixed(3), worstCol: +Math.min(...colMed).toFixed(3), colsU310: +(colMed.filter((r) => r < 3.1).length / colMed.length).toFixed(3) };
  }
  const modes = (key) => { const m = new Map(); for (const p of px) m.set(p[key], (m.get(p[key]) ?? 0) + 1); return [...m.entries()].sort((p, q) => q[1] - p[1]).slice(0, 4).map(([v, n]) => `${v}×${n}`); };
  const rows = new Map(); for (const p of px) rows.set(p.y, (rows.get(p.y) ?? 0) + 1);
  return { n: px.length, groundModes: modes('g'), strokeModes: modes('s'), rowsSpan: [Math.min(...rows.keys()), Math.max(...rows.keys())], row };
}
async function split(S, H1, H2, scheme) {
  const a = await raw(S), b = (await raw(H1)).data, c = (await raw(H2)).data;
  const { width: w, channels: ch } = a.info;
  const cls = { line: [], edge: [], paper: [] };
  let noise = 0;
  for (let i = 0; i < a.data.length; i += ch) {
    if (Math.abs(Yd(b, i) - Yd(c, i)) >= 0.01) noise++;
    const ya = Yd(a.data, i), yb = Yd(b, i), dy = Math.abs(ya - yb);
    if (dy < 0.01) continue;
    const k = scheme === "light" ? (yb < 0.25 ? "line" : yb > 0.93 ? "paper" : "edge") : yb > 0.25 ? "line" : yb < 0.02 ? "paper" : "edge";
    cls[k].push({ x: (i / ch) % w, y: Math.floor(i / ch / w), dy, r: (Math.max(ya, yb) + 0.05) / (Math.min(ya, yb) + 0.05), g: b[i] + ',' + b[i + 1] + ',' + b[i + 2], s: a.data[i] + ',' + a.data[i + 1] + ',' + a.data[i + 2] });
  }
  return { noisePx: noise, line: stats(cls.line), edge: stats(cls.edge), paper: stats(cls.paper) };
}
const out = { board: BOARD, base: BASE, control: "74a2b5d9", cells: {} };
for (const [eng, L] of ENGINES) {
  const br = await L.launch();
  for (const scheme of ["light", "dark"]) for (const dpr of DPRS) {
    const { ctx, page } = await open(br, BASE, { viewport: { width: 1280, height: 800 }, dpr, scheme, reduce: true });
    const R = (out.cells[`${eng}/${scheme}/dpr${dpr}`] = { asset: await asset(page), dealOk: (await cells(page)) === DEAL, arms: {} });
    for (let k = 0; k < Number(process.env.WRITES || 8); k++) await writeLegal(page, 200); // 8 writes = 15.7 % of the perimeter on the 51-cell payload
    await page.evaluate(() => document.activeElement?.blur?.()); await page.mouse.move(2, 2); await page.waitForTimeout(900);
    const box = await page.locator("svg.hand-drawn-grid").first().boundingBox();
    const clip = { x: Math.round(box.x + box.width * 0.15), y: Math.round(box.y - 10), width: Math.round(box.width * 0.4), height: 26 };
    const shot = () => page.screenshot({ clip, type: "png" });
    const hide = (on) => page.evaluate((o) => { document.getElementById("acc6-hide")?.remove(); if (!o) return; const s = document.createElement("style"); s.id = "acc6-hide"; s.textContent = ".progress-trace { visibility: hidden !important; }"; document.head.appendChild(s); }, on);
    for (const [name, hex] of ARMS) {
      await page.evaluate((h) => { document.getElementById("acc6-arm")?.remove(); if (!h) return; const s = document.createElement("style"); s.id = "acc6-arm"; s.textContent = `:root { --color-progress-ink: ${h} !important; }`; document.head.appendChild(s); }, hex);
      let last = null; for (let t = 0; t < 30; t++) { const v = await page.evaluate(() => { const e = document.querySelector(".progress-trace"); return e ? getComputedStyle(e).stroke + "|" + getComputedStyle(e).strokeOpacity : null; }); if (v === last) break; last = v; await page.waitForTimeout(120); }
      const S = await shot(); await hide(true); await page.waitForTimeout(150);
      const H1 = await shot(); await page.waitForTimeout(250); const H2 = await shot(); await hide(false); await page.waitForTimeout(150);
      const S2 = await shot(); // the second bare photograph (LAWS P5): its split against the same hidden pair
      R.arms[name] = { stroke: last, ...(await split(S, H1, H2, scheme)), second: await split(S2, H1, H2, scheme) };
    }
    await ctx.close();
    console.error("done", eng, scheme, dpr);
  }
  await br.close();
}
writeFileSync(process.argv[2], JSON.stringify(out, null, 1));
console.error("wrote");
