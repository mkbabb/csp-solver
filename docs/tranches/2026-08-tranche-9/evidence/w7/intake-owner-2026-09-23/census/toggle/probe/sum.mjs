// census:toggle — compact table + series.json from runs/*.json
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { analyze } from "./an.mjs";
const INK = { light: [38, 38, 38], dark: [209, 207, 199] };
const rgb = (s) => (s && s.match(/[\d.]+/g) ? s.match(/[\d.]+/g).slice(0, 3).map(Number) : null);
const lum = ([r, g, b]) => { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
const cr = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
function contrast(file, label) {
  const J = JSON.parse(readFileSync(file, "utf8")); const r = J.runs.find((x) => x.label === label);
  const i0 = Math.max(0, r.frames.findIndex((f) => f.t >= r.actAt - 0.5) - 1); const F = r.frames.slice(i0).filter((f) => f.t <= r.actAt + 1300);
  if (!F[0].gA && F[0].gA !== "") return null;
  const oldTheme = r.direction.startsWith("dark") ? "dark" : "light", newTheme = oldTheme === "dark" ? "light" : "dark";
  const oldSet = new Set((F[0].grid || "").replace(/^href:/, "").split(","));
  const series = F.map((f) => { const bg = rgb(f.bw); let ink; if (f.gA && f.gA.startsWith("rgb")) ink = rgb(f.gA); else ink = oldSet.has(f.gA) ? INK[oldTheme] : INK[newTheme]; return { t: +(f.t - r.actAt).toFixed(0), c: bg && ink ? +cr(ink, bg).toFixed(2) : null, inkNew: ink === INK[newTheme] || (f.gA && f.gA.startsWith("rgb") && f.gA !== F[0].gA) }; });
  const valid = series.filter((s) => s.c != null); const min = valid.reduce((m, s) => (s.c < m.c ? s : m), valid[0]);
  const under3 = valid.filter((s) => s.c < 3 && s.t >= 0);
  return { rest: valid[0].c, end: valid[valid.length - 1].c, min: min.c, minAt: min.t, under3: under3.length ? `${under3.length}f +${under3[0].t}…+${under3[under3.length - 1].t}` : 0, inkNewAt: (series.find((s) => s.inkNew) || {}).t ?? null };
}
const files = readdirSync("runs").filter((f) => /^[tsp]-.*\.json$/.test(f)).sort();
const out = [];
for (const f of files) {
  const a = analyze("runs/" + f);
  const tree = f.includes("-main-") ? "main 1d0dc4fd" : "VERB pass5 on 74a2b5d9";
  for (const r of a.runs) {
    const cold = r.label === "flip0" ? "cold" : "warm";
    const c = contrast("runs/" + f, r.label);
    out.push({ file: f, tree, engine: a.engine, vp: a.vp, pointer: a.touch ? "coarse(hasTouch)" : "fine", boot: a.scheme, prm: a.prm, flip: r.label, cold, dir: r.direction, reloaded: r.reloaded,
      frameMs: r.frameMs, bloom1100: r.bloom1100, bigFrames: r.bigFrames, born: r.born, maxStepIn: r.maxStepIn, stepsOver08: r.stepsOver08, largestJump: r.largestJump, crest: r.crest, out: r.out, handStart: r.handStart, settle: r.settle, doubleExposure: r.doubleExposure, pageHalf: r.pageHalf, pageEnd: r.pageEnd, plushMaxDev: r.plushMaxDev, btnMin: r.btnMin, emptyFrames: r.emptyFrames, turning: r.turning, page: r.page, gridContrast: c, bakes: r.bakes.length, bakeList: r.bakes.slice(0, 8), loaf: r.loaf, shots: r.shots, errors: a.errors });
  }
}
writeFileSync("series.json", JSON.stringify(out, null, 1));
const pad = (s, n) => String(s ?? "—").padEnd(n);
for (const o of out) {
  const b = o.born ? `${o.born.s}@+${o.born.t}` : "—";
  const pg = o.page.pageRoot ? `${o.page.pageRoot.first}…${o.page.pageRoot.last}` : "—";
  const gr = o.page.grid ? `${o.page.grid.first}…${o.page.grid.last}/${o.page.grid.distinct}` : "—";
  const lg = o.page.logo ? `${o.page.logo.first}` : "—";
  const gc = o.gridContrast ? `${o.gridContrast.rest}/${o.gridContrast.min}@${o.gridContrast.minAt}/${o.gridContrast.end} u3:${o.gridContrast.under3}` : "";
  const sh = o.shots ? ` SC ${o.shots.painted}p max${o.shots.gapMs.max} >16.7:${o.shots.over16_7} >34:${o.shots.over34} >50:${o.shots.over50}` : "";
  console.log([pad(o.file.replace(/\.json$/, ""), 38), pad(o.flip + " " + o.cold, 11), pad(o.dir, 12), pad(`max${o.frameMs.max} med${o.frameMs.median}`, 18), pad(`>16.7:${o.bloom1100.over16_7} >34:${o.bloom1100.over34} >50:${o.bloom1100.over50}`, 22), pad("born " + b, 18), pad(`dS${o.maxStepIn}/${o.stepsOver08}`, 11), pad(`jump${o.largestJump.d}${o.largestJump.body}@${o.largestJump.t}`, 20), pad(`outLast ${o.out ? o.out.lastScale + "@" + o.out.lastLive : "—"}`, 20), pad(`crest ${o.crest.s}@${o.crest.t}`, 17), pad(`settle ${o.settle ? o.settle.t + " s" + o.settle.liveScaleBefore : "—"}`, 16), pad(`page ${pg}`, 15), pad(`grid ${gr}`, 18), pad(`logo ${lg}`, 10), pad(`bakes ${o.bakes}`, 9), gc, o.reloaded ? " RELOADED" : "", sh].join(" "));
}
