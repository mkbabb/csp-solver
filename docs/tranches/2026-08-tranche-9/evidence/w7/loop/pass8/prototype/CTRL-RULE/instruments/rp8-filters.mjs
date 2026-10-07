// scratch probe: live-filter population at BOOT (every rAF from the first) and at REST, tree vs control.
import { openCell, playwright, load } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-28/web/frontend/e2e/lib/paint-lib.mjs";
const arms = { tree: "http://127.0.0.1:4231/", control: "http://127.0.0.1:4252/" };
const cells = [
  { name: "1280x800f", width: 1280, height: 800, dpr: 1, hasTouch: false },
  { name: "390x844c", width: 390, height: 844, dpr: 2, hasTouch: true },
];
const count = () => {
  let n = 0; const sig = [];
  for (const e of document.querySelectorAll("*")) {
    const cs = getComputedStyle(e);
    if (cs.filter !== "none" && cs.display !== "none") { n++; sig.push((e.tagName + "." + [...e.classList].slice(0, 2).join(".")).toLowerCase() + "⟨" + cs.filter.slice(0, 24) + "⟩"); }
  }
  return { n, sig };
};
for (const engine of (process.argv[2] ?? "chromium,webkit").split(",")) {
  const browser = await playwright()[engine].launch();
  for (const cell of cells) for (const colorScheme of ["light", "dark"]) for (const [arm, url] of Object.entries(arms)) {
    const { ctx, page } = await openCell(browser, { ...cell, colorScheme, reducedMotion: "no-preference" });
    await page.addInitScript(({ t, src }) => {
      try { localStorage.setItem("sudoku-color-scheme", t); } catch {}
      const count = new Function("return (" + src + ")")();
      const series = []; const t0 = performance.now();
      const tick = () => { if (document.body) { const c = count(); series.push([Math.round(performance.now() - t0), c.n]); } if (performance.now() - t0 < 3000) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
      window.__boot = series;
    }, { t: colorScheme, src: count.toString() });
    await page.goto(url + "?size=3&difficulty=EASY");
    await page.waitForSelector(".sudoku-cell", { timeout: 30000 });
    await page.waitForTimeout(3200);
    const boot = await page.evaluate(() => window.__boot);
    await page.waitForFunction(() => document.getAnimations().every((a) => a.playState !== "running" || a.effect?.getTiming().iterations === Infinity), null, { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(1500);
    const rest = await page.evaluate(count);
    const ns = boot.map((b) => b[1]);
    const hist = {}; for (const s of rest.sig) hist[s] = (hist[s] ?? 0) + 1;
    console.log(`${engine} ${cell.name} ${colorScheme} ${arm}: boot frames ${ns.length} max ${Math.max(...ns)} min ${Math.min(...ns)} first ${ns[0]} · rest ${rest.n} ${JSON.stringify(hist)}`);
    await ctx.close();
  }
  await browser.close();
}
console.log("LOAD " + load());
