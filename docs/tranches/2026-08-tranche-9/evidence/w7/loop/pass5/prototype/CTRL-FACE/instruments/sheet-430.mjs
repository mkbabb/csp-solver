// CTRL-FACE pass 5 — the content-sized dock sheet at 390×844 / 430×932 coarse: sheet top, drawer tab,
// bar, card; proto vs control, both engines, one encoded board, settled pose (polled).
import { createRequire } from "node:module";
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const pw = require("playwright");
const PAYLOAD = "?size=3&difficulty=MEDIUM&board=ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const ARMS = { proto: "http://127.0.0.1:4236", control: "http://127.0.0.1:4235" };
for (const eng of ["chromium", "webkit"]) {
  const b = await pw[eng].launch();
  for (const [w, h] of [[390, 844], [430, 932]]) for (const [arm, base] of Object.entries(ARMS)) {
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: true, isMobile: true, deviceScaleFactor: 3, reducedMotion: "reduce" });
    const p = await ctx.newPage();
    await p.goto(base + "/" + PAYLOAD); await p.waitForSelector("svg.handwritten-logo"); await p.waitForTimeout(600);
    await p.locator(".drawer-tab").tap();
    let last = "", same = 0; const t0 = Date.now();
    while (Date.now() - t0 < 5000) { const s = await p.evaluate(() => JSON.stringify(document.querySelector(".controls-card")?.getBoundingClientRect())); if (s === last) { if (++same >= 3) break; } else same = 0; last = s; await p.waitForTimeout(120); }
    const r = await p.evaluate(() => { const R = (s) => { const e = [...document.querySelectorAll(s)].find((x) => x.getClientRects().length); if (!e) return "—"; const b = e.getBoundingClientRect(); return `${b.y.toFixed(2)}+${b.height.toFixed(2)}`; }; return `case ${R("#controls-drawer .drawer-case")} · tab ${R(".drawer-tab")} · card ${R(".controls-card")} · bar ${R(".action-bar")} · board ${R(".board-group")}`; });
    console.log(`${eng} ${w}x${h} ${arm.padEnd(7)} ${r}`);
    await ctx.close();
  }
  await b.close();
}
