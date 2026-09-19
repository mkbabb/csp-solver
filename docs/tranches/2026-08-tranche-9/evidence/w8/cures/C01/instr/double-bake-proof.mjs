// RUN: node double-bake-proof.mjs <run.jsonl …>   (gunzip raw/*.jsonl.gz first)
//
// THE DISCARDED ROUND, priced. Per surface, per window: how many encodes ran, whether the
// PNG byte multisets of the two rounds are identical (chromium: they are — so the π
// obligation "the same bitmap bytes, later" is satisfiable by construction), what the
// discarded round cost in blocking ms and bytes, and where `fonts.ready` and the capture
// box sat relative to it — the two distinct mechanisms that produce the second round.
import { readFileSync } from "node:fs";
const eq = (a, b) => JSON.stringify([...a].sort()) === JSON.stringify([...b].sort());
for (const f of process.argv.slice(2)) {
  const L = readFileSync(f, "utf8").trim().split("\n").map(JSON.parse);
  const m = L.find((x) => x.k === "meta");
  console.log(`\n### ${m.engine} · ${m.cpuThrottle}× · ${m.net} · ${m.cache} · ${m.vp}   (${f})`);
  for (const w of L.filter((x) => x.k === "window")) {
    const ev = w.cold.ev;
    const fr = (ev.find((e) => e.k === "fonts.ready") || {}).t;
    const by = {};
    for (const e of ev)
      if (e.k === "toBlob:end") (by[e.surface] ??= []).push([e.bytes, e.w, e.t]);
    const sync = {};
    for (const e of ev) if (e.k === "toBlob:sync") (sync[e.surface] ??= []).push(e.syncMs);
    const poses = {};
    for (const e of ev) if (e.k === "poseSvg") (poses[e.surface] ??= []).push(e.t);
    console.log(` window ${w.window} · board-ready ${w.cold.boardReady} · fonts.ready ${fr}`);
    for (const [s, rows] of Object.entries(by)) {
      const n = rows.length,
        half = n / 2;
      const p = poses[s] || [];
      const line = [`  ${s}: ${n} encodes`];
      if (n === 8) {
        const r1 = rows.slice(0, half),
          r2 = rows.slice(half);
        line.push(
          `rounds ${r1[0][1]}px→${r2[0][1]}px`,
          `bytes identical: ${eq(r1.map((x) => x[0]), r2.map((x) => x[0]))}`,
          `discarded ${r1.reduce((a, x) => a + x[0], 0)} B / ${(sync[s] || []).slice(0, half).reduce((a, b) => a + b, 0).toFixed(1)} ms blocking`,
          `poseSvg built ${p[0]}…${p[half - 1]} | ${p[half]}…${p[n - 1]} (fonts.ready ${fr})`,
          fr != null && p[half] != null && p[half] > fr && p[half - 1] < fr
            ? "MECHANISM: the fonts.ready cache-clear"
            : r1[0][1] !== r2[0][1]
              ? "MECHANISM: a cssSize re-key (layout had not settled)"
              : "MECHANISM: undetermined from this window",
        );
      } else line.push("single round");
      console.log(line.join(" · "));
    }
  }
}
