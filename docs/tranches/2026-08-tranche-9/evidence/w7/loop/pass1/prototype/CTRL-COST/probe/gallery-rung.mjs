#!/usr/bin/env node
/**
 * THE ROW-3 DELETION IS NOT LOCAL TO THE CARD. `--type-group-title` is also the GALLERY's
 * staging axis label (`StagingBand.vue` `.section-heading.staging-axis-label`), so dropping
 * the `min-width: 768px` arm re-ranks those names on the phone too. This reads what they
 * measure now, at 390 and at 1280, so the side effect is a number in the record rather than a
 * surprise at the re-look.
 */
import { chromium } from "playwright";
const BASE = process.env.BASE || "http://127.0.0.1:4233";
const browser = await chromium.launch();
for (const [w, h] of [
  [390, 844],
  [1280, 800],
]) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    hasTouch: w < 800,
    isMobile: w < 800,
    baseURL: BASE,
  });
  const page = await ctx.newPage();
  await page.goto("./");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.waitForTimeout(1500);
  console.log(
    `${w}x${h}`,
    JSON.stringify(
      await page.evaluate(() => {
        const cs = getComputedStyle(document.documentElement);
        const axes = Array.from(document.querySelectorAll(".staging-axis-label")).map((e) => ({
          text: e.innerText.trim().slice(0, 14),
          px: +parseFloat(getComputedStyle(e).fontSize).toFixed(2),
          family: getComputedStyle(e).fontFamily.split(",")[0].replace(/["']/g, ""),
        }));
        return {
          groupTitle: cs.getPropertyValue("--type-group-title").trim(),
          heading: cs.getPropertyValue("--type-heading").trim(),
          subheading: cs.getPropertyValue("--type-subheading").trim(),
          axes,
        };
      }),
    ),
  );
  await ctx.close();
}
await browser.close();
