import { chromium, webkit } from "playwright";

const BASE = process.env.BASE ?? "http://127.0.0.1:4244";

const FILTERS = () => {
  const live = new Set();
  for (const el of document.querySelectorAll("*")) {
    const f = getComputedStyle(el).filter;
    if (f && f !== "none")
      for (const m of f.matchAll(/url\(["']?#([^"')]+)/g)) live.add(m[1]);
  }
  return [...live].sort();
};

async function run(engine, name, theme) {
  const b = await engine.launch();
  const ctx = await b.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    colorScheme: theme,
  });
  const page = await ctx.newPage();
  await page.goto(BASE + "/?game=sudoku", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  const filters = await page.evaluate(FILTERS);
  const res = { engine: name, theme, filters, filterCount: filters.length };
  // the bottom tab (W2's landed mechanic)
  const tab = page.locator(".drawer-tab, [class*='drawer-tab']").first();
  try {
    await tab.click({ timeout: 4000 });
    await page.waitForTimeout(700);
    res.animationsAfter700 = await page.evaluate(
      () => document.getAnimations().filter((a) => a.playState === "running").length,
    );
    res.allAnimations = await page.evaluate(() => document.getAnimations().length);
    res.sheet = await page.evaluate(() => {
      const el = document.querySelector(".controls-card, .scene-controls");
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        cls: el.className.slice(0, 40),
        x: +r.x.toFixed(2),
        y: +r.y.toFixed(2),
        w: +r.width.toFixed(2),
        h: +r.height.toFixed(2),
        transform: getComputedStyle(el).transform,
      };
    });
    res.filtersOpen = (await page.evaluate(FILTERS)).length;
  } catch (e) {
    res.dock = "tab not found: " + String(e).slice(0, 80);
  }
  await ctx.close();
  await b.close();
  return res;
}

const out = [];
for (const [eng, nm] of [
  [chromium, "chromium"],
  [webkit, "webkit"],
])
  for (const theme of ["light", "dark"]) out.push(await run(eng, nm, theme));
console.log(JSON.stringify(out, null, 1));
