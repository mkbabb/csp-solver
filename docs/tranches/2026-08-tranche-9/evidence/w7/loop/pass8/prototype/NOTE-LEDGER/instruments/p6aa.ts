/** COPIED from pass6/prototype/NOTE-ERASE/probe/p6-aa.probe.ts (the pass-6 GLYPH-TEXT statistic: core median over
 *  coverage >= 0.5, the fraction under 4.5), unchanged but for the exports. OUT re-pointed by the caller. */
import { expect, type Page } from "@playwright/test";
import sharp from "sharp";
type Raw = { data: Buffer; w: number; h: number; ch: number };
const raw = async (b: Buffer): Promise<Raw> => {
  const { data, info } = await sharp(b).raw().toBuffer({ resolveWithObject: true });
  return { data, w: info.width, h: info.height, ch: info.channels };
};
const lin = (v: number) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const lum = (r: number, g: number, b: number) => 0.2126 * lin(r / 255) + 0.7152 * lin(g / 255) + 0.0722 * lin(b / 255);
const ratio = (a: number, b: number) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

export async function glyphText(page: Page) {
  const ink = page.locator(".margin-note-ink").first();
  const box = await ink.evaluate((el) => {
    const r = document.createRange();
    r.selectNodeContents(el);
    const b = r.getBoundingClientRect();
    return { x: b.x, y: b.y, width: b.width, height: b.height };
  });
  const clip = { x: Math.floor(box.x) - 1, y: Math.floor(box.y) - 1, width: Math.ceil(box.width) + 3, height: Math.ceil(box.height) + 3 };
  const spec = await ink.evaluate((el) => getComputedStyle(el).color);
  const age = await ink.evaluate((el) => el.getAttribute("data-note-age"));
  const A = await raw(await page.screenshot({ clip }));
  const A2 = await raw(await page.screenshot({ clip }));
  await ink.evaluate((el) => {
    (el as HTMLElement).style.setProperty("transition", "none", "important");
    (el as HTMLElement).style.setProperty("color", "transparent", "important");
  });
  await expect.poll(() => ink.evaluate((el) => getComputedStyle(el).color)).toBe("rgba(0, 0, 0, 0)");
  const B = await raw(await page.screenshot({ clip }));
  const B2 = await raw(await page.screenshot({ clip }));
  await ink.evaluate((el) => (el as HTMLElement).style.removeProperty("color"));
  await expect.poll(() => ink.evaluate((el) => getComputedStyle(el).color)).toBe(spec);
  await ink.evaluate((el) => (el as HTMLElement).style.removeProperty("transition"));
  const rgba = await page.evaluate((css) => {
    const c = document.createElement("canvas");
    c.width = c.height = 1;
    const g = c.getContext("2d", { willReadFrequently: true })!;
    g.fillStyle = css;
    g.fillRect(0, 0, 1, 1);
    return Array.from(g.getImageData(0, 0, 1, 1).data);
  }, spec);
  const a = rgba[3] / 255;
  let noise = 0;
  const pop: { cov: number; r: number }[] = [];
  for (let k = 0; k < A.data.length; k += A.ch) {
    const n1 = Math.abs(A.data[k] - A2.data[k]) + Math.abs(A.data[k + 1] - A2.data[k + 1]) + Math.abs(A.data[k + 2] - A2.data[k + 2]);
    const n2 = Math.abs(B.data[k] - B2.data[k]) + Math.abs(B.data[k + 1] - B2.data[k + 1]) + Math.abs(B.data[k + 2] - B2.data[k + 2]);
    if (n1 > 8 || n2 > 8) { noise++; continue; }
    const g = [B.data[k], B.data[k + 1], B.data[k + 2]];
    const full = [0, 1, 2].map((i) => a * rgba[i] + (1 - a) * g[i]);
    const dFull = Math.abs(full[0] - g[0]) + Math.abs(full[1] - g[1]) + Math.abs(full[2] - g[2]);
    const d = Math.abs(A.data[k] - g[0]) + Math.abs(A.data[k + 1] - g[1]) + Math.abs(A.data[k + 2] - g[2]);
    if (dFull < 12 || d < 6) continue;
    pop.push({ cov: Math.min(1, d / dFull), r: ratio(lum(A.data[k], A.data[k + 1], A.data[k + 2]), lum(g[0], g[1], g[2])) });
  }
  const at = (f: number) => {
    const r = pop.filter((p) => p.cov >= f).map((p) => p.r).sort((u, v) => u - v);
    return { n: r.length, median: r.length ? +r[r.length >> 1].toFixed(3) : null, under45: r.filter((v) => v < 4.5).length, fraction: r.length ? +(r.filter((v) => v < 4.5).length / r.length).toFixed(3) : null, min: r.length ? +r[0].toFixed(3) : null };
  };
  return { age, spec, devicePx: [A.w, A.h], glyphPx: pop.length, noise, gate: at(0.5), sens: { "0.5": at(0.5), "0.7": at(0.7), "0.9": at(0.9) } };
}

export async function settle(page: Page) {
  await expect.poll(() => page.evaluate(() => document.querySelector(".margin-note-ink")?.getAttribute("data-note-age")), { timeout: 5000 }).toBe("settled");
  let prev = "";
  for (let i = 0; i < 40; i++) {
    const c = await page.evaluate(() => getComputedStyle(document.querySelector(".margin-note-ink")!).color);
    if (c === prev) break;
    prev = c;
    await page.waitForTimeout(100);
  }
}

