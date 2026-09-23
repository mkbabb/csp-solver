import { test } from "@playwright/test";
import { PINNED_URL } from "./board";
const OUT = "/private/tmp/claude-504/-Users-mkbabb-Programming-csc411-CSC411-HW2-ProgrammingQuestion/b26a5145-f034-45a7-a7f0-2781da45a9b3/scratchpad/crit-out/paint";
const ARMS: [string, string][] = [["T5", "http://127.0.0.1:4243"], ["T4", "http://127.0.0.1:4245"], ["T4b", "http://127.0.0.1:4245"], ["CTL", "http://127.0.0.1:4244"], ["CTLb", "http://127.0.0.1:4244"]];
for (const dark of [false, true])
  for (const vp of [{ w: 1440, h: 900, touch: false }, { w: 390, h: 844, touch: true }])
    test(`paint ${dark ? "dark" : "light"} ${vp.w}`, async ({ browser, browserName }) => {
      for (const [name, base] of ARMS) {
        const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, hasTouch: vp.touch, colorScheme: dark ? "dark" : "light", reducedMotion: "reduce" });
        const p = await ctx.newPage();
        await p.goto(base + PINNED_URL);
        await p.locator(".board-cells").first().waitFor();
        await p.waitForTimeout(3000);
        await p.screenshot({ path: `${OUT}/${browserName}-${dark ? "dark" : "light"}-${vp.w}-${name}.png` });
        await ctx.close();
      }
    });
