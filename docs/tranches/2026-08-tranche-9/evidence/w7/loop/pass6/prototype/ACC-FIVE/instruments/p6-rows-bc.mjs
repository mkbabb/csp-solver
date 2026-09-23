/**
 * ACC-FIVE pass 6 · ROW B (print) and ROW C (forced colours), PAINTED on the trace's own footprint.
 *
 * Three BUILT arms, one encoded `?board=` payload each run (minted off the control, read back on
 * every arm), TWO payloads: `canvas` (the tree with `.progress-trace { stroke: CanvasText }` under
 * forced colours, as pass 5 landed it), `crayon` (the same tree with that one rule deleted: the
 * trace keeps its gold) and `control` (74a2b5d9, violet, no forced rule). Ten hints (the ring
 * stands at 25 %, the board is not won).
 *
 * THE STATISTIC (LAWS P5 rings and strokes; pass-5 critique §3.2): three photographs of the board
 * box, DPR 1 — S as painted, H with the trace `visibility: hidden`, M with the trace re-stroked
 * #ff00ff in its own layer (same width, same pose). A pixel's COVERAGE is |M − H| / |magenta − H|
 * (the trace's own footprint, independent of its ink, so a trace pixel that paints and cannot be
 * seen COUNTS instead of dropping out); the core is coverage ≥ 0.5; each core pixel's ratio is
 * S against H (the ground it covers). The core is split by ground: LINE (H differs from the paper
 * by ≥ 1.5:1), BORDER (1.1–1.5:1: the board wrapper's 2 px edge the stroke overhangs) and PAPER
 * (the paper inside and the page outside, both within 1.1:1 of it). Reported: median, p10, fraction under 3, n; plus the settled computed
 * strokes and the trace's opacity chain (a computed stroke is not paint).
 *
 *   node p6-rows-bc.mjs <canvas> <crayon> <control> <out.json> [payloads=2]
 */
import { writeFileSync } from "node:fs";
import { chromium, webkit, mintMany, assertSameBoard, settled, ratio, rgbOf, rawOf, Y, stat } from "./p6-lib.mjs";

const [CANVAS, CRAYON, CTRL, OUT, NP = "2"] = process.argv.slice(2);
if (!OUT) throw new Error("usage: node p6-rows-bc.mjs <canvas> <crayon> <control> <out.json> [payloads]");
const boards = await mintMany(CTRL, Number(NP));
for (const b of boards) console.log(`payload ${b.payload.slice(0, 18)}… (${b.givens} givens)`);

const READ = () => {
  const t = document.querySelector(".progress-trace");
  const f = document.querySelector(".frame-line");
  const cs = (el) => (el ? getComputedStyle(el) : null);
  let op = 1;
  for (let n = t; n; n = n.parentElement) op *= Number(getComputedStyle(n).opacity);
  return {
    trace: t ? { stroke: cs(t).stroke, cw: cs(t).strokeWidth, opacityChain: +op.toFixed(3), visibility: cs(t).visibility } : null,
    frame: f ? { stroke: cs(f).stroke, cw: cs(f).strokeWidth } : null,
    paper: getComputedStyle(document.querySelector(".board-wrapper") ?? document.body).backgroundColor,
  };
};

async function style(page, id, css) {
  await page.evaluate(([i, c]) => {
    const s = document.createElement("style");
    s.id = i;
    s.textContent = c;
    document.head.appendChild(s);
  }, [id, css]);
}
const unstyle = (page, id) => page.evaluate((i) => document.getElementById(i)?.remove(), id);

