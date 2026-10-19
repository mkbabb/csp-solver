// Does a font-size plant on the VERBS (not the bar) remove painted text? Reads every text node's Range rect inside
// the foot's verbs, clean vs plant, and screenshots the foot both ways. usage: FE=<web/frontend> node font9.mjs <base> <outdir>
const FE = process.env.FE ?? process.cwd();
const pw = await import(`${FE}/node_modules/playwright/index.mjs`);
const [base, out] = process.argv.slice(2);
const P = [["clean", ""], ["V5", ".action-bar > .action-verbs { font-size: 0 !important; }"], ["V6", ".action-bar button { font-size: 1px !important; }"]];
for (const engine of ["chromium", "webkit"]) {
  const b = await pw[engine].launch();
  const ctx = await b.newContext({ baseURL: base, viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("./?size=3&difficulty=EASY");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.locator("#card-foot .action-bar").waitFor({ timeout: 20000 });
  for (const [n, css] of P) {
    const tag = css ? await page.addStyleTag({ content: css }) : null;
    const r = await page.evaluate(async () => {
      await new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(res)));
      const w = document.createTreeWalker(document.querySelector("#card-foot .action-bar"), NodeFilter.SHOW_TEXT);
      const t = []; let x;
      while ((x = w.nextNode())) { if (!x.textContent.trim()) continue; const rg = document.createRange(); rg.selectNodeContents(x); const q = rg.getBoundingClientRect(); if (getComputedStyle(x.parentElement).display === "none") continue; t.push([x.textContent.trim().slice(0, 14), +q.width.toFixed(1), +q.height.toFixed(1)]); }
      return t;
    });
    await page.locator("#card-foot").screenshot({ path: `${out}/font9-${engine}-${n}.png` });
    console.log(engine, n, JSON.stringify(r));
    if (tag) await tag.evaluate((e) => e.remove());
  }
  await ctx.close(); await b.close();
}
