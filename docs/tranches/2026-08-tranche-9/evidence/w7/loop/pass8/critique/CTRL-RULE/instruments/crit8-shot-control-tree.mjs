// CRITIC probe: the control's card end at the B13(b) frame's conditions (chromium 390x844 coarse DPR2 PRM light), to read what HEAD's foot verbs look like.
import { chromium } from "@playwright/test";
const b = await chromium.launch();
for (const port of [4252, 4231]) {
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
  const p = await ctx.newPage();
  await p.emulateMedia({ reducedMotion: "reduce", colorScheme: "light" });
  await p.goto(`http://127.0.0.1:${port}/?size=3&difficulty=EASY`);
  await p.waitForSelector(".sun-moon-toggle", { timeout: 30000 });
  await p.evaluate(() => document.fonts.ready);
  if (await p.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) await p.locator(".drawer-tab").tap();
  await p.waitForTimeout(2500);
  const info = await p.evaluate(() => {
    const sc = [...document.querySelectorAll("*")].find((e) => e.scrollHeight > e.clientHeight + 4 && /auto|scroll/.test(getComputedStyle(e).overflowY) && e.querySelector("#card-foot"));
    if (sc) sc.scrollTop = sc.scrollHeight;
    const verbs = [...document.querySelectorAll("#card-foot button")].map((x) => ({ t: (x.textContent || "").trim().slice(0, 10), tag: x.tagName, cls: x.className.toString().slice(0, 60), border: getComputedStyle(x).borderTopWidth, svgFrames: x.querySelectorAll("svg rect, svg path").length }));
    return { scroller: sc ? sc.className.toString().slice(0, 40) : null, verbs };
  });
  await p.waitForTimeout(800);
  await p.screenshot({ path: `${process.env.OUTD}/crit8-cardend-${port}.png` });
  console.log(port, JSON.stringify(info));
  await ctx.close();
}
await b.close();
