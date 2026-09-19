// T9-W7 pass 3 · RESEARCH · CTRL-RULE — the WEBKIT PRE-CLICK BLUR row (CTRL-COST's graft),
// aimed at THIS family's confirm. `ribbon-intersect.mjs` armed the ribbon in chromium on one
// click and read NOTHING in webkit. CTRL-COST's pass-2 finding: in WebKit the first press
// blurs (relatedTarget null) and the arm disarms, so a verb needs a SECOND press. This asks
// the question with the press count as the variable, and reads the board either way.
const NM = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/";
const { webkit, chromium } = await import(NM + "playwright/index.mjs");
const BASE = process.env.BASE || "http://127.0.0.1:4231/";
const out = {};
for (const engine of ["webkit", "chromium"]) {
  const browser = await (engine === "webkit" ? webkit : chromium).launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, deviceScaleFactor: 1, colorScheme: "light" });
  await ctx.addInitScript(() => { try { localStorage.clear(); localStorage.setItem("sudoku-color-scheme", "light"); } catch {} });
  const page = await ctx.newPage();
  await page.goto(BASE + "?size=3&difficulty=EASY", { waitUntil: "domcontentloaded" });
  await page.waitForSelector("svg.handwritten-logo", { timeout: 40000 });
  await page.waitForTimeout(1200);
  const cells = page.locator(".game-cell input:not([readonly]):not([disabled])");
  const n = Math.min(await cells.count(), 12);
  let dirty = false;
  for (let i = 0; i < n && !dirty; i++) {
    await cells.nth(i).click({ force: true }).catch(() => {});
    await page.keyboard.type("1");
    await page.waitForTimeout(220);
    dirty = await cells.nth(i).inputValue().then((v) => v.trim() === "1").catch(() => false);
  }
  if (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
    await page.locator(".drawer-tab").first().click({ force: true });
    await page.waitForTimeout(950);
  }
  const btn = page.locator("#card-foot button", { hasText: /^clear$/i }).first();
  const seen = [];
  for (const press of [1, 2, 3]) {
    await btn.click({ force: true }).catch(() => {});
    await page.waitForTimeout(650);
    seen.push({ press, ribbon: await page.evaluate(() => !!document.querySelector(".confirm-ribbon")),
      focus: await page.evaluate(() => document.activeElement?.className?.toString?.().slice(0,40) ?? document.activeElement?.tagName) });
    if (seen.at(-1).ribbon) break;
  }
  const count = await page.locator("#card-foot button").count();
  out[engine] = { dirty, footButtons: count, presses: seen };
  console.log(engine, JSON.stringify(out[engine]));
  await browser.close();
}
const { writeFileSync } = await import("node:fs");
writeFileSync(new URL("../readings/webkit-ribbon-twopress.json", import.meta.url), JSON.stringify(out, null, 2));
console.log("EXIT OK");
