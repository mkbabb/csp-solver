// CRITIC probe: computed π of the pass-8 product moves, tree :4231 vs control :4252, both engines.
import { chromium, webkit } from "@playwright/test";
const cells = [{ w: 1280, h: 800, coarse: false }, { w: 390, h: 844, coarse: true }, { w: 360, h: 800, coarse: false }];
for (const [ename, E] of [["chromium", chromium], ["webkit", webkit]]) {
  const b = await E.launch();
  for (const port of [4231, 4252]) for (const c of cells) {
    const ctx = await b.newContext({ viewport: { width: c.w, height: c.h }, hasTouch: c.coarse, isMobile: c.coarse && ename === "chromium" });
    const p = await ctx.newPage();
    await p.emulateMedia({ reducedMotion: "reduce" });
    await p.goto(`http://127.0.0.1:${port}/?size=3&difficulty=EASY`);
    await p.waitForSelector(".sun-moon-toggle", { timeout: 30000 });
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(1500);
    const r = await p.evaluate(() => {
      const rg = document.querySelector(".ruled-group");
      const root = getComputedStyle(document.documentElement);
      const pr = document.querySelector(".page-root") ?? document.body;
      const t = document.querySelector(".sun-moon-toggle");
      return {
        track: rg ? getComputedStyle(rg).gridTemplateColumns.split(" ")[0] : null,
        rpMargin: rg ? getComputedStyle(rg).getPropertyValue("--rp-margin").trim() : null,
        rpMarginOnWrap: document.querySelector(".control-panel-wrap") ? getComputedStyle(document.querySelector(".control-panel-wrap")).getPropertyValue("--rp-margin").trim() : null,
        toggleFoot: getComputedStyle(pr).getPropertyValue("--toggle-foot").trim(),
        reach: getComputedStyle(pr).getPropertyValue("--toggle-reach").trim(),
        tRest: t ? getComputedStyle(t).transform : null,
      };
    });
    let hov = null;
    if (!c.coarse) { await p.hover(".sun-moon-toggle"); await p.waitForTimeout(700); hov = await p.evaluate(() => getComputedStyle(document.querySelector(".sun-moon-toggle")).transform); }
    console.log(`${ename} :${port} ${c.w}x${c.h}${c.coarse ? "c" : "f"} ${JSON.stringify(r)} hover ${hov}`);
    await ctx.close();
  }
  await b.close();
}
