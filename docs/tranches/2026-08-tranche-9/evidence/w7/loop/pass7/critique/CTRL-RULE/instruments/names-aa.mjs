// critic pass 7: painted-text AA (the chair's glyph-pop, copied) on the ruled page's own text subjects, 3 arms
const NM = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/";
const { chromium, webkit } = await import(NM + "playwright/index.mjs");
const { glyphPopulation } = await import("./glyph-pop.mjs");
const BOARD = "ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const TEXTS = ["marks", "checking", "clear", "corner"];
for (const [eng, E] of [["chromium", chromium], ["webkit", webkit]]) {
  const b = await E.launch();
  for (const theme of ["light", "dark"]) for (const [label, port] of [["tree", 4231], ["control", 4232], ["s10", 4233]]) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: eng === "chromium", colorScheme: theme, reducedMotion: "reduce" });
    await ctx.addInitScript((t) => { try { localStorage.clear(); localStorage.setItem("sudoku-color-scheme", t); } catch {} }, theme);
    const p = await ctx.newPage();
    await p.goto(`http://127.0.0.1:${port}/?size=3&board=${BOARD}`);
    await p.waitForSelector(".sudoku-cell", { timeout: 60000 });
    await p.addStyleTag({ content: ".tuner-toggle{display:none!important}" });
    await p.waitForTimeout(900);
    if (await p.evaluate(() => document.documentElement.classList.contains("drawer-closed"))) await p.locator(".drawer-tab").first().click({ force: true });
    await p.waitForTimeout(1500);
    const row = { eng, theme, arm: label };
    for (const t of TEXTS) {
      const found = await p.evaluate((t) => {
        const el = [...document.querySelectorAll("#controls-drawer *")].find((e) => [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().toLowerCase() === t) && e.getClientRects().length);
        if (!el) return null;
        el.setAttribute("data-rc7", t); el.scrollIntoView({ block: "center" });
        const cs = getComputedStyle(el); return { tag: el.tagName, cls: String(el.className?.baseVal ?? el.className).slice(0, 40), color: cs.color, ff: cs.fontFamily.split(",")[0] };
      }, t);
      if (!found) { row[t] = "absent"; continue; }
      await p.waitForTimeout(500);
      const g = await glyphPopulation(p, { subject: `[data-rc7="${t}"]` });
      row[t] = { ...found, pop: g.population, med: g.coreMedian, frac: g.fracUnder, transient: g.transientPx, red: g.red, why: g.why };
    }
    console.log(JSON.stringify(row));
    await ctx.close();
  }
  await b.close();
}
