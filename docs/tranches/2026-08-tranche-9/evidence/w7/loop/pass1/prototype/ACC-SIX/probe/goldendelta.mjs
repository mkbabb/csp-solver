import { chromium } from "playwright";
import sharp from "sharp";
import { readFileSync } from "node:fs";

const ROOT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_e58b4764-0fc-41/web/frontend";
const BASE = process.env.BASE || "http://127.0.0.1:4242";

const ratio = async (buf, goldenPath) => {
  const a = await sharp(buf).raw().ensureAlpha().toBuffer({ resolveWithObject: true });
  const b = await sharp(readFileSync(goldenPath))
    .raw()
    .ensureAlpha()
    .toBuffer({ resolveWithObject: true });
  if (a.info.width !== b.info.width || a.info.height !== b.info.height)
    return { size: [a.info.width, a.info.height, b.info.width, b.info.height], ratio: null };
  let diff = 0;
  for (let i = 0; i < a.data.length; i += 4) {
    const d =
      Math.abs(a.data[i] - b.data[i]) +
      Math.abs(a.data[i + 1] - b.data[i + 1]) +
      Math.abs(a.data[i + 2] - b.data[i + 2]);
    if (d > 30) diff++;
  }
  const n = a.info.width * a.info.height;
  return { size: [a.info.width, a.info.height], diff, ratio: +(diff / n).toFixed(4) };
};

const b = await chromium.launch({ args: ["--force-color-profile=srgb"] });
const page = await b.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 });
await page.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
await page.goto(BASE + "/");
await page.waitForSelector("svg.handwritten-logo");
await page.waitForSelector("image.boil-frame-bitmap.is-active");
await page.waitForSelector("image.logo-pose-bmp.is-active");
await page.waitForTimeout(1500);

const bb = await page.locator(".board-wrapper").boundingBox();
const corner = await page.screenshot({ clip: { x: bb.x, y: bb.y, width: 180, height: 180 } });
console.log("grid-corner", JSON.stringify(await ratio(corner, ROOT + "/e2e/goldens/grid-corner-light-darwin.png")));

const cell = await page.locator(".sudoku-cell").first().screenshot();
console.log("cell", JSON.stringify(await ratio(cell, ROOT + "/e2e/goldens/cell-light-darwin.png")));

const logo = await page.locator("svg.handwritten-logo").screenshot();
console.log("logo(informational, crop differs)", JSON.stringify(await ratio(logo, ROOT + "/e2e/goldens/logo-light-darwin.png")));

await b.close();