async function footprint(page) {
  const box = await page.locator("svg.hand-drawn-grid").first().boundingBox();
  const clip = { x: Math.max(0, box.x - 8), y: Math.max(0, box.y - 8), width: box.width + 16, height: box.height + 16 };
  const S = await rawOf(await page.screenshot({ clip }));
  const S2 = await rawOf(await page.screenshot({ clip }));
  await style(page, "acc5-hide", "html body .progress-trace { visibility: hidden !important }");
  await page.waitForTimeout(250);
  const H = await rawOf(await page.screenshot({ clip }));
  await unstyle(page, "acc5-hide");
  // magenta in the trace rule's OWN layer at higher specificity: beats `@layer base` !important
  await style(page, "acc5-mag", "@layer base { html body svg .progress-trace { stroke: #ff00ff !important; transition: none !important } } html body svg .progress-trace { stroke: #ff00ff !important; transition: none !important }");
  await page.waitForTimeout(250);
  const M = await rawOf(await page.screenshot({ clip }));
  const magOk = await page.evaluate(() => getComputedStyle(document.querySelector(".progress-trace")).stroke);
  await unstyle(page, "acc5-mag");
  await page.waitForTimeout(250);
  // the paper = the modal colour of H
  const freq = new Map();
  for (let i = 0; i < H.data.length; i += 4) {
    const k = (H.data[i] << 16) | (H.data[i + 1] << 8) | H.data[i + 2];
    freq.set(k, (freq.get(k) ?? 0) + 1);
  }
  const pk = [...freq.entries()].sort((a, b) => b[1] - a[1])[0][0];
  const paper = [pk >> 16, (pk >> 8) & 255, pk & 255];
  const line = [], onPaper = [], onBorder = [];
  let noise = 0;
  for (let i = 0; i < H.data.length; i += 4) {
    const n = Math.abs(S.data[i] - S2.data[i]) + Math.abs(S.data[i + 1] - S2.data[i + 1]) + Math.abs(S.data[i + 2] - S2.data[i + 2]);
    if (n > 8) { noise++; continue; }
    const g = [H.data[i], H.data[i + 1], H.data[i + 2]];
    const full = Math.abs(255 - g[0]) + Math.abs(0 - g[1]) + Math.abs(255 - g[2]);
    const d = Math.abs(M.data[i] - g[0]) + Math.abs(M.data[i + 1] - g[1]) + Math.abs(M.data[i + 2] - g[2]);
    if (full < 60 || d / full < 0.5) continue;
    const s = [S.data[i], S.data[i + 1], S.data[i + 2]];
    const r = ratio(s, g);
    const gp = ratio(g, paper);
    (gp >= 1.5 ? line : gp >= 1.1 ? onBorder : onPaper).push({ r, cov: Math.min(1, d / full) });
  }
  // the sensitivity row: coverage ≥ 0.5 (the gate's core), 0.7, 0.9, 1.0 (fully covered pixels)
  const sens = (pop) => Object.fromEntries([0.5, 0.7, 0.9, 1.0].map((k) => [k, stat(pop.filter((p) => p.cov >= k - 1e-9).map((p) => p.r), 3)]));
  return { paper, magenta: magOk, noise, line: stat(line.map((p) => p.r), 3), paperGround: stat(onPaper.map((p) => p.r), 3), lineSens: sens(line), paperSens: sens(onPaper), borderSens: sens(onBorder), offFrameShare: +(onPaper.length / Math.max(1, onPaper.length + line.length + onBorder.length)).toFixed(3), borderShare: +(onBorder.length / Math.max(1, onPaper.length + line.length + onBorder.length)).toFixed(3) };
}

const rows = [];
for (const [bi, board] of boards.entries()) {
  for (const [name, type] of [["chromium", chromium], ["webkit", webkit]]) {
    const browser = await type.launch();
    for (const scheme of ["light", "dark"]) {
      for (const [arm, base] of [["canvas", CANVAS], ["crayon", CRAYON], ["control", CTRL]]) {
        const ctx = await browser.newContext({ colorScheme: scheme, reducedMotion: "reduce", viewport: { width: 1280, height: 800 } });
        const page = await ctx.newPage();
        await page.goto(base + board.query);
        await page.waitForSelector(".sudoku-cell", { timeout: 60000 });
        await page.waitForTimeout(1500);
        await assertSameBoard(page, board.cells);
        for (let i = 0; i < 10; i++) {
          await page.evaluate(() => document.querySelector('[aria-label*="Hint" i]:not([disabled])')?.click());
          await page.waitForTimeout(150);
        }
        await page.evaluate(() => document.activeElement?.blur?.());
        await page.waitForTimeout(1500);
        const row = {
          payload: bi, engine: name, scheme, arm,
          won: await page.evaluate(() => !!document.querySelector(".solve-success")),
          valuenow: await page.evaluate(() => document.querySelector('[role="progressbar"]')?.getAttribute("aria-valuenow") ?? null),
        };
        for (const [mode, media] of [
          ["screen", { media: "screen" }],
          ["print", { media: "print" }],
          ["forced", { media: "screen", forcedColors: "active" }],
        ]) {
          await page.emulateMedia(media);
          const s = await settled(page, READ);
          row[mode] = { ...s.value, settleMs: s.ms, unsettled: !!s.unsettled, fp: await footprint(page) };
          const t = s.value.trace && rgbOf(s.value.trace.stroke), f = s.value.frame && rgbOf(s.value.frame.stroke);
          row[mode].computedTraceFrame = t && f ? +ratio(t, f).toFixed(3) : null;
          await page.emulateMedia({ media: "screen", forcedColors: "none" });
        }
        rows.push(row);
        const k = (sv) => [0.5, 0.7, 0.9, 1].map((x) => `${sv[x].median}/${sv[x].under}/${sv[x].n}`).join(" ");
        const q = (m) => `${m.trace?.stroke} w ${m.trace?.cw} op ${m.trace?.opacityChain} | LINE med/<3/n @.5 .7 .9 1: ${k(m.fp.lineSens)} | PAPER ${k(m.fp.paperSens)} | BORDER ${k(m.fp.borderSens)} | offFrame ${m.fp.offFrameShare} border ${m.fp.borderShare} | frame ${m.frame?.stroke} ${m.frame?.cw} paper ${m.fp.paper} mag ${m.fp.magenta} noise ${m.fp.noise}`;
        console.log(`P${bi} ${name}/${scheme}/${arm} v${row.valuenow} won ${row.won}\n  SCREEN ${q(row.screen)}\n  PRINT  ${q(row.print)} (computed t:f ${row.print.computedTraceFrame})\n  FORCED ${q(row.forced)} (computed t:f ${row.forced.computedTraceFrame})`);
        await ctx.close();
      }
    }
    await browser.close();
  }
}
writeFileSync(OUT, JSON.stringify({ payloads: boards.map((b) => b.payload), rows }, null, 2));
console.log("ALLDONE");
