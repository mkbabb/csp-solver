import { chromium, webkit } from "./p5-lib.mjs";
for (const [name, type] of [["chromium", chromium], ["webkit", webkit]]) {
  const b = await type.launch();
  for (let run = 0; run < 3; run++) {
    const ctx = await b.newContext({ colorScheme: "light", reducedMotion: "reduce", viewport: { width: 1280, height: 800 } });
    const p = await ctx.newPage();
    await p.goto("http://127.0.0.1:4241/?size=3&difficulty=EASY");
    await p.waitForSelector(".sudoku-cell", { timeout: 60000 });
    await p.waitForTimeout(1500);
    const blanks = await p.evaluate(() => [...document.querySelectorAll(".sudoku-cell")].filter((c) => !c.querySelector(".glyph-svg")).length);
    let n = 0;
    for (; n < 26; n++) {
      const ok = await p.evaluate(() => { const b = document.querySelector('[aria-label*="Hint" i]'); if (!b || b.disabled) return false; b.click(); return true; });
      if (!ok) break;
      await p.waitForTimeout(130);
    }
    await p.waitForTimeout(1000);
    const st = await p.evaluate(() => ({ won: !!document.querySelector(".solve-success"), stroke: getComputedStyle(document.querySelector(".progress-trace")).stroke, valuenow: document.querySelector("[aria-valuenow]")?.getAttribute("aria-valuenow") }));
    console.log(`${name} run${run}: blanks ${blanks}, hints pressed ${n}, ${JSON.stringify(st)}`);
    await ctx.close();
  }
  await b.close();
}
