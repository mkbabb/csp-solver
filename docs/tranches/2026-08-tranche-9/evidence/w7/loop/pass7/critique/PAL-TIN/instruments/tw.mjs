import fs from "node:fs";
const S = await import(process.env.SHAPE_CENSUS);
const theme = fs.readFileSync(process.argv[2], "utf8");
const css = fs.readFileSync(process.argv[3], "utf8");
const lab = (t) => { const c = S.colorLiterals(t)[0]; return c ? S.srgbToOklab(c.rgb) : null; };
const arms = [...css.matchAll(/--color-peer-(\d)(-ring|-name)?:\s*(#[0-9a-f]{6})/g)].map(m => ({ n: `peer-${m[1]}${m[2]??""}`, hex: m[3], lab: lab(m[3]) }));
const tw = [...theme.matchAll(/--color-([a-z]+-\d+):\s*(oklch\([^)]*\))/g)].map(m => ({ n: m[1], v: m[2], lab: lab(m[2]) }));
const rows = [];
for (const t of tw) { if (!t.lab) continue; for (const a of arms) { const d = Math.hypot(...t.lab.map((v,i)=>v-a.lab[i])); rows.push([d, t.n, t.v, a.n, a.hex]); } }
rows.sort((a,b)=>a[0]-b[0]); for (const r of rows.slice(0,8)) console.log(r[0].toFixed(4), r.slice(1).join(" "));
console.log("tw colours parsed", tw.filter(t=>t.lab).length, "/", tw.length, "arms", arms.length);
