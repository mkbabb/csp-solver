const t = await import(process.argv[2]);
const lin = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const gam = (v) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);
function bytes(L, C, h) { const r = (h * Math.PI) / 180, a = C * Math.cos(r), b = C * Math.sin(r);
  const x = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3, y = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3, z = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [4.0767416621 * x - 3.3077115913 * y + 0.2309699292 * z, -1.2684380046 * x + 2.6097574011 * y - 0.3413193965 * z, -0.0041960863 * x - 0.7034186147 * y + 1.707614701 * z].map((v) => Math.round(255 * gam(Math.min(1, Math.max(0, v))))); }
const Y = ([r, g, b]) => 0.2126 * lin(r / 255) + 0.7152 * lin(g / 255) + 0.0722 * lin(b / 255);
const cr = (p, q) => { const [a, b] = [Y(p), Y(q)]; return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05); };
const paper = { light: [239, 239, 239], dark: [65, 62, 60] };
const one = (i, L, th, key) => { const m = /([\d.]+)\s+([\d.]+)deg/.exec(t.inkFor(i)[key]); return cr(bytes(L, +m[1], +m[2]), paper[th]).toFixed(3); };
const rank = (i, L, th, key) => { const v = [...Array(144).keys()].map((j) => +one(j, L, th, key)).sort((a, b) => a - b); return v.indexOf(+one(i, L, th, key)); };
for (const i of [0, 1, 13, 14]) console.log(`i=${i} dark name ${one(i, 0.86, "dark", "--color-peer-name-ink")} (rank ${rank(i, 0.86, "dark", "--color-peer-name-ink")}/143) light name ${one(i, 0.295, "light", "--color-peer-name-ink")} (rank ${rank(i, 0.295, "light", "--color-peer-name-ink")}/143)`);
for (const [th, L, key] of [["light", 0.295, "--color-peer-name-ink"], ["dark", 0.86, "--color-peer-name-ink"], ["dark", 0.79, "--color-peer-cursor-ink"]]) {
  let mn = 99, mi = -1, mx = 0; for (let i = 0; i < 144; i++) { const m = /([\d.]+)\s+([\d.]+)deg/.exec(t.inkFor(i)[key]); const c = cr(bytes(L, +m[1], +m[2]), paper[th]); if (c < mn) { mn = c; mi = i; } mx = Math.max(mx, c); }
  console.log(`${th} ${key} L ${L}: spec-vs-paper min ${mn.toFixed(3)} (i=${mi}) max ${mx.toFixed(3)} over 144`);
}
