#!/usr/bin/env node
/**
 * THE REVERSAL, AT THE DOCK'S OWN CLOCK (MOT-DERIVE pass-1 gap 3, closed).
 *
 * A mid-glide re-click retargets by `anim.reverse()`, and the never-never guard is re-armed
 * from `guardMs`. With a per-run duration those two must agree: the guard the reversal re-arms
 * has to be the LIVE run's (600+220 on the dock, 520+220 on the desk), not the controller's
 * default. This probe re-clicks 200ms into an open, then reads: the animation's own duration,
 * where the sheet rests afterwards, and whether the phase returned to idle.
 */
import { chromium, webkit } from "playwright";
import process from "node:process";

const BASE = process.env.BASE ?? "http://127.0.0.1:4248/";

for (const [name, launcher] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const browser = await launcher.launch({ headless: true });
  for (const vp of [
    { n: "390x844", w: 390, h: 844, dsf: 3, mobile: true, expectMs: 600 },
    { n: "1440x900", w: 1440, h: 900, dsf: 2, mobile: false, expectMs: 520 },
  ]) {
    const ctx = await browser.newContext({
      viewport: { width: vp.w, height: vp.h },
      deviceScaleFactor: vp.dsf,
      hasTouch: vp.mobile,
      isMobile: name === "chromium" ? vp.mobile : undefined,
    });
    const page = await ctx.newPage();
    await page.goto(BASE + "?size=3&difficulty=EASY");
    await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
    await page.waitForSelector(".sudoku-cell .glyph-svg", { timeout: 30000 });
    await page.waitForTimeout(1600);
    const tab = page.locator(".drawer-tab").first();
    const rect = () => page.evaluate(() => {
      const e = document.querySelector(".scene-controls");
      const r = e.getBoundingClientRect();
      return { y: +r.top.toFixed(1), x: +r.left.toFixed(1) };
    });
    const before = await rect();
    await tab.click({ force: true });
    await page.waitForTimeout(200); // mid-glide
    const live = await page.evaluate(() =>
      document.getAnimations().map((a) => ({
        dur: a.effect?.getTiming?.().duration,
        dir: a.playbackRate,
        cls: String(a.effect?.target?.className ?? "").slice(0, 24),
      })).filter((a) => a.cls.includes("scene-controls") || a.cls.includes("board-peek") || a.cls.includes("masthead")),
    );
    await tab.click({ force: true }); // RE-CLICK: retarget by reversal
    const reversed = await page.evaluate(() =>
      document.getAnimations().map((a) => ({
        dur: a.effect?.getTiming?.().duration,
        rate: a.playbackRate,
        cls: String(a.effect?.target?.className ?? "").slice(0, 24),
      })).filter((a) => a.cls.includes("scene-controls")),
    );
    await page.waitForTimeout(1400);
    const after = await rect();
    const settled = await page.evaluate(() => ({
      phaseIdle: !document.documentElement.classList.contains("drawer-gesturing"),
      anims: document.getAnimations().filter((a) => String(a.effect?.target?.className ?? "").includes("scene-controls")).length,
    }));
    console.log(
      `${name} ${vp.n} expect=${vp.expectMs}ms  live=${JSON.stringify(live)}  reversedRate=${JSON.stringify(reversed)}  rest ${JSON.stringify(before)} -> ${JSON.stringify(after)}  restRestored=${before.x === after.x && before.y === after.y}  ${JSON.stringify(settled)}`,
    );
    await ctx.close();
  }
  await browser.close();
}
