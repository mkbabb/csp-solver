/** p5-4 panels: deck centre card (keyboard focus) + the armed guard's first button, light, lane vs control. Same payload both arms; PRM parks the boil so the poses match. */
import { test } from "@playwright/test";
import { mintSudoku } from "./abs-lib";
import { armGuard } from "./chrome-lib";
const RAW = "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/raw";
const ARM: Record<string, string> = { A: "http://127.0.0.1:4239", HEAD: "http://127.0.0.1:4240" };
const settle = (page: import("@playwright/test").Page) => page.waitForFunction(() => document.getAnimations().filter((a) => a.playState === "running" && Number.isFinite(a.effect?.getComputedTiming().endTime as number)).length === 0, null, { timeout: 15000 });
test("guard", async ({ page }, info) => {
  test.setTimeout(240000); const e = info.project.name;
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const arm of ["A", "HEAD"]) {
    await page.goto(`${ARM[arm]}/?view=gallery&size=3&board=${mintSudoku(3)}`);
    await page.waitForSelector(".staging-band", { timeout: 30000 }); await settle(page); await page.waitForTimeout(600);
    await page.locator(".gallery-viewport").focus(); await page.keyboard.press("Shift"); await settle(page); await page.waitForTimeout(500);
    const c = (await page.locator(".game-card.is-center").boundingBox())!;
    await page.screenshot({ path: `${RAW}/deck-${arm}-light-${e}.png`, clip: { x: Math.floor(c.x - 10), y: Math.floor(c.y - 10), width: 150, height: 90 } });
    await armGuard(page, ARM[arm]);
    const g = page.locator(".guard-btn").first(); await g.focus(); await page.keyboard.press("Shift"); await settle(page); await page.waitForTimeout(500);
    const b = (await g.boundingBox())!;
    await page.screenshot({ path: `${RAW}/guard-${arm}-light-${e}.png`, clip: { x: Math.floor(b.x - 10), y: Math.floor(b.y - 10), width: Math.ceil(b.width + 20), height: Math.ceil(b.height + 20) } });
  }
});
