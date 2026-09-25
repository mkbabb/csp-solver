import { dE, chromaOf } from "./lib.mjs";
const T = { light: { stick: ["#853900","#455c00","#005f63","#3e32c5","#8b0081"], ring: ["#4b1d00","#243200","#003436","#220084","#4f0049"] }, dark: { stick: ["#e06600","#799f00","#00a3aa","#747eff","#d64fc8"], ring: ["#ff9f6b","#9ecf00","#00d4dd","#a8b5ff","#ff87f0"], name: ["#ffc1a1","#b2e705","#00edf7","#c4ceff","#ffb2f3"] } };
T.light.name = T.light.ring;
for (const a of ["light","dark"]) for (const k of ["stick","ring","name"]) {
  const s = T[a][k]; const out = [];
  for (let N = 2; N <= 6; N++) { let m = Infinity; for (let i=0;i<N;i++) for (let j=i+1;j<N;j++) m = Math.min(m, dE(s[i%5], s[j%5])); out.push(`N=${N} ${m.toFixed(4)}`); }
  console.log(`${a} ${k}: ${out.join(" · ")} · chroma ${s.map(chromaOf).map(c=>c.toFixed(3)).join("/")}`);
}
