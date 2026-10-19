// V8/V10 painted: the verb labels' text boxes and the verb glyphs' boxes, clean vs plant, both engines.
const FE = process.env.FE ?? process.cwd();
const pw = await import(`${FE}/node_modules/playwright/index.mjs`);
for (const engine of ["chromium", "webkit"]) {
  const b = await pw[engine].launch(); const p = await (await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce" })).newPage();
  await p.goto(process.argv[2] + "?size=3&difficulty=EASY"); await p.locator("#card-foot .action-bar").waitFor({ timeout: 30000 });
  for (const [n, css] of [["clean", ""], ["V8", ".action-bar .icon-sublabel { font-size: 0 !important; }"], ["V10", ".action-bar svg { display: none !important; }"]]) {
    const t = css ? await p.addStyleTag({ content: css }) : null;
    const r = await p.evaluate(async () => { await new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(res)));
      const lab = [...document.querySelectorAll("#card-foot .action-bar .icon-sublabel")].map((e) => { const g = document.createRange(); g.selectNodeContents(e); const q = g.getBoundingClientRect(); return +(q.width * q.height).toFixed(0); });
      const svg = [...document.querySelectorAll("#card-foot .action-bar button svg")].map((e) => { const q = e.getBoundingClientRect(); return +(q.width * q.height).toFixed(0); });
      return { labelArea: lab.reduce((a, c) => a + c, 0), labels: lab.length, glyphArea: svg.reduce((a, c) => a + c, 0), glyphs: svg.length }; });
    console.log(engine, n, JSON.stringify(r)); if (t) await t.evaluate((e) => e.remove());
  }
  await b.close();
}
