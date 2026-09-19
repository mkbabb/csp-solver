/**
 * T9-W7 pass 3 · CTRL-TAPE — THE THREE CROPS THE BRIEF NAMES, and nothing else.
 *
 * The wave's frame cap is 2 MB and pass 2 banked 207 PNGs against it, so this takes exactly the
 * three poses a number cannot say, each clipped to the region it is about.
 *   (1) 390×844 dark, sheet up, the foot with `--safe-b: 34px` beside its flush twin (§6.3c).
 *   (2) 390×844 dark, the confirm armed on `clear` (the section's face).
 *   (3) 1440×900 rail at scrollTop 0.5, the pinned tape inside the band (M03's second look).
 *
 *   node p3-crops.mjs <outdir> <base> [engine]
 */
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";

const DIR = process.argv[2];
const BASE = process.argv[3] || "http://127.0.0.1:4230";
const ONLY = process.argv[4] || "chromium";

async function loadBoard(page) {
  await page.goto("/?size=3&difficulty=EASY");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 30000 });
  await page.waitForSelector("g.boil-frame-layer.is-active", {
    state: "attached",
    timeout: 30000,
  });
}
async function dirty(page) {
  for (let i = 0; i < 12; i++) {
    await page.locator(".sudoku-cell").nth(i).click();
    await page.keyboard.press("5");
  }
  await page.waitForTimeout(150);
}
async function openSheet(page) {
  await page.locator(".drawer-tab").click();
  await page.waitForTimeout(950);
}

const eng = ONLY === "webkit" ? webkit : chromium;
const browser = await eng.launch();

// ── (1) THE FOOT ON THE INSET, flush and at 34px ───────────────────────────────────────────
{
  const ctx = await browser.newContext({
    baseURL: BASE,
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: ONLY === "chromium",
    colorScheme: "dark",
  });
  const page = await ctx.newPage();
  await loadBoard(page);
  await openSheet(page);
  const clip = { x: 0, y: 844 - 150, width: 390, height: 150 };
  await page.screenshot({ path: `${DIR}/c1-foot-flush-390-dark-${ONLY}.png`, clip });
  await page.evaluate(() => document.documentElement.style.setProperty("--safe-b", "34px"));
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${DIR}/c1-foot-inset34-390-dark-${ONLY}.png`, clip });
  await ctx.close();
}

// ── (2) THE CONFIRM'S FACE ─────────────────────────────────────────────────────────────────
{
  const ctx = await browser.newContext({
    baseURL: BASE,
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: ONLY === "chromium",
    colorScheme: "dark",
  });
  const page = await ctx.newPage();
  await loadBoard(page);
  await dirty(page);
  // THE DEV ARTEFACT, REMOVED AND NAMED. `FilterTuner.vue` mounts a floating toggle under
  // `import.meta.env.DEV` and it lands on the foot's right edge, exactly over the destructive
  // answer — it intercepted the probe's tap and it paints over the red word in this frame.
  // It ships in no build; a crop that leaves it in is a picture of the dev server.
  await page.evaluate(() => {
    for (const e of document.querySelectorAll("*")) {
      if (/filter tuner/i.test(e.getAttribute("aria-label") || "")) e.remove();
    }
  });
  await openSheet(page);
  await page.locator('.action-bar button[aria-label="Clear the board"]').tap();
  await page.waitForTimeout(450);
  const box = await page.evaluate(() => {
    const f = document.querySelector("#card-foot");
    if (!f) return null;
    const r = f.getBoundingClientRect();
    return {
      x: Math.max(0, Math.floor(r.left - 6)),
      y: Math.max(0, Math.floor(r.top - 10)),
      width: Math.ceil(r.width + 12),
      height: Math.ceil(r.height + 20),
    };
  });
  if (box) {
    await page.screenshot({ path: `${DIR}/c2-confirm-armed-390-dark-${ONLY}.png`, clip: box });
  }
  await ctx.close();
}

// ── (3) THE PINNED TAPE INSIDE THE BAND ────────────────────────────────────────────────────
{
  const ctx = await browser.newContext({
    baseURL: BASE,
    viewport: { width: 1440, height: 900 },
  });
  const page = await ctx.newPage();
  await loadBoard(page);
  await page.evaluate(() => {
    const c = document.querySelector(".controls-card");
    if (c) c.scrollTop = (c.scrollHeight - c.clientHeight) * 0.5;
  });
  await page.waitForTimeout(500);
  const box = await page.evaluate(() => {
    const c = document.querySelector(".controls-card");
    if (!c) return null;
    const r = c.getBoundingClientRect();
    return {
      x: Math.max(0, Math.floor(r.left - 8)),
      y: Math.max(0, Math.floor(r.top - 8)),
      width: Math.ceil(r.width + 16),
      height: Math.min(260, Math.ceil(r.height)),
    };
  });
  if (box) {
    await page.screenshot({ path: `${DIR}/c3-pinband-1440-${ONLY}.png`, clip: box });
  }
  await ctx.close();
}

await browser.close();
console.log("CROPS DONE");
