import sharp from "sharp";
const f = process.argv[2], k = +(process.argv[3] ?? 1), paper = +(process.argv[4] ?? 253), ink = +(process.argv[5] ?? 37);
const { data, info } = await sharp(f).raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height, ch = info.channels;
const L = (x, y) => { const i = (y * W + x) * ch; return 0.2126*data[i]+0.7152*data[i+1]+0.0722*data[i+2]; };
const thr = paper - 0.5 * (paper - ink);
const e = 12 * k, span = 14 * k;
const inkp = (v) => v < thr;
// covered width (alpha50, integer px) of the first run from the edge inward; and mass (coverage sum) within span
function scan(get) { let a = -1, b = -1; for (let t = 0; t < span; t++) { if (inkp(get(t))) { if (a < 0) a = t; b = t; } else if (a >= 0) break; } let m = 0; for (let t = 0; t < span; t++) m += Math.max(0, Math.min(1, (paper - get(t)) / (paper - ink))); return { w: a < 0 ? 0 : b - a + 1, m }; }
const sides = { top: [], bottom: [], left: [], right: [] }, mass = { top: [], bottom: [], left: [], right: [] };
for (let x = e + 20 * k; x < W - e - 20 * k; x++) { const t = scan((d) => L(x, e + d)); sides.top.push(t.w / k); mass.top.push(t.m / k); const b = scan((d) => L(x, H - e - 1 - d)); sides.bottom.push(b.w / k); mass.bottom.push(b.m / k); }
for (let y = e + 20 * k; y < H - e - 20 * k; y++) { const l = scan((d) => L(e + d, y)); sides.left.push(l.w / k); mass.left.push(l.m / k); const r = scan((d) => L(W - e - 1 - d, y)); sides.right.push(r.w / k); mass.right.push(r.m / k); }
const q = (a, p) => { const b = [...a].sort((x, y) => x - y); return +b[Math.floor(p * (b.length - 1))].toFixed(2); };
const all = [...sides.top, ...sides.bottom, ...sides.left, ...sides.right], allm = [...mass.top, ...mass.bottom, ...mass.left, ...mass.right];
const out = {};
for (const s of Object.keys(sides)) out[s] = { p5: q(sides[s], .05), med: q(sides[s], .5), p95: q(sides[s], .95), massMed: q(mass[s], .5) };
out.all = { n: all.length, p5: q(all, .05), p25: q(all,.25), med: q(all, .5), p75: q(all,.75), p95: q(all, .95), massMed: q(allm, .5) };
console.log(JSON.stringify(out));
