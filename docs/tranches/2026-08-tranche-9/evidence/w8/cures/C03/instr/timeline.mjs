// RUN: node timeline.mjs <bake-census.jsonl> [windowIndex]
// T9-W8 §8.2 cure C03 — event-grain read of ONE bake-census window: every pose-SVG mint,
// drawImage and toBlob, in time order, tagged by surface, so the SCHEDULE is visible rather
// than inferred. Prints per-surface first/last stamps and the whole pipeline's span.
import { readFileSync } from "node:fs";
const [file, wi = "1"] = process.argv.slice(2);
const L = readFileSync(file, "utf8").trim().split("\n").map((l) => JSON.parse(l));
const w = L.filter((x) => x.k === "window")[Number(wi) - 1];
const meta = L.find((x) => x.k === "meta");
console.log(`${meta.engine} · ${meta.cpuThrottle}× · ${meta.net} · ${meta.cache} · ${meta.vp} · board-ready ${w.cold.boardReady}`);
const ev = w.cold.ev;
const KEEP = new Set(["poseSvg", "drawImage", "toBlob:start", "toBlob:end", "toBlob:sync", "board-ready", "fonts.ready", "imgDecode"]);
const per = {};
for (const e of ev) {
  if (!KEEP.has(e.k)) continue;
  const s = e.surface || "-";
  (per[s] ??= { first: e.t, last: e.t, n: 0, encodes: 0, encodeMs: 0, bytes: 0, drawMs: 0 });
  per[s].first = Math.min(per[s].first, e.t); per[s].last = Math.max(per[s].last, e.t); per[s].n++;
  if (e.k === "toBlob:sync") { per[s].encodes++; per[s].encodeMs += e.syncMs; }
  if (e.k === "toBlob:end") per[s].bytes += e.bytes || 0;
  if (e.k === "drawImage") per[s].drawMs += e.syncMs;
}
console.log("\n| surface | first ev | last ev | encodes | Σ toBlob sync ms | Σ drawImage ms | Σ bytes |");
console.log("|---|---|---|---|---|---|---|");
for (const [s, v] of Object.entries(per))
  console.log(`| ${s} | ${v.first.toFixed(0)} | ${v.last.toFixed(0)} | ${v.encodes} | ${v.encodeMs.toFixed(1)} | ${v.drawMs.toFixed(1)} | ${v.bytes} |`);
console.log("\n--- the ordered trace ---");
for (const e of ev) {
  if (!KEEP.has(e.k)) continue;
  const extra = e.k === "toBlob:end" ? ` ${e.ms}ms ${e.bytes}B ${e.w}x${e.h}`
    : e.k === "toBlob:sync" ? ` sync ${e.syncMs}ms`
    : e.k === "drawImage" ? ` sync ${e.syncMs}ms ${e.w}x${e.h}`
    : e.k === "poseSvg" ? ` ${e.svgBytes}B` : e.k === "imgDecode" ? ` ${e.ms}ms` : "";
  console.log(`${String(e.t.toFixed(0)).padStart(6)}  ${e.k.padEnd(14)} ${(e.surface || "").padEnd(12)}${extra}`);
}
const raf = w.cold.raf || [];
console.log(`\nrAF gaps >33.4ms (first 40): ${raf.map(([t, d]) => `${t}:${d}`).join(" ")}`);
