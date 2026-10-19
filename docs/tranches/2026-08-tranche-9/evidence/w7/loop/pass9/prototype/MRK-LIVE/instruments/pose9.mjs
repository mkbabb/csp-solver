// R4 mechanism probe: 16x16 cell 0 tier 2 under no-preference; per read the grid's active baked pose
// before and after the four-band read, the count under 3:1; then each pose PINNED by CSS and read.
import { playwright } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-35/web/frontend/e2e/lib/paint-lib.mjs";
import { fourBands } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-35/web/frontend/e2e/lib/edge-bands.mjs";
import os from "node:os";
const [base, label] = process.argv.slice(2);
function mint(sub) {
  const n = sub * sub; let cells = "";
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) { const i = r * n + c; const v = ((r * sub + Math.floor(r / sub) + c) % n) + 1; const keep = i > 1 && (r * 7 + c * 3) % 5 < 2; cells += (keep ? v : 0).toString(36); }
  return Buffer.from(String.fromCharCode(1) + `${sub}.${cells}`, "latin1").toString("base64url");
}
const pose = (page) => page.evaluate(() => [...document.querySelectorAll(".board-shell .hand-drawn-grid image.boil-frame-bitmap")].findIndex((i) => i.classList.contains("is-active")));
console.log("LOAD start " + os.loadavg().map((x) => x.toFixed(1)).join(" "));
for (const engine of (process.env.ENGINES ?? "chromium,webkit").split(",")) {
  const browser = await playwright()[engine].launch();
  for (const theme of ["light", "dark"]) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1, reducedMotion: "no-preference" });
    const page = await ctx.newPage();
    await page.goto(`${base}/?size=3&board=${mint(3)}`);
    await page.waitForFunction(() => document.querySelectorAll(".board-shell .game-cell").length === 81, null, { timeout: 120000 });
    if ((await page.evaluate(() => document.documentElement.classList.contains("dark"))) !== (theme === "dark")) {
      await page.locator("button.sun-moon-toggle").first().focus(); await page.keyboard.press("Enter");
      await page.waitForFunction((d) => document.documentElement.classList.contains("dark") === d, theme === "dark");
    }
    await page.waitForFunction(() => document.querySelectorAll(".board-shell .hand-drawn-grid image.boil-frame-bitmap").length >= 4, null, { timeout: 30000 });
    await page.locator(".board-shell .game-cell .cell-native-input").nth(+(process.env.CELL ?? 0)).focus();
    await page.keyboard.press("Shift");
    await page.waitForTimeout(1500);
    await page.evaluate((c) => document.querySelectorAll(".board-shell .game-cell")[c].setAttribute("data-gl23", ""), +(process.env.CELL ?? 0));
    const read = async (tag) => {
      const p0 = await pose(page);
      const r = await fourBands(page, { subject: "[data-gl23]", edge: ".game-cell:has(input:focus-visible) .cell-ghost", out: 8, inn: 16 });
      const p1 = await pose(page);
      const n = Object.values(r.bands ?? {}).reduce((a, x) => a + Math.round(x.fracUnder * x.stations), 0);
      const left = r.bands?.left?.coreMedian;
      console.log(`POSE16 ${label} ${engine} ${theme} ${tag} pose ${p0}->${p1} ${p0 === p1 ? "held" : "STRADDLE"} left ${left} under3 ${n}`);
    };
    for (let i = 0; i < +(process.env.REPS ?? 12); i++) { await read("free"); await page.waitForTimeout(37 * (i % 4)); }
    const PR = +(process.env.PINREPS ?? 1);
    const nb = await page.evaluate(() => document.querySelectorAll(".board-shell .hand-drawn-grid image.boil-frame-bitmap").length);
    for (let k = 0; k < nb; k++) {
      const t = await page.addStyleTag({ content: `.board-shell .hand-drawn-grid image.boil-frame-bitmap { opacity: 0 !important; } .board-shell .hand-drawn-grid image.boil-frame-bitmap:nth-of-type(${k + 1}) { opacity: 1 !important; }` });
      await page.waitForTimeout(300);
      for (let j = 0; j < PR; j++) await read(`pinned${k}`);
      await t.evaluate((e) => e.remove());
    }
    await ctx.close();
  }
  await browser.close();
}
console.log("LOAD end " + os.loadavg().map((x) => x.toFixed(1)).join(" "));
