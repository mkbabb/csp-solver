// run: node A3-fold.mjs raw.jsonl   — folds the raw readings into the cold/warm layer tables (medians, ≥3 windows)
import fs from "node:fs";
const rows = fs
    .readFileSync(process.argv[2] || "raw.jsonl", "utf8")
    .trim()
    .split("\n")
    .map((l) => JSON.parse(l));
const med = (a) => {
    const v = a.filter((x) => x !== null && x !== undefined).sort((x, y) => x - y);
    return v.length ? (v.length % 2 ? v[(v.length - 1) / 2] : (v[v.length / 2 - 1] + v[v.length / 2]) / 2) : null;
};
const key = (r) => `${r.engine} cpu${r.cpu}x ${r.net} ${r.vp}`;
const groups = new Map();
for (const r of rows) {
    if (r.tainted) continue;
    const k = key(r) + " | " + r.kind;
    if (!groups.has(k)) groups.set(k, []);
    groups.get(k).push(r);
}
const F = (v) => (v === null || v === undefined ? "—" : typeof v === "number" ? (Number.isInteger(v) ? String(v) : v.toFixed(1)) : String(v));
const cols = [
    ["n", (g) => g.length],
    ["fcp", (g) => med(g.map((r) => r.paints["first-contentful-paint"]))],
    ["lcp", (g) => med(g.map((r) => r.lcp))],
    ["boardReady", (g) => med(g.map((r) => r.boardReady))],
    ["fontsReady", (g) => med(g.map((r) => r.fontsReady))],
    ["firstBake", (g) => med(g.map((r) => r.firstBakeAt))],
    ["lastBake", (g) => med(g.map((r) => r.lastBakeAt))],
    ["bakes", (g) => med(g.map((r) => r.bakeCount))],
    ["bakes@ready", (g) => med(g.map((r) => r.bakeCountAtReady))],
    ["objURLs", (g) => med(g.map((r) => r.objectUrls))],
    ["req", (g) => med(g.map((r) => r.reqCount))],
    ["wireB", (g) => med(g.map((r) => r.reqBytes))],
    ["cacheHits", (g) => med(g.map((r) => r.cacheHits))],
    ["longTasks", (g) => med(g.map((r) => r.longTasks))],
    ["longTaskMs", (g) => med(g.map((r) => r.longTaskMs))],
    ["wasmReqs", (g) => med(g.map((r) => r.wasm.filter((w) => w.ev === "req").length))],
    ["wasmFetchMs", (g) => med(g.map((r) => { const f = r.wasm.find((w) => w.ev === "fin" && w.respEnd !== undefined); return f ? +(f.respEnd - f.reqStart).toFixed(1) : null; }))],
    ["workerJs", (g) => med(g.map((r) => r.workerJsRequests))],
    ["swRegs", (g) => med(g.map((r) => r.swRegs))],
];
const hdr = ["regime | nav", ...cols.map((c) => c[0])];
const widths = hdr.map((h) => h.length);
const table = [];
for (const [k, g] of [...groups.entries()].sort()) {
    const row = [k, ...cols.map((c) => F(c[1](g)))];
    row.forEach((v, i) => (widths[i] = Math.max(widths[i], String(v).length)));
    table.push(row);
}
const line = (r) => r.map((v, i) => String(v).padEnd(widths[i])).join("  ");
console.log(line(hdr));
console.log(widths.map((w) => "-".repeat(w)).join("  "));
for (const r of table) console.log(line(r));
