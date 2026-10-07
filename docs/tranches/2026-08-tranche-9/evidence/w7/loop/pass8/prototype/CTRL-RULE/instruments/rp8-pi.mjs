// scratch π read for the pass-8 product moves: the margin track and the toggle's reach, computed.
import { playwright } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-28/web/frontend/e2e/lib/paint-lib.mjs";
for (const engine of ["chromium", "webkit"]) {
  const b = await playwright()[engine].launch();
  for (const vp of [{ width: 360, height: 800 }, { width: 390, height: 844 }, { width: 1024, height: 768 }, { width: 1280, height: 800 }]) {
    const p = await (await b.newContext({ viewport: vp })).newPage();
    await p.goto("http://127.0.0.1:4231/?size=3&difficulty=EASY"); await p.waitForSelector(".sudoku-cell");
    const r = await p.evaluate(() => { const g = document.querySelector(".ruled-group"); const c = document.querySelector(".controls-card"); const t = document.querySelector("button.sun-moon-toggle");
      return { margin: g ? getComputedStyle(g).gridTemplateColumns.split(" ")[0] : null, rpMargin: g ? getComputedStyle(g).getPropertyValue("--rp-margin").trim() : null, toggleFoot: c ? getComputedStyle(c).getPropertyValue("--toggle-foot").trim() : null, reach: t ? getComputedStyle(t).getPropertyValue("--toggle-reach").trim() : null }; });
    await p.hover("button.sun-moon-toggle").catch(() => {}); await p.waitForTimeout(400);
    const hov = await p.evaluate(() => getComputedStyle(document.querySelector("button.sun-moon-toggle")).transform);
    console.log(engine, vp.width + "x" + vp.height, JSON.stringify({ ...r, hoverTransform: hov }));
    await p.context().close();
  }
  await b.close();
}
