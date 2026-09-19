/**
 * MRK-WASH pass-1 CRITIQUE — the frame the lane did not shoot.
 *
 * All four of the prototype's cited crops show an EMPTY selected cell. The family's memorable
 * line is "the selected cell is a patch of crayon with a DIGIT written on it" and its contested
 * gate (G-WASH-3) is the digit read through the body. Neither is visible in any banked frame.
 * This types a 5 into the selected cell and crops it, both engines, light and dark.
 */
import { chromium, webkit } from "playwright";
import sharp from "sharp";
import { mkdirSync } from "node:fs";

const BASE = "http://127.0.0.1:4241";
const FR = new URL("../frames/", import.meta.url).pathname;
mkdirSync(FR, { recursive: true });

for (const [engineName, engine, theme] of [
  ["chromium", chromium, "light"],
  ["webkit", webkit, "dark"],
]) {
  const browser = await engine.launch();
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    colorScheme: theme,
    reducedMotion: "reduce",
    deviceScaleFactor: 1,
  });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/?size=3&difficulty=EASY`);
  await page.waitForSelector("path.cell-line", { state: "attached", timeout: 30000 });
  await page.waitForTimeout(1500);
  const rect = await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll(".game-cell input"));
    const i = inputs.findIndex((n, k) => !n.value && k > 20 && k < 60);
    inputs[i].focus();
    const r = document.querySelectorAll(".game-cell")[i].getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  });
  await page.keyboard.press("5");
  await page.waitForTimeout(700);
  const buf = await page.screenshot({ type: "png" });
  const pad = 62;
  await sharp(buf)
    .extract({
      left: Math.max(0, Math.round(rect.x - pad)),
      top: Math.max(0, Math.round(rect.y - pad)),
      width: Math.round(rect.width + pad * 2),
      height: Math.round(rect.height + pad * 2),
    })
    .png({ compressionLevel: 9, palette: true })
    .toFile(`${FR}digit-in-selection-${theme}-${engineName}.png`);
  console.log(`shot digit-in-selection-${theme}-${engineName}.png`);
  await ctx.close();
  await browser.close();
}
