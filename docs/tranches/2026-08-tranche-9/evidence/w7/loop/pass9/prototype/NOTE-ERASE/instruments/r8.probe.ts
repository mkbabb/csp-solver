/** NOTE-ERASE pass 9 · T9-R8 re-read on the union (never bent): the note's settled rung under the ONE glyph-pop
 *  (imported by RELATIVE product path), 1280x800, DPR 1 and 2, light, both engines; arms by port (R8_ARMS=name:port,…). */
import { test } from "@playwright/test";
import { glyphGate } from "../e2e/lib/glyph-pop.mjs";
import { encodeSudoku } from "../e2e/wire";
const GIVENS: Record<number, number> = { 0: 5, 1: 3, 4: 7, 9: 6, 12: 1, 13: 9, 14: 5, 19: 9, 20: 8, 25: 6, 27: 8, 31: 6, 35: 3, 36: 4, 39: 8, 41: 3, 44: 1, 45: 7, 49: 2, 53: 6, 55: 6, 60: 2, 61: 8, 66: 4, 67: 1, 68: 9, 71: 5, 76: 8, 79: 7, 80: 9 };
const PAYLOAD = encodeSudoku(3, GIVENS, 81);
const ARMS = (process.env.R8_ARMS ?? "u9:4240,ctl:4248").split(",").map((a) => a.split(":"));
for (const dpr of [1, 2])
  for (const [arm, port] of ARMS)
    test(`r8 ${arm} dpr${dpr}`, async ({ browser, browserName }) => {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: dpr, colorScheme: "light" });
      const page = await ctx.newPage();
      await page.goto(`http://127.0.0.1:${port}/?board=${PAYLOAD}`);
      await page.waitForSelector("path.cell-line", { state: "attached", timeout: 60000 });
      await page.waitForTimeout(1500);
      const ask = async () => {
        await page.evaluate(() => ([...document.querySelectorAll(".game-cell input")] as HTMLInputElement[]).find((i) => !i.value)?.focus());
        await page.keyboard.press("h");
      };
      await ask();
      await page.waitForTimeout(4000);
      const settled = await page.evaluate(() => [...document.querySelectorAll(".margin-note-ink")].map((e) => `${e.getAttribute("data-note-age")}`).join(","));
      for (const subject of ['.margin-note-ink[data-note-age="settled"]', ".margin-note-ink"]) {
        const n = await page.locator(subject).count();
        if (!n) { console.log(`R8|${browserName}|dpr${dpr}|${arm}|${subject}|ABSENT|ages=${settled}`); continue; }
        const g = await glyphGate(page, { subject, payload: `r8-${arm}-hint`, plants: {} });
        const c = g.clean as Record<string, unknown>;
        console.log(`R8|${browserName}|dpr${dpr}|${arm}|${subject}|ages=${settled}|median=${c.median ?? c.med ?? "?"}|fracUnder=${c.fracUnder ?? "?"}|${JSON.stringify(c).slice(0, 300)}`);
      }
      await ctx.close();
    });
