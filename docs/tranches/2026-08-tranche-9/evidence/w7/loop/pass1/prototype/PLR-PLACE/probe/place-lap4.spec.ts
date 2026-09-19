/**
 * PLR-PLACE · G8 AGAINST VIEWPORT HEIGHT.
 *
 * `place-lap3` showed the lap does not move with the drawer or with scroll (`scrollY` 0 in all
 * four readings). What it moves with is the viewport's HEIGHT: the board's top sits at 131.7 on
 * an iPhone 13 (390 × 664) and the π census read it at 252.5 on a 390 × 844 page. Both are
 * "a phone". So the lap is measured at both heights, coarse, with the same room and the same
 * sheet, and G8's declared ~64px is read against the pair.
 */
import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const SOLO = "./?size=3&difficulty=EASY&wire=local";
const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/prototype/PLR-PLACE/logs";
const say = (k: string, v: unknown) => console.log(`PLC|${k}|${JSON.stringify(v)}`);

async function settled(page: Page) {
  await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 })
    .toBeGreaterThan(0);
}
async function openDrawer(page: Page) {
  const tab = page.locator(".drawer-tab");
  if ((await tab.count()) === 0) return;
  if ((await tab.getAttribute("aria-expanded")) !== "true") await tab.click();
  await expect(page.locator("#controls-drawer .controls-card")).toBeVisible();
  await page.waitForTimeout(700);
}
async function pressMark(page: Page) {
  const marks = page.locator("[data-player-mark]");
  for (let i = 0; i < (await marks.count()); i++) {
    const m = marks.nth(i);
    if (await m.isVisible()) {
      await m.click();
      return;
    }
  }
  throw new Error("no visible player mark");
}
const read = (p: Page) =>
  p.evaluate(() => {
    const sheet = document.querySelector("[data-lobby]") as HTMLElement;
    const grid = document.querySelector('[role="grid"]') as HTMLElement;
    const s = sheet.getBoundingClientRect();
    const g = grid.getBoundingClientRect();
    return {
      vh: window.innerHeight,
      scrollY: Math.round(window.scrollY),
      sheetY: +s.y.toFixed(1),
      sheetH: +s.height.toFixed(1),
      sheetBottom: +s.bottom.toFixed(1),
      boardTop: +g.y.toFixed(1),
      lapPx: +(s.bottom - g.y).toFixed(1),
      rows: document.querySelectorAll("[data-lobby] .lobby-row").length,
    };
  });

for (const h of [664, 844]) {
  test(`G8 — the lap at 390 × ${h}, coarse`, async ({ browser }, info) => {
    mkdirSync(OUT, { recursive: true });
    const ctx = await browser.newContext({
      viewport: { width: 390, height: h },
      deviceScaleFactor: 3,
      isMobile: true,
      hasTouch: true,
    });
    const p = await ctx.newPage();
    await p.goto(SOLO);
    await settled(p);
    await openDrawer(p);
    const verb = p.locator('.controls-card button[aria-label="Play together on this board"]');
    await expect(verb).toBeEnabled();
    await verb.click();
    await expect.poll(() => new URL(p.url()).searchParams.get("s")).not.toBeNull();
    const q = await ctx.newPage();
    await q.goto(p.url());
    await settled(q);
    await expect(p.locator(".controls-card .players-roster .player-row")).toHaveCount(2);
    await q.locator(".sudoku-cell").nth(30).click();
    await p.waitForTimeout(1200);
    await pressMark(p);
    await p.waitForTimeout(900);
    const r = await read(p);
    say(`g8.vh${h}`, r);
    writeFileSync(
      join(OUT, `lap-vh${h}-${info.project.name}.json`),
      JSON.stringify({ engine: info.project.name, ...r }, null, 1),
    );
    await ctx.close();
  });
}
