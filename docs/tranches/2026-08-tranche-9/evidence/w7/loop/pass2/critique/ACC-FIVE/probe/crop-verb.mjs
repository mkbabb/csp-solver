/** crop-verb.mjs — read the prototype's OWN cited crop (frame 3) back as bytes: the
 *  destructive verb's painted ink against the paper it sits on. No server needed; the
 *  claim under test is G4's 4.917 / 4.693. */
import sharp from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.mjs";
import { rgbToOklch, srgbToLinear } from "./oklch.COPY.mjs";

const lum = ([r, g, b]) =>
  0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return +((x + 0.05) / (y + 0.05)).toFixed(3);
};

const f =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/prototype/ACC-FIVE/frames/3-confirm-hovered-light-both.png";
const { data, info } = await sharp(f).raw().toBuffer({ resolveWithObject: true });
const ch = info.channels;
const at = (x, y) => {
  const o = (y * info.width + x) * ch;
  return [data[o], data[o + 1], data[o + 2]];
};

const half = Math.floor(info.width / 2);
for (const [name, x0, x1] of [
  ["chromium(left)", 0, half],
  ["webkit(right)", half, info.width],
]) {
  let red = null;
  const freq = new Map();
  for (let y = 0; y < info.height; y++)
    for (let x = x0; x < x1; x++) {
      const rgb = at(x, y);
      freq.set(rgb.join(","), (freq.get(rgb.join(",")) || 0) + 1);
      const o = rgbToOklch(...rgb);
      const d = Math.abs(o.h - 12.5) % 360;
      if (Math.min(d, 360 - d) > 25) continue;
      if (o.C < 0.05) continue;
      if (!red || o.C > red.C) red = { rgb, ...o };
    }
  const paper = [...freq.entries()].sort((a, b) => b[1] - a[1])[0][0].split(",").map(Number);
  console.log(
    name,
    "paper",
    JSON.stringify(paper),
    "reddestInk",
    JSON.stringify(red.rgb),
    "h",
    red.h.toFixed(1),
    "C",
    red.C.toFixed(3),
    "ratio_vs_paper",
    ratio(red.rgb, paper),
  );
}
console.log("EXIT_OK");
