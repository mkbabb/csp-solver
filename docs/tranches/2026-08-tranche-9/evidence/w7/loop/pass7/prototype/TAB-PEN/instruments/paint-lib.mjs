// paint-lib.mjs — the painted-byte reads the pass-7 paint probes share (T9-W7 pass 7, chair's instruments).
// ONE copy: `edge-bands.mjs` (four bands, §2.9) and `glyph-pop.mjs` (the glyph population, §2.9) import it.
// Photographs are DEVICE-scaled (`scale: 'device'`: a DPR 2 read is read at DPR 2's pixels) PNGs decoded by sharp to RGB; luminance is WCAG 2.x relative
// luminance; a contrast is (Lhi + 0.05) / (Llo + 0.05). A photograph of the subject ON and of the subject
// with its paint OFF (the edge hidden / the text transparent) are compared PIXEL FOR PIXEL: the OFF photo is
// the painted ground under each pixel, so no ground is guessed and no crop maximum keys anything.
import { createRequire } from "node:module";
const require = createRequire(process.env.FE_PKG ?? "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const sharp = require("sharp");

export async function rgb(png) {
  const { data, info } = await sharp(png).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height };
}
const lin = (v) => ((v /= 255) <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
export const lum = (d, i) => 0.2126 * lin(d[i]) + 0.7152 * lin(d[i + 1]) + 0.0722 * lin(d[i + 2]);
export const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
export const median = (a) => { if (!a.length) return 0; const s = [...a].sort((p, q) => p - q); return s[s.length >> 1]; };
export const maxDelta = (d1, d2, i) => Math.max(Math.abs(d1[i] - d2[i]), Math.abs(d1[i + 1] - d2[i + 1]), Math.abs(d1[i + 2] - d2[i + 2]));

/** Photograph `clip` twice: as is, then with `offCss` injected (removed after). Returns decoded pair. */
export async function onOff(page, clip, offCss) {
  const on = await page.screenshot({ clip, scale: "device", animations: "disabled" });
  const tag = await page.addStyleTag({ content: offCss });
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  const off = await page.screenshot({ clip, scale: "device", animations: "disabled" });
  await tag.evaluate((e) => e.remove());
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  return { on: await rgb(on), off: await rgb(off) };
}
