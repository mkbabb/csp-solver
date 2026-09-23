// whole-subtree paint census of the UNCLAIMED surfaces (masthead, board, drawer tab, page body minus the card)
import { chromium, webkit, devices } from "playwright";
const [engName, base, label] = process.argv.slice(2);
const eng = engName === "webkit" ? webkit : chromium;
const Q = "size=3&difficulty=MEDIUM&board=ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const phone = devices["iPhone 13"];
const cells = [["1280x800-fine", { viewport: { width: 1280, height: 800 } }], ["390x844-coarse", { viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, isMobile: phone.isMobile, hasTouch: true }]];
const b = await eng.launch();
for (const theme of ["light", "dark"]) for (const [cell, o] of cells) {
  const ctx = await b.newContext({ ...o, colorScheme: theme, reducedMotion: "reduce" });
  const p = await ctx.newPage();
  await p.goto(`${base}/?${Q}`); await p.waitForSelector("svg.handwritten-logo", { timeout: 60000 }); await p.waitForTimeout(1800);
  if (process.env.PLANT) { await p.addStyleTag({ content: process.env.PLANT }); await p.waitForTimeout(200); }
  const rows = await p.evaluate(() => {
    const PROPS = ["color", "background-color", "font-family", "font-size", "font-weight", "filter", "opacity", "transform", "border-top-width", "border-top-color", "fill", "stroke", "stroke-width", "visibility", "display"];
    const out = [];
    const skip = (e) => e.closest(".controls-card, #controls-drawer .drawer-case, .tuner-toggle");
    const key = (e) => { const path = []; for (let n = e; n && n !== document.body; n = n.parentElement) { const i = n.parentElement ? [...n.parentElement.children].indexOf(n) : 0; path.push(n.tagName.toLowerCase() + ":" + i); } return path.reverse().join("/"); };
    for (const e of document.body.querySelectorAll("*")) {
      if (skip(e)) continue;
      const cs = getComputedStyle(e);
      const r = e.getBoundingClientRect();
      out.push([key(e), e.tagName.toLowerCase(), PROPS.map((k) => cs.getPropertyValue(k)).join("|"), [r.x, r.y, r.width, r.height].map((n) => Math.round(n * 10) / 10).join(",")]);
    }
    return out;
  });
  console.log(JSON.stringify({ engine: engName, label, theme, cell, rows }));
  await ctx.close();
}
await b.close();
