/**
 * MRK-WASH pass-1 PROTOTYPE · G-WASH-2 — ONE GROUND PER CELL.
 *
 * Two pages in ONE context on `?wire=local` (a BroadcastChannel is origin-scoped within a
 * context). B parks a cursor inside A's unit. At HEAD that cell wears the unit wash AND the
 * peer ring and out-reads A's own selection (1.34 vs 1.16 light, 1.55 vs 1.13 dark). Under the
 * prototype the `v-if` gate drops the unit wash there, so the cell wears exactly one ground.
 *
 * Read from painted bytes, plus the census's own booleans, plus the dL* rank the gate asserts.
 * The crops the brief asks for are cut here (330×210, dpr 2).
 */
import { chromium, webkit } from "playwright";
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { FRAMES, bank, decode, sampleRect, lum, ratio, r2, cellCensus } from "./lib.mjs";

const BASE = "http://127.0.0.1:4240/?size=3&difficulty=EASY&wire=local";
const lstar = (rgb) => {
  const y = lum(rgb);
  const f = y > 216 / 24389 ? Math.cbrt(y) : ((24389 / 27) * y) / 116 + 16 / 116;
  return 116 * f - 16;
};

const out = {};
for (const engineName of ["chromium", "webkit"]) {
  const engine = engineName === "chromium" ? chromium : webkit;
  const browser = await engine.launch();
  for (const theme of ["light", "dark"]) {
    const ctx = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      colorScheme: theme,
      reducedMotion: "reduce",
      deviceScaleFactor: 2,
    });
    const a = await ctx.newPage();
    await a.goto(BASE);
    await a.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 30000 });
    await a.waitForTimeout(1400);
    await a.locator('.controls-card button[aria-label="Play together on this board"]').click();
    await a.waitForFunction(() => new URL(location.href).searchParams.get("s") !== null, {
      timeout: 20000,
    });
    const link = a.url();

    const b = await ctx.newPage();
    await b.goto(link);
    await b.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 30000 });
    await b.waitForTimeout(1600);
    const PEER_CELL = 40;
    await b.evaluate((i) => {
      document.querySelectorAll(".game-cell input")[i]?.focus();
    }, PEER_CELL);
    await a.bringToFront();
    await a.waitForTimeout(1200);
    const A_CELL = PEER_CELL - 4;
    await a.evaluate((i) => {
      document.querySelectorAll(".game-cell input")[i]?.focus();
    }, A_CELL);
    await a.waitForTimeout(700);
    await a.keyboard.press("h");
    await a.waitForTimeout(1000);

    const census = await cellCensus(a);
    const stack = {
      peerCursorCells: census.filter((c) => c.peerCursor).map((c) => c.i),
      unitCells: census.filter((c) => c.peer).length,
      becauseCells: census.filter((c) => c.because).map((c) => c.i),
      focusedIsUnit: census[A_CELL]?.peer ?? null,
      peerAlsoUnit: census[PEER_CELL]?.peer ?? null,
      twoGround: census.filter((c) => c.peer && c.because).map((c) => c.i),
      threeGround: census.filter((c) => c.peer && c.because && c.peerCursor).map((c) => c.i),
    };

    const img = await decode(await a.screenshot({ type: "png" }));
    const pick = (p) => census.find(p);
    const subjects = {
      neutral: pick((c) => !c.peer && !c.because && !c.peerCursor && !c.focused && c.empty),
      unitOnly: pick((c) => c.peer && !c.because && !c.peerCursor && c.empty),
      peerCursor: census[PEER_CELL],
      selected: census[A_CELL],
    };
    const read = {};
    for (const [k, s] of Object.entries(subjects)) {
      const m = s ? sampleRect(img, s.rect, 2, 0.28) : null;
      read[k] = m ? { idx: s.i, median: m.median, L: r2(lstar(m.median)) } : null;
    }
    const nL = read.neutral.L;
    const dl = (k) => (read[k] ? r2(Math.abs(read[k].L - nL)) : null);
    const rank = {
      selectionDL: dl("selected"),
      peerCursorDL: dl("peerCursor"),
      unitDL: dl("unitOnly"),
      vsNeutral: {
        selected: ratio(read.selected.median, read.neutral.median),
        peerCursor: ratio(read.peerCursor.median, read.neutral.median),
        unitOnly: read.unitOnly ? ratio(read.unitOnly.median, read.neutral.median) : null,
      },
      yoursWins: dl("selected") >= dl("peerCursor"),
      peerAlsoUnit: stack.peerAlsoUnit,
    };

    const r = subjects.selected.rect;
    const clip = {
      x: Math.max(0, Math.round(r.x - 130)),
      y: Math.max(0, Math.round(r.y - 70)),
      width: 330,
      height: 210,
    };
    writeFileSync(
      join(FRAMES, `wash-peer-${theme}-${engineName}.png`),
      await a.screenshot({ clip, type: "png" }),
    );

    const key = `${engineName}-${theme}`;
    out[key] = { stack, read, rank, crop: clip };
    console.log(
      `PEER ${key} peerAlsoUnit=${stack.peerAlsoUnit} unitCells=${stack.unitCells} ` +
        `dL* you=${rank.selectionDL} peer=${rank.peerCursorDL} unit=${rank.unitDL} ` +
        `ratios=${JSON.stringify(rank.vsNeutral)} yoursWins=${rank.yoursWins}`,
    );
    await ctx.close();
  }
  await browser.close();
}
bank("peer-rank.json", out);
