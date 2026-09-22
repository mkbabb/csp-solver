import { chromium } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
const b = await chromium.launch();
const ctx = await b.newContext({ baseURL: "http://127.0.0.1:4245", viewport: { width: 1440, height: 900 } });
const p = await ctx.newPage();
await p.goto("/?size=3&difficulty=EASY&board=fold");
await p.waitForSelector(".ctrl-btn"); await p.waitForTimeout(900);
for (const f of [0, 0.25, 1]) {
  await p.locator(".controls-card").evaluate((el, x) => { el.scrollTop = (el.scrollHeight - el.clientHeight) * x; }, f);
  await p.waitForTimeout(350);
  console.log(f, JSON.stringify(await p.evaluate(() => {
    const c = document.querySelector(".controls-card");
    const chip = [...c.querySelectorAll(".ctrl-btn")].find(e => (e.textContent||"").trim() === "9×9");
    const cs = chip ? getComputedStyle(chip) : null;
    return { foldAbove: c.hasAttribute("data-fold-above"), foldBelow: c.hasAttribute("data-fold-below"), chipOpacity: cs && cs.opacity, chipTop: chip && +chip.getBoundingClientRect().top.toFixed(1), cardTop: +c.getBoundingClientRect().top.toFixed(1), padTop: cs && getComputedStyle(c).paddingTop };
  })));
}
await b.close();
