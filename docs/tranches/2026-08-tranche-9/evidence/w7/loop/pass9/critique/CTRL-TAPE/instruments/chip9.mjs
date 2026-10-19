// The chip's ring colour: read at focus and again after 600 ms (past any 150 ms tween). usage: FE=.. node chip9.mjs <base>
const FE = process.env.FE ?? process.cwd();
const pw = await import(`${FE}/node_modules/playwright/index.mjs`);
const [base] = process.argv.slice(2);
for (const engine of ["chromium", "webkit"]) {
  const b = await pw[engine].launch();
  const ctx = await b.newContext({ baseURL: base, viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("./?size=3&difficulty=EASY");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.keyboard.press("Tab");
  const r = await page.evaluate(async () => {
    const el = document.querySelector(".controls-card button[aria-pressed]");
    el.focus();
    const rd = () => { const c = getComputedStyle(el); return [el.matches(":focus-visible"), c.outlineStyle, c.outlineWidth, c.outlineColor, c.transitionProperty.slice(0, 60), c.transitionDuration]; };
    const a = rd(); await new Promise((r) => setTimeout(r, 600)); const z = rd();
    const ink = getComputedStyle(el).getPropertyValue("--ring-ink");
    return { at0: a, at600: z, ringInk: ink, cls: el.className.slice(0, 160) };
  });
  console.log(engine, JSON.stringify(r));
  await ctx.close(); await b.close();
}
