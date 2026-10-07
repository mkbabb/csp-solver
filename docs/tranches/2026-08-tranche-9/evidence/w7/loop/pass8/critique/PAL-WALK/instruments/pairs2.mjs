import { registerHooks } from "node:module";
registerHooks({ resolve(s,c,n){ try{return n(s,c)}catch(e){ if(/^\.\.?\//.test(s)) return n(`${s}.ts`,c); throw e } } });
const root = process.argv[2];
const { parseColor, srgbToOklab } = await import(root + "/scripts/shape-census.mjs");
const { inkFor } = await import(root + "/src/games/shared/playerIdentity.ts");
const lab=(L,C,h)=>{const c=parseColor(`oklch(${L} ${C} ${h})`);return srgbToOklab(c.rgb.map(v=>Math.round(v*255)/255));};
const parts=s=>{const m=/oklch\(var\([^)]+\)\s+([\d.]+)\s+([\d.]+)deg\)/.exec(s);return {C:+m[1],h:+m[2]}};
for (const N of [4,8,16]) for (const [arm,Lw,Lh] of [["light",0.295,0.5],["dark",0.86,0.8]]) {
  const W=[...Array(N)].map((_,i)=>{const p=parts(inkFor(i)["--color-peer-name-ink"]);return lab(Lw,p.C,p.h)});
  const H=[...Array(N)].map((_,i)=>lab(Lh,0.11,(i*137.5)%360));
  const cnt=(P)=>{let u=0,t=0,mn=9,at='';for(let i=0;i<N;i++)for(let j=i+1;j<N;j++){const d=Math.hypot(...P[i].map((v,k)=>v-P[j][k]));t++;if(d<0.1)u++;if(d<mn){mn=d;at=`${i}-${j}`}}return `${u}/${t} under 0.10 (min ${mn.toFixed(4)} ${at})`};
  console.log(`hands 0..${N-1} ${arm}: walk name ${cnt(W)} · HEAD ${cnt(H)}`);
}
