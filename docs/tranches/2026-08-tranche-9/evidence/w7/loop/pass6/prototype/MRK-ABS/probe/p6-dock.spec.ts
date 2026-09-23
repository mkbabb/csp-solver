/** T9-W7 pass 6 · MRK-ABS — G-ABS-11, the dock sheet OPENED and SETTLED at 393×699 coarse (hasTouch,
 *  witnessed), lane vs 74a2b5d9. Every Tab-reachable stop inside `.controls-card` is FOCUSED
 *  (keyboard modality) and its ring's reach (outline offset + width, read focused) must stay inside
 *  the card's edges; W2's one declared clip (the sticky invite `.icon-btn`) is named. */
import { test, expect } from "@playwright/test";
import { writeFileSync } from "node:fs";
import { settled } from "./p6-lib";
test("G-ABS-11 dock", async ({ browser }, info) => {
  test.setTimeout(300000);
  const res: unknown[] = [];
  for (const [arm, url] of [["lane", "http://127.0.0.1:4239"], ["HEAD", "http://127.0.0.1:4240"]] as const) {
    const ctx = await browser.newContext({ viewport: { width: 393, height: 699 }, hasTouch: true }); const page = await ctx.newPage();
    await page.goto(`${url}/`);
    await expect.poll(() => page.locator(".board-shell .game-cell").count(), { timeout: 60000 }).toBeGreaterThan(0);
    const coarse = await page.evaluate(() => matchMedia("(pointer: coarse)").matches);
    await page.locator(".drawer-tab").first().click();
    await expect(page.locator("#controls-drawer .controls-card")).toBeVisible({ timeout: 15000 });
    await settled(page);
    await expect.poll(async () => { const a = await page.locator("#controls-drawer .controls-card").boundingBox(); await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))); const b = await page.locator("#controls-drawer .controls-card").boundingBox(); return a && b ? Math.abs(a.y - b.y) : 99; }, { timeout: 15000 }).toBeLessThan(0.1);
    const n = await page.evaluate(() => document.querySelectorAll('#controls-drawer .controls-card :is(a[href], button, input:not([type=hidden]), select, textarea, [tabindex]:not([tabindex="-1"]))').length);
    const stops: { stop: string; reach: number; clear: number; fv: boolean }[] = [];
    for (let i = 0; i < n; i++) {
      await page.keyboard.press("Shift");
      const r = await page.evaluate(async (i) => {
        const card = document.querySelector("#controls-drawer .controls-card") as HTMLElement; const cr = card.getBoundingClientRect();
        const el = document.querySelectorAll<HTMLElement>('#controls-drawer .controls-card :is(a[href], button, input:not([type=hidden]), select, textarea, [tabindex]:not([tabindex="-1"]))')[i];
        const b = el.getBoundingClientRect(); if (!b.width || !b.height || el.closest("[inert]")) return null;
        el.focus(); await new Promise((r) => setTimeout(r, 0)); await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
        if (document.activeElement !== el) return null;
        const cs = getComputedStyle(el); const reach = cs.outlineStyle === "none" ? 0 : (parseFloat(cs.outlineOffset) || 0) + (parseFloat(cs.outlineWidth) || 0);
        const r2 = el.getBoundingClientRect(); const cr2 = card.getBoundingClientRect(); void cr2;
        const clear = Math.min(r2.left - reach - cr.left, cr.right - (r2.right + reach), r2.top - reach - cr.top, cr.bottom - (r2.bottom + reach));
        return { stop: `${el.tagName.toLowerCase()}.${(el.getAttribute("class") || "").trim().split(/\s+/).slice(0, 2).join(".")}`, reach, clear: Math.round(clear * 100) / 100, fv: el.matches(":focus-visible") };
      }, i);
      if (r) stops.push(r);
    }
    const notWhole = stops.filter((s) => s.clear < 0);
    const row = { engine: info.project.name, arm, coarse, stops: stops.length, notWhole };
    res.push(row); console.log(JSON.stringify(row));
    await ctx.close();
  }
  writeFileSync(`${process.env.OUT}/dock-${info.project.name}.json`, JSON.stringify(res));
});
