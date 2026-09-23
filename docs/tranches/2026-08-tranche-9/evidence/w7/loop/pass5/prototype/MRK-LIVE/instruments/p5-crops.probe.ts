/** T9-W7 pass 5 · MRK-LIVE · the four replacement crops (each names the pass-4 crop it retires,
 *  pass4/SWEEP.md). Every pair holds engine, theme, viewport, pointer class and board; the one
 *  variable is named in the file. Crops land on the MAIN tree's pass-5 evidence dir. */
import { test, expect, type Page } from "@playwright/test";
import fs from "node:fs";
const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass5/prototype/MRK-LIVE";
function mintSudoku(sub: number): string {
  const n = sub * sub;
  let cells = "";
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++) {
      const i = r * n + c;
      const v = ((r * sub + Math.floor(r / sub) + c) % n) + 1;
      cells += (i > 1 && (r * 7 + c * 3) % 5 < 2 ? v : 0).toString(36);
    }
  return Buffer.from(String.fromCharCode(1) + `${sub}.${cells}`, "latin1").toString("base64url");
}
const P9 = mintSudoku(3);
const P16 = mintSudoku(4);
const log = (s: string) => fs.appendFileSync(`${OUT}/logs/P5-crops.log`, s + "\n");
async function boot(page: Page, q: string) {
  await page.goto("./" + q);
  await page.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 60000 });
  await page.waitForTimeout(1500);
}
async function toDark(page: Page) {
  if (await page.evaluate(() => document.documentElement.classList.contains("dark"))) return;
  await page.evaluate(() => document.querySelector<HTMLElement>(".sun-moon-toggle")?.click());
  await page.waitForFunction(() => document.documentElement.classList.contains("dark"));
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur?.());
  await page.waitForTimeout(1500);
}
const state = (page: Page) =>
  page.evaluate(() => ({
    dark: document.documentElement.classList.contains("dark"),
    active: (document.activeElement?.className?.toString() || document.activeElement?.tagName || "").split(" ")[0],
    fv: !!document.activeElement?.matches(":focus-visible"),
    rings: document.querySelectorAll(".focus-ring").length,
  }));
const toggleClip = async (page: Page) => {
  const b = (await page.locator(".sun-moon-toggle").boundingBox())!;
  return { x: Math.max(0, b.x - 70), y: Math.max(0, b.y - 70), width: b.width + 140, height: b.height + 140 };
};

test("crops · the toggle pair, theme held (starts dark, ends light), one variable: modality", async ({ page }, info) => {
  test.skip(info.project.name !== "webkit", "the pair is webkit's (the pass-4 pair's engine)");
  // KEYBOARD arm: focus by keyboard, Enter flips dark → light, the ring stays on the button.
  await boot(page, `?size=3&board=${P9}`);
  await toDark(page);
  await page.keyboard.press("Tab");
  await page.evaluate(() => document.querySelector<HTMLElement>(".sun-moon-toggle")?.focus());
  await page.keyboard.press("Enter");
  await page.waitForFunction(() => !document.documentElement.classList.contains("dark"));
  await page.waitForTimeout(2600);
  const k = await state(page);
  await page.screenshot({ path: `${OUT}/1-toggle-keyboard-activated-ring-light-webkit.png`, clip: await toggleClip(page) });
  log(`1 keyboard ${JSON.stringify(k)} payload ${P9}`);
  // MOUSE arm: same start, a real mouse press flips dark → light.
  await boot(page, `?size=3&board=${P9}`);
  await toDark(page);
  const b = (await page.locator(".sun-moon-toggle").boundingBox())!;
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
  await page.mouse.down();
  await page.mouse.up();
  await page.waitForFunction(() => !document.documentElement.classList.contains("dark"));
  await page.mouse.move(5, 790);
  await page.waitForTimeout(2600);
  const m = await state(page);
  await page.screenshot({ path: `${OUT}/2-toggle-mouse-activated-no-ring-light-webkit.png`, clip: await toggleClip(page) });
  log(`2 mouse ${JSON.stringify(m)} payload ${P9}`);
  expect(k.dark).toBe(false);
  expect(m.dark).toBe(false);
});

test("crops · the ring ballot's ALIAS arm on ABS's payload (16×16, cell 0 = the frame crossing), dark", async ({ page }, info) => {
  test.skip(info.project.name !== "chromium", "one engine for the ballot arm");
  await boot(page, `?size=4&board=${P16}`);
  await expect.poll(() => page.locator(".board-shell .game-cell").count(), { timeout: 120000 }).toBe(256);
  await toDark(page);
  await page.evaluate(() => document.querySelectorAll<HTMLInputElement>(".board-shell .game-cell .cell-native-input")[0]?.focus());
  await page.keyboard.press("Shift");
  await page.waitForTimeout(900);
  const cell = (await page.locator(".board-shell .game-cell").nth(0).boundingBox())!;
  const so = await page.evaluate(() => getComputedStyle(document.querySelector(".board-shell .game-cell .cell-ghost-path")!).strokeOpacity);
  await page.screenshot({
    path: `${OUT}/3-ballot-alias-095-16x16-cell0-frame-dark-chromium.png`,
    clip: { x: Math.max(0, cell.x - 24), y: Math.max(0, cell.y - 24), width: cell.width * 3 + 48, height: cell.height * 3 + 48 },
  });
  log(`3 alias arm so=${so} payload ${P16}`);
});

test("crops · forced colours: the deck's active card carries the outline (the G-LIVE-21 cure)", async ({ page }, info) => {
  test.skip(info.project.name !== "chromium", "chromium applies forced-colors emulation");
  await page.emulateMedia({ forcedColors: "active" });
  await boot(page, `?size=3&board=${P9}`);
  await page.evaluate(() => document.querySelector<HTMLElement>("button.logo-trigger")?.click());
  await expect(page.locator(".gallery-viewport")).toBeVisible({ timeout: 15000 });
  await page.waitForTimeout(1500);
  await page.keyboard.press("Tab");
  await page.evaluate(() => document.querySelector<HTMLElement>(".gallery-viewport")?.focus());
  await page.waitForTimeout(900);
  const card = await page.evaluate(() => {
    const v = document.querySelector(".gallery-viewport")!;
    const c = document.getElementById(v.getAttribute("aria-activedescendant")!)!;
    const r = c.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height, o: getComputedStyle(c).outlineStyle };
  });
  await page.screenshot({
    path: `${OUT}/4-forced-colours-deck-card-outline-light-chromium.png`,
    clip: { x: Math.max(0, card.x - 16), y: Math.max(0, card.y - 16), width: card.w + 32, height: card.h + 32 },
  });
  log(`4 forced deck outline=${card.o} payload ${P9}`);
});
