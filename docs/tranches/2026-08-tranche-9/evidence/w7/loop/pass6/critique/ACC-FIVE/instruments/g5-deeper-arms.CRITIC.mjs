/**
 * CRITIC COPY (pass-6 critique, ACC-FIVE): the prototype's p6-g5-verb.mjs with two PLANTED deeper
 * arms (the same OKLab mix at 70% and 55% red-ink) beside tree/neg/control, DPR 1 only, to test the
 * README's claim that the fraction under 4.5 is structural for any chromatic red at this weight.
 *
 * ACC-FIVE pass 6 · G5 — the leave verb's word, the GLYPH-TEXT statistic (LAWS P5, registry-v5
 * §2.11; NOTE-ERASE's p6-aa.probe form).
 *
 * The WORD is scored, not the box: the drawn outline (`.guard-leave .guard-face svg`, which strokes
 * currentColor) is hidden in both photographs, then the word is made transparent. A pixel's
 * COVERAGE is its change over the change the computed ink, composited on that same ground, would
 * make (keyed on coverage, never on the crop's own maximum); the core is coverage ≥ 0.5; each core
 * pixel's ratio is shown against ground. Every photograph is taken TWICE and a pixel that moves
 * between the two is dropped as noise (counted). Gate: core median ≥ 4.5; the fraction under 4.5
 * STATED beside the control's own (the black `leave` of 74a2b5d9).
 *
 * Arms (one payload, 1280×800 fine, PRM reduce, DPR 1 and 2, rest and hover, both themes):
 *   tree     the pass-6 dist (the verb's ink = color-mix(in oklab, red-ink 85%, foreground))
 *   neg      the SAME dist with pass 5's ink planted back (`color: var(--color-red-ink)`): the
 *            born-RED, which must read under 4.5 at light hover as pass 5 did
 *   control  74a2b5d9
 *
 *   node p6-g5-verb.mjs <tree> <control> <out.json>
 */
import { writeFileSync } from "node:fs";
import { chromium, webkit, mintFromControl, assertSameBoard, rawOf, ratio } from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass6/prototype/ACC-FIVE/instruments/p6-lib.mjs";

const [TREE, CTRL, OUT] = process.argv.slice(2);
const board = await mintFromControl(CTRL);
console.log(`payload ${board.payload.slice(0, 18)}… (${board.givens} givens)`);

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

const addStyle = (page, id, css) => page.evaluate(([i, c]) => {
  const s = document.createElement("style");
  s.id = i;
  s.textContent = c;
  document.head.appendChild(s);
}, [id, css]);
const dropStyle = (page, id) => page.evaluate((i) => document.getElementById(i)?.remove(), id);
const faceColor = (page) => page.evaluate(() => getComputedStyle(document.querySelector(".guard-leave .guard-face")).color);

