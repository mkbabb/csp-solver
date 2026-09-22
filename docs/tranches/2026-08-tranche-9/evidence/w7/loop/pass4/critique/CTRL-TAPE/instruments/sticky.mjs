import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
for (const [n, eng] of [["chromium", chromium], ["webkit", webkit]]) {
  const b = await eng.launch();
  const ctx = await b.newContext({ baseURL: "http://127.0.0.1:4245", viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  await p.goto("/?size=3&difficulty=EASY&board=sticky");
  await p.waitForSelector(".ctrl-btn"); await p.waitForTimeout(900);
  const want = await p.evaluate(() => {
    const c = document.querySelector(".controls-card");
    const well = [...c.querySelectorAll(".tray-well")].find(w => (w.querySelector(".washi-tag")?.textContent||"").trim() === "pencils");
    c.scrollTop = 0;
    return well.getBoundingClientRect().top - c.getBoundingClientRect().top + 40;
  });
  const sync = await p.evaluate((y) => {
    const c = document.querySelector(".controls-card");
    c.scrollTop = y;
    const well = [...c.querySelectorAll(".tray-well")].find(w => (w.querySelector(".washi-tag")?.textContent||"").trim() === "pencils");
    const tag = well.querySelector(".washi-tag");
    const cr = c.getBoundingClientRect(), wr = well.getBoundingClientRect(), tr = tag.getBoundingClientRect();
    return { pos: getComputedStyle(tag).position, released: tag.hasAttribute("data-released"),
      wellInView: +((Math.min(wr.bottom, cr.bottom) - Math.max(wr.top, cr.top)) / wr.height).toFixed(3),
      tagVisible: +(Math.max(0, Math.min(tr.bottom, cr.bottom) - Math.max(tr.top, cr.top)) / tr.height).toFixed(3) };
  }, want);
  await p.waitForTimeout(600);
  const settled = await p.evaluate(() => {
    const c = document.querySelector(".controls-card");
    const well = [...c.querySelectorAll(".tray-well")].find(w => (w.querySelector(".washi-tag")?.textContent||"").trim() === "pencils");
    const tag = well.querySelector(".washi-tag");
    const cr = c.getBoundingClientRect(), wr = well.getBoundingClientRect(), tr = tag.getBoundingClientRect();
    return { pos: getComputedStyle(tag).position, released: tag.hasAttribute("data-released"),
      wellInView: +((Math.min(wr.bottom, cr.bottom) - Math.max(wr.top, cr.top)) / wr.height).toFixed(3),
      tagVisible: +(Math.max(0, Math.min(tr.bottom, cr.bottom) - Math.max(tr.top, cr.top)) / tr.height).toFixed(3) };
  });
  console.log(n, "want=" + want.toFixed(1), "SYNC", JSON.stringify(sync), "SETTLED", JSON.stringify(settled));
  await b.close();
}
