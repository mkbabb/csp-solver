/**
 * ACC-FIVE pass 7 · ROW B (print), PAINTED, three arms on one payload (pass-6 critique §3.3; chair A.6; B-PRINT).
 *   none     the tree's default: `.progress-trace { display: none !important }` in print — "no gauge in print"
 *   goldink  the built alternative (`arms/rowB-goldink-print.arm.diff`): the trace prints `--color-gold-ink`
 *   control  74a2b5d9: no print arm, the violet prints as it resolves
 * Under `emulateMedia({ media: 'print' })`, ten hints, DPR 1, both engines, both schemes. The statistic is
 * pass 6's footprint (p6-rows-bc, copied): S as painted, H with the trace hidden, M re-stroked magenta in its
 * own layer; coverage = |M − H| / |magenta − H|, core ≥ 0.5, split LINE / BORDER / PAPER by ground; each core
 * pixel's ratio S against H. A trace whose display is none has NO footprint (the magenta cannot paint either):
 * that arm prints "no gauge" as 0 px, which is its claim, and is never scored as a ratio.
 *
 *   node p7-rowb-print.mjs <none> <goldink> <control>
 */
import { chromium, webkit, mintFromControl, assertSameBoard, fillTo, ratio, rawOf, stat } from "./p7-lib.mjs";
const [NONE, GOLD, CTRL] = process.argv.slice(2);
const board = await mintFromControl(CTRL);
console.log(`payload ${board.payload.slice(0, 18)}… (${board.givens} givens)`);
const style = (page, id, css) => page.evaluate(([i, c]) => { const s = document.createElement("style"); s.id = i; s.textContent = c; document.head.appendChild(s); }, [id, css]);
const unstyle = (page, id) => page.evaluate((i) => document.getElementById(i)?.remove(), id);
async function footprint(page) {
  const box = await page.locator("svg.hand-drawn-grid").first().boundingBox();
  const clip = { x: Math.max(0, box.x - 8), y: Math.max(0, box.y - 8), width: box.width + 16, height: box.height + 16 };
  const S = await rawOf(await page.screenshot({ clip }));
  await style(page, "p-hide", "html body .progress-trace { visibility: hidden !important }");
  await page.waitForTimeout(250);
  const H = await rawOf(await page.screenshot({ clip }));
  await unstyle(page, "p-hide");
  await style(page, "p-mag", "@layer base { html body svg .progress-trace { stroke: #ff00ff !important; transition: none !important } } html body svg .progress-trace { stroke: #ff00ff !important; transition: none !important }");
  await page.waitForTimeout(250);
  const M = await rawOf(await page.screenshot({ clip }));
  await unstyle(page, "p-mag");
  const freq = new Map();
  for (let i = 0; i < H.data.length; i += 4) { const k = (H.data[i] << 16) | (H.data[i + 1] << 8) | H.data[i + 2]; freq.set(k, (freq.get(k) ?? 0) + 1); }
  const pk = [...freq.entries()].sort((a, b) => b[1] - a[1])[0][0];
  const paper = [pk >> 16, (pk >> 8) & 255, pk & 255];
  const pop = { line: [], border: [], paper: [] };
  let changed = 0;
  for (let i = 0; i < H.data.length; i += 4) {
    if (Math.abs(S.data[i] - H.data[i]) + Math.abs(S.data[i + 1] - H.data[i + 1]) + Math.abs(S.data[i + 2] - H.data[i + 2]) > 6) changed++;
    const g = [H.data[i], H.data[i + 1], H.data[i + 2]];
    const full = Math.abs(255 - g[0]) + Math.abs(0 - g[1]) + Math.abs(255 - g[2]);
    const d = Math.abs(M.data[i] - g[0]) + Math.abs(M.data[i + 1] - g[1]) + Math.abs(M.data[i + 2] - g[2]);
    if (full < 60 || d / full < 0.5) continue;
    const gp = ratio(g, paper);
    pop[gp >= 1.5 ? "line" : gp >= 1.1 ? "border" : "paper"].push(ratio([S.data[i], S.data[i + 1], S.data[i + 2]], g));
  }
  return { paper, tracePx: changed, footprintPx: pop.line.length + pop.border.length + pop.paper.length, line: stat(pop.line, 3), border: stat(pop.border, 3), paperG: stat(pop.paper, 3) };
}
for (const [name, type] of [["chromium", chromium], ["webkit", webkit]]) {
  const browser = await type.launch();
  for (const scheme of ["light", "dark"]) for (const [arm, base] of [["none", NONE], ["goldink", GOLD], ["control", CTRL]]) {
    const ctx = await browser.newContext({ colorScheme: scheme, reducedMotion: "reduce", viewport: { width: 1280, height: 800 } });
    const page = await ctx.newPage();
    await page.goto(base + board.query); await page.waitForSelector(".sudoku-cell", { timeout: 60000 }); await page.waitForTimeout(1500);
    await assertSameBoard(page, board.cells);
    const v = await fillTo(page, 25); if (v < 25) throw new Error(`gauge reached only ${v} %`);
    await page.evaluate(() => document.activeElement?.blur?.()); await page.waitForTimeout(1500);
    await page.emulateMedia({ media: "print" }); await page.waitForTimeout(600);
    const cs = await page.evaluate(() => { const t = document.querySelector(".progress-trace"); const f = document.querySelector(".frame-line"); return { display: t && getComputedStyle(t).display, stroke: t && getComputedStyle(t).stroke, frame: f && getComputedStyle(f).stroke, valuenow: document.querySelector('[role="progressbar"]')?.getAttribute("aria-valuenow") }; });
    const fp = await footprint(page);
    const g = (s) => `${s.median}/${s.p10}/${s.under}/${s.n}`;
    console.log(`${name} ${scheme} ${arm} PRINT v${cs.valuenow} trace display ${cs.display} stroke ${cs.stroke} frame ${cs.frame} · trace px changed ${fp.tracePx} footprint ${fp.footprintPx} · LINE med/p10/<3/n ${g(fp.line)} · BORDER ${g(fp.border)} · PAPER ${g(fp.paperG)} · paper ${fp.paper}`);
    await ctx.close();
  }
  await browser.close();
}
console.log("ALLDONE");
