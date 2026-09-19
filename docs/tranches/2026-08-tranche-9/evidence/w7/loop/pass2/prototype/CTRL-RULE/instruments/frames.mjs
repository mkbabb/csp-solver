// T9-W7 pass 2 · CTRL-RULE arm (b) — THE FOUR CROPS THE BRIEF NAMES, and no more.
// Pass 1 banked 207 PNGs against a 2 MB wave cap; this lane banks four, each ≤150 KB, each
// cited in the README, and only where a number cannot say it.
//   1 · 390×844 dark, sheet up — seven margin names on hand-ruled lines, `marks` wrapped
//   2 · 1280×800 light rail at scrollTop .5 — nothing pinned (the form-tell control)
//   3 · 390×844 the ribbon in the foot's row — keep bare / clear boxed red on bare card
//   4 · 320×568 — the narrow arm, reported not claimed
// node frames.mjs   [BASE=http://127.0.0.1:4231/]
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const NM =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/";
const { chromium } = await import(NM + "playwright/index.mjs");

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "..", "frames");
mkdirSync(OUT, { recursive: true });
const BASE = process.env.BASE || "http://127.0.0.1:4231/";

async function open(w, h, { dark = false, touch = true } = {}) {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 1,
    hasTouch: touch,
    isMobile: touch,
    colorScheme: dark ? "dark" : "light",
  });
  await ctx.addInitScript((d) => {
    try {
      localStorage.clear();
      localStorage.setItem("sudoku-color-scheme", d ? "dark" : "light");
    } catch {}
  }, dark);
  const page = await ctx.newPage();
  await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 40000 });
  await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await page.waitForTimeout(1300);
  return { browser, page };
}
async function raise(page) {
  if (
    await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))
  ) {
    await page.locator(".drawer-tab").first().click({ force: true });
    await page.waitForTimeout(950); // THE SHEET SLIDES
  }
}
const clipOf = (page, sel) =>
  page.evaluate((s) => {
    const el = document.querySelector(s);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    const vw = document.documentElement.clientWidth;
    const vh = document.documentElement.clientHeight;
    const x = Math.max(0, Math.floor(r.x) - 2);
    const y = Math.max(0, Math.floor(r.y) - 2);
    return {
      x,
      y,
      width: Math.min(Math.ceil(r.width) + 4, vw - x),
      height: Math.min(Math.ceil(r.height) + 4, vh - y),
    };
  }, sel);

// 1 — the dock, dark, sheet up
{
  const { browser, page } = await open(390, 844, { dark: true });
  await raise(page);
  const clip = await clipOf(page, ".drawer-case");
  await page.screenshot({ path: join(OUT, "1-dock-390-dark.png"), clip });
  await browser.close();
}
// 2 — the desk rail, light, mid-scroll (the form-tell control's pose)
{
  const { browser, page } = await open(1280, 800, { touch: false });
  await page.evaluate(() => {
    const c = document.querySelector(".controls-card");
    if (c) c.scrollTop = (c.scrollHeight - c.clientHeight) * 0.5;
  });
  await page.waitForTimeout(400);
  const clip = await clipOf(page, ".drawer-case");
  await page.screenshot({ path: join(OUT, "2-rail-1280-light.png"), clip });
  await browser.close();
}
// 3 — the confirm ribbon in the foot's row (coarse + dirty is the shipped arm)
{
  const { browser, page } = await open(390, 844);
  await raise(page);
  // make the board dirty, then press clear: the arm is `isCoarse && isDirty`
  const cell = page.locator(".game-cell input:not([readonly]):not([disabled])").first();
  await cell.click({ force: true }).catch(() => {});
  await page.keyboard.type("1").catch(() => {});
  await page.waitForTimeout(500);
  await raise(page);
  await page.locator('[aria-label="Clear the board"]').first().click({ force: true });
  await page.waitForTimeout(500);
  const clip = await clipOf(page, "#card-foot");
  if (clip) {
    const grow = { ...clip, y: Math.max(0, clip.y - 110), height: clip.height + 110 };
    await page.screenshot({ path: join(OUT, "3-ribbon-390.png"), clip: grow });
  }
  const armed = await page.evaluate(() => !!document.querySelector(".confirm-ribbon"));
  console.log("ribbon armed:", armed);
  await browser.close();
}
// 4 — the narrow arm, reported not claimed
{
  const { browser, page } = await open(320, 568);
  await raise(page);
  const clip = await clipOf(page, ".drawer-case");
  await page.screenshot({ path: join(OUT, "4-narrow-320.png"), clip });
  await browser.close();
}
console.log("banked frames/");
