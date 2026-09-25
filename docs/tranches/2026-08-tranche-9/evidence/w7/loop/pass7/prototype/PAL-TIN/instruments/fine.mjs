import { paint, hueOf, lOf, dE, lum, chromaOf } from "./lib.mjs";
const names = ["#ffc1a1","#b2e705","#00edf7","#c4ceff","#ffb4f3"]; const sticks=["#e06600","#799f00","#00a3aa","#747eff","#d64fc8"];
const nm = ["amber","green","teal","violet","pink"];
const minPair = (s) => { let m=9,w=""; for (let i=0;i<5;i++) for (let j=i+1;j<5;j++){const e=dE(s[i],s[j]); if(e<m){m=e;w=`${nm[i]}–${nm[j]}`;}} return [m,w]; };
for (const i of [3,4]) for (let L=0.850; L<=0.8601; L+=0.0005) { const h = paint(+L.toFixed(4), 0.215, hueOf(sticks[i])).hex; const s=names.slice(); s[i]=h; const [m,w]=minPair(s); console.log(nm[i], L.toFixed(4), h, "L", lOf(h).toFixed(4), "C", chromaOf(h).toFixed(3), "Y", lum(h).toFixed(3), "vsGrid", ((lum(h)+0.05)/(0.0772+0.05)).toFixed(3), "min", m.toFixed(4), w, "dh", (hueOf(h)-hueOf(sticks[i])).toFixed(2)); }
