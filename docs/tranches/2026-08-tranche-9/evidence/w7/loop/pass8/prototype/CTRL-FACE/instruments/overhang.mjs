// CTRL-FACE pass 8 · row 11 — what overhangs the rail card sideways, and does anything scroll it.
import os from "node:os";
import { playwright, args } from "../e2e/lib/paint-lib.mjs";
const A = args();
const [w, h] = (A.viewport ?? "1280x800").split("x").map(Number);
const Q = "size=3&difficulty=MEDIUM&board=ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const b = await playwright()[A.engine ?? "chromium"].launch();
const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: A.touch === "1", reducedMotion: "reduce" });
const p = await ctx.newPage();
await p.goto(`${A.url}/?${Q}`);
await p.locator(".board-cells").first().waitFor({ timeout: 60000 });
await p.waitForTimeout(1500);
const r = await p.evaluate(() => {
  const card = [...document.querySelectorAll(".controls-card")].find((c) => c.getClientRects().length);
  const cr = card.getBoundingClientRect();
  const cs = getComputedStyle(card);
  const inL = cr.left + parseFloat(cs.borderLeftWidth), inR = inL + card.clientWidth;
  const over = [];
  for (const e of card.querySelectorAll("*")) {
    const r = e.getBoundingClientRect();
    if (!r.width || !r.height) continue;
    const L = inL - r.left, R = r.right - inR;
    if (L > 0.5 || R > 0.5) {
      let top = e; while (top.parentElement && top.parentElement !== card) top = top.parentElement;
      over.push(`${e.tagName.toLowerCase()}.${String(e.className?.baseVal ?? e.className).trim().split(/\s+/).slice(0, 2).join(".")} L${L.toFixed(1)} R${R.toFixed(1)} under ${top.tagName.toLowerCase()}.${String(top.className).trim().split(/\s+/)[0]}`);
    }
  }
  return { scrollW: card.scrollWidth, clientW: card.clientWidth, ox: cs.overflowX, oy: cs.overflowY, over };
});
// the reveals that moved the card in pass 7: scrollIntoView on each wide note, and a shift-wheel
const moves = await p.evaluate(() => {
  const card = [...document.querySelectorAll(".controls-card")].find((c) => c.getClientRects().length);
  return [...card.querySelectorAll(".washi-wide")].map((n) => { card.scrollLeft = 0; n.scrollIntoView({ block: "nearest", inline: "nearest" }); const s = card.scrollLeft; card.scrollLeft = 0; return s; });
});
const box = await p.locator(".controls-card:visible").first().boundingBox();
await p.mouse.move(box.x + box.width / 2, box.y + 100);
await p.mouse.wheel(200, 0);
await p.waitForTimeout(400);
const wheel = await p.evaluate(() => [...document.querySelectorAll(".controls-card")].find((c) => c.getClientRects().length).scrollLeft);
console.log(JSON.stringify({ engine: A.engine ?? "chromium", url: A.url, vp: A.viewport ?? "1280x800", touch: A.touch === "1", scrollW: r.scrollW, clientW: r.clientW, ox: r.ox, oy: r.oy, noteScrollLeft: moves, wheel, overhang: r.over, load: os.loadavg()[0].toFixed(1) }));
await b.close();
