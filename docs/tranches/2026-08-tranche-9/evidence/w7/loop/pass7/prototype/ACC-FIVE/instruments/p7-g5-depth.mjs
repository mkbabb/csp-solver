/**
 * ACC-FIVE pass 7 · G5 on the FULL §2.11 statistic, with the depth search (pass-6 critique §3.2; chair A.6;
 * registry-v6 §2.6). The leave verb's word (`.guard-leave .guard-face`) is read by the chair's ONE
 * glyph-population probe (pass7/instruments/glyph-pop.mjs, imported, not re-implemented): the whole glyph
 * population ON vs text-transparent, G1 empty/thin RED, G2 absolute median ≥ 4.5, G3 the fraction under 4.5
 * ≤ the CONTROL's fraction in the same cell + 0.05 (the slack LAWS P6 §E names until the estate stamps one),
 * G4 the tail slices. The drawn outline strokes currentColor, so it is hidden in BOTH photographs (a style
 * injected before the probe), and only the word is scored.
 *
 * Arms (one payload minted off the control, read back on every page; 1280×800 fine, PRM reduce; both
 * engines × light/dark × DPR 1/2 × rest/hover): the tree's verb ink `color-mix(in oklab, red-ink X%,
 * foreground)` for X ∈ DEPTHS (85 = the pass-6 default; the others planted by one style rule on the same
 * page), and the control 74a2b5d9's black `leave`. In-run negatives on the tree's DEFAULT arm (X = DEF): the
 * FAINT30 and TAIL12/TAIL35 plants from glyph-pop's TEXT_PLANTS — each must RED — and the lane's own
 * TAIL12/TAIL35 on the TEXT run (`applyTailText`, below: the chair's Range spans this subject's hidden svg too).
 *
 *   node p7-g5-depth.mjs <tree> <control> <out.json> [DEF] [DEPTHS comma list]
 */
import { writeFileSync } from "node:fs";
import { chromium, webkit, mintFromControl, assertSameBoard } from "./p7-lib.mjs";
import { glyphPopulation, TEXT_PLANTS, applyTail, undoTail } from "../../../instruments/glyph-pop.mjs";

const [TREE, CTRL, OUT, DEF = "85", DL = "85,70,55,40,30,20"] = process.argv.slice(2);
const DEPTHS = DL.split(",").map(Number);
const SUBJ = ".guard-leave .guard-face";
const SLACK = 0.05;
const board = await mintFromControl(CTRL);
console.log(`payload ${board.payload.slice(0, 18)}… (${board.givens} givens) · DEPTHS ${DEPTHS} · DEF ${DEF}`);

async function guard(page) {
  const blank = await page.evaluate(() => {
    const cells = document.querySelectorAll(".sudoku-cell");
    for (let i = 0; i < cells.length; i++) if (!cells[i].querySelector(".glyph-svg")) return i;
    return -1;
  });
  await page.locator(".sudoku-cell").nth(blank).click();
  await page.evaluate((idx) => {
    const input = document.querySelectorAll(".sudoku-cell input")[idx];
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(input, "1");
    input.dispatchEvent(new Event("input", { bubbles: true }));
  }, blank);
  await page.waitForTimeout(400);
  await page.locator("button.logo-trigger").click();
  await page.locator(".gallery-viewport").waitFor({ timeout: 15000 });
  await page.waitForTimeout(900);
  await page.locator(".gallery-viewport").press("ArrowRight");
  await page.waitForTimeout(500);
  await page.locator(".gallery-viewport").press("d");
  await page.locator(".gallery-guard").waitFor({ timeout: 15000 });
  await page.waitForTimeout(900);
}
const style = (page, id, css) => page.evaluate(([i, c]) => { let s = document.getElementById(i); if (!s) { s = document.createElement("style"); s.id = i; document.head.appendChild(s); } s.textContent = c; }, [id, css]);
const unstyle = (page, id) => page.evaluate((i) => document.getElementById(i)?.remove(), id);
const mixCss = (x) => `${SUBJ} { color: color-mix(in oklab, var(--color-red-ink) ${x}%, var(--color-foreground)) !important; transition: none !important }`;
const inkOf = (page) => page.evaluate((s) => getComputedStyle(document.querySelector(s)).color, SUBJ);

