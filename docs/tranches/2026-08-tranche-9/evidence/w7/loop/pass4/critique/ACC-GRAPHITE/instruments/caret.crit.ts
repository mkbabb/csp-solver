import { test } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import sharp from "sharp";
import { encodeSudoku } from "../e2e/wire";
const S = process.env.OUTDIR!; mkdirSync(S, { recursive: true });
function solution(size: number, i: number) { const n = size * size, r = Math.floor(i / n), c = i % n; return ((r * size + Math.floor(r / size) + c) % n) + 1; }
const cells: Record<number, number> = {}; for (let i = 0; i < 81; i++) if ((i * 37) % 81 < 30) cells[i] = solution(3, i);
const ENC = encodeSudoku(3, cells, 81);
for (const theme of ["light", "dark"] as const) test(`caret-${theme}`, async ({ browser }, info) => {
  const out: any = {};
  const imgs: any = {};
  for (const [arm, base] of [["tree", "http://127.0.0.1:4245"], ["control", "http://127.0.0.1:4246"]]) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, colorScheme: theme, reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto(`${base}/?board=${ENC}`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector(".logo-caret svg path", { timeout: 60_000 });
    await page.mouse.move(640, 790);
    await page.waitForTimeout(3000);
    const sw = await page.evaluate(() => getComputedStyle(document.querySelector(".logo-caret svg path")!).strokeWidth);
    const buf = await page.locator(".logo-caret").screenshot();
    const { data, info: im } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
    imgs[arm] = { data, w: im.width, h: im.height, ch: im.channels };
    let ink = 0; for (let i = 0; i < im.width * im.height; i++) { const L = 0.2126 * data[i * im.channels] + 0.7152 * data[i * im.channels + 1] + 0.0722 * data[i * im.channels + 2]; if (theme === "light" ? L < 128 : L > 128) ink++; }
    out[arm] = { strokeWidth: sw, size: `${im.width}x${im.height}`, inkPx: ink };
    await ctx.close();
  }
  const a = imgs.tree, b = imgs.control; let diff = 0;
  if (a.w === b.w && a.h === b.h) for (let i = 0; i < a.w * a.h; i++) { let d = 0; for (let c = 0; c < 3; c++) d = Math.max(d, Math.abs(a.data[i * a.ch + c] - b.data[i * b.ch + c])); if (d > 24) diff++; }
  out.diffPx = diff; out.engine = info.project.name; out.theme = theme;
  writeFileSync(`${S}/caret-${info.project.name}-${theme}.json`, JSON.stringify(out));
});
