/** T9-W7 pass 4 · MRK-ABS — raw panels for the ≤4 cited crops (composited by magick after). */
import { test, expect } from "@playwright/test";
import { mintSudoku, setTheme, inject } from "./abs-lib";
const RAW = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-39/web/frontend/.p4-mrkabs/raw";
const PANEL = process.env.PANEL ?? "ballot";

async function focusCell(page: import("@playwright/test").Page, i: number) {
  await page.evaluate((i) => document.querySelectorAll<HTMLInputElement>(".board-shell .game-cell .cell-native-input")[i]?.focus(), i);
  await page.keyboard.press("Shift"); await page.waitForTimeout(500);
}
async function cellClip(page: import("@playwright/test").Page, i: number, pad = 16) {
  const r = (await page.locator(".board-shell .game-cell").nth(i).boundingBox())!;
  return { x: Math.floor(r.x - pad), y: Math.floor(r.y - pad), width: Math.ceil(r.width * 2 + pad * 2), height: Math.ceil(r.height + pad * 2) };
}

async function armGuard(page: Page) {
  await page.goto(`/?size=3&difficulty=EASY&board=${mintSudoku(3)}`);
  await expect.poll(() => page.locator(".sudoku-cell").count(), { timeout: 60000 }).toBe(81);
  const blank = await page.evaluate(() => { const c = document.querySelectorAll(".sudoku-cell"); for (let i = 0; i < c.length; i++) if (!c[i].querySelector(".glyph-svg")) return i; return -1; });
  await page.evaluate((idx) => { const input = document.querySelectorAll(".sudoku-cell input")[idx] as HTMLInputElement;
    input.focus(); const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!; set.call(input, "1");
    input.dispatchEvent(new Event("input", { bubbles: true })); }, blank);
  await page.waitForTimeout(300);
  await page.locator("button.logo-trigger").evaluate((n: HTMLElement) => n.focus());
  await page.keyboard.press("Enter");
  await page.waitForSelector(".staging-band", { timeout: 20000 });
  await page.waitForTimeout(900);
  const vp = page.locator(".gallery-viewport"); await vp.focus();
  for (let i = 0; i < 4; i++) await vp.press("ArrowRight");
  await page.waitForTimeout(700);
  await page.locator(".staging-deal").evaluate((n: HTMLElement) => n.focus());
  await page.keyboard.press("Enter");
  await expect(page.locator(".gallery-guard")).toBeVisible({ timeout: 10000 });
  await page.waitForTimeout(700);
}

test("panels", async ({ page }, info) => {
  const e = info.project.name;
  if (PANEL === "ballot" || PANEL === "inset") {
    await page.goto(`/?size=4&board=${mintSudoku(4)}`);
    await expect.poll(() => page.locator(".board-shell .game-cell").count(), { timeout: 120000 }).toBe(256);
    const themes = PANEL === "ballot" ? (["light", "dark"] as const) : (["light"] as const);
    for (const theme of themes) {
      await setTheme(page, theme);
      const arms = PANEL === "ballot"
        ? [["one", ""], ["two", `:root{--color-focus-sketch:#4589d2!important}:root.dark{--color-focus-sketch:#2f68aa!important}`]]
        : [[process.env.F ?? "f", ""]];
      for (const [name, css] of arms) {
        await inject(page, css); await focusCell(page, 0);
        await page.screenshot({ path: `${RAW}/${PANEL}-${e}-${theme}-${name}.png`, clip: await cellClip(page, 0) });
        await page.evaluate(() => (document.activeElement as HTMLElement)?.blur()); await inject(page, "");
      }
    }
  }
  if (PANEL === "guard") {
    await armGuard(page);
    await page.locator(".guard-leave").evaluate((n: HTMLElement) => n.focus()); await page.keyboard.press("Shift"); await page.waitForTimeout(500);
    const g = (await page.locator(".gallery-guard").boundingBox())!;
    await page.screenshot({ path: `${RAW}/guard-${e}-light.png`, clip: { x: Math.floor(g.x - 10), y: Math.floor(g.y - 10), width: Math.ceil(g.width + 20), height: Math.ceil(g.height + 20) } });
  }
  if (PANEL === "deck") {
    await page.goto(`/?view=gallery&size=3&board=${mintSudoku(3)}`);
    await page.waitForSelector(".staging-band", { timeout: 30000 }); await page.waitForTimeout(900);
    await page.locator(".gallery-viewport").focus(); await page.keyboard.press("Shift"); await page.waitForTimeout(500);
    const c = (await page.locator(".game-card.is-center").boundingBox())!;
    await page.screenshot({ path: `${RAW}/deck-${e}-light.png`, clip: { x: Math.floor(c.x - 14), y: Math.floor(c.y - 14), width: Math.ceil(c.width + 28), height: Math.min(260, Math.ceil(c.height + 28)) } });
  }
});
