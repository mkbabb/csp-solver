#!/usr/bin/env node
/** Rest-state pixel delta between two crops: fraction of pixels whose max channel delta
 *  exceeds a threshold, plus the worst channel delta seen. A family that claims zero rest
 *  pixels owes this number, not an md5 (the boil's feTurbulence rasterizes with a few LSB
 *  of run-to-run noise, which moves the hash without moving the design). */
import sharp from "sharp";
import process from "node:process";

const [a, b] = process.argv.slice(2);
const A = await sharp(a).raw().ensureAlpha().toBuffer({ resolveWithObject: true });
const B = await sharp(b).raw().ensureAlpha().toBuffer({ resolveWithObject: true });
if (A.info.width !== B.info.width || A.info.height !== B.info.height) {
  console.log(`SIZE MISMATCH ${A.info.width}x${A.info.height} vs ${B.info.width}x${B.info.height}`);
  process.exit(1);
}
let over2 = 0,
  over8 = 0,
  worst = 0;
const n = A.data.length / 4;
for (let i = 0; i < A.data.length; i += 4) {
  const d = Math.max(
    Math.abs(A.data[i] - B.data[i]),
    Math.abs(A.data[i + 1] - B.data[i + 1]),
    Math.abs(A.data[i + 2] - B.data[i + 2]),
  );
  if (d > worst) worst = d;
  if (d > 2) over2++;
  if (d > 8) over8++;
}
console.log(
  `${A.info.width}x${A.info.height}  worstChannelDelta=${worst}  px>2=${over2} (${((over2 / n) * 100).toFixed(4)}%)  px>8=${over8} (${((over8 / n) * 100).toFixed(4)}%)`,
);
