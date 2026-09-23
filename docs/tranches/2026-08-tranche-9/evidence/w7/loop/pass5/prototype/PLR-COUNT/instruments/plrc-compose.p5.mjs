// PASS-5 COPY of pass4's plrc-compose.mjs, unchanged.
// PLR-COUNT pass-4 frame composer: crops side by side on their own ground, a caption under each,
// a title line on top. node plrc-compose.mjs <out.png> "<title>" <bgR,G,B> <fgR,G,B> <label>=<png> ...
import { createRequire } from "node:module";
const sharp = createRequire(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json",
)("sharp");
const [out, title, bg, fg, ...pairs] = process.argv.slice(2);
const [br, bgc, bb] = bg.split(",").map(Number);
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const items = [];
for (const p of pairs) {
  const i = p.indexOf("=");
  const label = p.slice(0, i);
  const file = p.slice(i + 1);
  const m = await sharp(file).metadata();
  items.push({ label, file, w: m.width, h: m.height });
}
const GAP = 24, TOP = 44, CAP = 40, PAD = 16;
const H = Math.max(...items.map((x) => x.h));
const W = PAD * 2 + items.reduce((a, x) => a + x.w, 0) + GAP * (items.length - 1);
const comps = [];
let x = PAD;
let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${TOP + H + CAP}">` +
  `<text x="${PAD}" y="28" font-family="Helvetica, Arial" font-size="20" fill="rgb(${fg})">${esc(title)}</text>`;
for (const it of items) {
  comps.push({ input: it.file, left: x, top: TOP + Math.round((H - it.h) / 2) });
  svg += `<text x="${x}" y="${TOP + H + 28}" font-family="Helvetica, Arial" font-size="18" fill="rgb(${fg})">${esc(it.label)}</text>`;
  x += it.w + GAP;
}
svg += "</svg>";
comps.push({ input: Buffer.from(svg), left: 0, top: 0 });
await sharp({ create: { width: W, height: TOP + H + CAP, channels: 3, background: { r: br, g: bgc, b: bb } } })
  .composite(comps)
  .png({ compressionLevel: 9, palette: true })
  .toFile(out);
const m = await sharp(out).metadata();
console.log(out, m.width, "x", m.height, (await import("node:fs")).statSync(out).size, "B");
