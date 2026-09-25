const NM = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/";
const { chromium, webkit } = await import(NM + "playwright/index.mjs");
const BOARD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
for (const [eng, E] of [["chromium", chromium], ["webkit", webkit]]) {
  const b = await E.launch();
  for (const [label, port] of [["tree", 4231], ["control", 4232], ["s10", 4233]]) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: eng === "chromium", reducedMotion: "reduce" });
    const p = await ctx.newPage();
    await p.goto(`http://127.0.0.1:${port}/?size=3&board=${BOARD}`);
    await p.waitForSelector(".sudoku-cell", { timeout: 60000 });
    await p.waitForTimeout(1200);
    if (await p.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) await p.locator(".drawer-tab").first().click({ force: true });
    await p.waitForTimeout(1200);
    const r = await p.evaluate(async () => {
      await document.fonts.ready;
      const out = [];
      for (const t of ["Normal", "normal", "Corner", "corner", "Ask", "ask", "Off", "off"]) {
        const el = [...document.querySelectorAll(".controls-card *")].find((e) => e.childElementCount === 0 && e.textContent.trim() === t);
        if (!el) continue;
        const cs = getComputedStyle(el);
        out.push({ t, tag: el.tagName, cls: el.className?.baseVal ?? el.className, ff: cs.fontFamily.slice(0, 80), fs: cs.fontSize, tt: cs.textTransform });
      }
      const loaded = [...document.fonts].filter((f) => f.status === "loaded").map((f) => f.family);
      return { out, loaded: [...new Set(loaded)] };
    });
    console.log(eng, label, JSON.stringify(r));
    await ctx.close();
  }
  await b.close();
}
