import { test } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { PINNED_URL, PAYLOAD } from "./board";

const RAW = process.env.RAW ?? "/tmp/mlb-ballot";
mkdirSync(RAW, { recursive: true });
const AFTER = process.env.PW_AFTER ?? "http://127.0.0.1:4246";
const SHIPPED = 520;
const TIMES = [80, 160, 240, 320, 400, 480];

/**
 * T9-B11 · THE DOCK'S CLOCK, 520 vs 600, ONE variable. Same build, same payload, same engine,
 * theme, viewport and pointer class; only the clock is substituted, at the same seam the
 * audition used (`Element.prototype.animate` for useFlipGlide's exact signature). The sheet's
 * animation is PAUSED at the tap and SEEKED to each instant, so every pose is the curve's own
 * value at t — never a screenshot's latency. A strip of six instants shows what one still cannot:
 * how much further the 520 sheet has come at the same t, which is the rate the ballot prices.
 */
for (const clock of [520, 600]) {
  test(`ballot5 · dock sheet strip, rise ${clock}`, async ({ browser, browserName }) => {
    test.setTimeout(180000);
    const ctx = await browser.newContext({ viewport: { width: 768, height: 1024 }, hasTouch: true });
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
    await page.locator(".board-cells").first().waitFor();
    await page.waitForTimeout(1800);
    const coarse = await page.evaluate(() => matchMedia("(pointer: coarse)").matches);
    await page.locator(".drawer-tab").first().click({ force: true });
    // pause every running mover the tap started; each pose below is a SEEK, not a wait
    const n = await page.evaluate(() => {
      const a = document.getAnimations().filter((x) => x.playState === "running");
      a.forEach((x) => x.pause());
      (window as any).__ballot = a;
      return a.map((x) => (x.effect?.getTiming().duration as number) ?? 0);
    });
    for (const t of TIMES) {
      await page.evaluate((tt) => (window as any).__ballot.forEach((x: Animation) => (x.currentTime = tt)), t);
      await page.waitForTimeout(80);
      await page.screenshot({
        path: `${RAW}/${browserName}-${clock}-${t}.png`,
        clip: { x: 0, y: 0, width: 768, height: 1024 },
        scale: "css",
      });
    }
    console.log(`ballot5 ${browserName} rise${clock}: coarse ${coarse}, paused ${n.length} animations, durations ${JSON.stringify(n)}, payload ${PAYLOAD.slice(0, 24)}…`);
    await ctx.close();
  });
}
