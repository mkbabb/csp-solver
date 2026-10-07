// CTRL-FACE pass 8 · rows 10 + 11 — at the coarse rail: G2's line count per staged group (B20's
// cost, LAWS §G: printed for the control beside the tree), G3 Deal vs the fade (INTAKE row 11),
// and the card's sideways range (scrollWidth − clientWidth, the classic bar's height).
// Copied from pass7/prototype/CTRL-FACE/instruments/coarse-deal.mjs (OUT = stdout), homes by path.
import os from "node:os";
import { playwright, args } from "../e2e/lib/paint-lib.mjs";
const A = args();
const Q = "size=3&difficulty=MEDIUM&board=ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
for (const engine of (A.engines ?? "chromium,webkit").split(",")) {
  const b = await playwright()[engine].launch();
  for (const vp of (A.viewports ?? "1280x800,1440x900").split(",")) {
    const [w, h] = vp.split("x").map(Number);
    const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: A.touch !== "0", reducedMotion: "reduce" });
    const p = await ctx.newPage();
    await p.goto(`${A.url}/?${Q}`);
    await p.waitForSelector("svg.handwritten-logo", { timeout: 60000 });
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(1500);
    const m = await p.evaluate(() => {
      const card = [...document.querySelectorAll(".controls-card")].find((c) => c.getClientRects().length);
      card.scrollTop = 0;
      card.scrollLeft = 0;
      const deal = card.querySelector(".deal-btn").getBoundingClientRect();
      const inCard = card.querySelector(".action-bar");
      let fadeTop, how;
      if (inCard) {
        const bar = inCard.getBoundingClientRect();
        fadeTop = bar.top - parseFloat(getComputedStyle(inCard, "::before").height);
        how = "bar::before";
      } else {
        const clipBottom = card.getBoundingClientRect().top + card.clientTop + card.clientHeight;
        fadeTop = clipBottom - (parseFloat(getComputedStyle(card, "::after").height) || 0);
        how = "card::after";
      }
      const lines = [...card.querySelectorAll(".new-game-zone .staged-section .ctrl-options")].map(
        (o) => new Set([...o.querySelectorAll(":scope > .ctrl-btn")].map((b) => Math.round(b.getBoundingClientRect().top))).size,
      );
      const cs = getComputedStyle(card);
      return {
        coarse: matchMedia("(pointer: coarse)").matches,
        fadeFrom: how,
        dealBottom: +deal.bottom.toFixed(2),
        fadeTop: +fadeTop.toFixed(2),
        clear: +(fadeTop - deal.bottom).toFixed(2),
        sideways: card.scrollWidth - card.clientWidth,
        hBar: card.offsetHeight - card.clientHeight - parseFloat(cs.borderTopWidth) - parseFloat(cs.borderBottomWidth),
        ox: cs.overflowX,
        g2lines: lines,
        g2words: [...card.querySelectorAll(".new-game-zone .staged-section .ctrl-options")].map((o) => o.textContent.replace(/\s+/g, " ").trim().slice(0, 40)),
      };
    });
    console.log(JSON.stringify({ engine, url: A.url, vp, ...m, load: os.loadavg()[0].toFixed(1) }));
    await ctx.close();
  }
  await b.close();
}
