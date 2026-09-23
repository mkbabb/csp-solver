import { test, expect, type Page } from "@playwright/test";
import { appendFileSync } from "node:fs";
// PLR-PLACE pass 6 · NOTE-LEDGER's graft: a close is a pose. `Element.prototype.animate` hooked before
// any script; every WAAPI mover and every CSS transition inside the sheet read at keyframe 0, at the
// open and during the close (Escape), two at the table, 1280×800 fine, dev.
const OUT = process.env.PLC_OUT!;
async function stable(read: () => Promise<unknown>) { let last: unknown = Symbol(); await expect.poll(async () => { const v = JSON.stringify(await read()); const s = v === last; last = v; return s; }, { intervals: [150], timeout: 8000 }).toBe(true); }
async function settled(p: Page) { await p.waitForSelector("svg.handwritten-logo", { timeout: 60000 }); await expect.poll(() => p.locator(".sudoku-cell .glyph-svg").count(), { timeout: 60000 }).toBeGreaterThan(0); }
test("a close is a pose: keyframe 0 of every mover in the sheet", async ({ browser }, info) => {
  test.slow();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  await ctx.addInitScript(() => {
    const w = window as any; w.__anims = [];
    const orig = Element.prototype.animate;
    Element.prototype.animate = function (kf: any, opts: any) { w.__anims.push({ cls: String((this as Element).className?.baseVal ?? (this as Element).className).slice(0, 40), kf0: JSON.stringify(Array.isArray(kf) ? kf[0] : kf).slice(0, 120) }); return orig.call(this, kf, opts); };
  });
  const a = await ctx.newPage(); await a.goto("./?size=3&difficulty=EASY&wire=local"); await settled(a);
  const verb = a.locator('.controls-card button[aria-label="Play together on this board"]'); await verb.click();
  await expect.poll(() => a.locator(".players-roster .player-row").count()).toBe(1);
  const b = await ctx.newPage(); await b.goto(a.url()); await settled(b); await b.locator(".sudoku-cell input").nth(12).click();
  await a.bringToFront(); await expect.poll(() => a.locator(".players-roster .player-row").count(), { timeout: 20000 }).toBe(2);
  await a.evaluate(() => { (window as any).__anims = []; });
  const readT = () => a.evaluate(() => document.getAnimations().filter((an) => (an.effect as KeyframeEffect)?.target?.closest?.("[data-lobby]")).map((an) => { const e = an.effect as KeyframeEffect; const t = e.target as Element; const k = e.getKeyframes(); return { kind: an.constructor.name, on: (t.getAttribute("class") ?? t.tagName).slice(0, 30), prop: (an as any).transitionProperty ?? (an as any).animationName ?? "waapi", kf0: JSON.stringify(k[0]).slice(0, 100) }; }));
  await a.locator("[data-player-mark]:visible").click();
  const atOpen = await readT();
  const sh = a.locator("[data-lobby].is-open"); await stable(() => sh.evaluate((e) => getComputedStyle(e).opacity));
  await a.keyboard.press("Escape");
  const atClose = await readT();
  const waapi = await a.evaluate(() => (window as any).__anims);
  const line = `ANIM|${info.project.name}|open=${JSON.stringify(atOpen)}|close=${JSON.stringify(atClose)}|waapi=${JSON.stringify(waapi)}`;
  appendFileSync(OUT, line + "\n"); console.log(line.slice(0, 1500));
  await ctx.close();
});
