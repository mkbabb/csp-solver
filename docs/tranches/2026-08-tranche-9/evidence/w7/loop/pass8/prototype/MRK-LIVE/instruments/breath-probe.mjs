// After a keyboard focus and the spec's docSettled (finite animations drained), is the living mark at rest?
// Samples the ring's shown pose and the grid's data-mark-pose every rAF for 900 ms. no-preference vs reduce.
import { playwright } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-35/web/frontend/e2e/lib/paint-lib.mjs";
const base = process.argv[2] ?? "http://127.0.0.1:4238";
for (const engine of ["chromium", "webkit"]) {
  const browser = await playwright()[engine].launch();
  for (const rm of ["no-preference", "reduce"]) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: rm });
    const page = await ctx.newPage();
    await page.goto(base + "/?game=sudoku");
    await page.waitForFunction(() => document.querySelectorAll(".board-shell .game-cell").length === 81, null, { timeout: 120000 });
    await page.waitForTimeout(1500);
    for (const [label, sel] of [["tuner", "button.tuner-toggle"], ["cell40", ".board-shell .game-cell .cell-native-input >> nth=40"]]) {
      await page.locator(sel).first().focus();
      await page.keyboard.press("Shift");
      const t0 = Date.now();
      await page.waitForFunction(() => document.getAnimations().filter((a) => a.playState === "running" && Number.isFinite(a.effect?.getComputedTiming().endTime ?? Infinity)).length === 0, null, { timeout: 15000 });
      const settledAt = Date.now() - t0;
      const seq = await page.evaluate(() => new Promise((res) => {
        const out = []; const t = performance.now();
        const step = () => {
          const ring = document.querySelector(".focus-ring");
          const ps = ring ? [...ring.querySelectorAll("path")] : [];
          const shown = ps.findIndex((p) => p.style.opacity !== "0");
          const grid = document.querySelector("[data-mark-pose]")?.getAttribute("data-mark-pose");
          const k = shown + "/" + grid;
          if (!out.length || out[out.length - 1][1] !== k) out.push([Math.round(performance.now() - t), k]);
          if (performance.now() - t < 900) requestAnimationFrame(step); else res(out);
        };
        requestAnimationFrame(step);
      }));
      console.log(engine, rm, label, "docSettled after", settledAt, "ms; then ring/grid pose:", JSON.stringify(seq));
    }
    await ctx.close();
  }
  await browser.close();
}
