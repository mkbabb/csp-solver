/**
 * ACC-FIVE pass 6 · the two carried rows that read the whole board, re-run on the tree that ships
 * (dist `index-BiELmy4Rb4HL.js`) against 74a2b5d9, both engines, both themes, TWO payloads.
 *
 *  G9 — the paired census (pass 2's DECLARED TERM, board-ink.mjs §D): over the whole 1280×800
 *       viewport after ten hints, the share of chromatic pixels (OKLCH C ≥ 0.05) OUTSIDE the
 *       family arc 40–115° excluding the 240–270° bin (the pen and the ring, owned by the kinship
 *       rows); the blue bin beside it. Ceiling 12 %. A painted percentage: two payloads.
 *  G3 — the win (pass 3's p3-win form): the top band of the board (the corridor's band: 80 % of
 *       the width, box.y − 10, 26 rows), median OKLCH L of its chromatic pixels after ten hints
 *       and again at the win (Solve, settled by poll); ΔL = win − fill. The gate wants ≥ 0.09.
 *
 *   node p6-g9-g3.mjs <tree> <control>
 */
import { chromium, webkit, mintMany, assertSameBoard, rawOf, settled } from "./p6-lib.mjs";

const [TREE, CTRL] = process.argv.slice(2);
const lin = (c) => ((c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const ok = (r, g, b) => {
  const [R, G, B] = [lin(r), lin(g), lin(b)];
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B), m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B), s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  const A = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, Bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return { L: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, C: Math.hypot(A, Bb), h: ((Math.atan2(Bb, A) * 180) / Math.PI + 360) % 360 };
};
const census = (R) => {
  let chr = 0, off = 0, blue = 0;
  for (let i = 0; i < R.data.length; i += 4) {
    const o = ok(R.data[i], R.data[i + 1], R.data[i + 2]);
    if (o.C < 0.05) continue;
    chr++;
    const inBlue = o.h >= 240 && o.h <= 270;
    if (inBlue) blue++;
    else if (!(o.h >= 40 && o.h <= 115)) off++;
  }
  return { chr, offPct: chr ? +((off / chr) * 100).toFixed(2) : 0, bluePct: chr ? +((blue / chr) * 100).toFixed(2) : 0 };
};
const bandL = (R) => {
  const Ls = [];
  for (let i = 0; i < R.data.length; i += 4) {
    const o = ok(R.data[i], R.data[i + 1], R.data[i + 2]);
    if (o.C >= 0.05) Ls.push(o.L);
  }
  Ls.sort((a, b) => a - b);
  return { n: Ls.length, medL: Ls.length ? +Ls[Ls.length >> 1].toFixed(4) : null };
};

const boards = await mintMany(CTRL, 2);
for (const [bi, board] of boards.entries()) {
  console.log(`P${bi} payload ${board.payload.slice(0, 18)}…`);
  for (const [name, type] of [["chromium", chromium], ["webkit", webkit]]) {
    const b = await type.launch();
    for (const scheme of ["light", "dark"]) {
      for (const [arm, base] of [["tree", TREE], ["control", CTRL]]) {
        const p = await (await b.newContext({ colorScheme: scheme, reducedMotion: "reduce", viewport: { width: 1280, height: 800 } })).newPage();
        await p.goto(base + board.query);
        await p.waitForSelector(".sudoku-cell", { timeout: 60000 });
        await p.waitForTimeout(1500);
        await assertSameBoard(p, board.cells);
        for (let i = 0; i < 10; i++) { await p.evaluate(() => document.querySelector('[aria-label*="Hint" i]:not([disabled])')?.click()); await p.waitForTimeout(150); }
        await p.evaluate(() => document.activeElement?.blur?.());
        await p.mouse.move(2, 2);
        await p.waitForTimeout(1500);
        const aria = await p.evaluate(() => { const e = document.querySelector('[role="progressbar"]'); return e ? `now ${e.getAttribute("aria-valuenow")} of ${e.getAttribute("aria-valuemin")}–${e.getAttribute("aria-valuemax")} text "${e.getAttribute("aria-valuetext")}"` : "none"; });
        const g9 = census(await rawOf(await p.screenshot()));
        const box = await p.locator("svg.hand-drawn-grid").first().boundingBox();
        const clip = { x: Math.round(box.x + box.width * 0.1), y: Math.round(box.y - 10), width: Math.round(box.width * 0.8), height: 26 };
        const fill = bandL(await rawOf(await p.screenshot({ clip })));
        await p.evaluate(() => document.querySelector('[aria-label="Solve puzzle"]')?.click());
        await p.waitForSelector(".solve-success", { timeout: 20000 });
        await settled(p, () => getComputedStyle(document.querySelector(".progress-trace")).stroke);
        await p.waitForTimeout(700);
        const win = bandL(await rawOf(await p.screenshot({ clip })));
        const dL = fill.medL != null && win.medL != null ? +(win.medL - fill.medL).toFixed(4) : null;
        console.log(`  ${name} ${scheme} ${arm}: G9 off-family ${g9.offPct}% blue ${g9.bluePct}% (chromatic ${g9.chr} px) | G3 fill L ${fill.medL} (n ${fill.n}) win L ${win.medL} (n ${win.n}) dL ${dL} | aria ${aria}`);
        await p.context().close();
      }
    }
    await b.close();
  }
}
console.log("ALLDONE");
