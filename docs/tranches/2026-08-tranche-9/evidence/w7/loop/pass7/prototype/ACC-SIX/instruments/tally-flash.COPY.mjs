/**
 * ACC-FIVE pass-7 CRITIC · THE TALLY'S FIRST PAINTED FRAMES AT AN INK (the prototype's gap 3: "the tally's
 * forced start write is gone ... not photographed"). v2: v1 keyed on `.is-ungraded`, which a re-deal never
 * shows (the descriptor stays graded), and read 0 of 0 — vacuous, discarded.
 * Post-paint read (a MessageChannel task queued from each rAF, the chair's postpaint.mjs rule) of the tally's
 * INKED strokes: count n and summed VISIBLE length (geometric length less the dash offset). An ink is the first
 * painted frame L whose visible fraction (of the settled total) is <= 0.3 (the draw-in running from empty).
 * A FLASH is a painted frame before L showing the NEW inked count (n = settled n, n != the count before the
 * act) at >= 0.9 of its settled length: the new strokes painted whole before they draw in.
 * Acts: a fresh load (?size=3&difficulty=HARD|EASY alternating; n goes 0 -> k) and an in-app re-deal.
 *   node tally-flash2.mjs <engine> <base> <iters> [out.json]
 */
import pw from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/playwright/index.js";
import { writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
const [ENG, BASE, ITERS = "4", OUT] = process.argv.slice(2);
const load = () => execSync("uptime").toString().replace(/.*averages: /, "").split(" ")[0];
const b = await pw[ENG].launch();
const ctx = await b.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: "no-preference" });
await ctx.addInitScript(() => {
  const w = window; w.__tf = []; w.__tfOn = true;
  const ch = new MessageChannel();
  ch.port1.onmessage = () => {
    const t = document.querySelector(".difficulty-tally");
    let vis = 0, n = 0;
    t?.querySelectorAll(".dt-stroke.inked").forEach((p) => {
      n++; let L = 0; try { L = p.getTotalLength(); } catch { L = 0; }
      const cs = getComputedStyle(p); const off = parseFloat(cs.strokeDashoffset) || 0;
      const dashed = cs.strokeDasharray && cs.strokeDasharray !== "none";
      vis += dashed ? Math.max(0, Math.min(L, L - off)) : L;
    });
    w.__tf.push({ t: performance.now(), graded: !!t && !t.classList.contains("is-ungraded"), n, vis });
  };
  const loop = () => { if (w.__tfOn) ch.port2.postMessage(0); requestAnimationFrame(loop); };
  requestAnimationFrame(loop);
});
const judge = (s, n0) => {
  const settled = s.at(-1); const full = settled?.vis ?? 0; const nF = settled?.n ?? 0;
  const frac = s.map((x) => (full > 0 ? x.vis / full : NaN));
  const L = frac.findIndex((f, k) => s[k].n === nF && nF > 0 && f <= 0.3);
  let flash = 0; if (L > 0 && nF !== n0) for (let k = 0; k < L; k++) if (s[k].n === nF && frac[k] >= 0.9) flash++;
  return { n0, nF, inked: L >= 0, flash, flashMs: flash ? +(s[L].t - s[s.findIndex((x, k) => k < L && x.n === nF && frac[k] >= 0.9)].t).toFixed(1) : 0, first: frac.slice(Math.max(0, L - 2), L + 2).map((f) => +f.toFixed(2)) };
};
const rows = [];
const p = await ctx.newPage();
for (let i = 0; i < Number(ITERS); i++) {
  const diff = i % 2 ? "EASY" : "HARD";
  await p.goto(BASE + `/?size=3&difficulty=${diff}`);
  await p.waitForSelector(".sudoku-cell", { timeout: 60000 });
  await p.waitForFunction(() => { const t = document.querySelector(".difficulty-tally"); return t && !t.classList.contains("is-ungraded"); }, null, { timeout: 60000 }).catch(() => {});
  await p.waitForTimeout(2500);
  let s = await p.evaluate(() => { const r = window.__tf; window.__tf = []; return r; });
  rows.push({ act: `load ${diff}`, ...judge(s, 0), load: load() }); console.log(ENG, BASE, JSON.stringify(rows.at(-1)));
  for (let d = 0; d < 2; d++) {
    const n0 = await p.evaluate(() => document.querySelectorAll(".difficulty-tally .dt-stroke.inked").length);
    await p.evaluate(() => (window.__tf = []));
    await p.locator('button[aria-label="Deal a new board"]').first().click();
    await p.waitForTimeout(4000);
    s = await p.evaluate(() => { const r = window.__tf; window.__tf = []; return r; });
    rows.push({ act: `re-deal ${diff}`, ...judge(s, n0), load: load() }); console.log(ENG, BASE, JSON.stringify(rows.at(-1)));
  }
}
const inks = rows.filter((r) => r.inked && r.nF !== r.n0);
console.log(`SUMMARY ${ENG} ${BASE}: ${inks.filter((r) => r.flash > 0).length} of ${inks.length} tier-changing inks FLASH (new strokes painted whole before drawing in); ${rows.filter((r) => r.inked).length} inks of ${rows.length} acts`);
if (OUT) writeFileSync(OUT, JSON.stringify(rows, null, 1));
await b.close();
