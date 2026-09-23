import { test } from "@playwright/test";
import sharp from "sharp";
import { PAYLOAD } from "./board";
test("plant K paint", async ({ browser }, info) => {
  for (const [n, url] of [["tree", "http://127.0.0.1:4240"], ["plantK", "http://127.0.0.1:4242"]]) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto(`${url}/?game=sudoku&board=${PAYLOAD}`, { waitUntil: "networkidle" }); await page.waitForTimeout(4000);
    const buf = await page.locator(".board-peek-host .hand-drawn-grid").first().screenshot();
    const { data } = await sharp(buf).removeAlpha().raw().toBuffer({ resolveWithObject: true });
    let dark = 0; for (let i = 0; i < data.length; i += 3) if ((data[i] + data[i + 1] + data[i + 2]) / 3 < 100) dark++;
    const inline = await page.evaluate(() => document.querySelector<HTMLElement>(".grid-ink .boil-frame-bitmap")?.style.getPropertyValue("mask-image").slice(0, 12));
    console.log(`PLANTK[${info.project.name}·${n}] darkPx% ${(100 * dark / (data.length / 3)).toFixed(1)} inlineMask ${inline}`);
    await ctx.close();
  }
});
