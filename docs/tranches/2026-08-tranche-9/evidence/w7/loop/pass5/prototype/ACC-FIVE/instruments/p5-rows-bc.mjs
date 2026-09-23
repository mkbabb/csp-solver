/**
 * ACC-FIVE pass 5 · ROW B (print) and ROW C (forced colours), read SETTLED, with the FRAME beside
 * the trace (pass-4 critique §3.3/§3.4; the registry's graft 4: read a computed style after the
 * estate's own transition settles).
 *
 * Both arms are BUILT dists (prototype :4238, the `74a2b5d9` control :4237), both dealing ONE
 * encoded `?board=` payload minted off the control and read back on each arm. The board is filled
 * by the product's own HINT (10 presses, half the blanks: the ring stands, the board is not won).
 *
 * For each mode the row reads: the trace's computed stroke at +200 ms (the pass-4 instant) and
 * SETTLED (poll until three reads agree), the frame line's stroke and width, the trace's width,
 * the ratio between the two strokes, and a PAINTED count: the board photographed with the trace
 * shown and with it hidden (`visibility: hidden`, appended last); the pixels that differ are
 * everything the gauge adds to the picture. Zero means the gauge is not there to see.
 *
 * ROW C also reads two arms injected in the forced-colours layer: `Highlight` (the system
 * colour a forced-colours UA gives a selection or a progress fill) and the frame forced to
 * CanvasText (the sibling fix the pass-4 row implied), each with the same painted count.
 *
 *   node p5-rows-bc.mjs <proto> <control> <out.json>
 */
import { writeFileSync } from "node:fs";
import { chromium, webkit, mintFromControl, assertSameBoard, settled, ratio, rgbOf } from "./p5-lib.mjs";

const PROTO = process.argv[2] ?? "http://127.0.0.1:4238";
const CTRL = process.argv[3] ?? "http://127.0.0.1:4237";
const OUT = process.argv[4];
if (!OUT) throw new Error("usage: node p5-rows-bc.mjs <proto> <control> <out.json>");

const board = await mintFromControl(CTRL);
console.log(`payload ${board.payload} (${board.givens} givens)`);

const READ = () => {
  const t = document.querySelector(".progress-trace");
  const f = document.querySelector(".frame-line");
  const cs = (el) => (el ? getComputedStyle(el) : null);
  return {
    traces: document.querySelectorAll(".progress-trace").length,
    trace: t ? { stroke: cs(t).stroke, width: t.getAttribute("stroke-width"), cw: cs(t).strokeWidth } : null,
    frame: f ? { stroke: cs(f).stroke, width: f.getAttribute("stroke-width"), cw: cs(f).strokeWidth } : null,
    paper: getComputedStyle(document.querySelector(".board-wrapper") ?? document.body).backgroundColor,
  };
};

