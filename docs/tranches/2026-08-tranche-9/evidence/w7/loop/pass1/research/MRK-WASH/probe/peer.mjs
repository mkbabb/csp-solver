/**
 * MRK-WASH pass-1 · W2 + W3 — THREE GROUNDS ON ONE CELL, AND THE GRAMMAR WITH A PEER PRESENT.
 *
 * Two pages in ONE context on `?wire=local` (a `BroadcastChannel` is origin-scoped within a
 * context — `e2e/access.spec.ts:372`). Page B parks a cursor on a chosen cell; page A is
 * measured.
 *
 * THE STACK, as this tree actually builds it (measured, not assumed):
 *   `.cell-peer`      the 7% crayon-blue UNIT wash — and the focused cell is EXCLUDED from it
 *                     (20 nodes on a 9×9: 8 + 8 + 4, self not counted)
 *   `.cell-because`   the hint laminate, 15% teacher-red with a 2px inset rim — a FOURTH ground
 *                     the charter's "three" does not name
 *   `.is-peer-cursor` a peer's mark — a ring at HEAD, a wash under the prototype
 *   the selection     yours
 *
 * So the deepest stack a cell can wear is unit + laminate + peer, with your own selection
 * making a fourth on a cell you have focused. Each combination is composited on screen and
 * read from painted bytes, and the digit is read through whatever is under it.
 *
 * The crops (`frames/`) are cut here too, one light and one dark, 330×210.
 */
import { chromium, webkit } from "playwright";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  HERE,
  FRAMES,
  bank,
  decode,
  sampleRect,
  ratio,
  cellCensus,
} from "./lib.mjs";

const WASH_CSS = readFileSync(join(HERE, "..", "proto", "wash-board.css"), "utf8");
const BASE = "http://127.0.0.1:4240/?size=3&difficulty=EASY&wire=local";

