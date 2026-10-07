// CTRL-TAPE pass-8 critic: look at the surface (not banked): rail 1280x800 fine, clean and under the C4/C12 siblings.
// usage: node snap8.mjs <baseURL> <outdir>
const pw = await import("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs");
const [base, out] = process.argv.slice(2);
for (const engine of ["chromium", "webkit"]) {
  const b = await pw[engine].launch();
  const ctx = await b.newContext({ baseURL: base, viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
  const p = await ctx.newPage();
  await p.goto("./?size=3&difficulty=EASY"); await p.waitForSelector(".sudoku-cell input", { timeout: 30000 }); await p.waitForTimeout(1500);
  await p.screenshot({ path: `${out}/${engine}-clean.png` });
  for (const [n, css] of [["C4", ".card-foot { order: -1 !important }"], ["C12", ".action-bar { height: 0 !important }"]]) {
    const t = await p.addStyleTag({ content: css }); await p.waitForTimeout(500);
    await p.screenshot({ path: `${out}/${engine}-${n}.png` });
    await t.evaluate((x) => x.remove()); await p.waitForTimeout(300);
  }
  await b.close();
}
