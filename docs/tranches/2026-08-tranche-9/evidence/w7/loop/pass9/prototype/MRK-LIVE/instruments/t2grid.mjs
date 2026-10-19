// What lies under tier 2's top band at the board's cell 0 under reduce: read the four bands as
// shipped, then with the grid's vector ink hidden, then with only the baked layer hidden; print the
// grid's layer census (bitmaps, vector lines) so the union's crisp reduced grid is named on paint.
import { playwright } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-35/web/frontend/e2e/lib/paint-lib.mjs";
import { fourBands } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-35/web/frontend/e2e/lib/edge-bands.mjs";
import os from "node:os";
const [base, label] = process.argv.slice(2);
function mint(sub) {
  const n = sub * sub; let cells = "";
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) { const i = r * n + c; const v = ((r * sub + Math.floor(r / sub) + c) % n) + 1; const keep = i > 1 && (r * 7 + c * 3) % 5 < 2; cells += (keep ? v : 0).toString(36); }
  return Buffer.from(String.fromCharCode(1) + `${sub}.${cells}`, "latin1").toString("base64url");
}
console.log(`${label} LOAD start ${os.loadavg().map((x) => x.toFixed(1)).join(" ")}`);
const say = (r) => ["top", "right", "bottom", "left"].map((s) => `${s} ${r.bands?.[s]?.coreMedian?.toFixed?.(3)} u${Math.round((r.bands?.[s]?.fracUnder ?? 0) * (r.bands?.[s]?.stations ?? 0))}`).join(" · ");
for (const engine of (process.env.ENGINES ?? "chromium,webkit").split(",")) {
  const browser = await playwright()[engine].launch();
  for (const theme of ["light", "dark"]) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, reducedMotion: "reduce", colorScheme: theme });
    const page = await ctx.newPage();
    await page.goto(`${base}/?size=3&board=${mint(3)}`);
    await page.waitForFunction(() => document.querySelectorAll(".board-shell .game-cell").length === 81, null, { timeout: 120000 });
    if ((await page.evaluate(() => document.documentElement.classList.contains("dark"))) !== (theme === "dark")) {
      await page.locator("button.sun-moon-toggle").first().focus(); await page.keyboard.press("Enter");
      await page.waitForFunction((d) => document.documentElement.classList.contains("dark") === d, theme === "dark");
    }
    await page.waitForTimeout(1500);
    const census = await page.evaluate(() => {
      const g = document.querySelector(".board-shell .hand-drawn-grid");
      return { bitmaps: g?.parentElement?.querySelectorAll(".boil-frame-bitmap").length, gridInk: g?.parentElement?.querySelectorAll(".grid-ink").length, lines: g?.querySelectorAll(".grid-line, path").length };
    });
    await page.locator(".board-shell .game-cell .cell-native-input").nth(0).focus();
    await page.keyboard.press("Shift");
    await page.waitForTimeout(800);
    await page.evaluate(() => document.querySelectorAll(".board-shell .game-cell")[0].setAttribute("data-gl23", ""));
    const rd = () => fourBands(page, { subject: "[data-gl23]", edge: ".game-cell:has(input:focus-visible) .cell-ghost", out: 8, inn: 16 });
    console.log(`${label} ${engine} ${theme} census ${JSON.stringify(census)}`);
    console.log(`${label} ${engine} ${theme} shipped   ${say(await rd())}`);
    const t = await page.addStyleTag({ content: `${process.env.HIDE ?? ".board-shell .hand-drawn-grid"} { visibility: hidden !important; }` });
    await page.waitForTimeout(300);
    console.log(`${label} ${engine} ${theme} hid[${process.env.HIDE ?? "grid"}] ${say(await rd())}`);
    await t.evaluate((e) => e.remove());
    await ctx.close();
  }
  await browser.close();
}
console.log(`${label} LOAD end ${os.loadavg().map((x) => x.toFixed(1)).join(" ")}`);
