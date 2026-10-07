import { registerHooks } from "node:module";
registerHooks({ resolve(s,c,n){ try{return n(s,c)}catch(e){ if(/^\.\.?\//.test(s)) return n(`${s}.ts`,c); throw e } } });
const root = process.argv[2];
const { parseColor, srgbToOklab } = await import(root + "/scripts/shape-census.mjs");
const { inkFor } = await import(root + "/src/games/shared/playerIdentity.ts");
const lab=(L,C,h)=>{const c=parseColor(`oklch(${L} ${C} ${h})`);return srgbToOklab(c.rgb.map(v=>Math.round(v*255)/255));};
const parts=s=>{const m=/oklch\(var\([^)]+\)\s+([\d.]+)\s+([\d.]+)deg\)/.exec(s);return m?{C:+m[1],h:+m[2]}:null};
for (const [arm,L] of [["light",0.295],["dark",0.86]]) {
  const N=8; const P=[...Array(N)].map((_,i)=>{const p=parts(inkFor(i)["--color-peer-name-ink"]);return lab(L,p.C,p.h)});
  const rows=[]; let under=0, tot=0;
  for(let i=0;i<N;i++)for(let j=i+1;j<N;j++){const d=Math.hypot(...P[i].map((v,k)=>v-P[j][k]));tot++; if(d<0.1)under++; rows.push(`${i}-${j}:${d.toFixed(4)}`);}
  console.log(arm, `pairs<0.10 among hands 0..${N-1}: ${under}/${tot}`); console.log(rows.join(" "));
}
