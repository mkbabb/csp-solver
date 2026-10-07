// scratch probe (not a product file): .rp-name glyph population, shipped ink vs overrides.
import { glyphPopulation, fmt } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-28/web/frontend/e2e/lib/glyph-pop.mjs";
import { openCell, playwright, settle, load } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-28/web/frontend/e2e/lib/paint-lib.mjs";
const BOARD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const base = process.argv[2] ?? "http://127.0.0.1:4231/";
const inks = (process.argv[3] ?? "shipped,quiet").split(",");
const engines = (process.argv[4] ?? "chromium,webkit").split(",");
const INK = { shipped: null, quiet: ".rp-name { color: var(--ink-press-quiet) !important; }", fg: ".rp-name { color: var(--color-foreground) !important; }" };
const cells = [
  { name: "390x844c", width: 390, height: 844, dpr: 2, hasTouch: true },
  { name: "1280x800f", width: 1280, height: 800, dpr: 1, hasTouch: false },
];
for (const engine of engines) {
  const browser = await playwright()[engine].launch();
  for (const cell of cells) for (const colorScheme of ["light", "dark"]) {
    const { ctx, page } = await openCell(browser, { ...cell, colorScheme, reducedMotion: "reduce" });
    await page.addInitScript((t) => { try { localStorage.setItem("sudoku-color-scheme", t); } catch {} }, colorScheme);
    await page.goto(`${base}?size=3&board=${BOARD}`);
    await page.waitForSelector(".sudoku-cell");
    await page.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
    await page.evaluate(() => document.fonts.ready);
    if (await page.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) {
      if (cell.hasTouch) await page.locator(".drawer-tab").tap(); else await page.locator(".drawer-tab").click();
    }
    await page.waitForTimeout(1500);
    await settle(page);
    const ids = await page.evaluate(() => [...document.querySelectorAll(".rp-name")].map((e) => { const r = e.getBoundingClientRect(); return { id: e.id, t: e.textContent.trim(), vis: r.top >= 0 && r.bottom <= innerHeight && r.width > 0 }; }));
    for (const ink of inks) {
      const tag = INK[ink] ? await page.addStyleTag({ content: INK[ink] }) : null;
      await settle(page);
      for (const n of ids.filter((x) => x.vis).slice(0, 3)) {
        const r = await glyphPopulation(page, { subject: `[id="${n.id}"]` });
        console.log(`${engine} ${cell.name} dpr${cell.dpr} ${colorScheme} ink=${ink} '${n.t}' ${fmt(r)}`);
      }
      if (tag) { await tag.evaluate((e) => e.remove()); await settle(page); }
    }
    await ctx.close();
  }
  await browser.close();
}
console.log("LOAD " + load());
