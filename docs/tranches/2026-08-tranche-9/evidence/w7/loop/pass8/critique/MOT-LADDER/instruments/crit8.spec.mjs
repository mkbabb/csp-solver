// MOT-LADDER pass-8 CRITIC · computed reads on a served dist, driven by the product (a fresh deal
// arms the givens' reveal; nothing written into a Vue node). One row per engine per arm.
import { test } from "@playwright/test";
import { appendFileSync } from "node:fs";
const ARM = process.env.C8_ARM ?? "?";
const OUT = process.env.C8_OUT;
for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  test(`reveal + leave rung @${vp.width}x${vp.height}`, async ({ page }, info) => {
    await page.setViewportSize(vp);
    await page.goto("/?game=sudoku");
    const reveal = await (
      await page.waitForFunction(
        () => {
          const el = document.querySelector(".cell-reveal-animated");
          if (!el) return null;
          const cs = getComputedStyle(el);
          const a = el.getAnimations().find((x) => x.animationName === "cell-reveal");
          return {
            name: cs.animationName,
            dur: cs.animationDuration,
            effectMs: a ? a.effect.getTiming().duration : null,
            n: document.querySelectorAll(".cell-reveal-animated").length,
          };
        },
        null,
        { timeout: 30000, polling: "raf" },
      )
    ).jsonValue();
    const rest = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      const bc = document.querySelector(".board-cells");
      const at = document.querySelector(".attribution-trigger");
      return {
        rootLeave: root.getPropertyValue("--motion-leave").trim(),
        rootWhisper: root.getPropertyValue("--motion-whisper").trim(),
        boardCellsLeave: bc ? getComputedStyle(bc).getPropertyValue("--motion-leave").trim() : null,
        attribDur: at ? getComputedStyle(at).transitionDuration : null,
        js: [...document.querySelectorAll("script[src]")].map((s) => s.getAttribute("src")).find((s) => /index-/.test(s)),
      };
    });
    const row = { arm: ARM, engine: info.project.name, vp: `${vp.width}x${vp.height}`, reveal, ...rest };
    appendFileSync(OUT, JSON.stringify(row) + "\n");
    console.log(JSON.stringify(row));
  });
}
