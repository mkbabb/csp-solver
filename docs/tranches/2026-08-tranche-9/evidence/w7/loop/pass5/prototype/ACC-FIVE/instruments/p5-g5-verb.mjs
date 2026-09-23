/**
 * ACC-FIVE pass 5 · G5 — the leave verb's red, PAINTED (carried since pass 2; the pass-2 figure
 * 4.917 rest / #D02A52 is an `a8fee1f5` reading and does not travel).
 *
 * PAL-WALK's painted-text instrument: the `.guard-leave` box is photographed twice, once as
 * painted and once with its face's ink made transparent (the word AND the drawn box, which strokes
 * `currentColor`), so every changed pixel is compared against the ground it was painted on. The
 * CORE statistic (the chair's §2.4 form): pixels whose luminance change is ≥ k·max, k = 0.5 (the
 * core), with the sensitivity row at k = 0.5/0.7/0.9/1.0 and the fraction of the core under 4.5.
 * Rest and hover (fine pointer), both engines, both themes, this tree vs `74a2b5d9`, one payload.
 *
 *   node p5-g5-verb.mjs <proto> <control> <out.json>
 */
import sharp from "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/web/frontend/node_modules/sharp/dist/index.mjs";
import { writeFileSync } from "node:fs";
import { chromium, webkit, mintFromControl, assertSameBoard } from "./p5-lib.mjs";

const [PROTO, CTRL, OUT] = process.argv.slice(2);
const board = await mintFromControl(CTRL);
const lin = (c) => ((c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const Y = (d, i) => 0.2126 * lin(d[i]) + 0.7152 * lin(d[i + 1]) + 0.0722 * lin(d[i + 2]);

async function painted(shown, hidden) {
  const a = await sharp(shown).raw().toBuffer({ resolveWithObject: true });
  const b = await sharp(hidden).raw().toBuffer();
  const ch = a.info.channels;
  const px = [];
  for (let i = 0; i < a.data.length; i += ch) {
    const ya = Y(a.data, i), yb = Y(b, i);
    const dy = Math.abs(ya - yb);
    if (dy < 0.01) continue;
    px.push({ dy, r: (Math.max(ya, yb) + 0.05) / (Math.min(ya, yb) + 0.05) });
  }
  const max = Math.max(...px.map((p) => p.dy));
  const row = {};
  for (const k of [0.5, 0.7, 0.9, 1.0]) {
    const core = px.filter((p) => p.dy >= k * max - 1e-9).map((p) => p.r).sort((x, y) => x - y);
    row[k] = {
      n: core.length,
      median: +core[Math.floor(core.length / 2)].toFixed(3),
      p30: +core[Math.floor(core.length * 0.3)].toFixed(3),
      max: +core[core.length - 1].toFixed(3),
      under45: +(core.filter((r) => r < 4.5).length / core.length).toFixed(3),
    };
  }
  return { changed: px.length, row };
}

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

const rows = [];
for (const [name, type] of [["chromium", chromium], ["webkit", webkit]]) {
  const browser = await type.launch();
  for (const scheme of ["light", "dark"]) {
    for (const [arm, base] of [["proto", PROTO], ["control", CTRL]]) {
      const ctx = await browser.newContext({ colorScheme: scheme, reducedMotion: "reduce", viewport: { width: 1280, height: 800 } });
      const page = await ctx.newPage();
      await page.goto(base + board.query);
      await page.waitForSelector(".sudoku-cell", { timeout: 60000 });
      await page.waitForTimeout(1200);
      await assertSameBoard(page, board.cells);
      await guard(page);
      const out = { engine: name, scheme, arm };
      for (const state of ["rest", "hover"]) {
        const bb = await page.locator(".guard-leave").boundingBox();
        if (state === "hover") await page.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2);
        else await page.mouse.move(2, 2);
        await page.waitForTimeout(700);
        const clip = { x: bb.x - 4, y: bb.y - 4, width: bb.width + 8, height: bb.height + 8 };
        const shown = await page.screenshot({ clip });
        const color = await page.evaluate(() => getComputedStyle(document.querySelector(".guard-leave .guard-face")).color);
        await page.evaluate(() => {
          const s = document.createElement("style");
          s.id = "g5-hide";
          s.textContent = "html body .guard-leave .guard-face, html body .guard-leave .guard-face * { color: transparent !important }";
          document.head.appendChild(s);
        });
        await page.waitForTimeout(400);
        const hidden = await page.screenshot({ clip });
        await page.evaluate(() => document.getElementById("g5-hide")?.remove());
        await page.waitForTimeout(300);
        out[state] = { color, ...(await painted(shown, hidden)) };
      }
      rows.push(out);
      const f = (s) => `${s.color} core50 med ${s.row[0.5].median} p30 ${s.row[0.5].p30} max ${s.row[0.5].max} <4.5 ${s.row[0.5].under45} (n ${s.row[0.5].n}) · k70 ${s.row[0.7].median} · k90 ${s.row[0.9].median} · k100 ${s.row[1].median}`;
      console.log(`${name}/${scheme}/${arm} REST ${f(out.rest)} || HOVER ${f(out.hover)}`);
      await ctx.close();
    }
  }
  await browser.close();
}
writeFileSync(OUT, JSON.stringify({ payload: board.payload, rows }, null, 2));
