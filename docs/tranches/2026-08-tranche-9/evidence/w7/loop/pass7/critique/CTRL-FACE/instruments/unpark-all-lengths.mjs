// facecrit7 — un-park, every published length: (a) no press + root font 18px, (b) double press in one task + font,
// (c) TRIPLE press in one task (net OPEN: a rung DOES start) + font, (d) press, then a second press 60 ms later mid-rung + font.
// Truth for (a),(b) = (a)'s values (same closed state); every length must agree. For (c),(d) compare to a single press + font.
import { createRequire } from "node:module";
import os from "node:os";
const require = createRequire("/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/package.json");
const pw = require("playwright");
const [eng, base] = process.argv.slice(2);
const Q = "size=3&difficulty=MEDIUM&board=ATMuNTMwMDcwMDAwNjAwMTk1MDAwMDk4MDAwMDYwODAwMDYwMDAzNDAwODAzMDAxNzAwMDIwMDA2MDYwMDAwMjgwMDAwNDE5MDA1MDAwMDgwMDc5";
const b = await pw[eng].launch();
const NAMES = ["--action-bar-h", "--card-pad-t", "--pin-tape-h", "--pin-band", "--card-foot-h"];
async function run(mode) {
  const ctx = await b.newContext({ viewport: { width: 1280, height: 800 } });
  const p = await ctx.newPage();
  await p.goto(`${base}/?${Q}`); await p.locator(".board-cells").first().waitFor({ timeout: 60000 }); await p.waitForTimeout(1500);
  const ok = await p.evaluate(() => {
    const card = [...document.querySelectorAll(".controls-card")].find((c) => c.getClientRects().length);
    const b = [...card.querySelectorAll("button")].find((x) => /keys/i.test((x.getAttribute("aria-label") || "") + x.textContent));
    if (!b) return false; b.setAttribute("data-crit-keys", "1"); return true;
  });
  if (!ok) return { mode, error: "no keys" };
  const k = () => p.evaluate(() => document.querySelector("[data-crit-keys]").click());
  if (mode === "double") await p.evaluate(() => { const x = document.querySelector("[data-crit-keys]"); x.click(); x.click(); });
  if (mode === "triple") await p.evaluate(() => { const x = document.querySelector("[data-crit-keys]"); x.click(); x.click(); x.click(); });
  if (mode === "single") await k();
  if (mode === "midrung") { await k(); await p.waitForTimeout(60); await k(); }
  await p.waitForTimeout(1000);
  await p.evaluate(() => { document.documentElement.style.fontSize = "18px"; });
  await p.waitForTimeout(1200);
  const r = await p.evaluate((NAMES) => {
    const card = [...document.querySelectorAll(".controls-card")].find((c) => c.getClientRects().length);
    const o = {}; for (const n of NAMES) o[n] = card.style.getPropertyValue(n) || getComputedStyle(card).getPropertyValue(n).trim() || "-";
    o.open = !!card.querySelector(".legend-fold.is-open"); o.padT = getComputedStyle(card).paddingTop;
    const bar = card.querySelector(".action-bar"); o.barH = bar ? +bar.getBoundingClientRect().height.toFixed(2) : null;
    o.anims = document.getAnimations().filter((a) => a.playState === "running").length;
    return o;
  }, NAMES);
  await ctx.close();
  return { mode, ...r };
}
const out = {};
for (const m of ["none", "double", "single", "triple", "midrung"]) out[m] = await run(m);
for (const m of Object.keys(out)) console.log(eng, JSON.stringify(out[m]));
const cmp = (a, c) => NAMES.filter((n) => out[a][n] !== out[c][n]).map((n) => `${n} ${out[a][n]} vs ${out[c][n]}`);
console.log(eng, "double vs none:", JSON.stringify(cmp("double", "none")) , "| triple vs single:", JSON.stringify(cmp("triple", "single")), "| midrung vs none:", JSON.stringify(cmp("midrung", "none")), "load", os.loadavg()[0].toFixed(1));
await b.close();
