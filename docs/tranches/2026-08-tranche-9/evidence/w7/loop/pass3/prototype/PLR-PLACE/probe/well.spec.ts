import { test, expect, type Page } from "@playwright/test";
import { writeFileSync, mkdirSync } from "node:fs";

/** G19 — what the `your cell` row costs the well, against the HEAD control at `74a2b5d9`. */

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass3/prototype/PLR-PLACE/logs";
const WELL = ".tray-well:has(.players-status)";

async function boot(page: Page, url: string) {
  await page.goto(url);
  await page.waitForSelector("svg.handwritten-logo", { timeout: 40000 });
  await expect
    .poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 40000 })
    .toBeGreaterThan(0);
  await page.waitForTimeout(500);
}

const wellH = (p: Page) =>
  p.evaluate((sel) => {
    const el = document.querySelector(sel) as HTMLElement | null;
    return el ? +el.getBoundingClientRect().height.toFixed(2) : null;
  }, WELL);

test("well height, solo and live, prototype vs HEAD", async ({ browser }) => {
  test.setTimeout(180000);
  const out: Record<string, unknown> = {};
  for (const [name, base] of [
    ["prototype :4243", "http://127.0.0.1:4243"],
    ["HEAD 74a2b5d9 :4244", "http://127.0.0.1:4244"],
  ] as const) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const solo = await ctx.newPage();
    await boot(solo, `${base}/?size=3&difficulty=EASY`);
    const s = await wellH(solo);
    const room = `plc-${Date.now()}`;
    const a = await ctx.newPage();
    const b = await ctx.newPage();
    await boot(a, `${base}/?size=3&difficulty=EASY&wire=local&s=${room}`);
    await boot(b, `${base}/?size=3&difficulty=EASY&wire=local&s=${room}`);
    await a.bringToFront();
    await a.waitForTimeout(600);
    const l = await wellH(a);
    out[name] = { solo: s, live: l };
    await ctx.close();
  }
  mkdirSync(OUT, { recursive: true });
  writeFileSync(`${OUT}/well-heights.json`, JSON.stringify(out, null, 2));
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(out));
});
