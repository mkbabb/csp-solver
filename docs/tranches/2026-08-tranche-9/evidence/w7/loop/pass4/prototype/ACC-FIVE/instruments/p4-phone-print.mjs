/**
 * ACC-FIVE pass 4 · the PHONE's flank (charter row 11) and PRINT / FORCED-COLORS (row 12).
 *
 * The `prefers-contrast: more` arm is specified FROM the phone — "at 393 dpr3 the trace is 2.92
 * CSS px inside a 4.38 px frame, so the graphite flank is 0.73 px per side" — and pass 3 never
 * re-read it. This measures the two strokes' RENDERED widths at 393×699 dpr3 in a witnessed
 * coarse regime and derives the flank, both engines, both themes.
 *
 * Print and forced-colors are read by emulation on the same page: what the trace's computed
 * stroke actually resolves to under `emulateMedia({ media: "print" })` and
 * `{ forcedColors: "active" }`.
 *
 *   node p4-phone-print.mjs <url> <outdir>
 */
import { chromium, webkit } from "playwright";
import { writeFileSync, mkdirSync } from "node:fs";

const URL_ = process.argv[2] ?? "http://127.0.0.1:4236/?size=3&difficulty=EASY";
const OUT = process.argv[3] ?? ".";
mkdirSync(OUT, { recursive: true });

const READ = () => {
  const t = document.querySelector(".progress-trace");
  const f = document.querySelector(".grid-line") ?? document.querySelector(".progress-pose path");
  const svg = document.querySelector("svg.hand-drawn-grid");
  const vb = svg?.viewBox?.baseVal?.width ?? 1000;
  const cssW = svg?.getBoundingClientRect().width ?? 0;
  const unit = cssW / vb; // CSS px per user unit
  const num = (el) => (el ? parseFloat(getComputedStyle(el).strokeWidth) : NaN);
  return {
    viewBox: vb,
    svgCssWidth: +cssW.toFixed(2),
    cssPxPerUnit: +unit.toFixed(5),
    traceUnits: num(t),
    frameUnits: num(f),
    traceCssPx: +(num(t) * unit).toFixed(3),
    frameCssPx: +(num(f) * unit).toFixed(3),
    traceStroke: t ? getComputedStyle(t).stroke : null,
    coarse: matchMedia("(pointer: coarse)").matches,
    more: matchMedia("(prefers-contrast: more)").matches,
    dpr: window.devicePixelRatio,
  };
};

async function hints(page, n) {
  for (let i = 0; i < n; i++) {
    await page.evaluate(() => {
      const b = document.querySelector('[aria-label*="Hint" i]');
      if (b && !b.disabled) b.click();
    });
    await page.waitForTimeout(140);
  }
  await page.evaluate(() => document.activeElement?.blur?.());
  await page.waitForTimeout(800);
}

const rows = [];
for (const [name, type] of [
  ["chromium", chromium],
  ["webkit", webkit],
]) {
  const browser = await type.launch();
  for (const scheme of ["light", "dark"]) {
    for (const arm of ["default", "more"]) {
      const ctx = await browser.newContext({
        colorScheme: scheme,
        reducedMotion: "no-preference",
        contrast: arm === "more" ? "more" : "no-preference",
        viewport: { width: 393, height: 699 },
        deviceScaleFactor: 3,
        hasTouch: true,
        isMobile: name === "chromium",
      });
      const page = await ctx.newPage();
      await page.goto(URL_);
      await page.waitForSelector(".sudoku-cell", { timeout: 60000 });
      await page.waitForTimeout(1600);
      await hints(page, 4);
      const phone = await page.evaluate(READ);

      await page.emulateMedia({ media: "print" });
      await page.waitForTimeout(300);
      const print = await page.evaluate(READ);
      await page.emulateMedia({ media: "screen", forcedColors: "active" });
      await page.waitForTimeout(300);
      let forced = null;
      try {
        forced = await page.evaluate(READ);
      } catch (e) {
        forced = { error: String(e).slice(0, 100) };
      }
      await page.emulateMedia({ media: "screen", forcedColors: "none" });

      rows.push({
        engine: name,
        scheme,
        arm,
        phone: {
          ...phone,
          graphiteFlankCssPx: +(((phone.frameCssPx - phone.traceCssPx) / 2) || 0).toFixed(3),
        },
        printStroke: print.traceStroke,
        printTraceCssPx: print.traceCssPx,
        forcedStroke: forced?.traceStroke ?? null,
        forcedError: forced?.error ?? null,
      });
      await ctx.close();
    }
  }
  await browser.close();
}
writeFileSync(`${OUT}/phone-print.json`, JSON.stringify(rows, null, 2));
for (const r of rows)
  console.log(
    `${r.engine}/${r.scheme}/${r.arm} dpr${r.phone.dpr} coarse=${r.phone.coarse} more=${r.phone.more} | ` +
      `trace ${r.phone.traceUnits}u = ${r.phone.traceCssPx}px, frame ${r.phone.frameUnits}u = ${r.phone.frameCssPx}px, ` +
      `FLANK ${r.phone.graphiteFlankCssPx}px/side | print ${r.printStroke} | forced ${r.forcedStroke ?? r.forcedError}`,
  );
