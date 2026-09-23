/** T9-W7 pass 5 · MRK-ABS — charter row 11 + PAL-WALK's graft: the board ring at dpr 1/2/3 (fine,
 *  1280×800) and on the COARSE cells (390×844 portrait, 844×390 landscape — W2 §2.2's cell —
 *  hasTouch, dpr 3, a real tap), arms A (the alias) and C (two values at 1.0), 16×16 cells 0
 *  (frame) and 1 (paper), both themes, one codec payload per arm. */
import { test } from "@playwright/test";
import { bank, loadBoard, setTheme, readCellHidden } from "./abs-lib";
const ARMS = [
  { arm: "A-alias-0.95", base: "http://127.0.0.1:4239", ink: { light: "#3a7bc4", dark: "#3a7bc4" }, op: 0.95 },
  { arm: "C-two-1.0", base: "http://127.0.0.1:4242", ink: { light: "#4589d2", dark: "#2f68aa" }, op: 1 },
  { arm: "B-two-0.95", base: "http://127.0.0.1:4241", ink: { light: "#4589d2", dark: "#2f68aa" }, op: 0.95 },
  { arm: "HEAD-74a2b5d9", base: "http://127.0.0.1:4240", ink: { light: "#3a7bc4", dark: "#3a7bc4" }, op: 0.9 },
].filter((a) => !process.env.ARMS || process.env.ARMS.split(",").includes(a.arm));
const REG = [
  { reg: "desk-dpr1-fine", vp: { width: 1280, height: 800 }, dpr: 1, touch: false, how: "key" as const },
  { reg: "desk-dpr2-fine", vp: { width: 1280, height: 800 }, dpr: 2, touch: false, how: "key" as const },
  { reg: "desk-dpr3-fine", vp: { width: 1280, height: 800 }, dpr: 3, touch: false, how: "key" as const },
  { reg: "phone-390x844-dpr3-coarse", vp: { width: 390, height: 844 }, dpr: 3, touch: true, how: "tap" as const },
  { reg: "land-844x390-dpr3-coarse", vp: { width: 844, height: 390 }, dpr: 3, touch: true, how: "tap" as const },
];
test("density + coarse", async ({ browser }, info) => {
  test.setTimeout(1500000);
  const engine = info.project.name; const rows: Record<string, unknown>[] = [];
  for (const R of REG.filter((r) => !process.env.REGS || process.env.REGS.split(",").includes(r.reg))) for (const a of ARMS) {
    const ctx = await browser.newContext({ viewport: R.vp, deviceScaleFactor: R.dpr, hasTouch: R.touch });
    const page = await ctx.newPage();
    const pl = await loadBoard(page, a.base, 4); await page.waitForTimeout(900);
    const media = await page.evaluate(() => ({ coarse: matchMedia("(pointer: coarse)").matches, hover: matchMedia("(hover: hover)").matches, boardPx: document.querySelector(".board-shell")?.getBoundingClientRect().width ?? null }));
    for (const theme of ["light", "dark"] as const) {
      await setTheme(page, theme);
      for (const cell of [0, 1]) {
        const r = await readCellHidden(page, cell, a.ink[theme], a.op, R.how, R.dpr);
        const c = r.ring.core;
        rows.push({ engine, reg: R.reg, arm: a.arm, theme, cell, on: cell === 0 ? "FRAME" : "paper", media, givens: pl.givens.split(",").length, ...r });
        console.log(`ROW ${engine} ${R.reg} ${a.arm} ${theme} c${cell} coarse=${media.coarse} boardPx=${media.boardPx?.toFixed(1)} fv=${r.focusVisible} so=${r.strokeOpacity} core w${c?.worst} p30 ${c?.p30} med ${c?.median} f<3 ${c?.fracUnder3} sides ${Object.entries(r.ring.bySide).map(([k, v]) => k[0] + v.worst).join(" ")} sens ${r.ring.sensitivity.map((s) => s.at + ":" + s.worst + "(" + s.under3 + ")").join(" ")} isRing ${r.ring.isTheRing}`);
      }
    }
    await ctx.close();
  }
  bank(`density-coarse${process.env.TAG ?? ""}-${engine}`, { rows });
});
