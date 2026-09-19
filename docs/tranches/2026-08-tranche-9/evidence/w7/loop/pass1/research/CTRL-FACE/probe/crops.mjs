// CTRL-FACE pass-1 — the crops. Three, each one the region a number cannot carry:
// the owner's Frame B region (the risen sheet's names) before and after, and the masthead
// against the printed names at the desk (the flattening question).
//
//   BASE=http://127.0.0.1:4235/ TAG=after node probe/crops.mjs
//
const { webkit } = await import(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs"
);
import { resolve } from "node:path";
import process from "node:process";

const BASE = process.env.BASE || "http://127.0.0.1:4234/";
const TAG = process.env.TAG || "before";
const DIR = process.env.DIR || "frames";

async function board({ w, h, dark, open }) {
  const browser = await webkit.launch();
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 1,
    isMobile: w < 500,
    hasTouch: w < 500,
    colorScheme: dark ? "dark" : "light",
  });
  await ctx.addInitScript((d) => {
    try {
      localStorage.clear();
      localStorage.setItem("sudoku-color-scheme", d ? "dark" : "light");
    } catch {
      /* private mode */
    }
  }, dark);
  const page = await ctx.newPage();
  await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
  await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await page.waitForTimeout(1600);
  if (open && (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed")))) {
    await page.locator(".drawer-tab").click({ force: true });
    await page.waitForTimeout(950); // the sheet SLIDES
  }
  return { browser, page };
}

// FRAME B's region: the risen sheet at 390x844 dark — the deal well's tape, the two tab
// heads and the option row under them. Cropped to the card's top 330px.
{
  const { browser, page } = await board({ w: 390, h: 844, dark: true, open: true });
  const b = await page.evaluate(() => {
    const c = document.querySelector(".controls-card").getBoundingClientRect();
    return { x: Math.max(0, c.x - 4), y: Math.max(0, c.y - 4), width: Math.min(390, c.width + 8), height: 340 };
  });
  await page.screenshot({ path: resolve(DIR, `frameB-sheet-names-390x844-dark-${TAG}.png`), clip: b });
  await browser.close();
}

// The masthead against the printed names at the desk — the flattening question in one frame.
{
  const { browser, page } = await board({ w: 1280, h: 800, dark: false, open: true });
  const b = await page.evaluate(() => {
    const logo = document.querySelector("svg.handwritten-logo").getBoundingClientRect();
    const card = document.querySelector(".controls-card").getBoundingClientRect();
    const x = Math.max(0, Math.min(logo.x, card.x) - 8);
    const right = Math.min(1280, Math.max(logo.right, card.right) + 8);
    return { x, y: Math.max(0, logo.y - 6), width: right - x, height: Math.min(420, 800 - Math.max(0, logo.y - 6)) };
  });
  await page.screenshot({ path: resolve(DIR, `masthead-vs-names-1280x800-light-${TAG}.png`), clip: b });
  await browser.close();
}
console.log("crops written:", TAG);
