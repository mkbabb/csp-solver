// PAL-TIN pass 7 · the stamp table from the clean runs' STAMP lines (median, fraction, clears = row or HEAD ≥ 4.5)
import fs from "node:fs";
const rows = [];
for (const f of process.argv.slice(2)) for (const l of fs.readFileSync(f, "utf8").split("\n")) {
  const m = /^STAMP (\S+) ([\d.]+) ([\d.]+) HEAD ([\d.]+)/.exec(l);
  if (m) rows.push([m[1], +m[2], +m[3], +m[4]]);
}
const out = rows.map(([k, med, frac, head]) => `  "${k}": [${med}, ${frac}, ${med >= 4.5 || head >= 4.5}],`);
console.log(`const STAMPS: Record<string, [number, number, boolean]> = {\n${out.join("\n")}\n};`);
// the loss table: every row vs HEAD on the same key
const loss = rows.filter(([, med, , head]) => med < head).map(([k, med, , head]) => `${k} ${med} < HEAD ${head} (${(med - head).toFixed(3)})`);
fs.writeFileSync(process.env.LOSS_OUT ?? "/dev/stderr", `rows ${rows.length} · under HEAD ${loss.length}\n${loss.join("\n")}\n`);
