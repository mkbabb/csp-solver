const gam = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
function rgb(L, C, h) {
  const a = C * Math.cos(h * Math.PI / 180), b = C * Math.sin(h * Math.PI / 180);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b, m_ = L - 0.1055613458 * a - 0.0638541728 * b, s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
  return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s];
}
const ok = (v) => v.every((c) => c >= -1e-4 && c <= 1 + 1e-4);
function hexAt(L, h) { let lo = 0, hi = 0.4; for (let i = 0; i < 40; i++) { const mid = (lo + hi) / 2; ok(rgb(L, mid, h)) ? (lo = mid) : (hi = mid); } const C = Math.min(0.215, lo); return "#" + rgb(L, C, h).map((c) => Math.round(Math.max(0, Math.min(1, gam(c))) * 255).toString(16).padStart(2, "0")).join(""); }
const hues = [48.2, 124.8, 198.9, 276.2, 332.1];
for (const L of [0.295, 0.32, 0.775, 0.79]) console.log(L, hues.map((h) => hexAt(L, h)).join(" "));
