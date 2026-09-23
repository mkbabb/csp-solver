// critic: the dark trio's feasible window, searched at the landed ink's own OKLCH hue/chroma direction
const lin = (c) => ((c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const Y = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const cr = (a, b) => { const [x, y] = [Y(a), Y(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const G = { light: { line: [49, 49, 49], paper: [253, 253, 252], border: [230, 230, 228] }, dark: { line: [199, 197, 190], paper: [19, 18, 17], border: [42, 40, 39] } };
const row = (s, h) => { const c = hex(h); const g = G[s]; return `${s} ${h} Y ${Y(c).toFixed(4)} line ${cr(c, g.line).toFixed(3)} paper ${cr(c, g.paper).toFixed(3)} border ${cr(c, g.border).toFixed(3)}`; };
console.log(row("light", "#a27803")); console.log(row("light", "#a87e13")); console.log(row("dark", "#79650f")); console.log(row("dark", "#756106"));
// oklch helpers
const toLin = (x) => x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055;
function oklch2rgb(L, C, h) { const a = C * Math.cos(h * Math.PI / 180), b = C * Math.sin(h * Math.PI / 180);
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b, m_ = L - 0.1055613458 * a - 0.0638541728 * b, s_ = L - 0.0894841775 * a - 1.291485548 * b;
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
  const R = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, Gg = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, B = -0.0041960863 * l - 0.7034186168 * m + 1.707614701 * s;
  return [R, Gg, B].map((v) => Math.round(Math.max(0, Math.min(1, toLin(v))) * 255)); }
// dark: hue 94.5, chroma 0.100 (the landed ink's own); walk L, keep line & paper >= 3.05, maximise border
let best = null;
for (let L = 0.40; L <= 0.70; L += 0.001) { const c = oklch2rgb(L, 0.100, 94.5); const g = G.dark;
  const [li, pa, bo] = [cr(c, g.line), cr(c, g.paper), cr(c, g.border)];
  if (li >= 3.05 && pa >= 3.05 && (!best || bo > best.bo)) best = { L: L.toFixed(3), hex: '#' + c.map((v) => v.toString(16).padStart(2, '0')).join(''), li: li.toFixed(3), pa: pa.toFixed(3), bo: bo.toFixed(3) }; }
console.log("dark best border at line/paper >= 3.05, h 94.5 C .100:", JSON.stringify(best));
