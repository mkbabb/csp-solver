// CTRL-TABS pass 2 — FOUR CROPS, and no more (the wave's cap). Each one is a claim a number
// cannot make: a join held by geometry, a confirm's two answers, a floor that chose its rows,
// and a board that moved by exactly what the berth under it costs.
import { chromium, webkit } from "playwright";
import sharp from "sharp";

const BASE = process.env.LANE_BASE || "http://127.0.0.1:4232/";
const DIR =
  process.env.FRAME_DIR ||
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass2/prototype/CTRL-TABS/frames";

async function shot(name, opts) {
  const { w, h, theme, engine, sheet, tab, arm, clip } = opts;
  const browser = await (engine === "webkit" ? webkit : chromium).launch();
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 2,
    isMobile: w < 1024 && engine === "chromium" ? true : undefined,
    hasTouch: w < 1024,
    colorScheme: theme,
  });
  await ctx.addInitScript((t) => {
    try {
      localStorage.clear();
      localStorage.setItem("sudoku-color-scheme", t);
    } catch {}
  }, theme);
  const page = await ctx.newPage();
  await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await page.waitForTimeout(1200);
  if (arm) {
    const idx = await page.evaluate(() =>
      [...document.querySelectorAll(".game-cell input")].findIndex((i) => !i.value),
    );
    if (idx >= 0) {
      await page.locator(".game-cell input").nth(idx).click({ force: true });
      await page.keyboard.press("5");
      await page.waitForTimeout(300);
    }
  }
  if (sheet) {
    await page.locator(".drawer-tab").click({ force: true });
    await page.waitForTimeout(950); // the sheet SLIDES
  }
  if (tab) {
    await page.getByRole("tab", { name: tab }).click();
    await page.waitForTimeout(350);
  }
  if (arm) {
    await page.locator('.action-verbs [data-verb="clear"]').click();
    await page.waitForTimeout(400);
  }
  const box = await page.evaluate((sel) => {
    const e = document.querySelector(sel);
    if (!e) return null;
    const r = e.getBoundingClientRect();
    return { x: r.x, y: r.y, width: r.width, height: r.height };
  }, clip);
  if (!box) throw new Error(`no ${clip}`);
  const pad = 14;
  const padB = opts.padBottom || 0;
  const buf = await page.screenshot({
    clip: {
      x: Math.max(0, box.x - pad),
      y: Math.max(0, box.y - pad),
      width: Math.min(w - Math.max(0, box.x - pad), box.width + pad * 2),
      height: Math.min(h - Math.max(0, box.y - pad), box.height + pad * 2 + padB),
    },
  });
  let out = await sharp(buf).png({ compressionLevel: 9, palette: true }).toBuffer();
  let scale = 1;
  while (out.length > 150000 && scale > 0.4) {
    scale -= 0.15;
    out = await sharp(buf)
      .resize({ width: Math.round(box.width * scale + pad * 2) })
      .png({ compressionLevel: 9, palette: true })
      .toBuffer();
  }
  await sharp(out).toFile(`${DIR}/${name}.png`);
  console.log(`${name}.png  ${(out.length / 1024).toFixed(1)} KB  scale ${scale.toFixed(2)}`);
  await browser.close();
}

const WHICH = process.env.WHICH || "1,2,3,4";
const want = new Set(WHICH.split(","));
if (want.has("1"))
  await shot("f1-390-dark-pencils-raised", {
    w: 390, h: 844, theme: "dark", engine: "chromium", sheet: true, tab: "pencils",
    clip: ".controls-card",
  });
if (want.has("2"))
  await shot("f2-390-light-ribbon", {
    w: 390, h: 844, theme: "light", engine: "chromium", sheet: true, arm: true,
    clip: ".action-bar",
  });
if (want.has("3"))
  await shot("f3-1280-light-flank-two-row-floor", {
    w: 1280, h: 800, theme: "light", engine: "chromium",
    clip: ".controls-card",
  });
if (want.has("4"))
  await shot("f4-390-light-board-edge-berth", {
    w: 390, h: 844, theme: "light", engine: "chromium", padBottom: 78,
    clip: ".board-wrapper",
  });
