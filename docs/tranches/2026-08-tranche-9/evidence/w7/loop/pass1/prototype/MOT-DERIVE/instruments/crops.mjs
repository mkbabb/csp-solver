#!/usr/bin/env node
/**
 * TWO CROPS, and no more (the wave's evidence cap): the dock SETTLED OPEN at 390×844, 700ms
 * after the tap, in chromium and in webkit. What they prove is the REST POSE — a crop cannot
 * carry smoothness, so the smoothness lives in the numbers beside them.
 */
import { chromium, webkit } from "playwright";
import process from "node:process";

const BASE = process.env.BASE ?? "http://127.0.0.1:4248/";
const DIR = process.argv[2];

for (const [name, launcher] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const browser = await launcher.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    hasTouch: true,
    isMobile: name === "chromium",
    colorScheme: "light",
  });
  const page = await ctx.newPage();
  await page.goto(BASE + "?size=3&difficulty=EASY");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 30000 });
  await page.waitForTimeout(1800);
  await page.locator(".drawer-tab").first().click({ force: true });
  await page.waitForTimeout(700); // the sheet SLIDES — settle before measuring it open
  const rect = await page.evaluate(() => {
    const e = document.querySelector(".scene-controls");
    const r = e.getBoundingClientRect();
    return { x: r.left, y: r.top, w: r.width, h: r.height };
  });
  await page.screenshot({
    path: `${DIR}/dock-open-390x844-${name}.png`,
    clip: { x: 0, y: Math.max(0, rect.y - 8), width: 390, height: 300 },
  });
  console.log(`${name} settled-open rect: ${JSON.stringify(rect)}`);
  await browser.close();
}
