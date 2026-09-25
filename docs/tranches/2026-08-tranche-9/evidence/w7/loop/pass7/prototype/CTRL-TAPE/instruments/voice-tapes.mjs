// the voice the fold does not carry: the names the card draws as tapes, p7 vs s10p (rail 1440 fine, dock 390 open)
import { chromium } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.mjs";
const PAYLOAD = "ATMuNTA4MDAwMDAwMDAzMDAwMDAwNjA5MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAw";
for (const [arm, base] of [["p7", "http://127.0.0.1:4233"], ["s10p", "http://127.0.0.1:4237"], ["control", "http://127.0.0.1:4231"]])
  for (const [cell, w, h, touch] of [["rail1440", 1440, 900, false], ["dock390", 390, 844, true]]) {
    const b = await chromium.launch(); const p = await (await b.newContext({ baseURL: base, viewport: { width: w, height: h }, hasTouch: touch })).newPage();
    await p.goto("/?board=" + PAYLOAD); await p.waitForSelector(".controls-card", { state: "attached" }); await p.waitForTimeout(700);
    if (touch) { await p.locator(".drawer-tab").first().click(); await p.waitForTimeout(1300); }
    const r = await p.evaluate(() => { const card = document.querySelector(".drawer-case"); const vis = (e) => e.getClientRects().length && getComputedStyle(e).visibility !== "hidden" && +getComputedStyle(e).opacity > 0.5;
      const tapes = [...card.querySelectorAll(".washi-tag, .washi-label")].filter(vis).map((e) => e.textContent.trim()).filter(Boolean);
      const heads = [...card.querySelectorAll("h2, h3, .section-heading, [role=heading]")].filter(vis).map((e) => e.textContent.trim());
      return { tapes, heads: heads.slice(0, 12) }; });
    console.log(JSON.stringify({ arm, cell, nTapes: r.tapes.length, tapes: r.tapes.slice(0, 14), heads: r.heads }));
    await b.close();
  }
