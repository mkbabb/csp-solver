// The thickness clause (B3, css px) at DPR 2: a clean chrome stop and tier 2, then THIN_1PX, through the ONE probe.
import { playwright } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-35/web/frontend/e2e/lib/paint-lib.mjs";
import { fourBands, EDGE_PLANTS, applyEdgePlant } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-35/web/frontend/e2e/lib/edge-bands.mjs";
const base = process.argv[2] ?? "http://127.0.0.1:4238";
const B = "ATMuMDAzMDA2MDgwMDUwNzAwMTAzMDA5MDIwMDUwMjAwNTA3MDAxMDYwMDkwMjAwODAxMDA0MDYwMDQwNjAwOTAyMDA4MDEwMDQwOTAwMzA1MDA4";
const brief = (r) => Object.entries(r.bands ?? {}).map(([s, b]) => s + " " + b.coreMedian + "/" + b.stations + " t" + b.thickness).join(" · ") + (r.red ? " RED ⟨" + r.why.join("; ") + "⟩" : " GREEN");
for (const engine of ["chromium", "webkit"]) {
  const browser = await playwright()[engine].launch();
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, reducedMotion: "reduce", colorScheme: "light" });
  const page = await ctx.newPage();
  await page.goto(base + "/?size=3&board=" + B);
  await page.waitForFunction(() => document.querySelectorAll(".board-shell .game-cell").length === 81, null, { timeout: 120000 });
  await page.waitForTimeout(800);
  const settled = () => page.waitForFunction(() => document.getAnimations().filter((a) => a.playState === "running" && Number.isFinite(a.effect?.getComputedTiming().endTime ?? Infinity)).length === 0, null, { timeout: 15000 });
  // chrome: the info-btn toggle
  await page.locator("button.info-btn").focus(); await page.keyboard.press("Shift"); await settled();
  await page.evaluate(() => { document.querySelectorAll("[data-gl23]").forEach((e) => e.removeAttribute("data-gl23")); document.querySelector("button.info-btn").setAttribute("data-gl23", ""); });
  let r = await fourBands(page, { subject: "[data-gl23]", edge: ".focus-ring", out: 6, inn: 6 });
  console.log("DPR2", engine, "info-btn clean:", brief(r));
  let undo = await applyEdgePlant(page, ".focus-ring", EDGE_PLANTS(".focus-ring").THIN_1PX); await settled();
  r = await fourBands(page, { subject: "[data-gl23]", edge: ".focus-ring", out: 6, inn: 6 });
  console.log("DPR2", engine, "info-btn THIN_1PX:", brief(r)); await undo();
  const T2 = ".game-cell:has(input:focus-visible) .cell-ghost";
  await page.locator(".board-shell .game-cell .cell-native-input").nth(40).focus(); await page.keyboard.press("Shift"); await settled();
  await page.evaluate(() => { document.querySelectorAll("[data-gl23]").forEach((e) => e.removeAttribute("data-gl23")); document.querySelectorAll(".board-shell .game-cell")[40].setAttribute("data-gl23", ""); });
  r = await fourBands(page, { subject: "[data-gl23]", edge: T2, out: 8, inn: 16 });
  console.log("DPR2", engine, "tier2 cell40 clean:", brief(r));
  undo = await applyEdgePlant(page, T2, EDGE_PLANTS(T2).THIN_1PX); await settled();
  r = await fourBands(page, { subject: "[data-gl23]", edge: T2, out: 8, inn: 16 });
  console.log("DPR2", engine, "tier2 cell40 THIN_1PX:", brief(r)); await undo();
  await browser.close();
}
