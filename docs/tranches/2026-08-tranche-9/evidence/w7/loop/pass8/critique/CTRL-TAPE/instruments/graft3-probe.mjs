// CTRL-TAPE pass-8 critic: graft 3 at a FINE pointer (1440x900, hasTouch false), both engines.
// Arm A: page-load board -> Solve.  Arm B: Deal (no player ink) -> Solve.  Arm C: Deal -> type one digit -> Solve.
// Reads: the ribbon's text 300 ms after the press, the empty-cell count before and 3 s after.
// usage: node graft3-probe.mjs <label> <baseURL>
const pw = await import("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs");
const [label, base] = process.argv.slice(2);
const empties = (p) => p.evaluate(() => [...document.querySelectorAll(".sudoku-cell input")].filter((i) => !i.value).length);
const ribbon = (p) => p.evaluate(() => document.querySelector(".confirm-ribbon")?.textContent?.replace(/\s+/g, " ").trim().slice(0, 60) ?? null);
const btn = (p, name) => p.locator(`button[aria-label="${name}"]:visible`).first();
for (const engine of ["chromium", "webkit"]) {
  const b = await pw[engine].launch();
  for (const arm of ["A load->Solve", "B Deal->Solve", "C Deal->digit->Solve"]) {
    const ctx = await b.newContext({ baseURL: base, viewport: { width: 1440, height: 900 }, hasTouch: false, deviceScaleFactor: 1 });
    const p = await ctx.newPage();
    await p.goto("./?size=3&difficulty=EASY");
    await p.waitForSelector(".sudoku-cell input", { timeout: 30000 });
    await p.waitForTimeout(1200);
    if (arm[0] !== "A") { await btn(p, "Deal a new board").click(); await p.waitForTimeout(2500); }
    if (arm[0] === "C") { const c = p.locator(".sudoku-cell input:not([readonly])").first(); await c.click(); await p.keyboard.type("5"); await p.waitForTimeout(300); }
    const e0 = await empties(p);
    await btn(p, "Solve puzzle").click();
    await p.waitForTimeout(300);
    const r = await ribbon(p);
    await p.waitForTimeout(3000);
    const e1 = await empties(p);
    console.log(`${label} ${engine.padEnd(8)} ${arm.padEnd(22)} empties ${e0} -> ${e1}  ribbon@300ms ${JSON.stringify(r)}  one-click-solved=${e1 === 0 && e0 > 0}`);
    await ctx.close();
  }
  await b.close();
}
