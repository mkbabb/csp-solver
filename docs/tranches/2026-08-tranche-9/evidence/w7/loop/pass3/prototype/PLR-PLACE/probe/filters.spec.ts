import { test, expect, type Browser, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";

/**
 * G7 — THE LIVE-FILTER BUDGET ON THE BUILT DIST (not the dev server: the estate's own spec
 * titles say "built dist", and pass 2's 6/6 was measured on a dev server).
 *
 * Three poses per regime per engine: the sheet SHUT, the sheet OPEN solo, the sheet OPEN in a
 * live room with the chart drawing a peer. The count is every `<filter>` the document actually
 * holds — the chart enrols pose 0 and no beat, so the answer must not move.
 */

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/prototype/PLR-PLACE/logs";
const DIST = "http://127.0.0.1:4245";

const count = (p: Page) =>
  p.evaluate(() => document.querySelectorAll("filter").length);

async function boot(page: Page, url: string) {
  await page.goto(url);
  await page.waitForSelector("svg.handwritten-logo", { timeout: 40000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 40000 })
    .toBeGreaterThan(0);
  await page.waitForTimeout(700);
}

async function regime(browser: Browser, w: number, h: number, coarse: boolean) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    hasTouch: coarse,
    isMobile: coarse,
    deviceScaleFactor: 1,
  });
  const a = await ctx.newPage();
  await boot(a, `${DIST}/?size=3&difficulty=EASY&wire=local`);
  const witness = await a.evaluate(() => matchMedia("(pointer: coarse)").matches);
  const shut = await count(a);
  await a.locator("[data-player-mark]:visible").click();
  await a.waitForTimeout(400);
  const openSolo = await count(a);
  await a.locator("[data-player-mark]:visible").click();

  // THE ROOM IS JOINED ON THE WIRE, not through the well's verb: `?s=` is the product's own
  // join route (the link the verb writes), and it keeps this census off every control surface
  // whose visibility is another family's subject.
  const room = `plc-${Date.now()}`;
  await boot(a, `${DIST}/?size=3&difficulty=EASY&wire=local&s=${room}`);
  const b = await ctx.newPage();
  await boot(b, `${DIST}/?size=3&difficulty=EASY&wire=local&s=${room}`);
  await b.locator(".sudoku-cell input").nth(12).click();
  await a.bringToFront();
  await a.locator(".sudoku-cell input").nth(40).click();
  await a.locator("[data-player-mark]:visible").click();
  await a.waitForTimeout(1200); // the 700 ms settle, then the dot
  const dots = await a.locator(".chart-dot").count();
  const openLive = await count(a);
  await ctx.close();
  return { witness, shut, openSolo, openLive, dots };
}

test("filters on the dist, shut / open solo / open live", async ({ browser }, info) => {
  test.setTimeout(300000);
  const out = {
    engine: info.project.name,
    "1280x800 fine": await regime(browser, 1280, 800, false),
    "390x844 coarse": await regime(browser, 390, 844, true),
  };
  mkdirSync(OUT, { recursive: true });
  writeFileSync(`${OUT}/filters-dist-${info.project.name}.json`, JSON.stringify(out, null, 2));
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(out));
});
