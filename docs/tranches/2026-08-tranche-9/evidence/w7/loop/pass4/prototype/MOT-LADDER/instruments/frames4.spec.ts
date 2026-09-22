import { test } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { PINNED_URL } from "./board";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass4/prototype/MOT-LADDER";
mkdirSync(OUT, { recursive: true });

const AFTER = process.env.PW_AFTER ?? "http://127.0.0.1:4246";
const SHIPPED = 520;

/**
 * THE BALLOT'S TWO FRAMES (U-10). Both arms are THIS build; only the dock's clock differs,
 * substituted at the instrument exactly as the audition does. Both are read at the SAME wall
 * clock — 300ms after the tap — because that is the only thing a still can honestly show:
 * how far the sheet has come by a fixed instant. A still cannot show a smear, and this
 * record does not claim it does; the smear is the audition's rate column.
 */
for (const clock of [520, 600]) {
  test(`frame · dock sheet 300ms after the tap, rise ${clock}`, async ({
    browser,
    browserName,
  }) => {
    test.setTimeout(180000);
    const ctx = await browser.newContext({
      viewport: { width: 768, height: 1024 },
      hasTouch: true,
    });
    const page = await ctx.newPage();
    await page.addInitScript(
      ([shipped, want]) => {
        const orig = Element.prototype.animate;
        Element.prototype.animate = function (frames: unknown, opts: unknown) {
          const o = opts as Record<string, unknown> | undefined;
          if (o && o.duration === shipped && o.composite === "replace" && o.fill === "none")
            return orig.call(this, frames as never, { ...o, duration: want } as never);
          return orig.call(this, frames as never, opts as never);
        } as typeof Element.prototype.animate;
      },
      [SHIPPED, clock] as [number, number],
    );
    await page.goto(AFTER + PINNED_URL);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(600);
    const witness = await page.evaluate(() => matchMedia("(pointer: coarse)").matches);
    console.log(`frame ${browserName} rise${clock}: pointer coarse = ${witness}`);
    const tab = page.locator(".drawer-tab").first();
    await tab.click({ force: true });
    await page.waitForTimeout(300);
    await page.screenshot({
      path: `${OUT}/frame-dock-${clock}ms-${browserName}-768x1024-light-coarse.png`,
      clip: { x: 0, y: 220, width: 768, height: 560 },
      scale: "css",
    });
    await ctx.close();
  });
}
