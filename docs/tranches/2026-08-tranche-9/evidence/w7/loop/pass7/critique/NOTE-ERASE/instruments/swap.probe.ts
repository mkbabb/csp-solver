/** NOTE-ERASE pass-7 CRITIC · the SWAP leave on the union (HOLD default): union as integrated (:4246, C4rwyft5SG8y)
 *  vs union + the pass-7 delta (U1) + union-carry (:4247, B6mPe1IcFLAX). A record proved and held; a second hint
 *  displaces it (setMargin pushes it to line two => leaveName() = "note-swap", whose CSS is `animation: none`). */
import { test, expect, type Page } from "@playwright/test";
import { encodeSudoku } from "../e2e/wire";
const GIVENS: Record<number, number> = { 0: 5, 1: 3, 4: 7, 9: 6, 12: 1, 13: 9, 14: 5, 19: 9, 20: 8, 25: 6, 27: 8, 31: 6, 35: 3, 36: 4, 39: 8, 41: 3, 44: 1, 45: 7, 49: 2, 53: 6, 55: 6, 60: 2, 61: 8, 66: 4, 67: 1, 68: 9, 71: 5, 76: 8, 79: 7, 80: 9 };
const PAYLOAD = encodeSudoku(3, GIVENS, 81);
const EXPECTED = Array.from({ length: 81 }, (_, i) => (GIVENS[i] ? String(GIVENS[i]) : ".")).join("");
const SOLUTION = "534678912672195348198342567859761423426853791713924856961537284287419635345286179";
const bs = (p: Page) => p.evaluate(() => [...document.querySelectorAll(".game-cell input")].map((i) => (i as HTMLInputElement).value || ".").join(""));
const ga = (p: Page) => p.evaluate(() => [...document.querySelectorAll(".game-cell input")].map((i) => /given clue (\S+)/.exec(i.getAttribute("aria-label") ?? "")?.[1] ?? ".").join(""));
const lineOne = (p: Page) => p.evaluate(() => (document.querySelector(".board-margin .margin-note")?.textContent ?? "").trim());
async function ask(page: Page) {
  await page.evaluate(() => ([...document.querySelectorAll(".game-cell input")] as HTMLInputElement[]).find((i) => !i.value)?.focus());
  await page.keyboard.press("h");
}
async function answer(page: Page) {
  const s = await lineOne(page);
  const d = (/(?:only|is)\s+(\S+)\s/.exec(s) ?? [])[1] ?? (/^(\S+)\s+goes/.exec(s) ?? [])[1];
  if (!d) throw new Error(`no digit in "${s}"`);
  const target = await page.evaluate(([d, sol]) => [...document.querySelectorAll(".game-cell")].map((c, i) => ({ c, i })).filter(({ c, i }) => c.querySelector(".cell-because") && !(c.querySelector("input") as HTMLInputElement).value && sol[i] === d).map(({ i }) => i), [d, SOLUTION] as const);
  if (target.length !== 1) throw new Error(`"${s}": ${target.length} target cells`);
  await page.locator(".game-cell input").nth(target[0]).focus();
  await page.keyboard.type(d);
}
for (const [arm, port, want] of [["union", 4246, "C4rwyft5SG8y"], ["unionplus", 4247, "B6mPe1IcFLAX"]] as const)
  for (const rep of [1, 2, 3])
    test(`swap ${arm} r${rep}`, async ({ browser, browserName }) => {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
      const page = await ctx.newPage();
      await page.goto(`http://127.0.0.1:${port}/?board=${PAYLOAD}`);
      await page.waitForSelector("path.cell-line", { state: "attached", timeout: 60000 });
      for (let i = 0; i < 80 && (await bs(page)) !== EXPECTED; i++) await page.waitForTimeout(100);
      expect(await bs(page)).toBe(EXPECTED); expect(await ga(page)).toBe(EXPECTED);
      const id = await page.evaluate(() => [...document.scripts].map((s) => s.src).find((s) => /index-.*\.js/.test(s)) ?? "");
      expect(id).toContain(want);
      await page.waitForTimeout(900);
      await ask(page); await page.waitForTimeout(400);
      const hint1 = await lineOne(page);
      await answer(page); await page.waitForTimeout(900);
      const held = await lineOne(page);
      await page.evaluate(() => {
        const host = document.querySelector(".board-margin")!; const r: any = { frames: 0, both: 0, bothVisible: 0 }; (window as any).__s = r;
        new MutationObserver(() => {
          const el = r.el ?? host.querySelector(".margin-note .margin-note-ink[class*='leave-active']");
          if (el && !r.el) { const cs = getComputedStyle(el); Object.assign(r, { el, cls: el.className, t0: performance.now(), an: cs.animationName, ad: cs.animationDuration, inl: (el as HTMLElement).style.cssText, text: el.textContent!.trim() }); }
          if (r.el && r.t1 === undefined && !r.el.isConnected) r.t1 = performance.now();
          const fresh = [...host.querySelectorAll(".margin-note .margin-note-ink")].find((x) => !/leave/.test(x.className) && x !== r.el && (x.textContent ?? "").trim());
          if (r.el && fresh && r.tNew === undefined) r.tNew = performance.now();
        }).observe(host, { subtree: true, childList: true, attributes: true, attributeFilter: ["class"] });
        const tick = () => { if (r.el && r.t1 === undefined) { r.frames++; const two = document.querySelector(".board-margin .margin-note-previous"); const tt = (two?.textContent ?? "").trim(); if (tt && r.text && tt.includes(r.text.slice(0, 12))) { r.both++; const cs = getComputedStyle(r.el); if (+cs.opacity > 0.05 && cs.visibility !== "hidden") r.bothVisible++; } } if (r.t1 === undefined) requestAnimationFrame(tick); };
        requestAnimationFrame(tick);
      });
      const tH = Date.now();
      await ask(page);
      const read = () => page.evaluate(() => { const r = (window as any).__s; return r.t1 === undefined ? null : { cls: r.cls, an: r.an, ad: r.ad, inl: r.inl, gone: Math.round((r.t1 - r.t0) * 10) / 10, newAfter: r.tNew === undefined ? null : Math.round((r.tNew - r.t0) * 10) / 10, frames: r.frames, bothFrames: r.both, bothVisible: r.bothVisible, text: r.text }; });
      await expect.poll(read, { timeout: 5000 }).not.toBeNull();
      await page.waitForTimeout(600);
      const after = await page.evaluate(() => ({ one: (document.querySelector(".board-margin .margin-note")?.textContent ?? "").trim(), two: (document.querySelector(".board-margin .margin-note-previous")?.textContent ?? "").trim() }));
      console.log(`CRITSWAP|${browserName}|${arm}|r${rep}|${JSON.stringify({ hint1, held, ...(await read()), after })}`);
      await ctx.close();
    });
