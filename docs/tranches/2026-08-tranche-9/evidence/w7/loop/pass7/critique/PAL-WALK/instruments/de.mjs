const tree = await import(process.argv[2]);
const head = process.argv[3] ? await import(process.argv[3]) : null;
const lin = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const gam = (v) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);
function bytes(L, C, h) {
  const r = (h * Math.PI) / 180, a = C * Math.cos(r), b = C * Math.sin(r);
  const x = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3, y = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3, z = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [4.0767416621 * x - 3.3077115913 * y + 0.2309699292 * z, -1.2684380046 * x + 2.6097574011 * y - 0.3413193965 * z, -0.0041960863 * x - 0.7034186147 * y + 1.707614701 * z].map((v) => Math.round(255 * gam(Math.min(1, Math.max(0, v)))));
}
function lab([R, G, B]) {
  const [r, g, b] = [R, G, B].map((v) => lin(v / 255));
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b), m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b), s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
}
const parse = (s) => { const m = /oklch\((?:var\((--[\w-]+)\)|([\d.]+))\s+([\d.]+)\s+([\d.]+)(?:deg)?\)/.exec(s); return { v: m[1], L: m[2] ? +m[2] : null, C: +m[3], h: +m[4] }; };
const minDE = (cols, N) => { let mn = Infinity; for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) { const [p, q] = [lab(cols[i]), lab(cols[j])]; mn = Math.min(mn, Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2])); } return mn; };
const Ns = [2, 3, 4, 5, 8, 16];
const bands = { "--color-user-ink": [0.44, 0.65], "--color-peer-cursor-ink": [0.295, 0.79], "--color-peer-name-ink": [0.295, 0.86] };
for (const [key, [d, n]] of Object.entries(bands)) for (const L of [d, n]) {
  const cols = [...Array(16).keys()].map((i) => { const p = parse(tree.inkFor(i)[key]); return bytes(L, p.C, p.h); });
  console.log(`${key} L ${L}: ` + Ns.map((N) => `N${N} ${minDE(cols, N).toFixed(4)}`).join(" "));
}
let lower = 0, worst = 1, wi = -1, first8 = [];
for (let i = 0; i < 144; i++) { const n = parse(tree.inkFor(i)["--color-peer-name-ink"]).C, r = parse(tree.inkFor(i)["--color-peer-cursor-ink"]).C; if (n < r - 1e-9) { lower++; if (i < 16) first8.push(i); if (n / r < worst) { worst = n / r; wi = i; } } }
console.log(`name chroma < ring for ${lower}/144, worst ratio ${worst.toFixed(3)} at i=${wi}; among first 16 hands: [${first8}]`);
if (head) for (const L of [0.5, 0.8]) { const cols = [...Array(16).keys()].map((i) => { const s = Object.values(head.inkFor(i))[0]; const p = parse(s); return bytes(L, p.C, p.h); }); console.log(`HEAD L ${L}: ` + Ns.map((N) => `N${N} ${minDE(cols, N).toFixed(4)}`).join(" ") + ` sample ${Object.values(head.inkFor(1))[0]}`); }
