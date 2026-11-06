// crit-MOT-LADDER pass 10: the reveal's computed clock on a served dist (the pass-9 critic's critl9 spec + iterations,
// activeDuration, endTime and the timeline), driven by the product (a fresh deal). One context per test (playwright default).
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
          const all = el.getAnimations();
          const a = all.find((x) => x.animationName === "cell-reveal" || x.animationName === "cell-pop") ?? all[0];
          const t = a ? a.effect.getComputedTiming() : null;
          return {
            n: els.length,
            name: cs.animationName,
            dur: cs.animationDuration,
            delay: cs.animationDelay,
            iter: cs.animationIterationCount,
            ease: cs.animationTimingFunction,
            timeline: cs.animationTimeline ?? null,
            anims: all.length,
            animName: a ? a.animationName : null,
            playState: a ? a.playState : null,
            docTimeline: a ? a.timeline === document.timeline : null,
            effectMs: t ? t.duration : null,
            effectDelay: t ? t.delay : null,
            iterations: t ? t.iterations : null,
            activeDuration: t ? t.activeDuration : null,
            endTime: t ? t.endTime : null,
            visibleMs: t ? Math.max(0, t.activeDuration + Math.min(0, t.delay)) : null,
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
