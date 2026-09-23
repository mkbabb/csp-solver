// G7 attribution: every flip's hand-off, the live scale in the last frame before it, and the frame gap into it
import { readdirSync, readFileSync } from "node:fs";
import { analyze } from "./an.mjs";
const re = new RegExp(process.argv[2] || ".");
const rows = [];
for (const f of readdirSync("runs").filter((x) => re.test(x) && x.endsWith(".json"))) {
  const J = JSON.parse(readFileSync("runs/" + f, "utf8")); const A = analyze("runs/" + f);
  J.runs.forEach((r, i) => { const s = A.runs[i].G7.settle; if (!s) return; const a = r.clicks && r.clicks.length ? r.clicks[0] : r.actAt;
    const idx = r.frames.findIndex((x) => x.t - a >= s.t - 0.5); const dt = idx > 0 ? +(r.frames[idx].t - r.frames[idx - 1].t).toFixed(0) : null;
    rows.push({ f, flip: r.label, t: s.t, liveS: s.liveS, dtInto: dt }); });
}
const off = rows.filter((x) => Math.abs(x.liveS - 1) > 0.005);
console.log(JSON.stringify({ n: rows.length, within: rows.length - off.length, off }));
