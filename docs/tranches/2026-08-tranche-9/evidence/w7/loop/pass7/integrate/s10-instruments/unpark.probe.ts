/** §10 pass-7 integration · the un-park on the UNION (FACE's exit, the foot's subjects). The chair's
 *  `rest-probes --preset unpark` reads `--action-bar-h` in `.controls-card`, both MOVED on the union
 *  (the name is struck; the bar lives in `#card-foot`), so this row drives the library's `unpark()`
 *  on the lengths the union still publishes. PLANT `stuck`: `.legend-fold`'s getAnimations() never
 *  empties, i.e. the pre-cure park (no exit) — it must red. */
import { test, expect } from "@playwright/test";
// @ts-expect-error untyped instrument copy
import { unpark } from "./instruments/rest-probes.mjs";
const BASE = process.env.BASE ?? "http://127.0.0.1:4232";
const CARD = `[...document.querySelectorAll(".controls-card")].find((c) => c.getClientRects().length)`;
const PAIRS = [
  ["--pin-tape-h", `${CARD}.style.getPropertyValue("--pin-tape-h")`, `Math.max(0, ...[...${CARD}.querySelectorAll(".washi-tag")].map((t) => Math.ceil(t.getBoundingClientRect().height))) + "px"`],
  ["--card-pad-b", `${CARD}.style.getPropertyValue("--card-pad-b")`, `(parseFloat(getComputedStyle(${CARD}).paddingBottom) || 0) + "px"`],
];
for (const [plant, mode] of [["none", "double"], ["none", "single"], ["stuck", "double"]])
    test(`unpark ${mode} plant=${plant}`, async ({ browser, browserName }) => {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
      if (plant === "stuck")
        await ctx.addInitScript(() => {
          const g = Element.prototype.getAnimations;
          Element.prototype.getAnimations = function (this: Element, o?: GetAnimationsOptions) {
            return this.classList?.contains("legend-fold") ? ([{}] as unknown as Animation[]) : g.call(this, o);
          };
        });
      const page = await ctx.newPage();
      await page.goto(`${BASE}/?size=3&difficulty=MEDIUM`);
      await page.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
      await page.waitForTimeout(1500);
      const has = await page.evaluate(() => { const b = [...document.querySelectorAll(".action-bar button")].find((x) => x.getClientRects().length && /keys/i.test((x.getAttribute("aria-label") || "") + x.textContent)); if (b) b.setAttribute("data-rest-keys", "1"); return !!b; });
      expect(has, "the keys control exists").toBe(true);
      const act = () => page.evaluate((m) => { const b = document.querySelector<HTMLElement>("[data-rest-keys]")!; b.click(); if (m === "double") b.click(); }, mode);
      const r = await unpark(page, { act, pairs: PAIRS });
      const id = await page.evaluate(() => [...document.scripts].map((s) => s.src).find((s) => /index-/.test(s))?.split("/").pop());
      console.log(`S10UNPARK|${JSON.stringify({ browserName, id, mode, plant, afterAct: r.afterAct, afterPerturb: r.afterPerturb, stale: r.stale })}`);
      if (plant === "none") expect(r.stale, "published == truth after the perturb").toEqual([]);
      else expect(r.stale.length, "the stuck park must go stale").toBeGreaterThan(0);
      await ctx.close();
    });
