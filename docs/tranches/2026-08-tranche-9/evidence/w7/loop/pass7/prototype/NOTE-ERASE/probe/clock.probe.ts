/** NOTE-ERASE pass 7 · the two-axis clock table (+ the delay longhand): node-gone ms per adversary, both engines, tree vs the PLANT (the tree with the hook's animation writes deleted = pass 6's hook), + PRM. */
import { test, expect, type Page } from "@playwright/test";
import { encodeSudoku } from "../e2e/wire";
const SOLVED_9 = [5,3,4,6,7,8,9,1,2,6,7,2,1,9,5,3,4,8,1,9,8,3,4,2,5,6,7,8,5,9,7,6,1,4,2,3,4,2,6,8,5,3,7,9,1,7,1,3,9,2,4,8,5,6,9,6,1,5,3,7,2,8,4,2,8,7,4,1,9,6,3,5,3,4,5,2,8,6,1,7,9];
const CONFLICT_BOARD = encodeSudoku(3, Object.fromEntries(SOLVED_9.map((v, i) => [i, i < 9 ? 0 : v])), 81);
const ADV: Record<string, string> = {
  none: "",
  transition: "#app .margin-note-ink { transition: color 1000ms linear !important; }",
  ancestorRung: ".margin-note { --motion-whisper: 900ms; }",
  animImportant: ".margin-note-ink.note-leave-active { animation-duration: 900ms !important; }",
  animDelay: ".margin-note-ink.note-leave-active { animation-delay: 750ms !important; }",
};
async function set(page: Page, i: number, v: string) {
  await page.evaluate(([i, v]) => { const input = document.querySelectorAll(".board-cells input")[Number(i)] as HTMLInputElement; Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(input, v); input.dispatchEvent(new Event("input", { bubbles: true })); }, [String(i), v]);
}
for (const arm of (process.env.ARMS ?? "tree:4248,plant:4247").split(","))
  for (const prm of [false, true])
    for (const adv of Object.keys(ADV)) {
      const [name, port] = arm.split(":");
      if (prm && adv !== "none" && adv !== "animImportant" && adv !== "animDelay") continue;
      test(`${name} ${adv}${prm ? " PRM" : ""}`, async ({ browser, browserName }) => {
        const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: prm ? "reduce" : "no-preference" });
        const page = await ctx.newPage();
        await page.goto(`http://127.0.0.1:${port}/?board=${CONFLICT_BOARD}`);
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
            if (el && !rec.el) { const cs = getComputedStyle(el); Object.assign(rec, { el, t0: performance.now(), td: cs.transitionDuration, ad: cs.animationDuration, an: cs.animationName, inlineAD: (el as HTMLElement).style.getPropertyValue("animation-duration") + "|" + (el as HTMLElement).style.getPropertyPriority("animation-duration"), adl: cs.animationDelay }); }
            if (rec.el && rec.t1 === undefined && !rec.el.isConnected) rec.t1 = performance.now();
          }).observe(host, { subtree: true, childList: true, attributes: true, attributeFilter: ["class"] });
        });
        await set(page, 1, "");
        const read = () => page.evaluate(() => { const r = (window as any).__l; return r.t1 === undefined ? null : { ms: Math.round((r.t1 - r.t0) * 10) / 10, td: r.td, ad: r.ad, an: r.an, inlineAD: r.inlineAD, adl: r.adl }; });
        await expect.poll(read, { timeout: 5000 }).not.toBeNull();
        console.log(`E7CLOCK|${browserName}|${name}|${adv}${prm ? "+PRM" : ""}|${JSON.stringify(await read())}`);
        await ctx.close();
      });
    }
