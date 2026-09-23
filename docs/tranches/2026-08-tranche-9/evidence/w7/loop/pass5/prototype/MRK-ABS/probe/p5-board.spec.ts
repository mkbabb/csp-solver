/** T9-W7 pass 5 · MRK-ABS — the ring token's THREE ARMS, BUILT (charter row 1–2, 8): each arm is its
 *  own dist, served on its own port; every arm deals the SAME codec payload and the given-set is
 *  read back from each. Both statistics from one focus cycle (abs-lib.readCell). The control
 *  (74a2b5d9, tier 2 at 0.9, uninset ring) is read beside as the HEAD reference. */
import { test } from "@playwright/test";
import { bank, loadBoard, setTheme, readCell } from "./abs-lib";
const ARMS = [
  { arm: "A-alias-0.95", base: "http://127.0.0.1:4239", ink: { light: "#3a7bc4", dark: "#3a7bc4" }, op: 0.95 },
  { arm: "B-two-0.95", base: "http://127.0.0.1:4241", ink: { light: "#4589d2", dark: "#2f68aa" }, op: 0.95 },
  { arm: "C-two-1.0", base: "http://127.0.0.1:4242", ink: { light: "#4589d2", dark: "#2f68aa" }, op: 1 },
  { arm: "HEAD-74a2b5d9", base: "http://127.0.0.1:4240", ink: { light: "#3a7bc4", dark: "#3a7bc4" }, op: 0.9 },
];
test("three arms · 16x16 frame + paper · 9x9 paper", async ({ page }, info) => {
  test.setTimeout(1200000);
  const engine = info.project.name; const rows: Record<string, unknown>[] = []; const payloads: Record<string, unknown> = {};
  for (const a of ARMS) for (const sub of [4, 3]) {
    const pl = await loadBoard(page, a.base, sub); payloads[`${a.arm}-${sub}`] = pl;
    await page.waitForTimeout(900);
    for (const theme of ["light", "dark"] as const) {
      await setTheme(page, theme);
      for (const cell of sub === 4 ? [0, 1] : [0]) {
        const r = await readCell(page, cell, a.ink[theme], a.op);
        const row = { engine, arm: a.arm, theme, board: `${sub * sub}x${sub * sub}`, cell, on: sub === 4 && cell === 0 ? "FRAME" : "paper", ...r };
        rows.push(row);
        console.log(`ROW ${engine} ${a.arm} ${theme} ${row.board} c${cell} ${row.on} so=${r.strokeOpacity} ledger(L worst ${r.ledger.worst} med ${r.ledger.median} n${r.ledger.painted}) ring(worst ${r.ring.core?.worst} p30 ${r.ring.core?.p30} med ${r.ring.core?.median} f<3 ${r.ring.core?.fracUnder3}) sides ${JSON.stringify(r.ring.bySide)} sens ${r.ring.sensitivity.map((s) => s.at + ":" + s.worst + "(" + s.under3 + ")").join(" ")} isRing ${r.ring.isTheRing} Δ${r.ring.deltaToComposite}`);
      }
    }
  }
  bank(`board-arms-${engine}`, { payloads, rows });
});
