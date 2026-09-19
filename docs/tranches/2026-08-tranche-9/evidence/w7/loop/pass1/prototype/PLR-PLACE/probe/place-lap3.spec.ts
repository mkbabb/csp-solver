/**
 * PLR-PLACE · G8, THE DRAWER AND THE SCROLL RULED OUT. (Writes `logs/lap2-<engine>.json`.)
 *
 * The first banked lap (158.6 / 158.9px) was taken after the drawer had been opened to reach the
 * invite verb and shut again, so the first question was whether the number was about the drawer
 * or about the page's scroll. It is about neither: four readings with the sheet held open —
 * drawer shut / open, page at the top / scrolled to the board — give `scrollY` 0 and the same lap
 * to a pixel. What the lap IS about is the viewport's height; `place-lap4.spec.ts` measures that.
 */
import { test, expect, type Page, devices } from "@playwright/test";
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
async function shutDrawer(page: Page) {
  const tab = page.locator(".drawer-tab");
  if ((await tab.count()) === 0) return;
  if ((await tab.getAttribute("aria-expanded")) === "true") await tab.click();
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
    const sheet = document.querySelector("[data-lobby]") as HTMLElement | null;
    const grid = document.querySelector('[role="grid"]') as HTMLElement;
    const tab = document.querySelector(".drawer-tab");
    const g = grid.getBoundingClientRect();
    const base = {
      scrollY: Math.round(window.scrollY),
      boardTop: +g.y.toFixed(1),
      drawerExpanded: tab?.getAttribute("aria-expanded") ?? null,
      sheetOpen: !!sheet,
    };
    if (!sheet) return base;
    const s = sheet.getBoundingClientRect();
    return {
      ...base,
      sheetY: +s.y.toFixed(1),
      sheetH: +s.height.toFixed(1),
      sheetBottom: +s.bottom.toFixed(1),
      lapPx: +(s.bottom - g.y).toFixed(1),
      rows: document.querySelectorAll("[data-lobby] .lobby-row").length,
    };
  });

test("G8 — the lap against scroll and drawer, four readings", async ({ browser }, info) => {
  mkdirSync(OUT, { recursive: true });
  const out: Record<string, unknown> = { engine: info.project.name };
  const ctx = await browser.newContext({
    ...devices["iPhone 13"],
    hasTouch: true,
    isMobile: true,
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

  // B — the banked posture: the drawer shut, the page left where the drawer put it
  await shutDrawer(p);
  await pressMark(p);
  await p.waitForTimeout(900);
  out["B_shut_asLeft"] = await read(p);
  say("g8.B_shut_asLeft", out["B_shut_asLeft"]);

  // A — the same, with the page returned to the top
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(500);
  out["A_shut_top"] = await read(p);
  say("g8.A_shut_top", out["A_shut_top"]);

  // C — the drawer open, page at the top
  await openDrawer(p);
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(500);
  out["C_open_top"] = await read(p);
  say("g8.C_open_top", out["C_open_top"]);

  // D — the drawer open, scrolled until the board's top is in view
  await p.evaluate(() => {
    const g = document.querySelector('[role="grid"]') as HTMLElement;
    window.scrollTo(0, window.scrollY + g.getBoundingClientRect().y - 120);
  });
  await p.waitForTimeout(500);
  out["D_open_board"] = await read(p);
  say("g8.D_open_board", out["D_open_board"]);

  writeFileSync(join(OUT, `lap2-${info.project.name}.json`), JSON.stringify(out, null, 1));
  await ctx.close();
});
