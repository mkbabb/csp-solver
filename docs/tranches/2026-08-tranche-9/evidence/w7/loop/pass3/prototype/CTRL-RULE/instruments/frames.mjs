// T9-W7 pass 3 · CTRL-RULE — THE THREE CROPS. Numbers first; these are the three poses a
// number cannot say. Each ≤150 KB, each cited in the README.
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const NM =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/";
const { chromium } = await import(NM + "playwright/index.mjs");
const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "..", "frames");
mkdirSync(OUT, { recursive: true });
const BASE = process.argv[2] || "http://127.0.0.1:4231/";

const boot = async (ctx, theme) => {
  await ctx.addInitScript((t) => {
    try {
      localStorage.clear();
      localStorage.setItem("sudoku-color-scheme", t);
    } catch {}
  }, theme);
  const page = await ctx.newPage();
  await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 40000 });
  await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await page.waitForTimeout(1600);
  if (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
    await page.locator(".drawer-tab").first().click({ force: true });
    await page.waitForTimeout(950); // the sheet SLIDES
  }
  await page.waitForTimeout(400);
  return page;
};

const browser = await chromium.launch();

// 1 · 1280×800 light, the rail at half scroll — `level` pinned in the margin at the card's own
//     inset with its field under the eye, and `size` gone with its row.
{
  const ctx = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
    colorScheme: "light",
  });
  const page = await boot(ctx, "light");
  const box = await page.evaluate(() => {
    const c = document.querySelector(".controls-card");
    c.scrollTop = Math.round((c.scrollHeight - c.clientHeight) * 0.5);
    const r = c.getBoundingClientRect();
    return { x: Math.round(r.x) - 4, y: Math.round(r.y) - 4, width: Math.round(r.width) + 8, height: Math.min(360, Math.round(r.height)) };
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: join(OUT, "1-rail-1280-light-pinned.png"), clip: box });
  await ctx.close();
}

// 2 · 390×844 dark, the sheet up and the confirm ARMED — the note at the foot's full width.
{
  const ctx = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 1,
    hasTouch: true,
    isMobile: true,
    colorScheme: "dark",
  });
  const page = await boot(ctx, "dark");
  try {
    await page.locator(".digit-cell, .cell, [data-cell]").first().click({ force: true, timeout: 5000 });
    await page.keyboard.press("5");
    await page.waitForTimeout(500);
    await page.locator('.action-bar button[aria-label="Clear the board"]').first().click({ force: true });
    await page.waitForTimeout(700);
  } catch (e) {
    console.log("frame 2: could not arm —", String(e).slice(0, 120));
  }
  const box = await page.evaluate(() => {
    const f = document.getElementById("card-foot");
    const rib = document.querySelector(".confirm-ribbon");
    if (!f) return null;
    const r = f.getBoundingClientRect();
    const t = rib ? Math.min(r.top, rib.getBoundingClientRect().top) : r.top;
    return { x: Math.max(0, Math.round(r.x) - 6), y: Math.max(0, Math.round(t) - 8), width: Math.round(r.width) + 12, height: Math.round(r.bottom - t) + 12 };
  });
  if (box) await page.screenshot({ path: join(OUT, "2-confirm-390-dark-fullwidth.png"), clip: box });
  else console.log("frame 2: no foot");
  await ctx.close();
}

// 3 · 320×568 light — the margin's SHORT arm (6.4rem), reported, not claimed.
{
  const ctx = await browser.newContext({
    viewport: { width: 320, height: 568 },
    deviceScaleFactor: 1,
    hasTouch: true,
    isMobile: true,
    colorScheme: "light",
  });
  const page = await boot(ctx, "light");
  const box = await page.evaluate(() => {
    const c = document.querySelector(".controls-card");
    c.scrollTop = Math.round((c.scrollHeight - c.clientHeight) * 0.45);
    const r = c.getBoundingClientRect();
    return { x: Math.max(0, Math.round(r.x) - 3), y: Math.max(0, Math.round(r.y) - 3), width: Math.round(r.width) + 6, height: Math.min(300, Math.round(r.height)) };
  });
  await page.waitForTimeout(300);
  await page.screenshot({ path: join(OUT, "3-margin-320-short-arm.png"), clip: box });
  await ctx.close();
}

await browser.close();
console.log("FRAMES OK");
