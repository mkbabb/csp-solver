// CTRL-TAPE pass 9 row 7 · the foot notes' berth on PAINTED boxes: each foot verb hovered, its note's
// rotated box vs every foot control's box and vs the foot; arms: shipped tilt, and the plants +1.5° / -1.5°
// (SIX's band, ±1.5°) forced on every foot note. usage: node berth9.mjs <label> <baseURL> [w h]
const FE = process.env.FE ?? process.cwd();
const pw = await import(`${FE}/node_modules/playwright/index.mjs`);
const [label, base, w = "1440", h = "900"] = process.argv.slice(2);
for (const engine of ["chromium", "webkit"]) {
  const b = await pw[engine].launch();
  const ctx = await b.newContext({ baseURL: base, viewport: { width: +w, height: +h }, hasTouch: false, deviceScaleFactor: 2, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("./?size=3&difficulty=EASY");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.addStyleTag({ content: ".tuner-toggle { display: none !important; }" });
  await page.locator("#card-foot .action-bar").waitFor({ timeout: 20000 });
  for (const arm of ["shipped", "+1.5deg", "-1.5deg"]) {
    const tag = arm === "shipped" ? null : await page.addStyleTag({ content: "#card-foot .washi-label { --washi-tilt: " + arm + " !important; }" });
    const btns = await page.locator("#card-foot button").all();
    let worst = { rise: -Infinity }, lowest = { slack: Infinity };
    for (const bt of btns) {
      if (!(await bt.isVisible())) continue;
      await bt.hover();
      const r = await page.evaluate(async () => {
        await new Promise((res) => setTimeout(res, 220));
        const notes = [...document.querySelectorAll("#card-foot .washi-label")].filter((n) => +getComputedStyle(n).opacity > 0.5);
        if (!notes.length) return null;
        const n = notes[0], nb = n.getBoundingClientRect();
        const foot = document.getElementById("card-foot").getBoundingClientRect();
        const ctrls = [...document.querySelectorAll("#card-foot button")].map((e) => [e.getAttribute("aria-label") || e.textContent.trim().slice(0, 20), e.getBoundingClientRect()]);
        let rise = -Infinity, over = 0, who = "";
        for (const [k, c] of ctrls) {
          const wd = Math.min(c.right, nb.right) - Math.max(c.left, nb.left);
          if (wd <= 0) continue;
          const d = c.bottom - nb.top; // > 0: the note's box reaches up into this control
          if (d > rise) { rise = d; who = k; }
          const ov = Math.max(0, wd) * Math.max(0, Math.min(c.bottom, nb.bottom) - Math.max(c.top, nb.top));
          over = Math.max(over, ov);
        }
        return { text: n.textContent.trim().slice(0, 24), tilt: getComputedStyle(n).getPropertyValue("--washi-tilt").trim(), w: +nb.width.toFixed(2), rise: +rise.toFixed(2), who, overPx2: +over.toFixed(2), slack: +(foot.bottom - nb.bottom).toFixed(2) };
      });
      await page.mouse.move(2, 2);
      if (!r) continue;
      if (r.rise > worst.rise) worst = r;
      if (r.slack < lowest.slack) lowest = r;
    }
    console.log(label + " " + engine + " " + w + "x" + h + " " + arm.padEnd(8) + " worst rise " + JSON.stringify(worst) + " · least foot slack " + JSON.stringify(lowest));
    if (tag) await tag.evaluate((e) => e.remove());
  }
  await ctx.close(); await b.close();
}
