// RUN: node summarize.mjs <run.jsonl> [<run.jsonl> …]   (prints one table block per regime)
//
// Folds `bake-census.mjs` readings into the §8.1 bake table. Medians over the run's windows;
// a window whose `taint` > 0 is named and excluded. Every per-surface row carries:
//   trigger · t_start / t_end vs navigationStart · main-thread ms · BEFORE/AFTER board-ready ·
//   PNG bytes. `syncMs` is the blocking half of `toBlob` (the encode); `ms` is wall including
//   the yields the promise takes. Chromium additionally attributes `longtask` entries by
//   overlap; WebKit has no `longtask` entry type, so that column prints NOT MEASURED and the
//   rAF-gap census stands in its place.
import { readFileSync } from "node:fs";

const med = (a) => {
  if (!a.length) return null;
  const s = [...a].sort((x, y) => x - y);
  const m = s.length >> 1;
  return +(s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2).toFixed(1);
};

for (const f of process.argv.slice(2)) {
  const L = readFileSync(f, "utf8").trim().split("\n").map(JSON.parse);
  const meta = L.find((x) => x.k === "meta");
  const end = L.find((x) => x.k === "end");
  const all = L.filter((x) => x.k === "window");
  const tainted = all.filter((w) => w.cold.taint > 0).map((w) => w.window);
  const W = all.filter((w) => w.cold.taint === 0);

  console.log(
    `\n### ${meta.engine} · CPU ${meta.cpuThrottle}× · net ${meta.net} · cache ${meta.cache} · ${meta.vp} · load ${meta.loadavgStart} → ${end ? end.loadavgEnd : "?"} · ${W.length}/${all.length} clean windows${tainted.length ? ` (EXCLUDED tainted: ${tainted.join(",")})` : ""}`,
  );
  console.log(`file: ${f}`);
  console.log(
    `board-ready (ms from navigationStart): ${W.map((w) => w.cold.boardReady).join(" · ")}  → MEDIAN ${med(W.map((w) => w.cold.boardReady))}`,
  );
  const br = med(W.map((w) => w.cold.boardReady));
  console.log(
    `FCP ${med(W.map((w) => (w.cold.ev.find((e) => e.name === "first-contentful-paint") || {}).t).filter(Boolean))} · DCL ${med(W.map((w) => w.cold.nav.domContentLoaded))} · load ${med(W.map((w) => w.cold.nav.loadEnd))} · longtask supported: ${W[0] && W[0].cold.supportsLongtask}`,
  );

  // ── the bake table ──────────────────────────────────────────────────────────────────
  const perWindow = W.map((w) => {
    const ev = w.cold.ev;
    const rows = {};
    const pose = {};
    for (const e of ev) {
      if (e.k === "poseSvg") (pose[e.surface] ??= []).push(e.t);
      if (e.k === "toBlob:sync")
        (rows[e.surface] ??= { sync: [], wall: [], bytes: [], start: [], endT: [] }).sync.push(
          e.syncMs,
        );
      if (e.k === "toBlob:start") (rows[e.surface] ??= { sync: [], wall: [], bytes: [], start: [], endT: [] }).start.push(e.t);
      if (e.k === "toBlob:end") {
        const r = (rows[e.surface] ??= { sync: [], wall: [], bytes: [], start: [], endT: [] });
        r.bytes.push(e.bytes);
        r.endT.push(e.t);
        r.dims = `${e.w}×${e.h}`;
      }
    }
    return { rows, pose, br: w.cold.boardReady, ev };
  });

  const surfaces = [...new Set(perWindow.flatMap((p) => Object.keys(p.rows)))].sort();
  console.log(
    `\n| bake | dims | encodes | t_start | t_end | main-thread ms (sync encode) | vs board-ready | PNG bytes |`,
  );
  console.log(`| --- | --- | --- | --- | --- | --- | --- | --- |`);
  let totSync = 0,
    totBytes = 0,
    totN = 0;
  for (const s of surfaces) {
    const n = med(perWindow.map((p) => (p.rows[s] || { sync: [] }).sync.length));
    const t0 = med(perWindow.map((p) => Math.min(...(p.rows[s] || { start: [0] }).start)));
    const t1 = med(perWindow.map((p) => Math.max(...(p.rows[s] || { endT: [0] }).endT)));
    const sync = med(
      perWindow.map((p) => (p.rows[s] || { sync: [] }).sync.reduce((a, b) => a + b, 0)),
    );
    const bytes = med(
      perWindow.map((p) => (p.rows[s] || { bytes: [] }).bytes.reduce((a, b) => a + b, 0)),
    );
    const dims = (perWindow.find((p) => p.rows[s]) || { rows: {} }).rows[s]?.dims ?? "?";
    console.log(
      `| ${s} | ${dims} | ${n} | ${t0} | ${t1} | ${sync} | ${t0 > br ? "AFTER" : "BEFORE"} | ${bytes} |`,
    );
    totSync += sync || 0;
    totBytes += bytes || 0;
    totN += n || 0;
  }
  console.log(
    `| **TOTAL** | | ${totN} | | | **${totSync.toFixed(1)}** | | **${totBytes}** |`,
  );

  // ── longtask census (chromium) / rAF gaps (webkit) ──────────────────────────────────
  if (W[0] && W[0].cold.supportsLongtask) {
    const lt = perWindow.map((p) => p.ev.filter((e) => e.k === "perf:longtask"));
    console.log(
      `longtask: median count ${med(lt.map((a) => a.length))} · median summed ms ${med(lt.map((a) => a.reduce((x, e) => x + e.dur, 0)))} · median TBT (Σ dur−50) ${med(lt.map((a) => a.reduce((x, e) => x + Math.max(0, e.dur - 50), 0)))} · worst ${med(lt.map((a) => Math.max(0, ...a.map((e) => e.dur))))}`,
    );
    // attribute longtasks to a surface by overlap with its toBlob:start → toBlob:sync span
    const attr = {};
    for (const p of perWindow) {
      const spans = [];
      let open = null;
      for (const e of p.ev) {
        if (e.k === "toBlob:start") open = { s: e.surface, t0: e.t };
        if (e.k === "toBlob:sync" && open) {
          spans.push({ s: open.s, t0: open.t0, t1: e.t });
          open = null;
        }
      }
      for (const e of p.ev)
        if (e.k === "perf:longtask") {
          const hit = spans.find((sp) => e.t <= sp.t1 && e.t + e.dur >= sp.t0);
          const key = hit ? hit.s : "not-a-bake";
          (attr[key] ??= { n: 0, ms: 0 }).n++;
          attr[key].ms += e.dur;
        }
    }
    const k = perWindow.length || 1;
    console.log(
      `longtask attribution (per window): ` +
        Object.entries(attr)
          .map(([s, v]) => `${s} ${(v.n / k).toFixed(1)}× / ${(v.ms / k).toFixed(0)} ms`)
          .join(" · "),
    );
  } else {
    console.log(`longtask: NOT MEASURED (engine ships no \`longtask\` entry type)`);
    console.log(
      `rAF gaps >33.4 ms: median count ${med(W.map((w) => w.cold.raf.length))} · median worst ${med(W.map((w) => Math.max(0, ...w.cold.raf.map((r) => r[1]))))} ms · median summed ${med(W.map((w) => w.cold.raf.reduce((a, r) => a + r[1], 0)))} ms`,
    );
  }

  // ── the toggle ──────────────────────────────────────────────────────────────────────
  for (let i = 0; i < 2; i++) {
    const t = W.map((w) => w.toggles[i]).filter(Boolean);
    if (!t.length) continue;
    const per = t.map((x) => {
      const c = {};
      let sync = 0,
        bytes = 0,
        last = 0;
      for (const e of x.ev) {
        if (e.k === "poseSvg") c[e.surface] = (c[e.surface] || 0) + 1;
        if (e.k === "toBlob:sync") sync += e.syncMs;
        if (e.k === "toBlob:end") {
          bytes += e.bytes;
          last = Math.max(last, e.t - x.tClick);
        }
      }
      return { c, sync, bytes, last, theme: x.theme, n: x.ev.filter((e) => e.k === "toBlob:end").length };
    });
    console.log(
      `toggle #${i + 1} (→ ${per[0].theme || "light"}): re-bakes ${med(per.map((p) => p.n))} encodes ${JSON.stringify(per[0].c)} · main-thread ms ${med(per.map((p) => p.sync))} · settle ${med(per.map((p) => p.last))} ms after click · bytes ${med(per.map((p) => p.bytes))}`,
    );
  }
}
