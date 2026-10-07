// voice8.mjs — CTRL-TAPE pass 8 charter row 8 (the ballots' third arm, NUMBERS ONLY): the ARIA headings inside
// `.drawer-case` and the painted tapes, rail 1440x900 fine and dock 390x844 coarse, per served arm.
//   node voice8.mjs <label>=<baseURL> ...
import { chromium } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
for (const a of process.argv.slice(2)) {
  const [arm, base] = a.split("=");
  for (const [cell, vw, vh, touch] of [["rail1440", 1440, 900, false], ["dock390", 390, 844, true]]) {
    const b = await chromium.launch();
    const p = await (await b.newContext({ baseURL: base, viewport: { width: vw, height: vh }, hasTouch: touch })).newPage();
    await p.goto("/"); await p.waitForSelector(".controls-card", { state: "attached" }); await p.waitForTimeout(700);
    if (touch) { await p.locator(".drawer-tab").first().click(); await p.waitForTimeout(1200); }
    const tree = await p.locator(".drawer-case").ariaSnapshot().catch((e) => String(e));
    const heads = (tree.match(/heading "[^"]*"/g) || []).map((h) => h.slice(9, -1));
    const tapes = await p.evaluate(() => [...document.querySelectorAll(".drawer-case .washi-tag, .drawer-case .washi-label")].filter((e) => e.getClientRects().length && getComputedStyle(e).visibility !== "hidden").map((e) => e.textContent.trim().slice(0, 16)));
    console.log(`${arm} ${cell} heads ${heads.length} [${heads.join(", ")}] tapes ${tapes.length} [${tapes.join(", ")}]`);
    await b.close();
  }
}
