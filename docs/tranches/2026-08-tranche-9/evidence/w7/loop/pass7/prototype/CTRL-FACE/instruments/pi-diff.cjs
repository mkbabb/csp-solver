const fs = require("fs");
const load = (f) => fs.readFileSync(f, "utf8").trim().split("\n").filter(Boolean).map(JSON.parse);
const [a, bfile, eng] = process.argv.slice(2);
const A = load(a), B = load(bfile);
for (const x of A) {
  const y = B.find((z) => z.theme === x.theme && z.cell === x.cell);
  const mb = new Map(y.rows.map((r) => [r[0], r]));
  let paint = 0, rect = 0, missing = 0; const ex = [];
  for (const r of x.rows) {
    const s = mb.get(r[0]);
    if (!s) { missing++; if (ex.length < 4) ex.push("MISSING " + r[0].slice(-60)); continue; }
    if (s[2] !== r[2]) { paint++; if (ex.length < 6) ex.push("PAINT " + r[1] + " " + r[0].slice(-50) + " :: " + r[2].split("|").map((v, i) => v !== s[2].split("|")[i] ? i + ":" + v + "→" + s[2].split("|")[i] : null).filter(Boolean).join(" ")); }
    if (s[3] !== r[3]) { rect++; if (ex.length < 8) ex.push("RECT " + r[1] + " " + r[0].slice(-50) + " " + r[3] + " → " + s[3]); }
  }
  console.log(`${eng} ${x.theme} ${x.cell}: n=${x.rows.length}/${y.rows.length} paintΔ ${paint} rectΔ ${rect} missing ${missing}`);
  for (const e of ex) console.log("   " + e);
}
