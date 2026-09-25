const sharp = require("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp");
const P = process.argv[2], OUT = process.argv[3];
const cols = [["chromium","light","P1fresh","chromium light · +100 ms"],["chromium","light","P1rest","chromium light · P1 rest (+1.6 s)"],["chromium","light","P2rest","chromium light · P2 rest"],["chromium","dark","P1rest","chromium dark · P1 rest"],["webkit","light","P1fresh","webkit light · +100 ms"],["webkit","light","P1rest","webkit light · P1 rest"],["webkit","dark","P1rest","webkit dark · P1 rest"]];
const arms = ["hold","age","step","tint"];
(async () => {
  const pw = 362, ph = 64, lw = 56, hh = 18, gap = 4;
  const W = lw + cols.length * (pw + gap), H = hh + arms.length * (ph + gap);
  const layers = [];
  for (let c = 0; c < cols.length; c++) for (let r = 0; r < arms.length; r++) {
    const [e, s, p] = cols[c];
    const buf = await sharp(`${P}/${e}-${s}-${p}-${arms[r]}.png`).resize(pw, ph, { fit: "cover", position: "top" }).png().toBuffer();
    layers.push({ input: buf, left: lw + c * (pw + gap), top: hh + r * (ph + gap) });
  }
  const t = (x, y, s, a = "start") => `<text x="${x}" y="${y}" font-family="Helvetica" font-size="12" fill="#111" text-anchor="${a}">${s}</text>`;
  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">${cols.map((c, i) => t(lw + i * (pw + gap) + pw / 2, 13, c[3], "middle")).join("")}${arms.map((a, i) => t(4, hh + i * (ph + gap) + ph / 2 + 4, a.toUpperCase())).join("")}</svg>`;
  layers.push({ input: Buffer.from(svg), left: 0, top: 0 });
  await sharp({ create: { width: W, height: H, channels: 3, background: "#ffffff" } }).composite(layers).png().toFile(OUT);
  console.log("wrote", OUT, W, H);
})();
