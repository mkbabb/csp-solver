// MOT-LADDER pass 8 · the behavioural rows: what the reveal and the toggle COMPUTE on a served dist.
// Drives the product only: a fresh deal arms `.cell-reveal-animated` on the givens (useGameState's
// deal), and the toggle is pressed like a reader presses it. Nothing is written into a Vue node.
import { test } from "@playwright/test";
import { appendFileSync } from "node:fs";
const ARM = process.env.L8_ARM ?? "?";
const OUT = process.env.L8_OUT;
test("reveal duration + toggle curve", async ({ page }, info) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/?game=sudoku");
  // read in the SAME task that finds the armed cell (WebKit disarmed between a locator's attach
  // and a second evaluate on the 150 ms plant: n 0, name none)
  const reveal = await (
    await page.waitForFunction(
      () => {
        const el = document.querySelector(".cell-reveal-animated");
        if (!el) return null;
        const cs = getComputedStyle(el);
        return {
          name: cs.animationName,
          dur: cs.animationDuration,
          ease: cs.animationTimingFunction,
          n: document.querySelectorAll(".cell-reveal-animated").length,
        };
      },
      null,
      { timeout: 20000, polling: "raf" },
    )
  ).jsonValue();
  const token = await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue("--ease-anticipatePop").trim(),
  );
  const toggle = page.locator(".sun-moon-toggle").first();
  await toggle.waitFor();
  await toggle.click();
  await page.waitForTimeout(50);
  const star = await page.evaluate(() => {
    const el = document.querySelector(".toggle-icon.is-active .twinkle-star");
    if (!el) return { found: false };
    const cs = getComputedStyle(el);
    return { found: true, prop: cs.transitionProperty, ease: cs.transitionTimingFunction, dur: cs.transitionDuration };
  });
  const js = await page.evaluate(() =>
    [...document.querySelectorAll("script[src]")].map((s) => s.getAttribute("src")).find((s) => /index-/.test(s)),
  );
  const row = { arm: ARM, engine: info.project.name, js, reveal, token, star };
  appendFileSync(OUT, JSON.stringify(row) + "\n");
  console.log(JSON.stringify(row));
});
