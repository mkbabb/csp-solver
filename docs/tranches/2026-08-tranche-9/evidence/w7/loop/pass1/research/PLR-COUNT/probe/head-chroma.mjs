/** The head band's own chroma (P8's readings, converted). Input is the P8 census in
 *  data/proto2.log; the hues below are what it painted at 390x844 light, chromium. */
const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
function oklch(r, g, b) {
  const R = lin(r / 255), G = lin(g / 255), B = lin(b / 255);
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  const L = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const Bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  let h = (Math.atan2(Bb, A) * 180) / Math.PI; if (h < 0) h += 360;
  return { L: +L.toFixed(3), C: +Math.hypot(A, Bb).toFixed(4), h: +h.toFixed(1) };
}
const HEAD = { c9184a:[201,24,74], ff4d6d:[255,77,109], "8f3a50":[143,58,80], ffb3c6:[255,179,198],
  e88845:[232,136,69], d16a32:[209,106,50], f09855:[240,152,85], f0b030:[240,176,48],
  d99a10:[217,154,16], fde68a:[253,230,138], e5c74d:[229,199,77], fff4aa:[255,244,170] };
const hd = (a, b) => { const d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; };
const rows = Object.entries(HEAD).map(([k, v]) => ({ k, ...oklch(...v) })).sort((a, b) => a.h - b.h);
for (const r of rows) console.log(`  #${r.k}  L=${r.L} C=${r.C} h=${r.h}`);
let n = 0;
for (let i = 0; i < 16; i++) {
  const ph = +((i * 137.5) % 360).toFixed(1);
  for (const r of rows) { const d = hd(ph, r.h); if (d < 12) { console.log(`  peer ${i} (h=${ph}) vs #${r.k} (h=${r.h}): ${d.toFixed(1)}deg`); n++; } }
}
console.log(`  -> ${n} collisions between the first 16 peer inks and the head band`);
