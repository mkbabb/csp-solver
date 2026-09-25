import { createRequire } from "node:module";
import os from "node:os";
import { glyphPopulation } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass7/instruments/glyph-pop.mjs";
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const pw = require("playwright");
const [eng, base, label, scheme] = process.argv.slice(2);
const Q = "size=3&difficulty=MEDIUM&board=ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const b = await pw[eng].launch();
const p = await (await b.newContext({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 2, colorScheme: scheme, reducedMotion: "reduce" })).newPage();
await p.goto(base + "/?" + Q); await p.locator(".board-cells").first().waitFor({ timeout: 60000 }); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(1500);
const names = await p.evaluate(() => {
  const card = [...document.querySelectorAll(".controls-card")].find((c) => c.getClientRects().length);
  return [...card.querySelectorAll(".icon-sublabel")].filter((e) => e.getClientRects().length).map((e, i) => { e.setAttribute("data-sl", String(i)); const cs = getComputedStyle(e); return [i, e.textContent.trim(), cs.fontFamily.split(",")[0], cs.fontSize, cs.fontWeight, cs.color]; });
});
for (const [i, t, ff, fs, fw, c] of names) {
  await p.evaluate((i) => document.querySelector('[data-sl="' + i + '"]').scrollIntoView({ block: "center" }), i); await p.waitForTimeout(400);
  let r; try { r = await glyphPopulation(p, { subject: '[data-sl="' + i + '"]', fracBound: null }); } catch (e) { console.log(label, eng, scheme, JSON.stringify(t), "UNREADABLE", String(e).slice(0, 80)); continue; }
  console.log(label, eng, scheme, JSON.stringify(t), ff, fs, fw, c, "pop", r.population, "median", r.coreMedian, "<4.5", r.fracUnder, r.red ? "RED " + r.why.join("; ") : "GREEN");
}
console.log("LOAD", os.loadavg()[0].toFixed(1));
await b.close();
