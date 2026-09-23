// ACC-SIX pass-6 — row 10: R6's heading census and R3's wobble, run on the lane's dist AND the control
// (the r0 probe COPIES under instruments/, OUT re-pointed), compared field by field. Prints the diff; banks nothing raw.
// usage: node p6-r0-compare.mjs <r0out dir with tree/ and control/>
import { readFileSync, readdirSync, existsSync } from "node:fs";
const D = process.argv[2];
const heading = (arm) => { const t = readFileSync(`${D}/${arm}/heading.log`, "utf8"); const out = []; let i = 0; while ((i = t.indexOf("HEADING-CENSUS ", i)) >= 0) { const s = t.indexOf("{", i); let d = 0, j = s; for (; j < t.length; j++) { if (t[j] === "{") d++; else if (t[j] === "}" && --d === 0) break; } out.push(JSON.parse(t.slice(s, j + 1))); i = j; } return out; };
const [ht, hc] = [heading("tree"), heading("control")];
console.log(`heading census: ${ht.length} tree / ${hc.length} control readings (one per engine)`);
ht.forEach((x, k) => { const a = JSON.stringify(x), b = JSON.stringify(hc[k]); console.log(`  engine #${k}: ${a === b ? "IDENTICAL" : "DIFFERS"} (${a.length} chars)`); if (a !== b) for (const key of Object.keys(x)) { const X = x[key], Y = hc[k][key]; if (JSON.stringify(X) === JSON.stringify(Y)) continue; if (!Array.isArray(X)) { console.log(`    ${key}: tree ${JSON.stringify(X)} | control ${JSON.stringify(Y)}`); continue; } X.forEach((e, i) => { const f = Y[i] ?? {}; const d = Object.keys(e).filter((q) => e[q] !== f[q]).map((q) => `${q} ${e[q]}→ctl ${f[q]}`); if (d.length) console.log(`    ${key}[${i}] "${e.text}": ${d.join(", ")}`); }); } });
for (const f of readdirSync(`${D}/tree`).filter((f) => f.startsWith("wobble") && f.endsWith(".json"))) {
  const a = readFileSync(`${D}/tree/${f}`, "utf8"), b = existsSync(`${D}/control/${f}`) ? readFileSync(`${D}/control/${f}`, "utf8") : null;
  const strip = (s) => JSON.stringify(JSON.parse(s), (k, v) => (/^(t|ts|time|when|at)$/.test(k) ? undefined : v));
  console.log(`wobble ${f}: ${b === null ? "NO CONTROL FILE" : strip(a) === strip(b) ? "IDENTICAL" : "DIFFERS"}`);
  if (b && strip(a) !== strip(b)) { const A = JSON.parse(a), B = JSON.parse(b); for (const k of Object.keys(A)) if (JSON.stringify(A[k]) !== JSON.stringify(B[k])) console.log(`    ${k}: tree ${JSON.stringify(A[k]).slice(0, 240)} | control ${JSON.stringify(B[k]).slice(0, 240)}`); }
}
