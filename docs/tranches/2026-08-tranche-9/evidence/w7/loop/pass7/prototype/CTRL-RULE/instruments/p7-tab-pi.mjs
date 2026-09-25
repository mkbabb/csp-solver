// T9-W7 pass 7 · CTRL-RULE — the pass-6 critic's gap 5 as a NAMED π row: W2's drawer tab (a
// descendant of `#controls-drawer`, which the whole-DOM π census skipped) read per arm at every
// portrait cell incl. the two tablet-portrait cells, drawer OPEN and SETTLED (the case's top polled
// until two reads agree), plus the card's content view (clientHeight) and the sideways scroll
// (INTAKE-22 row 29: scrollWidth − clientWidth). Same encoded board on every arm.
// node p7-tab-pi.mjs <engine> <label=base> [<label=base> …]
const NM = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/";
const { chromium, webkit } = await import(NM + "playwright/index.mjs");
const [ENGINE, ...ARMS] = process.argv.slice(2);
const BOARD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const CELLS = (process.env.CELLS || "390x844c,360x800c,390x800c,430x932c,390x844f,360x800f,390x800f,600x960f,768x1024c,820x1180c").split(",");
const b = await (ENGINE === "webkit" ? webkit : chromium).launch();
for (const cell of CELLS) {
  const [, w, h, k] = cell.match(/(\d+)x(\d+)([cf])/);
  const out = { cell, engine: ENGINE };
  for (const arm of ARMS) {
    const [label, base] = arm.split("=");
    const ctx = await b.newContext({ viewport: { width: +w, height: +h }, hasTouch: k === "c", isMobile: k === "c" && ENGINE === "chromium", deviceScaleFactor: 1, reducedMotion: "reduce" });
    const p = await ctx.newPage();
    await p.goto(`${base}?size=3&board=${BOARD}`, { waitUntil: "domcontentloaded" });
    await p.waitForSelector(".sudoku-cell", { timeout: 60000 });
    await p.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
    await p.waitForTimeout(900);
    if (await p.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) await p.locator(".drawer-tab").first().click({ force: true });
    let last = null; for (let i = 0; i < 60; i++) { await p.waitForTimeout(100); const t = await p.evaluate(() => document.querySelector(".drawer-case")?.getBoundingClientRect().top ?? -1); if (last !== null && Math.abs(t - last) < 0.01) break; last = t; }
    out[label] = await p.evaluate(() => {
      const tab = document.querySelector(".drawer-tab"); const card = document.querySelector(".controls-card"); const cas = document.querySelector(".drawer-case");
      const tb = tab?.getBoundingClientRect();
      return { tabTop: tb ? +tb.top.toFixed(2) : null, tabVisible: !!tb && tb.width > 0, caseTop: cas ? +cas.getBoundingClientRect().top.toFixed(2) : null, cardClientH: card?.clientHeight ?? null, sideways: card ? card.scrollWidth - card.clientWidth : null, coarse: matchMedia("(pointer: coarse)").matches };
    });
    await ctx.close();
  }
  const ref = out.control;
  for (const arm of ARMS.map((a) => a.split("=")[0]).filter((l) => l !== "control"))
    if (ref && out[arm]?.tabTop != null && ref.tabTop != null) out[`${arm}−control`] = { tab: +(out[arm].tabTop - ref.tabTop).toFixed(2), cardClientH: out[arm].cardClientH - ref.cardClientH };
  console.log(JSON.stringify(out));
}
await b.close();