async function gaugePixels(page) {
  const box = await page.locator("svg.hand-drawn-grid").first().boundingBox();
  const clip = { x: Math.max(0, box.x - 8), y: Math.max(0, box.y - 8), width: box.width + 16, height: box.height + 16 };
  const shown = await page.screenshot({ clip });
  const id = await page.evaluate(() => {
    const s = document.createElement("style");
    s.id = "acc5-hide";
    s.textContent = "html body .progress-trace { visibility: hidden !important }";
    document.head.appendChild(s);
    return s.id;
  });
  await page.waitForTimeout(250);
  const hidden = await page.screenshot({ clip });
  await page.evaluate((i) => document.getElementById(i)?.remove(), id);
  await page.waitForTimeout(250);
  return page.evaluate(
    async ([a, b]) => {
      const load = async (d) => {
        const img = new Image();
        img.src = "data:image/png;base64," + d;
        await img.decode();
        const c = document.createElement("canvas");
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        const x = c.getContext("2d", { willReadFrequently: true });
        x.drawImage(img, 0, 0);
        return x.getImageData(0, 0, c.width, c.height).data;
      };
      const A = await load(a);
      const B = await load(b);
      const lin = (c) => ((c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
      const Y = (d, i) => 0.2126 * lin(d[i]) + 0.7152 * lin(d[i + 1]) + 0.0722 * lin(d[i + 2]);
      // the paper = the modal colour of the HIDDEN shot
      const freq = new Map();
      for (let i = 0; i < B.length; i += 4) {
        const k = (B[i] << 16) | (B[i + 1] << 8) | B[i + 2];
        freq.set(k, (freq.get(k) ?? 0) + 1);
      }
      const paperK = [...freq.entries()].sort((x, y) => y[1] - x[1])[0][0];
      const pr = paperK >> 16, pg = (paperK >> 8) & 255, pb = paperK & 255;
      // every pixel the gauge changes, split by the ground it lands on (paper vs any ink under
      // it) and binned by the contrast the change makes against that ground
      const out = { changed: 0, onPaper: 0, onInk: 0, onPaper3: 0, onInk3: 0, onInk15: 0 };
      for (let i = 0; i < A.length; i += 4) {
        if (Math.abs(A[i] - B[i]) + Math.abs(A[i + 1] - B[i + 1]) + Math.abs(A[i + 2] - B[i + 2]) <= 24) continue;
        out.changed++;
        const ya = Y(A, i), yb = Y(B, i);
        const r = (Math.max(ya, yb) + 0.05) / (Math.min(ya, yb) + 0.05);
        const paper = Math.abs(B[i] - pr) + Math.abs(B[i + 1] - pg) + Math.abs(B[i + 2] - pb) <= 24;
        if (paper) {
          out.onPaper++;
          if (r >= 3) out.onPaper3++;
        } else {
          out.onInk++;
          if (r >= 3) out.onInk3++;
          if (r >= 1.5) out.onInk15++;
        }
      }
      out.paper = [pr, pg, pb];
      return out;
    },
    [shown.toString("base64"), hidden.toString("base64")],
  );
}

async function inject(page, css) {
  await page.evaluate((c) => {
    const s = document.createElement("style");
    s.className = "acc5-arm";
    s.textContent = c;
    document.head.appendChild(s);
  }, css);
}
const clearArms = (page) => page.evaluate(() => document.querySelectorAll(".acc5-arm").forEach((s) => s.remove()));

const rows = [];
for (const [name, type] of [["chromium", chromium], ["webkit", webkit]]) {
  const browser = await type.launch();
  for (const scheme of ["light", "dark"]) {
    for (const [arm, base] of [["proto", PROTO], ["control", CTRL]]) {
      const ctx = await browser.newContext({ colorScheme: scheme, reducedMotion: "no-preference", viewport: { width: 1280, height: 800 } });
      const page = await ctx.newPage();
      await page.goto(base + board.query);
      await page.waitForSelector(".sudoku-cell", { timeout: 60000 });
      await page.waitForTimeout(1500);
      await assertSameBoard(page, board.cells);
      // TEN hints: half the blanks, so the ring stands over the frame and the board is NOT won
      for (let i = 0; i < 10; i++) {
        await page.evaluate(() => document.querySelector('[aria-label*="Hint" i]:not([disabled])')?.click());
        await page.waitForTimeout(120);
      }
      await page.evaluate(() => document.activeElement?.blur?.());
      await page.waitForTimeout(1500);
      const row = {
        engine: name,
        scheme,
        arm,
        won: await page.evaluate(() => !!document.querySelector(".solve-success")),
        valuenow: await page.evaluate(() => document.querySelector("[aria-valuenow]")?.getAttribute("aria-valuenow") ?? null),
      };
      row.screen = { ...(await settled(page, READ)).value, gaugePx: await gaugePixels(page) };

      // ROW B — print
      await page.emulateMedia({ media: "print" });
      await page.waitForTimeout(200);
      const at200 = await page.evaluate(READ);
      const s = await settled(page, READ);
      row.print = { at200ms: at200.trace?.stroke, ...s.value, settleMs: s.ms, unsettled: !!s.unsettled, gaugePx: await gaugePixels(page) };
      await page.emulateMedia({ media: "screen" });

      // ROW C — forced colours, then + prefers-contrast: more
      for (const [mode, media] of [
        ["forced", { forcedColors: "active" }],
        ["forced+more", { forcedColors: "active", contrast: "more" }],
      ]) {
        await page.emulateMedia(media);
        await page.waitForTimeout(200);
        const c200 = await page.evaluate(READ);
        const c = await settled(page, READ);
        const v = c.value;
        const tr = v.trace ? rgbOf(v.trace.stroke) : null;
        const fr = v.frame ? rgbOf(v.frame.stroke) : null;
        const pa = rgbOf(v.paper);
        const out = {
          at200ms: c200.trace?.stroke,
          ...v,
          settleMs: c.ms,
          traceVsFrame: tr && fr ? +ratio(tr, fr).toFixed(3) : null,
          traceVsPaper: tr ? +ratio(tr, pa).toFixed(3) : null,
          gaugePx: await gaugePixels(page),
        };
        if (mode === "forced") {
          // the two candidate arms, each in the forced-colours rule's own layer, appended last
          await inject(page, "@layer base { html body .progress-trace { stroke: Highlight !important } }");
          const h = (await settled(page, READ)).value;
          const ht = rgbOf(h.trace.stroke);
          out.armHighlight = { trace: h.trace.stroke, frame: h.frame.stroke, traceVsFrame: +ratio(ht, rgbOf(h.frame.stroke)).toFixed(3), traceVsPaper: +ratio(ht, pa).toFixed(3), gaugePx: await gaugePixels(page) };
          await clearArms(page);
          await inject(page, "@layer base { html body .grid-line { stroke: CanvasText !important } }");
          const g = (await settled(page, READ)).value;
          out.armFrameCanvasText = { trace: g.trace.stroke, frame: g.frame.stroke, traceVsFrame: +ratio(rgbOf(g.trace.stroke), rgbOf(g.frame.stroke)).toFixed(3), gaugePx: await gaugePixels(page) };
          await clearArms(page);
        }
        row[mode] = out;
        await page.emulateMedia({ forcedColors: "none", contrast: "no-preference" });
      }
      rows.push(row);
      const f = row.forced;
      console.log(
        `${name}/${scheme}/${arm}: screen trace ${row.screen.trace?.stroke} frame ${row.screen.frame?.stroke} px ${JSON.stringify(row.screen.gaugePx)} won ${row.won} v ${row.valuenow} | ` +
          `PRINT +200 ${row.print.at200ms} settled ${row.print.trace?.stroke} (${row.print.settleMs}ms) frame ${row.print.frame?.stroke} w ${row.print.trace?.width}/${row.print.frame?.width} px ${JSON.stringify(row.print.gaugePx)} | ` +
          `FORCED +200 ${f.at200ms} settled ${f.trace?.stroke} frame ${f.frame?.stroke} paper ${f.paper} t/f ${f.traceVsFrame} t/p ${f.traceVsPaper} px ${JSON.stringify(f.gaugePx)}` +
          (f.armHighlight ? ` | HIGHLIGHT ${f.armHighlight.trace} t/f ${f.armHighlight.traceVsFrame} t/p ${f.armHighlight.traceVsPaper} px ${JSON.stringify(f.armHighlight.gaugePx)} | FRAME→CanvasText t/f ${f.armFrameCanvasText.traceVsFrame} px ${JSON.stringify(f.armFrameCanvasText.gaugePx)}` : "") +
          ` | FORCED+MORE ${row["forced+more"].trace?.stroke} w ${row["forced+more"].trace?.cw} t/f ${row["forced+more"].traceVsFrame} px ${JSON.stringify(row["forced+more"].gaugePx)}`,
      );
      await ctx.close();
    }
  }
  await browser.close();
}
writeFileSync(OUT, JSON.stringify({ payload: board.payload, givens: board.givens, rows }, null, 2));
