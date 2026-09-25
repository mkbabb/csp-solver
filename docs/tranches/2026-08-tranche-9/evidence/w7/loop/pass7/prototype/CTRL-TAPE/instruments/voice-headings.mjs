import { chromium } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
for (const [arm, base] of [["p7", "http://127.0.0.1:4233"], ["s10", "http://127.0.0.1:4232"], ["control", "http://127.0.0.1:4231"], ["s10p", "http://127.0.0.1:4237"]]) {
  const b = await chromium.launch(); const p = await (await b.newContext({ baseURL: base, viewport: { width: 1440, height: 900 } })).newPage();
  await p.goto("/"); await p.waitForSelector(".controls-card", { state: "attached" }); await p.waitForTimeout(700);
  const r = await p.evaluate(() => [...document.querySelector(".drawer-case").querySelectorAll("h2, h3, [role=heading], .row-label, legend, label")].filter(e=>e.getClientRects().length).slice(0,14).map((e) => `${e.tagName.toLowerCase()}.${[...e.classList].slice(0,2).join(".")}${e.getAttribute("aria-level")?"[lvl"+e.getAttribute("aria-level")+"]":""}="${e.textContent.trim().slice(0,20)}"`));
  const tree = await p.locator(".drawer-case").ariaSnapshot().catch(e=>String(e));
  console.log(arm, JSON.stringify(r)); console.log(arm, "headings", (tree.match(/heading "[^"]*"/g)||[]).join(", "));
  await b.close();
}
