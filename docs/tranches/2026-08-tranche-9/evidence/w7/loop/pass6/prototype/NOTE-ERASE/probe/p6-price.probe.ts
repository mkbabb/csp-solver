/**
 * NOTE-ERASE pass 6 · the hook's PRICE, re-cut (charter 13). The first cut's negative control
 * stripped the hook's write in a MutationObserver, AFTER the write had already cancelled the
 * running dusk tween, so both arms snapped. This cut BLOCKS the write at its source (an init
 * script drops `setProperty("transition", "none", "important")`, the pass-5 critic's form), so the
 * control arm keeps tweening. Every frame's computed colour is sampled from arrival to removal;
 * the leave is started ~90 ms after the settle begins (mid-tween on the 350 ms dusk rung).
 */
import { test, type Browser } from "@playwright/test";
import { bank, say, boardReady, armHint, PROTO, PAYLOAD } from "./lib";

type F = { t: number; color: string; age: string | null; leaving: boolean; clip: string; op: string };
async function arm(browser: Browser, block: boolean) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  if (block)
    await ctx.addInitScript(() => {
      const real = CSSStyleDeclaration.prototype.setProperty;
      CSSStyleDeclaration.prototype.setProperty = function (p: string, v: string | null, pr?: string) {
        if (p === "transition" && v === "none" && pr === "important") return;
        return real.call(this, p, v, pr);
      };
    });
  const page = await ctx.newPage();
  await boardReady(page, PROTO);
  await armHint(page, 0);
  await page.evaluate(() => {
    const frames: F[] = [];
    (window as unknown as { __f: F[] }).__f = frames;
    const t0 = performance.now();
    let el: HTMLElement | null = null;
    const tick = () => {
      el = el?.isConnected ? el : document.querySelector<HTMLElement>(".margin-note-ink");
      const t = Math.round((performance.now() - t0) * 10) / 10;
      if (el?.isConnected) {
        const cs = getComputedStyle(el);
        frames.push({ t, color: cs.color, age: el.getAttribute("data-note-age"), leaving: el.classList.contains("note-leave-active"), clip: cs.clipPath, op: cs.opacity });
      } else frames.push({ t, color: "", age: null, leaving: false, clip: "", op: "" });
      if (performance.now() - t0 < 3000) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  await page.waitForFunction(() => document.querySelector(".margin-note-ink")?.getAttribute("data-note-age") === "settled", undefined, { polling: "raf", timeout: 5000 });
  await page.waitForTimeout(90);
  await page.keyboard.press("h");
  await page.waitForTimeout(1200);
  const frames = await page.evaluate(() => (window as unknown as { __f: F[] }).__f);
  const end = await page.evaluate(() => {
    const d = document.createElement("span");
    d.className = "margin-note-ink";
    d.setAttribute("data-note-age", "settled");
    d.style.transition = "none";
    document.querySelector(".margin-note")?.appendChild(d);
    const c = getComputedStyle(d).color;
    d.remove();
    return c;
  });
  await ctx.close();
  const iS = frames.findIndex((f) => f.age === "settled");
  const iL = frames.findIndex((f) => f.leaving);
  const iGone = frames.findIndex((f, k) => iL >= 0 && k > iL && f.color === "");
  const alpha = (c: string) => { const m = /\/\s*([\d.]+)\)/.exec(c); return m ? +(+m[1]).toFixed(3) : 1; };
  return {
    settledEnd: end,
    intoTweenMs: iL >= 0 && iS >= 0 ? Math.round((frames[iL].t - frames[iS].t) * 10) / 10 : null,
    alphaBefore: alpha(frames[iL - 1]?.color ?? ""), alphaFrame1: alpha(frames[iL]?.color ?? ""), alphaFrame2: alpha(frames[iL + 1]?.color ?? ""),
    leaveToGoneMs: iGone > 0 ? Math.round((frames[iGone].t - frames[iL].t) * 10) / 10 : null,
    alphaTrail: frames.slice(Math.max(0, iL - 2), iL + 6).map((f) => `${f.t}:${alpha(f.color)}${f.leaving ? "L" : ""}`),
  };
}
test("price: a settle still tweening when its line is rubbed out (hook vs blocked at source)", async ({ browser }, info) => {
  test.setTimeout(200000);
  const rows = { engine: info.project.name, payload: PAYLOAD, hook: await arm(browser, false), BLOCKED: await arm(browser, true) };
  bank(`price-${info.project.name}.json`, rows);
  say("price", rows);
});
