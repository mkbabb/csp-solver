/**
 * T9-W7 pass 4 · CTRL-TAPE — FOUR CROPS, each a REPLACEMENT (chair §6.11). Every frame names
 * its engine, theme, viewport and POINTER CLASS in its filename, and the README names the
 * pass-3 crop it retires. The DEV-only `FilterTuner` toggle is suppressed in all four (it ships
 * in no build and it sat over the destructive answer in pass 3's crop).
 *
 *   node p4-crops.mjs <outDir> <baseURL>
 */
import {
  chromium,
  webkit,
} from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";

const DIR = process.argv[2];
const BASE = process.argv[3] || "http://127.0.0.1:4230";
const SUPPRESS = ".tuner-toggle{display:none!important}";

async function dirty(page) {
  await page.waitForSelector(".sudoku-cell", { timeout: 30000 });
  await page.waitForFunction(
    () => document.querySelectorAll(".sudoku-cell .glyph-svg").length > 0,
    null,
    { timeout: 30000 },
  );
  const blank = await page.evaluate(() => {
    const c = document.querySelectorAll(".sudoku-cell");
    for (let i = 0; i < c.length; i++) if (!c[i].querySelector(".glyph-svg")) return i;
    return -1;
  });
  if (blank < 0) return;
  await page.locator(".sudoku-cell").nth(blank).click({ force: true });
  await page.evaluate((i) => {
    const input = document.querySelectorAll(".sudoku-cell input")[i];
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(input, "1");
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }, blank);
  await page.waitForTimeout(250);
}

async function shot(page, sel, file, pad = 8) {
  const box = await page.locator(sel).first().boundingBox();
  if (!box) {
    console.log("NO BOX", file, sel);
    return;
  }
  await page.screenshot({
    path: `${DIR}/${file}`,
    clip: {
      x: Math.max(0, box.x - pad),
      y: Math.max(0, box.y - pad),
      width: Math.min(box.width + pad * 2, page.viewportSize().width - Math.max(0, box.x - pad)),
      height: Math.min(box.height + pad * 2, page.viewportSize().height - Math.max(0, box.y - pad)),
    },
  });
  console.log("SHOT", file);
}

// ── (1) THE CONFIRM'S FACE, corrected — 390×844 · dark · chromium · COARSE (hasTouch) ───────
{
  const br = await chromium.launch();
  const ctx = await br.newContext({
    baseURL: BASE,
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    colorScheme: "dark",
  });
  const page = await ctx.newPage();
  await page.goto("/?size=3&difficulty=EASY&board=crop");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.addStyleTag({ content: SUPPRESS });
  await dirty(page);
  await page.locator(".drawer-tab").click();
  await page.waitForSelector("#controls-drawer .drawer-case", { state: "visible" });
  await page.waitForTimeout(900);
  const clear = page.locator(".action-verbs button").first();
  await clear.click({ force: true });
  await page.waitForTimeout(400);
  await shot(page, ".confirm-ribbon", "c1-confirm-redword-390x844-dark-chromium-coarse.png", 14);
  await ctx.close();
  await br.close();
}

// ── (2) THE SAME FACE IN THE OTHER ENGINE AND THEME — 390×844 · light · webkit · COARSE ─────
{
  const br = await webkit.launch();
  const ctx = await br.newContext({
    baseURL: BASE,
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    colorScheme: "light",
  });
  const page = await ctx.newPage();
  await page.goto("/?size=3&difficulty=EASY&board=crop");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.addStyleTag({ content: SUPPRESS });
  await dirty(page);
  await page.locator(".drawer-tab").click();
  await page.waitForSelector("#controls-drawer .drawer-case", { state: "visible" });
  await page.waitForTimeout(900);
  await page.locator(".action-verbs button").first().click({ force: true });
  await page.waitForTimeout(400);
  await shot(page, ".confirm-ribbon", "c2-confirm-redword-390x844-light-webkit-coarse.png", 14);
  await ctx.close();
  await br.close();
}

// ── (3) c3 RE-CUT — the rail at scrollTop 0.5, the PINNED TAPE and the FIRST CHIP in frame ──
{
  const br = await chromium.launch();
  const ctx = await br.newContext({
    baseURL: BASE,
    viewport: { width: 1440, height: 900 },
  });
  const page = await ctx.newPage();
  await page.goto("/?size=3&difficulty=EASY&board=crop");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.addStyleTag({ content: SUPPRESS });
  await page.waitForSelector(".controls-card .washi-tag", { timeout: 30000 });
  await page.waitForTimeout(600);
  // frac 0.25, NOT 0.5: that is where §2.5b reads a tape actually PINNED (worstBelow −1.20
  // chromium / −1.24 webkit). At 0.5 the first tape has already released and ridden out of the
  // port, so a 0.5 crop shows a band with no tape in it — which is what pass 3's c3 showed.
  await page.evaluate(() => {
    const c = document.querySelector(".controls-card");
    if (c) c.scrollTop = Math.round((c.scrollHeight - c.clientHeight) * 0.25);
  });
  await page.waitForTimeout(500);
  // The claim is the BAND: a pinned tape sitting inside the reserved strip with the first live
  // chip clear beneath it. Frame the card's top 300px so both are in the picture.
  const box = await page.locator(".controls-card").boundingBox();
  await page.screenshot({
    path: `${DIR}/c3-pinband-band-and-chip-1440x900-light-chromium-fine.png`,
    clip: { x: box.x - 6, y: box.y - 6, width: box.width + 12, height: 210 },
  });
  console.log("SHOT c3");
  await ctx.close();
  await br.close();
}

// ── (4) THE QUICK SET'S FLANK, priced — 844×390 · light · chromium · COARSE (hasTouch) ──────
{
  const br = await chromium.launch();
  const ctx = await br.newContext({
    baseURL: BASE,
    viewport: { width: 844, height: 390 },
    hasTouch: true,
  });
  const page = await ctx.newPage();
  await page.goto("/?size=3&difficulty=EASY&board=crop");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.addStyleTag({ content: SUPPRESS });
  await page.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 30000 });
  await page.waitForTimeout(700);
  const box = await page.locator(".tongue-strip").boundingBox();
  if (box) {
    await page.screenshot({
      path: `${DIR}/c4-quickset-flank-844x390-light-chromium-coarse.png`,
      clip: {
        x: Math.max(0, box.x - 90),
        y: Math.max(0, box.y - 14),
        width: Math.min(200, 844 - Math.max(0, box.x - 90)),
        height: Math.min(box.height + 28, 390),
      },
    });
    console.log("SHOT c4");
  } else console.log("NO BOX c4");
  await ctx.close();
  await br.close();
}
console.log("CROPS DONE");
