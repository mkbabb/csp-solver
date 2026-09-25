import { createRequire } from "node:module";
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const pw = require("playwright");
const Q = "size=3&difficulty=MEDIUM&board=ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const b = await pw.chromium.launch();
for (const [label, base] of [["tree", "http://127.0.0.1:4241"], ["control", "http://127.0.0.1:4242"]]) {
  const p = await (await b.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, reducedMotion: "reduce" })).newPage();
  await p.goto(base + "/?" + Q); await p.locator(".board-cells").first().waitFor({ timeout: 60000 }); await p.waitForTimeout(1500);
  console.log(label, JSON.stringify(await p.evaluate(() => {
    const card = [...document.querySelectorAll(".controls-card")].find((c) => c.getClientRects().length);
    return [...card.querySelectorAll(".icon-sublabel")].filter((e) => e.getClientRects().length).map((e) => { e.scrollIntoView({ block: "center" }); const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return `${e.textContent.trim()} x${r.left.toFixed(3)} y${r.top.toFixed(3)} w${r.width.toFixed(2)} ls${cs.letterSpacing} tf${getComputedStyle(e.closest("button")).transform}`; });
  })));
}
await b.close();
