/**
 * T9-W7 pass 4 · MRK-ABS — G-ABS-5 RE-CUT (registry v3 §2.10: "without a named statistic").
 * The gate parses the LEDGER in index.css's `--color-focus-sketch` comment: the opacity it was
 * read at, the statistic (WORST of 60), and one row per board x ground x theme x engine. It is
 * GREEN only when (a) the stated opacity == gameCell.css tier-2 `stroke-opacity` (source text)
 * == the painted ring's computed stroke-opacity, and (b) every painted WORST is within 0.10 of
 * its ledger figure. Born-RED in the SAME run: the tier-2 opacity ablated to law 39's 0.9 at
 * runtime (clauses a and b), and the source text mutated to 0.9 in memory (clause a).
 */
import { test, expect } from "@playwright/test";
import fs from "node:fs";
import { bank, mintSudoku, setTheme, readRing } from "./abs-lib";

const FE = "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/.claude/worktrees/wf_f72f3b5a-83a-39/web/frontend";
const TOL = 0.1;
function ledger(css: string) {
  const at = css.indexOf("--color-focus-sketch:"); const c = css.slice(at, css.indexOf("*/", at));
  const op = c.match(/stroke-opacity ([\d.]+), WORST of (\d+)/);
  const rows = [...c.matchAll(/(16×16|9×9) (paper|frame)\s+light ([\d.]+) \/ ([\d.]+)\s+dark ([\d.]+) \/ ([\d.]+)/g)].map((m) => ({
    board: m[1], on: m[2], light: { chromium: +m[3], webkit: +m[4] }, dark: { chromium: +m[5], webkit: +m[6] } }));
  return { opacity: op ? +op[1] : null, statistic: op ? `worst of ${op[2]}` : null, rows };
}
const tier2 = (src: string) => { const i = src.indexOf(".game-cell:has(input:focus-visible) .cell-ghost-path {");
  const m = src.slice(i, src.indexOf("}", i)).match(/stroke-opacity:\s*([\d.]+)/); return m ? +m[1] : null; };

test("G-ABS-5 · the ledger is true at the opacity it names, and reds when that opacity moves", async ({ page }, info) => {
  const engine = info.project.name as "chromium" | "webkit";
  const css = fs.readFileSync(`${FE}/src/assets/index.css`, "utf8"); const cell = fs.readFileSync(`${FE}/src/games/shared/gameCell.css`, "utf8");
  const L = ledger(css); const srcOp = tier2(cell); const mutatedOp = tier2(cell.replace(/(cell-ghost-path \{[^}]*stroke-opacity:\s*)0\.95/, "$10.9"));
  const out: Record<string, unknown> = { engine, ledger: L, sourceOpacity: srcOp, arms: {} };
  const where = { "16×16": { sub: 4, n: 256, frame: 0, paper: 1 }, "9×9": { sub: 3, n: 81, frame: -1, paper: 0 } } as const;
  for (const arm of [{ name: "shipped", css: "" }, { name: "ablated-0.9", css: `.game-cell:has(input:focus-visible) .cell-ghost-path{stroke-opacity:.9!important}` }]) {
    const rows: Record<string, unknown>[] = []; let computedOps = new Set<string>();
    for (const board of ["16×16", "9×9"] as const) {
      const w = where[board];
      await page.goto(`/?size=${w.sub}&board=${mintSudoku(w.sub)}`);
      await expect.poll(() => page.locator(".board-shell .game-cell").count(), { timeout: 120000 }).toBe(w.n);
      await page.waitForTimeout(900); // the board settles; run 2 chromium read a cell list mid-mount
      for (const theme of ["light", "dark"] as const) {
        await setTheme(page, theme); await page.waitForTimeout(300);
        for (const on of ["paper", "frame"] as const) {
          const idx = w[on]; if (idx < 0) continue;
          const r = await readRing(page, idx, arm.css); computedOps.add(r.strokeOpacity);
          const want = L.rows.find((x) => x.board === board && x.on === on)?.[theme][engine] ?? null;
          const delta = want === null || r.worst === null ? null : +(r.worst - want).toFixed(3);
          rows.push({ board, on, theme, painted: r.worst, median: r.median, ground: r.ground, ledger: want, delta, ok: delta !== null && Math.abs(delta) <= TOL });
        }
      }
    }
    const a = L.opacity !== null && L.opacity === srcOp && [...computedOps].every((o) => +o === L.opacity);
    const b = rows.length > 0 && rows.every((r) => r.ok);
    (out.arms as Record<string, unknown>)[arm.name] = { opacityClause: a, paintClause: b, verdict: a && b ? "GREEN" : "RED", computedOps: [...computedOps], rows };
    console.log(`[G-ABS-5 ${engine} ${arm.name}] opacity ${a ? "GREEN" : "RED"} (ledger ${L.opacity}, source ${srcOp}, computed ${[...computedOps]}) · paint ${b ? "GREEN" : "RED"}`);
    for (const r of rows) console.log(`   ${r.board} ${r.on} ${r.theme}: painted ${r.painted} ledger ${r.ledger} delta ${r.delta} ${r.ok ? "ok" : "RED"}`);
  }
  const sourceNeg = L.opacity !== null && L.opacity === mutatedOp;
  out.sourceTextNegative = { mutatedOpacity: mutatedOp, opacityClause: sourceNeg ? "GREEN (gate cannot fail!)" : "RED as required" };
  console.log(`[G-ABS-5 ${engine}] source-text negative control (tier 2 -> 0.9): ${sourceNeg ? "GREEN — VACUOUS" : "RED as required"}`);
  bank(`gabs5-${engine}`, out);
  const arms = out.arms as Record<string, { verdict: string; opacityClause: boolean; paintClause: boolean }>;
  expect(arms["shipped"].verdict, "G-ABS-5 on the tree").toBe("GREEN");
  expect(arms["ablated-0.9"].opacityClause, "born-RED: opacity clause under 0.9").toBe(false);
  expect(arms["ablated-0.9"].paintClause, "born-RED: paint clause under 0.9").toBe(false);
  expect(sourceNeg, "born-RED: source-text clause").toBe(false);
});
