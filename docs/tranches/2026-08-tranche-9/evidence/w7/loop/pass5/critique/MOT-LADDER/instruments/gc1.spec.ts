import { test } from "@playwright/test";
import { PINNED_URL } from "./board";
test("gc1", async ({ browser, browserName }) => {
  for (const [arm, base] of [["T5", "http://127.0.0.1:4243"], ["T4", "http://127.0.0.1:4245"], ["CTL", "http://127.0.0.1:4244"]]) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage();
    await p.goto(base + PINNED_URL);
    await p.locator(".board-cells").first().waitFor();
    await p.waitForTimeout(1500);
    await p.locator("button.logo-trigger").first().click();
    await p.locator(".gallery-viewport").first().waitFor();
    await p.waitForTimeout(2000);
    const r = await p.evaluate(async () => {
      const face = document.querySelector(".live-face-fit") as HTMLElement | null;
      const host = document.querySelector(".board-peek-host") as HTMLElement | null;
      const rect = (e: Element | null) => { if (!e) return null; const b = e.getBoundingClientRect(); return [+b.width.toFixed(1), +b.height.toFixed(1)]; };
      const before = { inline: face?.style.getPropertyValue("--live-fit"), board: rect(host), slot: rect(face?.parentElement ?? null) };
      face?.style.removeProperty("--live-fit");
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      return { before, afterStrip: { computed: face ? getComputedStyle(face).getPropertyValue("--live-fit") : null, tf: face ? getComputedStyle(face).transform : null, board: rect(host) } };
    });
    console.log("GC1", browserName, arm, JSON.stringify(r));
    await ctx.close();
  }
});
