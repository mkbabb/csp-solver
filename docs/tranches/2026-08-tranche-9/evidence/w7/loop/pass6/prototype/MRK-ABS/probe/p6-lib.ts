// T9-W7 pass 6 · MRK-ABS probe library (scratch; copied to evidence at return).
import { expect, type Page } from "@playwright/test";
export type RGB = number[];
const lin = (c: number) => (c / 255 <= 0.04045 ? c / 255 / 12.92 : Math.pow((c / 255 + 0.055) / 1.055, 2.4));
export const lum = (c: RGB) => 0.2126 * lin(c[0]) + 0.7152 * lin(c[1]) + 0.0722 * lin(c[2]);
export const ratio = (a: RGB, b: RGB) => (Math.max(lum(a), lum(b)) + 0.05) / (Math.min(lum(a), lum(b)) + 0.05);
export const dist = (a: RGB, b: RGB) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]);
export const r3 = (x: number) => Math.round(x * 1000) / 1000;
export const q = (v: number[], p: number) => (v.length ? [...v].sort((x, y) => x - y)[Math.min(v.length - 1, Math.floor(p * v.length))] : NaN);
export function mint(sub: number): string {
  const n = sub * sub;
  let cells = "";
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++) {
      const i = r * n + c;
      const keep = i > 1 && (r * 7 + c * 3) % 5 < 2;
      cells += (keep ? ((r * sub + Math.floor(r / sub) + c) % n) + 1 : 0).toString(36);
    }
  return btoa(String.fromCharCode(1) + `${sub}.${cells}`).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
export const settled = (page: Page) =>
  expect.poll(() => page.evaluate(() => document.getAnimations().filter((a) => a.playState === "running" && a.effect?.getTiming().iterations !== Infinity).length), { timeout: 15000 }).toBe(0);
export async function setTheme(page: Page, want: "light" | "dark") {
  const isDark = () => page.evaluate(() => document.documentElement.classList.contains("dark"));
  if ((await isDark()) !== (want === "dark")) {
    await page.locator("button.sun-moon-toggle").first().focus();
    await page.keyboard.press("Enter");
    await expect.poll(isDark, { timeout: 10000 }).toBe(want === "dark");
  }
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.());
  await settled(page);
}
export async function inject(page: Page, css: string, id: string) {
  await page.evaluate(({ css, id }) => { document.getElementById(id)?.remove(); if (!css) return; const s = document.createElement("style"); s.id = id; s.textContent = css; document.head.appendChild(s); }, { css, id });
}
export const frames2 = (page: Page) => page.evaluate(() => new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r()))));
/** painted bytes, device pixels; lookup in CSS coordinates. */
export async function grab(page: Page, clip: { x: number; y: number; width: number; height: number }, dpr: number) {
  const png = await page.screenshot({ clip, scale: dpr === 1 ? "css" : "device" });
  const W = Math.round(clip.width * dpr), H = Math.round(clip.height * dpr);
  const data: number[] = await page.evaluate(async ({ b64, w, h }) => {
    const img = new Image(); img.src = `data:image/png;base64,${b64}`; await img.decode();
    const c = document.createElement("canvas"); c.width = w; c.height = h; const g = c.getContext("2d")!; g.drawImage(img, 0, 0);
    return Array.from(g.getImageData(0, 0, w, h).data);
  }, { b64: png.toString("base64"), w: W, h: H });
  return (x: number, y: number): RGB | null => {
    const px = Math.floor((x - clip.x) * dpr + (dpr === 1 ? 0.5 : 0)), py = Math.floor((y - clip.y) * dpr + (dpr === 1 ? 0.5 : 0));
    if (px < 0 || py < 0 || px >= W || py >= H) return null;
    const o = (py * W + px) * 4; return [data[o], data[o + 1], data[o + 2]];
  };
}
