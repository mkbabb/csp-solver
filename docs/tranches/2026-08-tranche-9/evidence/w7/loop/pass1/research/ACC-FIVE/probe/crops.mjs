/**
 * crops.mjs — the three frames this lane banks, and nothing else.
 *
 *  1/2. `board-corner-{light,dark}.png` — 330×210 at the board's top-left, the SAME crop
 *       R2 banked at HEAD (`r0/r2-accent-family/frames/`), taken under this family's
 *       overlay so the two can be read side by side: the violet trace, the stock-blue
 *       digits and the pale blue wash become one gold trace and one blue crayon.
 *  3.   `meter-strip.png` — the fill meter at 5% / 50% / 100% and then the SOLVED frame,
 *       four panels of the whole board, so the charter's contradiction ("gold comes to
 *       the page only when the work is done") can be looked at rather than argued.
 *
 * Every panel is the board element's own bounding box, so nothing outside the claim is
 * banked. Palette-quantised PNG; each file's byte size is printed and cited in the .md.
 */
import { chromium } from "playwright";
import sharp from "sharp";
import { writeFileSync, mkdirSync } from "node:fs";

const BASE = process.env.BASE || "http://127.0.0.1:4236";
const HERE =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass1/research/ACC-FIVE";
const OVERLAY = `${HERE}/proto/five-crayons.css`;
mkdirSync(`${HERE}/frames`, { recursive: true });

const browser = await chromium.launch();
const notes = {};

/* ── 1/2. the board corner, both themes, under the overlay ─────────────────── */
for (const scheme of ["light", "dark"]) {
  const ctx = await browser.newContext({
    colorScheme: scheme,
    reducedMotion: "reduce",
    viewport: { width: 1280, height: 800 },
  });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/?size=3&difficulty=EASY`);
  await page.waitForSelector(".sudoku-cell", { timeout: 30000 });
  await page.addStyleTag({ path: OVERLAY });
  await page.waitForTimeout(700);

  // the same state R2's crop was taken in: a partly-filled board with a focused cell, so
  // the trace, the digits, the unit wash and the ring are all in one 330×210.
  const cell = page.locator(".sudoku-cell input:not([readonly])").first();
  await cell.focus();
  for (let i = 0; i < 6; i++) {
    await page.keyboard.type("1");
    await page.keyboard.press("ArrowRight");
  }
  await page.keyboard.press("ArrowLeft");
  await page.waitForTimeout(800);

  const box = await page.locator(".board-wrapper, svg.hand-drawn-grid").first().boundingBox();
  const clip = {
    x: Math.max(0, Math.round(box.x - 10)),
    y: Math.max(0, Math.round(box.y - 10)),
    width: 330,
    height: 210,
  };
  const buf = await page.screenshot({ clip, type: "png" });
  const out = await sharp(buf).png({ palette: true, quality: 82, effort: 9 }).toBuffer();
  writeFileSync(`${HERE}/frames/board-corner-${scheme}.png`, out);
  notes[`board-corner-${scheme}`] = { bytes: out.length, clip };
  await ctx.close();
}

/* ── 3. the meter strip ────────────────────────────────────────────────────── */
{
  const ctx = await browser.newContext({
    colorScheme: "light",
    reducedMotion: "reduce",
    viewport: { width: 1280, height: 800 },
  });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/?size=3&difficulty=EASY`);
  await page.waitForSelector(".sudoku-cell", { timeout: 30000 });
  await page.addStyleTag({ path: OVERLAY });
  await page.waitForTimeout(700);

  const grid = page.locator("svg.hand-drawn-grid").first();
  const readFill = () =>
    page.evaluate(() => {
      const el = document.querySelector('[role="progressbar"]');
      return el ? Number(el.getAttribute("aria-valuenow")) : null;
    });

  const shoot = async (label) => {
    const box = await grid.boundingBox();
    const pad = 14; // the top stripe OVERHANGS the board box (FRAME_Y_PAD 0) — include it
    const buf = await page.screenshot({
      clip: {
        x: Math.max(0, Math.round(box.x - pad)),
        y: Math.max(0, Math.round(box.y - pad)),
        width: Math.round(box.width + pad * 2),
        height: Math.round(box.height + pad * 2),
      },
      type: "png",
    });
    return { label, fill: await readFill(), buf };
  };

  // Fill DETERMINISTICALLY: walk the empty inputs themselves. An arrow-key walk stalls on
  // the givens (a keystroke into a readonly cell changes nothing), and a `while fill < 50`
  // loop written on top of it never terminates — it did not, once, here.
  const emptyCount = await page.evaluate(
    () =>
      Array.from(document.querySelectorAll(".sudoku-cell input")).filter(
        (i) => !i.readOnly && !i.value,
      ).length,
  );
  const fillTo = async (target) => {
    for (let k = 0; k < emptyCount; k++) {
      const now = await readFill();
      if (now != null && now >= target) return;
      const next = page.locator(".sudoku-cell input:not([readonly])").nth(0);
      const idx = await page.evaluate(() => {
        const ins = Array.from(document.querySelectorAll(".sudoku-cell input")).filter(
          (i) => !i.readOnly,
        );
        const e = ins.findIndex((i) => !i.value);
        if (e < 0) return -1;
        ins[e].focus();
        return e;
      });
      if (idx < 0) return;
      await page.keyboard.type("1");
      await page.waitForTimeout(45);
      void next;
    }
  };

  const panels = [];
  await fillTo(5);
  await page.waitForTimeout(700);
  panels.push(await shoot("5%"));

  await fillTo(50);
  await page.waitForTimeout(700);
  panels.push(await shoot("50%"));

  await fillTo(100);
  await page.waitForTimeout(800);
  panels.push(await shoot("100%"));

  // the SOLVED frame: the gold wax floods `.grid-line` and the trace fades to 0.
  await page.locator('[aria-label="Solve puzzle"]').first().click({ timeout: 6000 }).catch(() => {});
  await page.waitForTimeout(4500);
  panels.push(await shoot("solved"));

  const W = 196;
  const tiles = await Promise.all(
    panels.map((p) => sharp(p.buf).resize({ width: W }).toBuffer()),
  );
  const meta = await sharp(tiles[0]).metadata();
  const strip = await sharp({
    create: {
      width: W * tiles.length + 6 * (tiles.length - 1),
      height: meta.height,
      channels: 3,
      background: { r: 255, g: 255, b: 255 },
    },
  })
    .composite(tiles.map((b, i) => ({ input: b, left: i * (W + 6), top: 0 })))
    .png({ palette: true, quality: 80, effort: 9 })
    .toBuffer();
  writeFileSync(`${HERE}/frames/meter-strip.png`, strip);
  notes["meter-strip"] = {
    bytes: strip.length,
    panels: panels.map((p) => ({ label: p.label, ariaValueNow: p.fill })),
    tileWidth: W,
  };
  await ctx.close();
}

await browser.close();
writeFileSync(`${HERE}/frames/frames.json`, JSON.stringify(notes, null, 2));
console.log(JSON.stringify(notes, null, 2));
