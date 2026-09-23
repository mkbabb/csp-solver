/** T9-W7 pass 5 · MRK-ABS — raw panels for the ≤4 cited crops. Every board panel loads the SAME
 *  codec payload on its own arm's dist; one variable per pair (the arm), engine/theme/viewport/
 *  pointer held. Composited by crops.mjs. */
import { test, expect, type Page } from "@playwright/test";
import fs from "node:fs";
import { mintSudoku, setTheme, loadBoard } from "./abs-lib";
const RAW = "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/raw";
fs.mkdirSync(RAW, { recursive: true });
const ARM: Record<string, string> = { A: "http://127.0.0.1:4239", B: "http://127.0.0.1:4241", C: "http://127.0.0.1:4242", D: "http://127.0.0.1:4243", HEAD: "http://127.0.0.1:4240" };
async function cell0(page: Page, path: string) {
  await page.locator(".board-shell .game-cell .cell-native-input").first().focus();
  await page.keyboard.press("Shift"); await page.waitForTimeout(600);
  const r = (await page.locator(".board-shell .game-cell").first().boundingBox())!;
  await page.screenshot({ path, clip: { x: Math.floor(r.x - 14), y: Math.floor(r.y - 14), width: Math.ceil(r.width * 2 + 28), height: Math.ceil(r.height * 2 + 28) } });
  await page.evaluate(() => (document.activeElement as HTMLElement)?.blur());
}
test("panels", async ({ page }, info) => {
  test.setTimeout(600000);
  const e = info.project.name; const log: Record<string, unknown> = {};
  const prior = process.env.FORCED_ONLY ? JSON.parse(fs.readFileSync(`${RAW}/log-${e}.json`, "utf8")) : {};
  Object.assign(log, prior);
  for (const arm of process.env.FORCED_ONLY ? [] : ["A", "B", "C", "D"]) {
    const pl = await loadBoard(page, ARM[arm], 4); log[arm] = pl.givens.split(",").length;
    for (const theme of ["light", "dark"] as const) { await setTheme(page, theme); await cell0(page, `${RAW}/board-${arm}-${theme}-${e}.png`); }
  }
  for (const arm of ["A", "HEAD"]) {
    await page.emulateMedia({ forcedColors: "active" });
    await page.goto(`${ARM[arm]}/?view=gallery&size=3&board=${mintSudoku(3)}`);
    await page.waitForSelector(".staging-band", { timeout: 30000 }); await page.waitForTimeout(900);
    await page.locator(".gallery-viewport").focus(); await page.keyboard.press("Shift");
    // settle: the first shot caught the lane's card mid route transition (title at partial opacity); poll to zero running finite animations
    await page.waitForFunction(() => document.getAnimations().filter((a) => a.playState === "running" && Number.isFinite(a.effect?.getComputedTiming().endTime as number)).length === 0, null, { timeout: 15000 });
    await page.waitForTimeout(700);
    const c = (await page.locator(".game-card.is-center").boundingBox())!;
    const oc = await page.evaluate(() => getComputedStyle(document.querySelector(".game-card.is-center")!).outlineColor);
    log[`forced-${arm}`] = oc;
    await page.screenshot({ path: `${RAW}/forced-deck-${arm}-light-${e}.png`, clip: { x: Math.floor(c.x - 12), y: Math.floor(c.y - 12), width: Math.ceil(c.width + 24), height: Math.min(200, Math.ceil(c.height + 24)) } });
    await page.emulateMedia({ forcedColors: "none" });
  }
  fs.writeFileSync(`${RAW}/log-${e}.json`, JSON.stringify({ payload16: mintSudoku(4), payload9: mintSudoku(3), ...log }, null, 1));
  expect(Object.keys(log).length).toBeGreaterThan(0);
});
