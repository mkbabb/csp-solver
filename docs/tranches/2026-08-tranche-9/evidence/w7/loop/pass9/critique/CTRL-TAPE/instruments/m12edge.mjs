// CTRL-TAPE pass-9 critic: the two edges of `inkSinceDeal` the lane's rows do not read, fine pointer 1440×900.
// R (reload): a player digit, a reload (the board persists, the undo timeline does not), then Clear: asked? digit kept?
// C (clear, then solve): a player digit, Clear (answered), then Solve on a board with no player ink: asked?
// usage: FE=<web/frontend> node m12edge.mjs <base>
const FE = process.env.FE ?? process.cwd();
const pw = await import(`${FE}/node_modules/playwright/index.mjs`);
const [base] = process.argv.slice(2);
const arm = (page) => page.evaluate(() => {
  const w = window; w.__asked = false;
  new MutationObserver(() => { if (document.querySelector("#card-foot .confirm-ribbon")) w.__asked = true; }).observe(document.body, { subtree: true, childList: true });
});
const asked = (page) => page.evaluate(() => window.__asked);
const firstEmpty = (page) => page.evaluate(() => [...document.querySelectorAll(".sudoku-cell input")].findIndex((e) => !e.value && !e.readOnly));
const empties = (page) => page.evaluate(() => [...document.querySelectorAll(".sudoku-cell input")].filter((e) => !e.value).length);
for (const engine of ["chromium", "webkit"]) {
  const b = await pw[engine].launch();
  const ctx = await b.newContext({ baseURL: base, viewport: { width: 1440, height: 900 }, hasTouch: false, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("./?size=3&difficulty=EASY");
  await page.waitForSelector(".sudoku-cell input", { timeout: 30000 });
  await page.locator("#card-foot .action-bar").waitFor({ timeout: 20000 });
  // R
  let at = await firstEmpty(page);
  const cell = () => page.locator(".sudoku-cell input").nth(at);
  await cell().click(); await page.keyboard.press("5");
  const typed = await cell().inputValue();
  await page.waitForTimeout(1500); // the board's own save debounce
  await page.reload();
  await page.waitForSelector(".sudoku-cell input", { timeout: 30000 });
  await page.locator("#card-foot .action-bar").waitFor({ timeout: 20000 });
  const kept = await cell().inputValue();
  await arm(page);
  await page.locator('#card-foot button[aria-label="Clear the board"]').click();
  await page.waitForTimeout(800);
  const rAsk = await asked(page), after = await cell().inputValue();
  console.log(engine, "R", JSON.stringify({ typed, keptAfterReload: kept, clearAsked: rAsk, digitAfterOneClick: after }));
  // C
  await page.reload();
  await page.waitForSelector(".sudoku-cell input", { timeout: 30000 });
  await page.locator("#card-foot .action-bar").waitFor({ timeout: 20000 });
  at = await firstEmpty(page);
  await cell().click(); await page.keyboard.press("7");
  await page.locator('#card-foot button[aria-label="Clear the board"]').click();
  const rib = page.locator("#card-foot .confirm-ribbon");
  const clearAsked = (await rib.count()) > 0;
  if (clearAsked) await rib.getByRole("button", { name: "clear", exact: true }).click();
  await page.waitForTimeout(600);
  const inkLeft = await cell().inputValue();
  const e0 = await empties(page);
  await arm(page);
  await page.locator('#card-foot button[aria-label="Solve puzzle"]').click();
  await page.waitForTimeout(1500);
  console.log(engine, "C", JSON.stringify({ clearAsked, inkLeftAfterClear: inkLeft, emptiesBeforeSolve: e0, solveAsked: await asked(page), emptiesAfterOneClick: await empties(page) }));
  await ctx.close(); await b.close();
}
