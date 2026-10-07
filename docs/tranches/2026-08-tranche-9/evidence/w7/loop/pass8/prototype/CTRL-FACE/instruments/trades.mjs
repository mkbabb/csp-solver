import { chromium, webkit } from "@playwright/test";
const Q = "size=3&difficulty=MEDIUM&board=ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const arms = { tree: 4234, control: 4251, s10h: 4235 };
for (const [en, bt] of [["chromium", chromium], ["webkit", webkit]]) {
  const b = await bt.launch();
  for (const [arm, port] of Object.entries(arms)) {
    const row = { en, arm };
    {
      const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: "reduce" });
      const p = await ctx.newPage();
      await p.goto(`http://127.0.0.1:${port}/?${Q}`);
      await p.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
      await p.waitForSelector(".controls-card .deal-btn", { timeout: 20000 });
      await p.waitForTimeout(1200);
      row.dealFine = await p.evaluate(() => { const r = [...document.querySelectorAll(".controls-card .deal-btn")].find((e) => e.getClientRects().length).getBoundingClientRect(); return `${r.width.toFixed(2)}×${r.height.toFixed(2)}`; });
      await ctx.close();
    }
    {
      const ctx = await b.newContext({ viewport: { width: 430, height: 932 }, hasTouch: true, isMobile: en === "chromium", reducedMotion: "reduce" });
      const p = await ctx.newPage();
      await p.goto(`http://127.0.0.1:${port}/?${Q}`);
      await p.waitForSelector("svg.handwritten-logo", { timeout: 20000 });
      await p.waitForSelector(".drawer-tab", { timeout: 20000 });
      await p.waitForTimeout(1200);
      row.tabTop = await p.evaluate(() => document.querySelector(".drawer-tab").getBoundingClientRect().top.toFixed(2));
      await p.locator(".drawer-tab").tap();
      await p.waitForTimeout(1500);
      row.sheetTop = await p.evaluate(() => { const e = document.querySelector("#controls-drawer .drawer-case"); return e ? e.getBoundingClientRect().top.toFixed(2) : "none"; });
      await ctx.close();
    }
    console.log(JSON.stringify(row));
  }
  await b.close();
}
