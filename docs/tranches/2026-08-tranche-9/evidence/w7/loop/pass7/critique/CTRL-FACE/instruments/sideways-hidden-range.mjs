// facecrit7 — the hidden sideways range: can a user action scroll the rail card sideways once overflow-x is hidden?
// and does the cure move the fine rail too (WebKit's classic bar)?
import { createRequire } from "node:module";
import os from "node:os";
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const pw = require("playwright");
const [eng, base, label, vp, touch] = process.argv.slice(2);
const [w, h] = vp.split("x").map(Number);
const Q = "size=3&difficulty=MEDIUM&board=ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const b = await pw[eng].launch();
const ctx = await b.newContext({ viewport: { width: w, height: h }, hasTouch: touch === "coarse", reducedMotion: "reduce" });
const p = await ctx.newPage();
await p.goto(`${base}/?${Q}`); await p.locator(".board-cells").first().waitFor({ timeout: 60000 }); await p.waitForTimeout(1500);
const givens = await p.evaluate(() => [...document.querySelectorAll("[aria-label]")].filter((e) => /given/i.test(e.getAttribute("aria-label"))).length);
const geo = await p.evaluate(() => {
  const card = [...document.querySelectorAll(".controls-card")].find((c) => c.getClientRects().length);
  const bar = card.querySelector(".action-bar");
  const cs = getComputedStyle(card);
  return { ox: cs.overflowX, oy: cs.overflowY, clientH: card.clientHeight, offsetH: card.offsetHeight, scrollW: card.scrollWidth, clientW: card.clientWidth, hBar: card.offsetHeight - card.clientHeight - parseFloat(cs.borderTopWidth) - parseFloat(cs.borderBottomWidth), barTop: bar ? +bar.getBoundingClientRect().top.toFixed(2) : null };
});
// focus walk: every focusable in the card, focus() + read scrollLeft
const focusWalk = await p.evaluate(async () => {
  const card = [...document.querySelectorAll(".controls-card")].find((c) => c.getClientRects().length);
  const els = [...card.querySelectorAll("button, [tabindex], a, input, select, textarea")].filter((e) => e.getClientRects().length);
  let max = 0, who = null;
  for (const e of els) { card.scrollLeft = 0; e.focus(); await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))); if (card.scrollLeft > max) { max = card.scrollLeft; who = (e.className || e.tagName).toString().slice(0, 40); } }
  return { n: els.length, maxScrollLeft: max, who };
});
// hover each verb that owns a wide note, then scrollIntoView the note (what a hover-note focus/reveal might do)
const hoverWalk = [];
const verbs = await p.locator(".controls-card .washi-wide").count();
for (let i = 0; i < Math.min(verbs, 8); i++) {
  const r = await p.evaluate((i) => {
    const card = [...document.querySelectorAll(".controls-card")].find((c) => c.getClientRects().length);
    const n = card.querySelectorAll(".washi-wide")[i];
    if (!n) return null;
    card.scrollLeft = 0; n.scrollIntoView({ block: "nearest", inline: "nearest" });
    const r = n.getBoundingClientRect(), c = card.getBoundingClientRect();
    return { i, scrollLeft: card.scrollLeft, noteL: +r.left.toFixed(1), noteR: +r.right.toFixed(1), cardL: +c.left.toFixed(1), cardR: +c.right.toFixed(1) };
  }, i);
  hoverWalk.push(r);
}
// wheel sideways over the card (a trackpad's shift-wheel)
const box = await p.locator(".controls-card").first().boundingBox();
await p.mouse.move(box.x + box.width / 2, box.y + 100);
await p.evaluate(() => { const card = [...document.querySelectorAll(".controls-card")].find((c) => c.getClientRects().length); card.scrollLeft = 0; });
await p.mouse.wheel(200, 0); await p.waitForTimeout(400);
const wheel = await p.evaluate(() => [...document.querySelectorAll(".controls-card")].find((c) => c.getClientRects().length).scrollLeft);
console.log(JSON.stringify({ eng, label, vp, touch, givens, ...geo, focusWalk, wheelScrollLeft: wheel, notes: verbs, hoverWalk: hoverWalk.filter(Boolean).map((x) => `${x.i}:sl${x.scrollLeft} note ${x.noteL}-${x.noteR} card ${x.cardL}-${x.cardR}`), load: os.loadavg()[0].toFixed(1) }));
await b.close();
