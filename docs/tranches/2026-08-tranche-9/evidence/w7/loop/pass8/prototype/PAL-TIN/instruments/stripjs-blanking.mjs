// PAL-TIN pass 8 · how much of each shipped JS chunk a stripper blanks (the critic's §0.3 reading)
import fs from "node:fs"; import path from "node:path";
const [lib, dir] = process.argv.slice(2);
const L = await import(path.resolve(lib));
let tot = 0, bl = 0; const rows = [];
for (const f of fs.readdirSync(path.join(dir, "assets")).filter((f) => /\.js$/.test(f))) {
  const s = fs.readFileSync(path.join(dir, "assets", f), "utf8"), o = L.stripJs(s);
  let n = 0, first = -1;
  for (let i = 0; i < s.length; i++) if (o[i] === " " && s[i] !== " " && s[i] !== "\n") { n++; if (first < 0) first = i; }
  tot += s.length; bl += n; rows.push(`${f} ${s.length} B blanked ${n} (${(100 * n / s.length).toFixed(2)} %) first at ${first}`);
}
for (const r of rows.filter((r) => !/ 0 \(/.test(r) || /index-|vue-vendor/.test(r))) console.log(r);
console.log(`ALL JS ${tot} B · blanked ${bl} B = ${(100 * bl / tot).toFixed(2)} %`);
