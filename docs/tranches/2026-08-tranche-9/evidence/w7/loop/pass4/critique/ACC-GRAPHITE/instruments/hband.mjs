import sharp from "sharp";
const [f, k, col, row] = [process.argv[2], +process.argv[3], +process.argv[4], +process.argv[5]];
const { data, info } = await sharp(f).raw().toBuffer({ resolveWithObject: true });
const W = info.width, ch = info.channels; const L = (x, y) => { const i = (y * W + x) * ch; return 0.2126*data[i]+0.7152*data[i+1]+0.0722*data[i+2]; };
const paper = 253, ink = 37, thr = 145; const e = 12 * k, pitch = (W - 2 * e) / 9;
const cov = (v) => Math.max(0, Math.min(1, (paper - v) / (paper - ink)));
function run(y, x0, dir, reach) { // first ink run starting within reach from x0 in dir
  let s = -1; for (let t = 0; t < reach; t++) { const x = x0 + dir * t; if (L(x, y) < thr) { s = x; break; } } if (s < 0) return null;
  let a = s, b = s; while (L(a - 1, y) < thr) a--; while (L(b + 1, y) < thr) b++;
  const sub = (i, j) => i + (thr - L(i, y)) / (L(j, y) - L(i, y)) * (j - i);
  const left = sub(a - 1, a), right = sub(b, b + 1); let m = 0; for (let x = a - 3; x <= b + 3; x++) m += cov(L(x, y)); return { w: right - left, m };
}
const y0 = Math.round(e + (row + 0.3) * pitch), y1 = Math.round(e + (row + 0.7) * pitch);
const R = { fl: [], fr: [], bl: [], br: [], mfl: [], mfr: [], mbl: [], mbr: [] };
for (let y = y0; y < y1; y++) {
  const fl = run(y, e, 1, 6 * k), fr = run(y, W - e - 1, -1, 6 * k);
  const bl = run(y, Math.round(e + col * pitch + 2 * k), 1, 8 * k), br = run(y, Math.round(e + (col + 1) * pitch - 2 * k), -1, 8 * k);
  if (fl && fr && bl && br) { R.fl.push(fl.w); R.fr.push(fr.w); R.bl.push(bl.w); R.br.push(br.w); R.mfl.push(fl.m); R.mfr.push(fr.m); R.mbl.push(bl.m); R.mbr.push(br.m); }
}
const med = (a) => { const b = [...a].sort((x, y) => x - y); return b[b.length >> 1]; };
const o = {}; for (const [kk, v] of Object.entries(R)) o[kk] = +(med(v) / k).toFixed(3);
o.n = R.fl.length; o.ratioA50 = +(((o.bl + o.br) / 2) / ((o.fl + o.fr) / 2)).toFixed(3); o.ratioMass = +(((o.mbl + o.mbr) / 2) / ((o.mfl + o.mfr) / 2)).toFixed(3);
console.log(JSON.stringify(o));
