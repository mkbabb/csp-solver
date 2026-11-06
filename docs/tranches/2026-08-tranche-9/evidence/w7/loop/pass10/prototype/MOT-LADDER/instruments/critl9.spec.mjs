// pass-9 critic (MOT-LADDER): the reveal's computed clock on a served dist, driven by the product (a fresh deal).
import { test } from "@playwright/test";
import { appendFileSync } from "node:fs";
const ARM = process.env.CL9_ARM ?? "?";
const OUT = process.env.CL9_OUT;
for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  test(`reveal clock @${vp.width}x${vp.height}`, async ({ page }, info) => {
    await page.setViewportSize(vp);
    await page.goto("/?game=sudoku");
    const reveal = await (
      await page.waitForFunction(
        () => {
          const els = [...document.querySelectorAll(".cell-reveal-animated")];
          if (!els.length) return null;
          const el = els[0];
          const cs = getComputedStyle(el);
          const a = el.getAnimations().find((x) => x.animationName === "cell-reveal");
          const t = a ? a.effect.getTiming() : null;
          return {
            n: els.length,
            name: cs.animationName,
            dur: cs.animationDuration,
            delay: cs.animationDelay,
            ease: cs.animationTimingFunction,
            classes: el.className,
            effectMs: t ? t.duration : null,
            effectDelay: t ? t.delay : null,
            activeMs: t ? Math.max(0, t.duration + Math.min(0, t.delay)) : null,
          };
        },
        null,
        { timeout: 45000, polling: "raf" },
      )
    ).jsonValue();
    const js = await page.evaluate(() =>
      [...document.querySelectorAll("script[src]")].map((s) => s.getAttribute("src")).find((s) => /index-/.test(s)),
    );
    const row = { arm: ARM, engine: info.project.name, vp: `${vp.width}x${vp.height}`, js, reveal };
    appendFileSync(OUT, JSON.stringify(row) + "\n");
    console.log(JSON.stringify(row));
  });
}
