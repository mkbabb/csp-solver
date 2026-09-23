import { registerHooks } from "node:module";
registerHooks({ resolve(s, c, n) { try { return n(s, c); } catch (e) { if (/^\.\.?\//.test(s)) return n(`${s}.ts`, c); throw e; } } });
const m = await import(process.argv[2] + "/src/games/shared/playerIdentity.ts");
const lin = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const lab = ([R, G, B]) => { const [r, g, b] = [R, G, B].map((v) => lin(v / 255)); const l = Math.cbrt(0.4122214708*r+0.5363325363*g+0.0514459929*b), mm = Math.cbrt(0.2119034982*r+0.6806995451*g+0.1073969566*b), q = Math.cbrt(0.0883024619*r+0.2817188376*g+0.6299787005*b); return [0.2104542553*l+0.793617785*mm-0.0040720468*q, 1.9779984951*l-2.428592205*mm+0.4505937099*q, 0.0259040371*l+0.7827717662*mm-0.808675766*q]; };
const bytes = (L, C, h) => { const a = C*Math.cos(h*Math.PI/180), b = C*Math.sin(h*Math.PI/180); const x=(L+0.3963377774*a+0.2158037573*b)**3, y=(L-0.1055613458*a-0.0638541728*b)**3, z=(L-0.0894841775*a-1.291485548*b)**3; const g=(c)=>c<=0.0031308?12.92*c:1.055*c**(1/2.4)-0.055; return [4.0767416621*x-3.3077115913*y+0.2309699292*z,-1.2684380046*x+2.6097574011*y-0.3413193965*z,-0.0041960863*x-0.7034186147*y+1.707614701*z].map(v=>Math.round(g(Math.min(1,Math.max(0,v)))*255)); };
const W = [];
for (const [k, bands] of [["--color-user-ink", m.DIGIT_BANDS], ["--color-peer-cursor-ink", m.RING_BANDS]]) for (const L of bands) for (let i = 0; i < 144; i++) { const r = /oklch\(var\([^)]+\)\s+([\d.]+)\s+([\d.]+)deg\)/.exec(m.inkFor(i)[k]); W.push(lab(bytes(L, +r[1], +r[2]))); }
let caught = 0, best = 9; const per = [];
for (const w of W) { let bw = 9; for (let r = 0; r < 16; r++) for (let g = 0; g < 16; g++) for (let b = 0; b < 16; b++) { const q = lab([r*17, g*17, b*17]); const d = Math.hypot(w[0]-q[0], w[1]-q[1], w[2]-q[2]); if (d < bw) bw = d; } per.push(bw); if (bw < 0.02) caught++; best = Math.min(best, bw); }
per.sort((a, b) => a - b);
console.log(`3-digit hex: ${caught}/${W.length} walked inks have a 3-digit neighbour within ΔE 0.02; nearest ${best.toFixed(4)}; median nearest ${per[per.length >> 1].toFixed(4)}; worst ${per[per.length-1].toFixed(4)}`);
