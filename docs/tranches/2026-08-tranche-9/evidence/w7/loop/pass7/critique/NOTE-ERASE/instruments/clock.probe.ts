/** NOTE-ERASE pass-7 CRITIC · the clock, re-measured. Tree dist on :4244 (index-CNyQnHaWLGEi). The PLANT is in-page:
 *  an init script that drops the hook's animation-duration / animation-delay writes (= pass 6's hook) — same dist, same run. */
import { test, expect, type Page } from "@playwright/test";
import { encodeSudoku } from "../e2e/wire";
const SOLVED_9 = [5,3,4,6,7,8,9,1,2,6,7,2,1,9,5,3,4,8,1,9,8,3,4,2,5,6,7,8,5,9,7,6,1,4,2,3,4,2,6,8,5,3,7,9,1,7,1,3,9,2,4,8,5,6,9,6,1,5,3,7,2,8,4,2,8,7,4,1,9,6,3,5,3,4,5,2,8,6,1,7,9];
const CONFLICT_BOARD = encodeSudoku(3, Object.fromEntries(SOLVED_9.map((v, i) => [i, i < 9 ? 0 : v])), 81);
const ADV: Record<string, string> = {
  none: "",
  ancestorRung: ".margin-note { --motion-whisper: 900ms; }",
  animImportant: ".margin-note-ink.note-leave-active { animation-duration: 900ms !important; }",
  animDelay: ".margin-note-ink.note-leave-active { animation-delay: 750ms !important; }",
  // critic's own
  layeredImportant: "@layer crit { .margin-note-ink.note-leave-active { animation-duration: 900ms !important; animation-delay: 300ms !important; } }",
  shorthandImportant: ".margin-note-ink.note-leave-active { animation: ink-rub-out 900ms linear 200ms !important; }",
  iterCount: ".margin-note-ink.note-leave-active { animation-iteration-count: 6 !important; }",
  rootRung: ":root { --motion-whisper: 900ms !important; }",
};
const PLANT = `(() => { const o = CSSStyleDeclaration.prototype.setProperty; CSSStyleDeclaration.prototype.setProperty = function (p, v, pr) { if (p === "animation-duration" || p === "animation-delay") return; return o.call(this, p, v, pr); }; })();`;
async function set(page: Page, i: number, v: string) {
  await page.evaluate(([i, v]) => { const input = document.querySelectorAll(".board-cells input")[Number(i)] as HTMLInputElement; Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(input, v); input.dispatchEvent(new Event("input", { bubbles: true })); }, [String(i), v]);
}
for (const arm of ["tree", "plant"])
  for (const adv of Object.keys(ADV))
    test(`${arm} ${adv}`, async ({ browser, browserName }) => {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
      if (arm === "plant") await ctx.addInitScript(PLANT);
      const page = await ctx.newPage();
      await page.goto(`http://127.0.0.1:4244/?board=${CONFLICT_BOARD}`);
      const id = await page.evaluate(() => [...document.scripts].map((s) => s.src).find((s) => /index-.*\.js/.test(s)) ?? "");
      expect(id).toContain("CNyQnHaWLGEi");
      await expect.poll(() => page.locator(".sudoku-cell .glyph-svg").count(), { timeout: 20000 }).toBe(72);
      await page.waitForSelector("g.boil-frame-layer.is-active", { state: "attached", timeout: 20000 });
      if (ADV[adv]) await page.addStyleTag({ content: ADV[adv] });
      await set(page, 0, "9"); await set(page, 1, "9");
      await page.locator('.controls-card button[aria-label="Solve puzzle"]').click();
      await expect(page.locator(".margin-note")).toHaveClass(/teacher-red/, { timeout: 15000 });
      await page.evaluate(() => {
        const host = document.querySelector(".margin-note")!; const rec: any = {}; (window as any).__l = rec;
        new MutationObserver(() => {
          const el = rec.el ?? host.querySelector(".margin-note-ink.note-leave-active");
          if (el && !rec.el) { const cs = getComputedStyle(el); Object.assign(rec, { el, t0: performance.now(), ad: cs.animationDuration, adl: cs.animationDelay, ic: cs.animationIterationCount, td: cs.transitionDuration }); }
          if (rec.el && rec.t1 === undefined && !rec.el.isConnected) rec.t1 = performance.now();
        }).observe(host, { subtree: true, childList: true, attributes: true, attributeFilter: ["class"] });
      });
      await set(page, 1, "");
      const read = () => page.evaluate(() => { const r = (window as any).__l; return r.t1 === undefined ? null : { ms: Math.round((r.t1 - r.t0) * 10) / 10, ad: r.ad, adl: r.adl, ic: r.ic, td: r.td }; });
      await expect.poll(read, { timeout: 5000 }).not.toBeNull();
      const load = "";
      console.log(`CRITCLOCK|${browserName}|${arm}|${adv}|${JSON.stringify(await read())}`);
      await ctx.close();
    });
