import { oklab, chromaAt, paint, hueOf, chromaOf, lOf, dE, lum } from "./lib.mjs";
const sticks = { light: ["#853900","#455c00","#005f63","#3e32c5","#8b0081"], dark: ["#e06600","#799f00","#00a3aa","#747eff","#d64fc8"] };
const rings = { light: ["#4b1d00","#243200","#003436","#220084","#4f0049"], dark: ["#ff9f6b","#9ecf00","#00d4dd","#a8b5ff","#ff87f0"] };
const names = { light: rings.light, dark: ["#ffc1a1","#b2e705","#00edf7","#c4ceff","#ffb4f3"] };
const nm = ["amber","green","teal","violet","pink"];
const pairs = (set) => { const o=[]; for (let i=0;i<5;i++) for (let j=i+1;j<5;j++) o.push([dE(set[i],set[j]), `${nm[i]}–${nm[j]}`]); return o.sort((a,b)=>a[0]-b[0]); };
for (const [k, S] of Object.entries({sticks, rings, names})) for (const a of ["light","dark"]) { const p = pairs(S[a]); console.log(`${k} ${a}: min ${p[0][0].toFixed(4)} (${p[0][1]}) · ${p.filter(x=>x[0]<0.1).map(x=>`${x[1]} ${x[0].toFixed(4)}`).join(", ")}`); }
for (const a of ["light","dark"]) console.log(a, "name C / stick C:", names[a].map((h,i)=>`${nm[i]} ${chromaOf(h).toFixed(3)}/${chromaOf(sticks[a][i]).toFixed(3)} L ${lOf(h).toFixed(3)} Y ${lum(h).toFixed(3)}`).join(" · "));
// dark: search per-arm L in [0.86, 0.93] (step .005) at stick hue, C = min(0.215, chromaAt); all pairs >= 0.10, minimise total L lift
const hues = sticks.dark.map(hueOf);
const armAt = (i, L) => paint(L, 0.215, hues[i]).hex;
let best = null;
const Ls = []; for (let L = 0.86; L <= 0.9301; L += 0.005) Ls.push(+L.toFixed(3));
for (const Lv of Ls) for (const Lp of Ls) for (const Lg of [0.86]) {
  const set = names.dark.slice(); set[3] = armAt(3, Lv); set[4] = armAt(4, Lp);
  const m = pairs(set)[0][0];
  if (m >= 0.1) { const cost = (Lv-0.86)+(Lp-0.86); if (!best || cost < best.cost) best = { cost, Lv, Lp, m, set }; }
}
console.log("dark lift search (violet,pink only):", JSON.stringify(best));
// also try single-arm moves, any arm, to any L in [0.80,0.95]
for (let i = 0; i < 5; i++) { let b=null; for (let L=0.80; L<=0.951; L+=0.0025) { const set = names.dark.slice(); set[i] = armAt(i, +L.toFixed(4)); const m = pairs(set)[0][0]; if (m>=0.1 && (!b || Math.abs(L-0.86)<Math.abs(b.L-0.86))) b={L:+L.toFixed(4), m:+m.toFixed(4), hex:set[i], Y:+lum(set[i]).toFixed(3)}; } console.log(`dark move ${nm[i]} only:`, JSON.stringify(b)); }
// light: names un-aliased from the ring arm: search a common L in [0.20, 0.42] at which pairwise >=0.10
for (let L = 0.20; L <= 0.4201; L += 0.01) { const set = sticks.light.map((h,i)=>paint(+L.toFixed(2), 0.215, hueOf(h)).hex); const p=pairs(set)[0]; console.log(`light name at common L ${L.toFixed(2)}: min ${p[0].toFixed(4)} (${p[1]}) Y max ${Math.max(...set.map(lum)).toFixed(3)}`); }
