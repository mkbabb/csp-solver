// The frame cells (9×9 and 16×16 cell 0) and interior cell 40, tier 2 focused, four bands through the ONE
// probe at its product home; lane vs control; both engines, both themes, reduce, 1280×800 DPR 1.
import { playwright } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-35/web/frontend/e2e/lib/paint-lib.mjs";
import { fourBands } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-35/web/frontend/e2e/lib/edge-bands.mjs";
const urls = process.argv.slice(2);
function mint(sub) {
  const n = sub * sub; let cells = "";
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) { const i = r * n + c; const v = ((r * sub + Math.floor(r / sub) + c) % n) + 1; const keep = i > 1 && (r * 7 + c * 3) % 5 < 2; cells += (keep ? v : 0).toString(36); }
  return Buffer.from(String.fromCharCode(1) + `${sub}.${cells}`, "latin1").toString("base64url");
}
for (const engine of ["chromium", "webkit"]) {
  const browser = await playwright()[engine].launch();
  for (const u of urls) {
    const [label, base] = u.split("=");
    for (const theme of (process.env.THEMES ?? "light,dark").split(",")) {
      const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, reducedMotion: process.env.RM ?? "reduce" });
      const page = await ctx.newPage();
      for (const [sub, cell] of JSON.parse(process.env.CELLS ?? "[[3,0],[3,40],[4,0]]")) for (let rep = 0; rep < +(process.env.REPS ?? 1); rep++) {
        await page.goto(`${base}/?size=${sub}&board=${mint(sub)}`);
        await page.waitForFunction((n) => document.querySelectorAll(".board-shell .game-cell").length === n, sub ** 4, { timeout: 120000 });
        const dark = await page.evaluate(() => document.documentElement.classList.contains("dark"));
        if (dark !== (theme === "dark")) {
          await page.locator("button.sun-moon-toggle").first().focus();
          await page.keyboard.press("Enter");
          await page.waitForFunction((d) => document.documentElement.classList.contains("dark") === d, theme === "dark");
        }
        await page.locator(".board-shell .game-cell .cell-native-input").nth(cell).focus();
        await page.keyboard.press("Shift");
        await page.waitForFunction(() => document.getAnimations().filter((a) => a.playState === "running" && Number.isFinite(a.effect?.getComputedTiming().endTime ?? Infinity)).length === 0, null, { timeout: 15000 });
        await page.evaluate((cell) => { document.querySelectorAll("[data-gl23]").forEach((e) => e.removeAttribute("data-gl23")); document.querySelectorAll(".board-shell .game-cell")[cell].setAttribute("data-gl23", ""); }, cell);
        await page.waitForTimeout(900);
        const so = await page.evaluate(() => getComputedStyle(document.querySelector(".game-cell:has(input:focus-visible) .cell-ghost-path")).strokeOpacity);
        const r = await fourBands(page, { subject: "[data-gl23]", edge: ".game-cell:has(input:focus-visible) .cell-ghost", out: 8, inn: 16 });
        const b = Object.entries(r.bands ?? {}).map(([s, x]) => `${s} ${x.coreMedian}/${x.stations} u${Math.round(x.fracUnder * x.stations)} t${x.thickness}`).join(" · ");
        const n = Object.values(r.bands ?? {}).reduce((a, x) => a + Math.round(x.fracUnder * x.stations), 0);
        console.log(`CELL0 rm=${process.env.RM ?? "reduce"} rep${rep} ${engine} ${label} ${theme} ${sub * sub}x${sub * sub} cell ${cell} so ${so}: ${b} · under3 ${n} → ${r.red ? "RED " + r.why.join("; ") : "GREEN"}`);
      }
      await ctx.close();
    }
  }
  await browser.close();
}
console.log(`LOAD ${(await import("node:os")).loadavg().map((x) => x.toFixed(1)).join(" ")}`);