async function open(browser, base, scheme, dpr) {
  const ctx = await browser.newContext({ colorScheme: scheme, reducedMotion: "reduce", viewport: { width: 1280, height: 800 }, deviceScaleFactor: dpr });
  const page = await ctx.newPage();
  await page.goto(base + board.query);
  await page.waitForSelector(".sudoku-cell", { timeout: 60000 });
  await page.waitForTimeout(1200);
  await assertSameBoard(page, board.cells);
  await guard(page);
  await style(page, "g5-nobox", `html body ${SUBJ} svg { visibility: hidden !important }`);
  return { ctx, page };
}
// The chair's TAIL plant measures the run by a Range over the subject's CONTENTS, and this subject's contents
// hold the drawn outline's svg (hidden, but boxed): the run reads [-2, 57.1] px for a word whose glyphs end
// near 49, so TAIL12's cut (50.0) falls past the last letter and the plant paints nothing (pass-7 run: every
// TAIL12 number equal to the default arm's to 3 decimals). The lane's own TEXT-RUN tail: the Range spans the
// text nodes only, the mask is the chair's (last `tail` of the run at 25 % alpha); `undoTail` restores it.
async function applyTailText(page, subject, tail) {
  return page.evaluate(({ subject, tail }) => {
    const el = document.querySelector(subject); if (!el) return { ok: false };
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, { acceptNode: (n) => (n.parentElement.closest("svg") || !n.textContent.trim() ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT) });
    const nodes = []; while (w.nextNode()) nodes.push(w.currentNode);
    if (!nodes.length) return { ok: false };
    const r = document.createRange(); r.setStart(nodes[0], 0); r.setEnd(nodes[nodes.length - 1], nodes[nodes.length - 1].length);
    const rects = [...r.getClientRects()].filter((q) => q.width > 0), eb = el.getBoundingClientRect();
    const left = Math.min(...rects.map((q) => q.left)), right = Math.max(...rects.map((q) => q.right));
    const cut = left + (1 - tail) * (right - left) - eb.left;
    const g = `linear-gradient(to right, #000 ${cut.toFixed(1)}px, rgba(0,0,0,.25) ${cut.toFixed(1)}px)`;
    el.dataset.tailPrev = el.getAttribute("style") ?? "";
    el.style.setProperty("-webkit-mask-image", g, "important"); el.style.setProperty("mask-image", g, "important");
    return { ok: true, run: [+(left - eb.left).toFixed(1), +(right - eb.left).toFixed(1)], cut: +cut.toFixed(1) };
  }, { subject, tail });
}
async function pose(page, state) {
  const bb = await page.locator(".guard-leave").boundingBox();
  if (state === "hover") await page.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2);
  else await page.mouse.move(2, 2);
  await page.waitForTimeout(500);
}
const rows = [];
for (const [name, type] of [["chromium", chromium], ["webkit", webkit]]) {
  const browser = await type.launch();
  for (const dpr of [1, 2]) for (const scheme of ["light", "dark"]) {
    // the control first: its fraction is the cell's bound
    const C = await open(browser, CTRL, scheme, dpr);
    const ctl = {};
    for (const state of ["rest", "hover"]) { await pose(C.page, state); ctl[state] = await glyphPopulation(C.page, { subject: SUBJ }); ctl[state].ink = await inkOf(C.page); }
    await C.ctx.close();
    const T = await open(browser, TREE, scheme, dpr);
    for (const state of ["rest", "hover"]) {
      await pose(T.page, state);
      const bound = +(ctl[state].fracUnder + SLACK).toFixed(3);
      const cell = `${name} dpr${dpr} ${scheme} ${state}`;
      console.log(`${cell} CONTROL ${ctl[state].ink} med ${ctl[state].coreMedian} <4.5 ${ctl[state].fracUnder} pop ${ctl[state].population} → bound ${bound}`);
      rows.push({ cell, arm: "control", ...ctl[state], bound });
      for (const x of DEPTHS) {
        await style(T.page, "g5-mix", mixCss(x));
        await T.page.waitForTimeout(150);
        const r = await glyphPopulation(T.page, { subject: SUBJ, fracBound: bound });
        const ink = await inkOf(T.page);
        rows.push({ cell, arm: `mix${x}`, ink, ...r, bound });
        console.log(`${cell} mix${x} ${ink} med ${r.coreMedian} <4.5 ${r.fracUnder} pop ${r.population} ${r.red ? "RED " + r.why.join(" / ") : "GREEN"}`);
      }
      // in-run negatives on the default arm
      await style(T.page, "g5-mix", mixCss(DEF));
      for (const [pn, plant] of Object.entries(TEXT_PLANTS(SUBJ))) {
        if (pn.startsWith("FADE")) continue;
        let r;
        if (typeof plant === "string") { await style(T.page, "g5-plant", plant); await T.page.waitForTimeout(150); r = await glyphPopulation(T.page, { subject: SUBJ, fracBound: bound }); await unstyle(T.page, "g5-plant"); }
        else { await applyTail(T.page, SUBJ, plant.tail); await T.page.waitForTimeout(150); r = await glyphPopulation(T.page, { subject: SUBJ, fracBound: bound }); await undoTail(T.page, SUBJ); }
        rows.push({ cell, arm: `mix${DEF}+${pn}`, ...r, bound });
        console.log(`${cell} mix${DEF}+${pn} med ${r.coreMedian} <4.5 ${r.fracUnder} pop ${r.population} ${r.red ? "RED " + r.why.join(" / ") : "GREEN (HOLE)"}`);
      }
      for (const tail of [0.12, 0.35]) {
        const pn = `TAIL${Math.round(tail * 100)}_textrun`;
        const at = await applyTailText(T.page, SUBJ, tail); await T.page.waitForTimeout(150);
        const r = await glyphPopulation(T.page, { subject: SUBJ, fracBound: bound }); await undoTail(T.page, SUBJ);
        rows.push({ cell, arm: `mix${DEF}+${pn}`, ...r, bound, run: at.run, cut: at.cut });
        console.log(`${cell} mix${DEF}+${pn} run ${JSON.stringify(at.run)} cut ${at.cut} med ${r.coreMedian} <4.5 ${r.fracUnder} pop ${r.population} ${r.red ? "RED " + r.why.join(" / ") : "GREEN (HOLE)"}`);
      }
      await unstyle(T.page, "g5-mix");
    }
    await T.ctx.close();
  }
  await browser.close();
}
writeFileSync(OUT, JSON.stringify({ payload: board.payload, rows: rows.map(({ clip, ...r }) => r) }, null, 1));
console.log("ALLDONE");
