// CTRL-TAPE pass-9 critic: do the source gate's GREEN siblings (breaks9.mjs) MOVE PAINT? Each CSS plant is injected
// at run time on the served tree (the same bytes the gate reads, added as one rule), then the case, the foot, the
// verbs and the viewport are read off the painted boxes. A plant whose verbs leave the viewport, leave the case, or
// paint at < 10 px is a real escape. usage: FE=<web/frontend> node esc9.mjs <baseURL> [w h]
const FE = process.env.FE ?? process.cwd();
const pw = await import(`${FE}/node_modules/playwright/index.mjs`);
const [base, w = "1440", h = "900"] = process.argv.slice(2);
const P = [
  ["clean", ""],
  ["B1 case min-height:200vh", ".drawer-case { min-height: 200vh !important; }"],
  ["B2 case min-block-size:200vh", ".drawer-case { min-block-size: 200vh !important; }"],
  ["A2 card min-block-size:100vh", ".controls-card { min-block-size: 100vh !important; }"],
  ["G1 case row-gap:100vh", ".drawer-case { row-gap: 100vh !important; }"],
  ["G3 case writing-mode:vertical-rl", ".drawer-case { writing-mode: vertical-rl !important; }"],
  ["G4 case flex-flow:column-reverse", ".drawer-case { flex-flow: column-reverse !important; }"],
  ["G5 case::after 100vh", '.drawer-case::after { content: ""; display: block; height: 100vh; flex: none; }'],
  ["G6 case border-bottom 100vh", ".drawer-case { border-bottom: 100vh solid transparent !important; }"],
  ["D6 foot::before 100vh", '.card-foot::before { content: ""; display: block; height: 100vh; }'],
  ["D7 foot line-height:100vh", ".card-foot { line-height: 100vh !important; }"],
  ["F1 bar min-height:100vh", ".action-bar { min-height: 100vh !important; }"],
  ["F3 bar margin-top:100vh", ".action-bar { margin-top: 100vh !important; }"],
  ["F4 bar padding-top:100vh", ".action-bar { padding-top: 100vh !important; }"],
  ["F5 bar line-height:0", ".action-bar { line-height: 0 !important; }"],
  ["V5 verbs font-size:0", ".action-bar > .action-verbs { font-size: 0 !important; }"],
  ["V6 bar button font-size:1px", ".action-bar button { font-size: 1px !important; }"],
  ["V7 bar font-size:50vh", ".action-bar { font-size: 50vh !important; }"],
  ["T16 foot mt-[100vh] (as CSS)", "#card-foot { margin-top: 100vh !important; }"],
];
for (const engine of ["chromium", "webkit"]) {
  const b = await pw[engine].launch();
  const ctx = await b.newContext({ baseURL: base, viewport: { width: +w, height: +h }, hasTouch: false, deviceScaleFactor: 2, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto("./?size=3&difficulty=EASY");
  await page.waitForSelector("svg.handwritten-logo", { timeout: 30000 });
  await page.locator("#card-foot .action-bar").waitFor({ timeout: 20000 });
  for (const [name, css] of P) {
    const tag = css ? await page.addStyleTag({ content: css }) : null;
    const r = await page.evaluate(async () => {
      await new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(res)));
      const R = (e) => e.getBoundingClientRect();
      const kase = R(document.querySelector(".drawer-case")), foot = R(document.getElementById("card-foot"));
      const vs = [...document.querySelectorAll("#card-foot .action-bar button")].filter((e) => e.offsetParent !== null);
      const vb = vs.map(R), fs = vs.map((e) => parseFloat(getComputedStyle(e).fontSize));
      const top = Math.min(...vb.map((x) => x.top)), bottom = Math.max(...vb.map((x) => x.bottom));
      return { n: vs.length, caseTop: +kase.top.toFixed(1), caseBottom: +kase.bottom.toFixed(1), footTop: +foot.top.toFixed(1), footBottom: +foot.bottom.toFixed(1), verbsTop: +top.toFixed(1), verbsBottom: +bottom.toFixed(1), minFont: Math.min(...fs), vh: innerHeight, vw: innerWidth };
    });
    const out = [];
    if (r.verbsBottom > r.vh + 0.5) out.push("verbs below viewport");
    if (r.verbsTop < 0) out.push("verbs above viewport");
    if (r.verbsBottom > r.caseBottom + 0.5) out.push("verbs below case");
    if (r.caseBottom > r.vh + 0.5) out.push("case below viewport");
    if (r.minFont < 10) out.push("verb font " + r.minFont);
    if (r.footBottom < r.caseBottom - 1) out.push("foot not last");
    console.log(engine.padEnd(9) + name.padEnd(34) + (out.length ? "MOVES  " + out.join("; ") : "same   ") + "  " + JSON.stringify(r));
    if (tag) await tag.evaluate((e) => e.remove());
  }
  await ctx.close(); await b.close();
}
