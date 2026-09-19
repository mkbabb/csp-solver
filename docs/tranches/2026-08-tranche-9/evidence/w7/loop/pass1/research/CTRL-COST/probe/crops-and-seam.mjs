// CTRL-COST pass-1 · TWO CROPS AND THE SEAM, CORRECTED.
//
// The seam row in `sticky-taps-seam.mjs` read `.drawer-case svg.outline-svg`, and after the
// DOM patch that selector resolves to a DIFFERENT svg (the emptied wells' frames are hidden,
// not removed, and `querySelector` takes the first in document order). Its Δ of exactly
// −230.00px is the instrument moving, not the seam. Here the seam is the CASE'S OWN BOX,
// which no re-parent can swap out.
//
//   node crops-and-seam.mjs
//
const { chromium, webkit } = await import(
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs"
);
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const PROTO = resolve(HERE, "../proto");
const OUT = resolve(HERE, "../readings");
const FRAMES = resolve(HERE, "../frames");
const BASE = "http://127.0.0.1:4233/";
const CSS = readFileSync(resolve(PROTO, "cost-card.css"), "utf8");
const JS_SRC = readFileSync(resolve(PROTO, "cost-card.js"), "utf8").replace(
  /^export const costCard = /m,
  "window.__costCard = ",
);
const STICKY = `.cost-band-head{position:sticky;top:0;z-index:3;background:var(--color-card)}`;

const SEAM = () => {
  const c = document.querySelector(".drawer-case");
  const logo = document.querySelector("svg.handwritten-logo");
  if (!c || !logo) return null;
  const cb = c.getBoundingClientRect();
  const lb = logo.getBoundingClientRect();
  return {
    caseTop: +cb.top.toFixed(2),
    caseH: +cb.height.toFixed(2),
    wordmarkBottom: +lb.bottom.toFixed(2),
    gap: +(cb.top - lb.bottom).toFixed(2),
  };
};

async function open(engine, w, h, coarse) {
  const browser = await (engine === "webkit" ? webkit : chromium).launch();
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 1,
    hasTouch: coarse,
    isMobile: coarse && engine === "chromium",
    colorScheme: "light",
  });
  await ctx.addInitScript(() => {
    try {
      localStorage.clear();
      localStorage.setItem("sudoku-color-scheme", "light");
    } catch {}
  });
  const page = await ctx.newPage();
  await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
  await page.waitForTimeout(1500);
  return { browser, page };
}
const openSheet = async (page) => {
  if (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
    await page.locator(".drawer-tab").click({ force: true });
    await page.waitForTimeout(950);
  }
};

const seam = {};
for (const [w, h] of [
  [390, 844],
  [375, 812],
  [430, 932],
]) {
  for (const engine of ["chromium", "webkit"]) {
    const { browser, page } = await open(engine, w, h, true);
    await openSheet(page);
    const control = await page.evaluate(SEAM);
    await page.addStyleTag({ content: CSS });
    await page.evaluate(`(() => { ${JS_SRC} ; return window.__costCard(); })()`);
    await page.waitForTimeout(450);
    const ladder = await page.evaluate(SEAM);
    seam[`${w}x${h}-${engine}`] = { control, ladder, delta: +(ladder.gap - control.gap).toFixed(2) };
    console.log(
      `seam ${w}x${h}-${engine.padEnd(9)} control gap ${control.gap} · ladder gap ${ladder.gap} · Δ ${(
        ladder.gap - control.gap
      ).toFixed(2)}`,
    );
    await browser.close();
  }
}
writeFileSync(resolve(OUT, "seam.json"), JSON.stringify(seam, null, 1));

// ── the two crops ───────────────────────────────────────────────────────────────────────
{
  const { browser, page } = await open("chromium", 390, 844, true);
  await openSheet(page);
  await page.addStyleTag({ content: CSS + STICKY });
  await page.evaluate(`(() => { ${JS_SRC} ; return window.__costCard(); })()`);
  await page.waitForTimeout(450);
  const box = await page.evaluate(() => {
    const b = document.querySelector(".cost-band:nth-of-type(3)");
    b.scrollIntoView({ block: "center" });
    const r = b.getBoundingClientRect();
    return { x: Math.max(0, r.x - 6), y: Math.max(0, r.y - 6), width: r.width + 12, height: r.height + 12 };
  });
  await page.waitForTimeout(220);
  await page.screenshot({ path: resolve(FRAMES, "tier3-390-resting.png"), clip: box });
  await page.evaluate(() => document.querySelector(".cost-face-destructive").click());
  await page.waitForTimeout(320);
  await page.screenshot({ path: resolve(FRAMES, "tier3-390-armed.png"), clip: box });
  await browser.close();
}
{
  const { browser, page } = await open("chromium", 1280, 800, false);
  await openSheet(page);
  await page.addStyleTag({ content: CSS + STICKY });
  await page.evaluate(`(() => { ${JS_SRC} ; return window.__costCard(); })()`);
  await page.waitForTimeout(450);
  const box = await page.evaluate(() => {
    const c = document.querySelector(".controls-card");
    c.scrollTop = 0;
    const r = c.getBoundingClientRect();
    return { x: Math.max(0, r.x - 8), y: Math.max(0, r.y - 8), width: r.width + 16, height: Math.min(r.height + 16, 700) };
  });
  await page.waitForTimeout(220);
  await page.screenshot({ path: resolve(FRAMES, "rail-1280-ladder.png"), clip: box });
  await browser.close();
}
console.log("\nbanked frames + readings/seam.json");
