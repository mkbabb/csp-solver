import { chromium, webkit } from "playwright";
const [engName, base, label] = process.argv.slice(2);
const eng = engName === "webkit" ? webkit : chromium;
const Q = "size=3&difficulty=MEDIUM&board=ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const b = await eng.launch();
const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, hasTouch: true, isMobile: false, reducedMotion: "reduce" });
const p = await ctx.newPage();
await p.goto(`${base}/?${Q}`); await p.waitForSelector("svg.handwritten-logo", { timeout: 60000 }); await p.waitForTimeout(1500);
const m = await p.evaluate(() => {
  const card = [...document.querySelectorAll(".controls-card")].find((c) => c.getClientRects().length);
  card.scrollTop = 0;
  const deal = card.querySelector(".deal-btn").getBoundingClientRect();
  const bar = card.querySelector(".action-bar").getBoundingClientRect();
  const fade = parseFloat(getComputedStyle(card.querySelector(".action-bar"), "::before").height);
  return { coarse: matchMedia("(pointer: coarse)").matches, dealBottom: +deal.bottom.toFixed(2), barTop: +bar.top.toFixed(2), fadeH: fade, fadeTop: +(bar.top - fade).toFixed(2), clear: +(bar.top - fade - deal.bottom).toFixed(2), scrollW: card.scrollWidth, clientW: card.clientWidth, padT: getComputedStyle(card).paddingTop };
});
console.log(JSON.stringify({ engine: engName, label, ...m }));
await b.close();
