// PLR-PLACE pass 4 · compose chromium | webkit side by side into one ≤150 KB crop per frame.
import sharp from "sharp";
import fs from "node:fs";
const SH = new URL("./shots/", import.meta.url).pathname;
const OUT = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass4/prototype/PLR-PLACE/frames/";
fs.mkdirSync(OUT, { recursive: true });
const frames = [
  ["chart-664", "1-kill-664-chart-arm-coarse-light.png"],
  ["list-664", "4-kill-664-list-arm-coarse-light.png"],
  ["query", "2-query-at-four-desk-fine-light.png"],
  ["cold", "3-cold-press-first-frame-desk-fine-light.png"],
];
for (const [k, name] of frames) {
  const a = `${SH}${k}-chromium.png`, b = `${SH}${k}-webkit.png`;
  if (!fs.existsSync(a) || !fs.existsSync(b)) { console.log(`skip ${k}`); continue; }
  const [ma, mb] = await Promise.all([sharp(a).metadata(), sharp(b).metadata()]);
  const gap = 8, w = ma.width + mb.width + gap, h = Math.max(ma.height, mb.height);
  const buf = await sharp({ create: { width: w, height: h, channels: 3, background: "#808080" } })
    .composite([{ input: a, left: 0, top: 0 }, { input: b, left: ma.width + gap, top: 0 }])
    .png({ palette: true, quality: 80, compressionLevel: 9 })
    .toBuffer();
  fs.writeFileSync(OUT + name, buf);
  console.log(`${name} ${w}x${h} ${buf.length} B`);
}
