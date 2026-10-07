// CRITIC probe: pass-7 s10 (:4231) at the B13(b) frame's conditions, card scrolled to END, light + dark.
import { chromium } from "@playwright/test";
const b = await chromium.launch();
for (const scheme of ["light", "dark"]) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  await p.emulateMedia({ reducedMotion: "reduce", colorScheme: scheme });
  await p.addInitScript((t) => { try { localStorage.setItem("sudoku-color-scheme", t); } catch {} }, scheme);
  await p.goto(`http://127.0.0.1:4231/?size=3&difficulty=EASY`);
  await p.waitForSelector(".sun-moon-toggle", { timeout: 30000 });
  await p.evaluate(() => document.fonts.ready);
  if (await p.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) await p.locator(".drawer-tab").tap();
  await p.waitForTimeout(2500);
  const info = await p.evaluate(() => {
    const cands = [...document.querySelectorAll("*")].filter((e) => e.scrollHeight > e.clientHeight + 4 && /auto|scroll/.test(getComputedStyle(e).overflowY));
    cands.sort((a, b) => b.scrollHeight - a.scrollHeight);
    const sc = cands[0];
    if (sc) sc.scrollTop = sc.scrollHeight;
    const verbs = [...document.querySelectorAll("#card-foot button")].map((x) => (x.textContent || "").trim().slice(0, 8));
    return { scroller: sc ? `${sc.tagName}.${sc.className.toString().slice(0, 40)}` : null, verbs };
  });
  await p.waitForTimeout(1000);
  await p.screenshot({ path: `${process.env.OUTD}/crit8-s10p7-${scheme}.png` });
  console.log(scheme, JSON.stringify(info));
  await ctx.close();
}
await b.close();
