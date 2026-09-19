#!/usr/bin/env node
/** MRK-ABS pass-2 · stitch the four focused chrome crops into ONE composite strip. */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const FR = process.argv[2];
const parts = [
  "chrome-ctrlbtn-light-chromium.png",
  "chrome-tongue-light-chromium.png",
  "chrome-toggle-light-chromium.png",
  "deck-card-light-chromium.png",
];
const H = 360; // device px; every panel scaled to this height
const GAP = 18;

const imgs = [];
for (const p of parts) {
  const f = path.join(FR, p);
  const b = await sharp(f).resize({ height: H, fit: "inside" }).png().toBuffer();
  const m = await sharp(b).metadata();
  imgs.push({ b, w: m.width, h: m.height });
}
const W = imgs.reduce((a, i) => a + i.w, 0) + GAP * (imgs.length + 1);
const canvasH = H + GAP * 2;
let x = GAP;
const layers = imgs.map((i) => {
  const o = { input: i.b, left: x, top: GAP + Math.round((H - i.h) / 2) };
  x += i.w + GAP;
  return o;
});
const out = path.join(FR, "chrome-composite-light-chromium.png");
await sharp({
  create: { width: W, height: canvasH, channels: 3, background: { r: 246, g: 244, b: 241 } },
})
  .composite(layers)
  .png({ compressionLevel: 9 })
  .toFile(out);
for (const p of parts) fs.unlinkSync(path.join(FR, p));
console.log(out, fs.statSync(out).size, W + "x" + canvasH);