async function glyphText(page, dpr) {
  const bb = await page.locator(".guard-leave .guard-face").boundingBox();
  const clip = { x: bb.x - 2, y: bb.y - 2, width: bb.width + 4, height: bb.height + 4 };
  await addStyle(page, "g5-nobox", "html body .guard-leave .guard-face svg { visibility: hidden !important }");
  await page.waitForTimeout(250);
  const spec = await faceColor(page);
  const A = await rawOf(await page.screenshot({ clip }));
  const A2 = await rawOf(await page.screenshot({ clip }));
  await addStyle(page, "g5-clear", "html body .guard-leave .guard-face { color: transparent !important; transition: none !important }");
  await page.waitForTimeout(300);
  const B = await rawOf(await page.screenshot({ clip }));
  const B2 = await rawOf(await page.screenshot({ clip }));
  await dropStyle(page, "g5-clear");
  await dropStyle(page, "g5-nobox");
  await page.waitForTimeout(300);
  const ink = await page.evaluate((css) => {
    const c = document.createElement("canvas");
    c.width = c.height = 1;
    const g = c.getContext("2d", { willReadFrequently: true });
    g.fillStyle = css;
    g.fillRect(0, 0, 1, 1);
    return Array.from(g.getImageData(0, 0, 1, 1).data);
  }, spec);
  const a = ink[3] / 255;
  let noise = 0;
  const pop = [];
  for (let k = 0; k < A.data.length; k += 4) {
    const n1 = Math.abs(A.data[k] - A2.data[k]) + Math.abs(A.data[k + 1] - A2.data[k + 1]) + Math.abs(A.data[k + 2] - A2.data[k + 2]);
    const n2 = Math.abs(B.data[k] - B2.data[k]) + Math.abs(B.data[k + 1] - B2.data[k + 1]) + Math.abs(B.data[k + 2] - B2.data[k + 2]);
    if (n1 > 8 || n2 > 8) { noise++; continue; }
    const g = [B.data[k], B.data[k + 1], B.data[k + 2]];
    const full = [0, 1, 2].map((i) => a * ink[i] + (1 - a) * g[i]);
    const dFull = Math.abs(full[0] - g[0]) + Math.abs(full[1] - g[1]) + Math.abs(full[2] - g[2]);
    const d = Math.abs(A.data[k] - g[0]) + Math.abs(A.data[k + 1] - g[1]) + Math.abs(A.data[k + 2] - g[2]);
    if (dFull < 12 || d < 6) continue;
    pop.push({ cov: Math.min(1, d / dFull), r: ratio([A.data[k], A.data[k + 1], A.data[k + 2]], g) });
  }
  const at = (f) => {
    const r = pop.filter((p) => p.cov >= f).map((p) => p.r).sort((u, v) => u - v);
    return r.length ? { n: r.length, median: +r[r.length >> 1].toFixed(3), under45: +(r.filter((v) => v < 4.5).length / r.length).toFixed(3), min: +r[0].toFixed(3) } : { n: 0 };
  };
  return { spec, dpr, noise, glyphPx: pop.length, gate: at(0.5), k70: at(0.7), k90: at(0.9) };
}

const rows = [];
for (const [name, type] of [["chromium", chromium], ["webkit", webkit]]) {
  const browser = await type.launch();
  for (const dpr of (process.env.DPRS ?? "1").split(",").map(Number)) {
    for (const scheme of ["light", "dark"]) {
      for (const [arm, base] of [["tree", TREE], ["mix70", TREE], ["mix55", TREE], ["control", CTRL]]) {
        const ctx = await browser.newContext({ colorScheme: scheme, reducedMotion: "reduce", viewport: { width: 1280, height: 800 }, deviceScaleFactor: dpr });
        const page = await ctx.newPage();
        await page.goto(base + board.query);
        await page.waitForSelector(".sudoku-cell", { timeout: 60000 });
        await page.waitForTimeout(1200);
        await assertSameBoard(page, board.cells);
        await guard(page);
        if (arm === "neg") await addStyle(page, "g5-neg", ".guard-leave .guard-face { color: var(--color-red-ink) !important }");
        if (arm === "mix70") await addStyle(page, "g5-m70", ".guard-leave .guard-face { color: color-mix(in oklab, var(--color-red-ink) 70%, var(--color-foreground)) !important }");
        if (arm === "mix55") await addStyle(page, "g5-m55", ".guard-leave .guard-face { color: color-mix(in oklab, var(--color-red-ink) 55%, var(--color-foreground)) !important }");
        const out = { engine: name, dpr, scheme, arm, verb: await page.evaluate(() => document.querySelector(".guard-leave")?.textContent?.trim()) };
        for (const state of ["rest", "hover"]) {
          const bb = await page.locator(".guard-leave").boundingBox();
          if (state === "hover") await page.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2);
          else await page.mouse.move(2, 2);
          await page.waitForTimeout(600);
          out[state] = await glyphText(page, dpr);
        }
        rows.push(out);
        const f = (s) => `${s.spec} med ${s.gate.median} <4.5 ${s.gate.under45} min ${s.gate.min} n ${s.gate.n} (k70 ${s.k70.median} k90 ${s.k90.median}) noise ${s.noise}`;
        console.log(`${name} dpr${dpr} ${scheme} ${arm} "${out.verb}" REST ${f(out.rest)} || HOVER ${f(out.hover)}`);
        await ctx.close();
      }
    }
  }
  await browser.close();
}
writeFileSync(OUT, JSON.stringify({ payload: board.payload, rows }, null, 2));
console.log("ALLDONE");
