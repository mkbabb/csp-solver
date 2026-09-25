import fs from "node:fs"; import path from "node:path";
const SH = await import(process.env.SHAPE_CENSUS);
for (const dir of process.argv.slice(2)) {
  let tot = 0, blank = 0, files = 0, hit = [];
  const walk = (d) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (/\.(js|mjs)$/.test(e.name)) {
    const raw = fs.readFileSync(p, "utf8"); const s = SH.stripJs(raw); files++;
    let b = 0; for (let i = 0; i < raw.length; i++) if (raw[i] !== " " && raw[i] !== "\n" && s[i] === " ") b++;
    tot += raw.length; blank += b;
    if (b / raw.length > 0.05) { let k = 0; while (k < raw.length && !(raw[k] !== " " && s[k] === " " && s.slice(k, k + 200).trim() === "")) k++; hit.push(`${e.name} ${(100*b/raw.length).toFixed(1)}% blanked from ${k}/${raw.length}: ${JSON.stringify(raw.slice(Math.max(0,k-40), k+30))}`); }
  } } };
  walk(dir);
  console.log(`${dir}: ${files} js files, ${(100*blank/tot).toFixed(1)}% of bytes blanked`); for (const h of hit) console.log("  " + h);
}
