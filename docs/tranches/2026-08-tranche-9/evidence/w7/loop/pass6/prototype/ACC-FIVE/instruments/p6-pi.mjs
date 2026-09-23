/**
 * ACC-FIVE pass 6 (copied from pass 5's p5-pi-hidden.mjs; the BOARD state added: ten hints, the gauge
 * standing at 25 %, pointer parked — the surface the pass-6 byte and the progressbar contract move).
 * Pass 5's header follows.
 *
 * ACC-FIVE pass 5 · π on the two claimed surfaces a board-at-rest census cannot see (pass-4
 * critique §3.9): `GameGallery`'s `.guard-leave` (behind the leave guard) and `GameControlPanel`'s
 * `.sparkle-icon` glow (hover only, `@media (hover: hover)`).
 *
 * The census DRIVES the surface (NOTE-LEDGER's critic): state G dirties the board, opens the deck
 * by the wordmark, steps right and presses `d` so the deal guard arms (gallery-guard.spec.ts's
 * route), then hovers the leave verb; state S hovers the solver's button. Every element's computed
 * PAINT + tag + rect is diffed prototype-vs-control, and control-vs-control (a second load of the
 * same control) is π's own negative control in the same run (MRK-ABS's critic). Both arms are
 * BUILT dists dealing ONE encoded `?board=` payload, read back on each arm.
 *
 *   node p5-pi-hidden.mjs <proto> <control> <out.json>
 */
import { writeFileSync } from "node:fs";
import { chromium, webkit, mintFromControl, assertSameBoard, CENSUS, PAINT, diffCensus, settled } from "./p6-lib.mjs";

const PROTO = process.argv[2] ?? "http://127.0.0.1:4238";
const CTRL = process.argv[3] ?? "http://127.0.0.1:4237";
const OUT = process.argv[4];
if (!OUT) throw new Error("usage: node p5-pi-hidden.mjs <proto> <control> <out.json>");
const board = await mintFromControl(CTRL);
console.log(`payload ${board.payload} (${board.givens} givens)`);

const GUARD_READ = () => {
  const rd = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const cs = getComputedStyle(el);
    const outline = el.querySelector("svg path, path");
    return {
      color: cs.color,
      background: cs.backgroundColor,
      outlineStroke: outline ? getComputedStyle(outline).stroke : null,
    };
  };
  return { leave: rd(".guard-leave .guard-face"), keep: rd(".guard-keep .guard-face") };
};
const SPARKLE_READ = () => {
  const el = document.querySelector(".sparkle-icon");
  return el ? { filter: getComputedStyle(el).filter } : null;
};

async function load(browser, scheme, base) {
  const ctx = await browser.newContext({ colorScheme: scheme, reducedMotion: "reduce", viewport: { width: 1280, height: 800 } });
  const page = await ctx.newPage();
  await page.goto(base + board.query);
  await page.waitForSelector(".sudoku-cell", { timeout: 60000 });
  await page.waitForTimeout(1500);
  await assertSameBoard(page, board.cells);
  return { ctx, page };
}

async function stateGuard(browser, scheme, base) {
  const { ctx, page } = await load(browser, scheme, base);
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
  await page.mouse.move(2, 2);
  const rest = (await settled(page, GUARD_READ)).value;
  const censusRest = await page.evaluate(CENSUS, PAINT);
  const b = await page.locator(".guard-leave").boundingBox();
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
  const hover = (await settled(page, GUARD_READ)).value;
  const censusHover = await page.evaluate(CENSUS, PAINT);
  await ctx.close();
  return { rest, hover, censusRest, censusHover };
}

async function stateBoard(browser, scheme, base) {
  const { ctx, page } = await load(browser, scheme, base);
  for (let i = 0; i < 10; i++) {
    await page.evaluate(() => document.querySelector('[aria-label*="Hint" i]:not([disabled])')?.click());
    await page.waitForTimeout(150);
  }
  await page.evaluate(() => document.activeElement?.blur?.());
  await page.mouse.move(2, 2);
  await settled(page, () => [...document.querySelectorAll(".progress-trace")].map((t) => t.getAttribute("d")?.length));
  const census = await page.evaluate(CENSUS, PAINT);
  const aria = await page.evaluate(() => { const e = document.querySelector('[role="progressbar"]'); return e ? [...e.attributes].filter((a) => a.name.startsWith("aria-")).map((a) => `${a.name}=${a.value}`).join(" ") : null; });
  await ctx.close();
  return { census, aria };
}
async function stateSparkle(browser, scheme, base) {
  const { ctx, page } = await load(browser, scheme, base);
  await page.mouse.move(2, 2);
  const rest = (await settled(page, SPARKLE_READ)).value;
  const btn = page.locator(".icon-btn:has(.sparkle-icon)").first();
  const b = await btn.boundingBox();
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2);
  const hover = (await settled(page, SPARKLE_READ)).value;
  const censusHover = await page.evaluate(CENSUS, PAINT);
  await ctx.close();
  return { rest, hover, censusHover };
}

