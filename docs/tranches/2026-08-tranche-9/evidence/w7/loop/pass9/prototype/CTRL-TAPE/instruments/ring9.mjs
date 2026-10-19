// CTRL-TAPE pass 9 · the ring at station 1 on four bands, by keyboard focus, through the ONE edge-bands home.
// usage: node ring9.mjs <label> <baseURL>  — both engines; per site: clean, THIN_1PX, DASH_arm_b (the dash).
const FE = process.env.FE ?? process.cwd();
const pw = await import(`${FE}/node_modules/playwright/index.mjs`);
const { fourBands, applyEdgePlant, fmt } = await import(`${FE}/e2e/lib/edge-bands.mjs`);
const [label, base] = process.argv.slice(2);
const SITES = [
  { name: "foot verb (Clear) 1440 fine", vp: [1440, 900], touch: false, open: false, sel: '#card-foot button[aria-label="Clear the board"]' },
  { name: "card chip 1440 fine", vp: [1440, 900], touch: false, open: false, sel: ".controls-card button[aria-pressed]" },
  { name: "drawer tab 390 coarse", vp: [390, 844], touch: true, open: false, sel: ".drawer-tab" },
];
for (const engine of ["chromium", "webkit"]) {
  const b = await pw[engine].launch();
  for (const s of SITES) {
    const ctx = await b.newContext({ baseURL: base, viewport: { width: s.vp[0], height: s.vp[1] }, hasTouch: s.touch, deviceScaleFactor: 2, reducedMotion: "reduce" });
    const page = await ctx.newPage();
    try {
      await page.goto("./?size=3&difficulty=EASY");
      await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
      await page.addStyleTag({ content: ".tuner-toggle { display: none !important; }" });
      await page.locator(s.sel).first().waitFor({ state: "visible", timeout: 20000 });
      await page.keyboard.press("Tab");
      await page.locator(s.sel).first().evaluate((e) => (e.focus(), 0));
      const fv = await page.locator(s.sel).first().evaluate((e) => [e.matches(":focus-visible"), getComputedStyle(e).outlineStyle, getComputedStyle(e).outlineWidth, getComputedStyle(e).outlineColor]);
      const tag = await page.evaluate((sel) => { const e = document.querySelector(sel); e.setAttribute("data-ring9", ""); return 1; }, s.sel);
      const sub = "[data-ring9]";
      const off = sub + " { outline-style: none !important; }";
      const opts = { subject: sub, edge: sub, off, out: 8, inn: 2, thick: 2, thickTol: 0.9 };
      const row = { clean: await fourBands(page, opts) };
      for (const [n, css] of [["THIN_1PX", sub + " { outline-width: 1px !important; }"], ["DASH_arm_b", sub + " { outline-style: dashed !important; }"]]) {
        const undo = await applyEdgePlant(page, sub, css); row[n] = await fourBands(page, opts); await undo();
      }
      console.log(label + " " + engine + " · " + s.name + " · focus-visible " + JSON.stringify(fv));
      for (const [n, r] of Object.entries(row)) console.log("   " + n.padEnd(10) + " " + (r.red ? "RED  " : "GREEN") + " " + (r.why || []).join(" ; ").slice(0, 160) + " | " + fmt(r).slice(0, 220));
    } catch (e) { console.log(label + " " + engine + " · " + s.name + " · ERROR " + String(e.message).slice(0, 160)); }
    await ctx.close();
  }
  await b.close();
}
