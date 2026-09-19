#!/usr/bin/env node
/** CTRL-COST pass-3 RESEARCH r4 — ARE THE FOUR HEADS ONE HEIGHT?
 *  `--cost-head-h` is published from `wrapEl.querySelector('.cost-band-head')` — the FIRST head
 *  (GameControlPanel:738). r2 read that head at 40.39 (1280 chromium) while r3 read the
 *  `writing` head at 37.45 in the same cell. If the heads differ, one sample cannot reserve the
 *  band. Measured for all four, both engines, desk and dock.
 */
import fs from "node:fs";
import { chromium, webkit } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_8630d340-e56-30/web/frontend/node_modules/playwright/index.mjs";
const OUT = process.argv[2] || "./r4.json";
const READ = () => {
  const card = document.querySelector(".controls-card");
  const cs = card && getComputedStyle(card);
  return {
    published: cs ? cs.getPropertyValue("--cost-head-h").trim() : "",
    paddingTop: cs ? cs.paddingTop : "",
    heads: Array.from(document.querySelectorAll(".cost-band-head")).map((h) => {
      const b = h.getBoundingClientRect();
      const hs = getComputedStyle(h);
      return {
        name: (h.querySelector(".section-heading")?.textContent || "").trim(),
        h: +b.height.toFixed(2),
        padding: `${hs.paddingTop}/${hs.paddingBottom}`,
        kids: Array.from(h.children).map((k) => ({
          sel: `${k.tagName}.${(k.className?.baseVal ?? k.className ?? "").toString().trim().split(/\s+/)[0]}`,
          h: +k.getBoundingClientRect().height.toFixed(2),
        })),
      };
    }),
  };
};
async function run(engine, name, vp) {
  const br = await engine.launch();
  const ctx = await br.newContext(
    vp === "dock"
      ? { viewport: { width: 390, height: 844 }, hasTouch: true, deviceScaleFactor: 2 }
      : { viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2 },
  );
  const page = await ctx.newPage();
  await page.goto("http://127.0.0.1:4233/?size=3&difficulty=EASY");
  await page.waitForSelector(".controls-card", { state: "attached", timeout: 40000 });
  await page.waitForTimeout(1300);
  if (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
    await page.locator(".drawer-tab").click({ force: true });
    await page.waitForTimeout(950);
  }
  const r = await page.evaluate(READ);
  await ctx.close();
  await br.close();
  return { engine: name, vp, ...r };
}
const out = [];
for (const [e, n] of [[chromium, "chromium"], [webkit, "webkit"]])
  for (const vp of ["desk", "dock"]) {
    try { out.push(await run(e, n, vp)); } catch (err) { out.push({ engine: n, vp, error: String(err).slice(0, 400) }); }
    fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
  }
console.log("DONE", OUT);
