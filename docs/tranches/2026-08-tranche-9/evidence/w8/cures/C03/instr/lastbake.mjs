// RUN: node lastbake.mjs <base.jsonl> <cured.jsonl>
// T9-W8 §8.2 cure C03 — PER SURFACE, out of A1's bake-census raws: when each surface's LAST
// pose blob resolved (its stack's landing), and the whole pipeline's span. The charter asks for
// leg 2 "printed per pose"; the census sees per SURFACE, which is the grain the schedule moves.
import { readFileSync } from "node:fs";
const med = (a) => { const s = [...a].sort((x, y) => x - y); const n = s.length;
  return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
const f = (x) => (x == null || Number.isNaN(x) ? "—" : (+x).toFixed(1));
const SURF = ["logo", "toggle-sun", "toggle-moon", "grid"];
function rows(file) {
  const L = readFileSync(file, "utf8").trim().split("\n").map((l) => JSON.parse(l));
  return { meta: L.find((x) => x.k === "meta"), end: L.find((x) => x.k === "end"),
    out: L.filter((x) => x.k === "window").map((w) => {
      const r = { window: w.window, taint: w.cold.taint, boardReadyMs: w.cold.boardReady };
      for (const s of SURF) {
        const ends = w.cold.ev.filter((e) => e.k === "toBlob:end" && e.surface === s).map((e) => e.t);
        r[s] = ends.length ? Math.max(...ends) : null;
        r[s + "#"] = ends.length;
      }
      const gaps = (w.cold.raf || []).filter(([t]) => t < 3000);
      r.long33 = gaps.length; r.worstGap = gaps.length ? Math.max(...gaps.map(([, d]) => d)) : 0;
      return r;
    }) };
}
const KEYS = ["boardReadyMs", ...SURF, "long33", "worstGap"];
const [bf, cf] = process.argv.slice(2);
const B = rows(bf), C = rows(cf);
const head = (m) => `${m.engine} · ${m.cpuThrottle}× · ${m.net} · ${m.cache} · ${m.vp}`;
console.log(`regime: ${head(B.meta)}   (cured: ${head(C.meta)})`);
console.log(`load  : base ${B.meta.loadavgStart} → ${B.end?.loadavgEnd} · cured ${C.meta.loadavgStart} → ${C.end?.loadavgEnd}`);
console.log(`taint : base ${B.out.map((r) => r.taint).join("/")} · cured ${C.out.map((r) => r.taint).join("/")}`);
console.log(`encodes/surface base : ${SURF.map((s) => `${s} ${B.out.map((r) => r[s + "#"]).join(",")}`).join(" · ")}`);
console.log(`encodes/surface cured: ${SURF.map((s) => `${s} ${C.out.map((r) => r[s + "#"]).join(",")}`).join(" · ")}`);
console.log("\n| quantity (ms; a surface's LAST pose blob) | base median | base spread | cured median | cured spread | Δ | outside both spreads |");
console.log("|---|---|---|---|---|---|---|");
for (const k of KEYS) {
  const b = B.out.map((r) => r[k]).filter((x) => x != null), c = C.out.map((r) => r[k]).filter((x) => x != null);
  if (!b.length || !c.length) continue;
  const bs = [Math.min(...b), Math.max(...b)], cs = [Math.min(...c), Math.max(...c)];
  console.log(`| ${k} | ${f(med(b))} | ${f(bs[0])}–${f(bs[1])} | ${f(med(c))} | ${f(cs[0])}–${f(cs[1])} | ${f(med(c) - med(b))} | ${bs[0] > cs[1] || cs[0] > bs[1] ? "YES" : "no — inside the spread"} |`);
}