const summarise = (d) => {
  const g = new Map();
  for (const p of d.paint) {
    const cls = p.key.split("|")[1] || p.key.split("|")[0].split(">").pop();
    const k = `${cls} :: ${p.prop}`;
    const e = g.get(k) ?? { n: 0, a: p.a, b: p.b };
    e.n++;
    g.set(k, e);
  }
  return {
    nodes: [d.nodesA, d.nodesB],
    shared: d.shared,
    onlyA: d.onlyA.length,
    onlyB: d.onlyB.length,
    paintDiffs: d.paint.length,
    rectDiffs: d.rect.length,
    paintByClassProp: Object.fromEntries(g),
    rectSample: d.rect.slice(0, 6),
    onlySample: [...d.onlyA.slice(0, 4), ...d.onlyB.slice(0, 4)],
  };
};

const report = { payload: board.payload, givens: board.givens, cells: {} };
for (const [name, type] of [["chromium", chromium], ["webkit", webkit]]) {
  const browser = await type.launch();
  for (const scheme of ["light", "dark"]) {
    const gp = await stateGuard(browser, scheme, PROTO);
    const gc = await stateGuard(browser, scheme, CTRL);
    const gc2 = await stateGuard(browser, scheme, CTRL);
    const sp = await stateSparkle(browser, scheme, PROTO);
    const sc = await stateSparkle(browser, scheme, CTRL);
    const sc2 = await stateSparkle(browser, scheme, CTRL);
    const bp = await stateBoard(browser, scheme, PROTO);
    const bc = await stateBoard(browser, scheme, CTRL);
    const bc2 = await stateBoard(browser, scheme, CTRL);
    const cell = {
      guard: {
        proto: { rest: gp.rest, hover: gp.hover },
        control: { rest: gc.rest, hover: gc.hover },
        restPiVsControl: summarise(diffCensus(gp.censusRest, gc.censusRest)),
        restControlVsControl: summarise(diffCensus(gc2.censusRest, gc.censusRest)),
        hoverPiVsControl: summarise(diffCensus(gp.censusHover, gc.censusHover)),
        hoverControlVsControl: summarise(diffCensus(gc2.censusHover, gc.censusHover)),
      },
      board: {
        aria: { proto: bp.aria, control: bc.aria },
        piVsControl: summarise(diffCensus(bp.census, bc.census)),
        controlVsControl: summarise(diffCensus(bc2.census, bc.census)),
      },
      sparkle: {
        proto: { rest: sp.rest, hover: sp.hover },
        control: { rest: sc.rest, hover: sc.hover },
        hoverPiVsControl: summarise(diffCensus(sp.censusHover, sc.censusHover)),
        hoverControlVsControl: summarise(diffCensus(sc2.censusHover, sc.censusHover)),
      },
    };
    report.cells[`${name}/${scheme}`] = cell;
    const G = cell.guard;
    const S = cell.sparkle;
    console.log(`${name}/${scheme}`);
    console.log(`  guard leave rest proto ${JSON.stringify(G.proto.rest.leave)} | control ${JSON.stringify(G.control.rest.leave)}`);
    console.log(`  guard leave hover proto ${JSON.stringify(G.proto.hover.leave)} | control ${JSON.stringify(G.control.hover.leave)}`);
    console.log(`  guard REST π: paint ${G.restPiVsControl.paintDiffs} rect ${G.restPiVsControl.rectDiffs} only ${G.restPiVsControl.onlyA}/${G.restPiVsControl.onlyB} · noise paint ${G.restControlVsControl.paintDiffs} rect ${G.restControlVsControl.rectDiffs}`);
    console.log(`    ${JSON.stringify(G.restPiVsControl.paintByClassProp)}`);
    console.log(`  guard HOVER π: paint ${G.hoverPiVsControl.paintDiffs} rect ${G.hoverPiVsControl.rectDiffs} · noise paint ${G.hoverControlVsControl.paintDiffs} rect ${G.hoverControlVsControl.rectDiffs}`);
    console.log(`    ${JSON.stringify(G.hoverPiVsControl.paintByClassProp)}`);
    const B = cell.board;
    console.log(`  BOARD π: paint ${B.piVsControl.paintDiffs} rect ${B.piVsControl.rectDiffs} only ${B.piVsControl.onlyA}/${B.piVsControl.onlyB} · noise paint ${B.controlVsControl.paintDiffs} rect ${B.controlVsControl.rectDiffs} only ${B.controlVsControl.onlyA}/${B.controlVsControl.onlyB}`);
    console.log(`    ${JSON.stringify(B.piVsControl.paintByClassProp)}`);
    console.log(`    aria proto [${B.aria.proto}] control [${B.aria.control}]`);
    console.log(`  sparkle rest proto ${JSON.stringify(S.proto.rest)} control ${JSON.stringify(S.control.rest)}; hover proto ${JSON.stringify(S.proto.hover)} control ${JSON.stringify(S.control.hover)}`);
    console.log(`  sparkle HOVER π: paint ${S.hoverPiVsControl.paintDiffs} rect ${S.hoverPiVsControl.rectDiffs} · noise paint ${S.hoverControlVsControl.paintDiffs} rect ${S.hoverControlVsControl.rectDiffs}`);
    console.log(`    ${JSON.stringify(S.hoverPiVsControl.paintByClassProp)}`);
  }
  await browser.close();
}
writeFileSync(OUT, JSON.stringify(report, null, 2));
