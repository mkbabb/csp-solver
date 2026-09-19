// CTRL-FACE pass-1 PROTOTYPE — the four poses, each one a region a number cannot carry.
//   BASE=http://127.0.0.1:4235/ DIR=<frames> TAG=armD node probe/crops-armd.mjs
const { webkit, chromium } = await import(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs"
);
import { resolve } from "node:path";
import process from "node:process";

const BASE = process.env.BASE || "http://127.0.0.1:4235/";
const TAG = process.env.TAG || "armD";
const DIR = process.env.DIR || "frames";

async function board(eng, { w, h, dark, open }) {
  const browser = await (eng === "webkit" ? webkit : chromium).launch();
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 1,
    isMobile: w < 1024 && eng === "chromium",
    hasTouch: w < 1024,
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
  if (
    open &&
    (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed")))
  ) {
    await page.locator(".drawer-tab").click({ force: true });
    await page.waitForTimeout(950); // the sheet SLIDES
  }
  return { browser, page };
}

const cardClip = (page, height) =>
  page.evaluate((hh) => {
    const c = document.querySelector(".controls-card").getBoundingClientRect();
    return {
      x: Math.max(0, c.x - 4),
      y: Math.max(0, c.y - 4),
      width: Math.min(innerWidth - Math.max(0, c.x - 4), c.width + 8),
      height: Math.min(hh, innerHeight - Math.max(0, c.y - 4)),
    };
  }, height);

// 1 + 2 — the dock, dark, size open then level open
for (const eng of ["webkit", "chromium"]) {
  const { browser, page } = await board(eng, { w: 390, h: 844, dark: true, open: true });
  await page.screenshot({
    path: resolve(DIR, `p1-dock-390x844-dark-size-open-${TAG}-${eng}.png`),
    clip: await cardClip(page, 330),
  });
  if (eng === "webkit") {
    await page.locator(".controls-card .mobile-heading-btn").nth(1).click({ force: true });
    await page.waitForTimeout(500);
    await page.screenshot({
      path: resolve(DIR, `p2-dock-390x844-dark-level-open-${TAG}-${eng}.png`),
      clip: await cardClip(page, 330),
    });
  }
  await browser.close();
}

// 3 — the rail, light: the masthead against the printed names
for (const eng of ["webkit", "chromium"]) {
  const { browser, page } = await board(eng, { w: 1280, h: 800, dark: false, open: true });
  const b = await page.evaluate(() => {
    const logo = document.querySelector("svg.handwritten-logo").getBoundingClientRect();
    const card = document.querySelector(".controls-card").getBoundingClientRect();
    const x = Math.max(0, Math.min(logo.x, card.x) - 8);
    const right = Math.min(1280, Math.max(logo.right, card.right) + 8);
    return {
      x,
      y: Math.max(0, logo.y - 6),
      width: right - x,
      height: Math.min(420, 800 - Math.max(0, logo.y - 6)),
    };
  });
  await page.screenshot({
    path: resolve(DIR, `p3-rail-1280x800-light-${TAG}-${eng}.png`),
    clip: b,
  });
  await browser.close();
}

// 4 — 900×500, the ratio cell nobody measured
{
  const { browser, page } = await board("webkit", { w: 900, h: 500, dark: true, open: true });
  await page.screenshot({
    path: resolve(DIR, `p4-land-900x500-dark-${TAG}-webkit.png`),
    clip: await cardClip(page, 300),
  });
  await browser.close();
}
console.log("crops written:", TAG);
