// COPIED to pass 6 from pass5/prototype/CTRL-FACE/instruments/seal-read.mjs (ARMS re-pointed: tree dist :4236, control :4232; mainhead dropped — W8 did not touch the seal surface on this pass). CTRL-FACE pass 5 — visual-regression test 10's three reads (shipped · captions on the hand rung ·
// the EXTENDED unpaid layout), per arm, both engines, 1280×800 coarse isMobile — the numbers the chair
// stamps once at the fold. usage: node seal-read.mjs
import { createRequire } from "node:module";
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const pw = require("playwright");
const ARMS = { tree: "http://127.0.0.1:4236", control: "http://127.0.0.1:4232" };
const PANEL_H = () => { const p = document.querySelector(".controls-card .control-panel-wrap"); return p ? +p.getBoundingClientRect().height.toFixed(2) : null; };
const UNPAID_ORIG = `.ctrl-options.options-pair { flex-direction: column !important } .ctrl-options.options-pair > .ctrl-btn { flex: 0 0 auto !important } .peek-hold-surface { margin-block: 0.5rem !important }`;
const UNPAID_EXT = UNPAID_ORIG + ` .ctrl-options.options-line { flex-direction: column !important; flex-wrap: nowrap !important } .ctrl-options.options-line > .ctrl-btn { flex: 0 0 auto !important } .deal-row { display: grid !important } .deal-row > .difficulty-tally { grid-area: 2 / 1 !important; justify-self: center !important } .deal-row > .deal-btn { grid-area: 1 / 1 !important; justify-self: center !important }`;
for (const eng of ["chromium", "webkit"]) {
  const b = await pw[eng].launch();
  for (const [arm, base] of Object.entries(ARMS)) {
    const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, hasTouch: true, isMobile: true });
    const p = await ctx.newPage();
    await p.goto(base + "/"); await p.waitForSelector("svg.handwritten-logo"); await p.waitForSelector(".ctrl-btn"); await p.waitForTimeout(400);
    const shipped = await p.evaluate(PANEL_H);
    const read = async (css) => { const h = await p.addStyleTag({ content: css }); await p.waitForTimeout(150); const v = await p.evaluate(PANEL_H); await h.evaluate((n) => n.remove()); await p.waitForTimeout(150); return v; };
    const hand = await read(".zone-row-label { font-size: var(--type-tag) !important; line-height: 1.1 !important }");
    const orig = await read(UNPAID_ORIG);
    const ext = await read(UNPAID_EXT);
    console.log(`${eng} ${arm.padEnd(8)} shipped ${shipped} · captions on the hand rung ${hand} (Δ ${(shipped - hand).toFixed(2)}) · unpaid (test 10 as landed) ${orig} · unpaid EXTENDED ${ext}`);
    await ctx.close();
  }
  await b.close();
}