const out = {};
for (const engineName of ["chromium", "webkit"]) {
  const engine = engineName === "chromium" ? chromium : webkit;
  const browser = await engine.launch();
  for (const theme of ["light", "dark"]) {
    const ctx = await browser.newContext({
      viewport: { width: 1280, height: 800 },
      colorScheme: theme,
      reducedMotion: "reduce",
      deviceScaleFactor: 1,
    });
    const a = await ctx.newPage();
    await a.goto(BASE);
    await a.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 30000 });
    await a.waitForTimeout(1400);
    await a.locator('.controls-card button[aria-label="Play together on this board"]').click();
    await a.waitForFunction(() => new URL(location.href).searchParams.get("s") !== null, { timeout: 20000 });
    const link = a.url();

    const b = await ctx.newPage();
    await b.goto(link);
    await b.waitForSelector('[role="grid"] [role="gridcell"]', { timeout: 30000 });
    await b.waitForTimeout(1600);

    // B parks a cursor on cell 40 (the board's middle).
    const PEER_CELL = 40;
    await b.evaluate((i) => {
      const inputs = Array.from(document.querySelectorAll(".game-cell input"));
      inputs[i]?.focus();
    }, PEER_CELL);
    await a.bringToFront();
    await a.waitForTimeout(1200);

    // A focuses a cell in the SAME ROW as the peer's, so the peer's cell is inside A's unit and
    // carries the unit wash AND the peer mark at once.
    const A_CELL = PEER_CELL - 4;
    await a.evaluate((i) => {
      const inputs = Array.from(document.querySelectorAll(".game-cell input"));
      inputs[i]?.focus();
    }, A_CELL);
    await a.waitForTimeout(600);

    // A hint puts the laminate on the board; the overlap with the unit is what we want.
    await a.keyboard.press("h");
    await a.waitForTimeout(900);

    const census = await cellCensus(a);
    const stack = {
      peerCursorCells: census.filter((c) => c.peerCursor).map((c) => c.i),
      unitCells: census.filter((c) => c.peer).length,
      becauseCells: census.filter((c) => c.because).map((c) => c.i),
      focusedIsUnit: census[A_CELL]?.peer ?? null,
      peerAlsoUnit: census[PEER_CELL]?.peer ?? null,
      peerAlsoBecause: census[PEER_CELL]?.because ?? null,
      twoGround: census.filter((c) => c.peer && c.because).map((c) => c.i),
      threeGround: census.filter((c) => c.peer && c.because && c.peerCursor).map((c) => c.i),
    };

    const pick = (pred) => census.find(pred);
    const subjects = {
      neutral: pick((c) => !c.peer && !c.because && !c.peerCursor && !c.focused && c.empty),
      unitOnly: pick((c) => c.peer && !c.because && !c.peerCursor && c.empty),
      becauseOnly: pick((c) => c.because && !c.peer && !c.peerCursor),
      unitPlusBecause: pick((c) => c.peer && c.because && !c.peerCursor),
      peerOnly: pick((c) => c.peerCursor && !c.peer),
      peerPlusUnit: pick((c) => c.peerCursor && c.peer),
      selected: census[A_CELL],
    };

    const measure = async (label) => {
      const img = await decode(await a.screenshot({ type: "png" }));
      const row = { arm: label };
      for (const [k, s] of Object.entries(subjects)) {
        if (!s) {
          row[k] = null;
          continue;
        }
        const m = sampleRect(img, s.rect, 1, 0.28);
        row[k] = { idx: s.i, median: m.median };
      }
      const n = row.neutral?.median;
      row.vsNeutral = {};
      for (const [k, v] of Object.entries(row))
        if (v && v.median && k !== "neutral" && k !== "vsNeutral") row.vsNeutral[k] = ratio(v.median, n);
      return row;
    };

    const arms = [await measure("CONTROL-head")];
    await a.addStyleTag({ content: WASH_CSS });
    for (const arm of [
      { name: "wash-a18-rim0", a: 0.18, rimW: 0, rimO: 0, pa: 0.12, pr: 0, po: 0 },
      { name: "wash-a12-rim3", a: 0.12, rimW: 3, rimO: 0.95, pa: 0.1, pr: 0, po: 0 },
      { name: "wash-a12-rim3+peerwash", a: 0.12, rimW: 3, rimO: 0.95, pa: 0.16, pr: 0, po: 0 },
    ]) {
      await a.evaluate((x) => {
        const s = document.documentElement.style;
        s.setProperty("--wash-a", String(x.a));
        s.setProperty("--wash-rim-w", String(x.rimW));
        s.setProperty("--wash-rim-o", String(x.rimO));
        s.setProperty("--peer-wash-a", String(x.pa));
        s.setProperty("--peer-rim-w", String(x.pr));
        s.setProperty("--peer-rim-o", String(x.po));
      }, arm);
      await a.waitForTimeout(320);
      arms.push(await measure(arm.name));
    }

    // ── THE CROP ──
    // 330×210 around the selected cell so the frame carries: the wash, its unit, the peer's
    // cell and a neutral neighbour, at dpr 2 for legibility inside the size cap.
    const r = subjects.selected.rect;
    const clip = {
      x: Math.max(0, Math.round(r.x - 130)),
      y: Math.max(0, Math.round(r.y - 70)),
      width: 330,
      height: 210,
    };
    const shot = await a.screenshot({ clip, type: "png" });
    writeFileSync(join(FRAMES, `wash-stack-${theme}-${engineName}.png`), shot);

    const key = `${engineName}-${theme}`;
    out[key] = { link: link.replace(/s=[^&]+/, "s=<room>"), stack, arms, crop: clip };
    console.log(`PEER ${key} stack=${JSON.stringify(stack)}`);
    for (const r2 of arms) console.log("   " + r2.arm + " " + JSON.stringify(r2.vsNeutral));
    await ctx.close();
  }
  await browser.close();
}
bank("peer-stack.json", out);
