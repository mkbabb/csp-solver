/** T9-W7 pass 5 · MRK-ABS — charter rows 6 and 7: the tab (law 39's dashed form and the PROPOSED
 *  token form) and the deck's centre card, each read FIVE times on unchanged code, in the default
 *  regime and with the boil PARKED (prefers-reduced-motion: reduce — pencil-boil's central PRM
 *  enforcement), both themes. The spread is the row; a worst sample that moves more than the gap
 *  between two forms cannot rank them. */
import { test, expect } from "@playwright/test";
import { bank, mintSudoku, setTheme, inject } from "./abs-lib";
import { bandStop } from "./chrome-lib";
const BASE = process.env.BASE ?? "http://127.0.0.1:4239"; const N = 5;
const TOKEN = `.drawer-tab:focus-visible{outline:2px solid var(--ring-ink)!important;outline-offset:var(--focus-offset)!important}`;
test("spread · tab x2 forms · deck card · default vs parked", async ({ browser }, info) => {
  test.setTimeout(1500000);
  const engine = info.project.name; const rows: Record<string, unknown>[] = [];
  for (const regime of ["default", "parked"] as const) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, reducedMotion: regime === "parked" ? "reduce" : "no-preference" });
    const page = await ctx.newPage();
    for (const theme of ["light", "dark"] as const) {
      await page.goto(`${BASE}/?size=3&board=${mintSudoku(3)}`);
      await expect.poll(() => page.locator(".board-shell .game-cell").count(), { timeout: 60000 }).toBe(81);
      await setTheme(page, theme);
      for (const form of ["law39-dashed", "token-PROPOSED"]) {
        await inject(page, form === "token-PROPOSED" ? TOKEN : "", "abs-tab");
        for (let k = 0; k < N; k++) { const b = await bandStop(page, "button.drawer-tab", 0); const c = b.core as { worst: number; median: number; fracUnder3: number } | undefined;
          rows.push({ engine, regime, theme, subject: `tab ${form}`, rep: k, worst: c?.worst ?? null, median: c?.median ?? null, fracUnder3: c?.fracUnder3 ?? null, side: b.worstSide, owner: b.groundOwner, sens: b.sensitivity }); }
        await inject(page, "", "abs-tab");
      }
      await page.goto(`${BASE}/?view=gallery&size=3&board=${mintSudoku(3)}`);
      await page.waitForSelector(".staging-band", { timeout: 30000 }); await page.waitForTimeout(900); await setTheme(page, theme);
      for (let k = 0; k < N; k++) { const b = await bandStop(page, "div.gallery-viewport", 0); const c = b.core as { worst: number; median: number; fracUnder3: number } | undefined;
        rows.push({ engine, regime, theme, subject: "deck centre card", rep: k, worst: c?.worst ?? null, median: c?.median ?? null, fracUnder3: c?.fracUnder3 ?? null, lines: b.lines, side: b.worstSide, owner: b.groundOwner, ground: b.worstGround, sens: b.sensitivity }); }
    }
    await ctx.close();
  }
  const summary: Record<string, unknown> = {};
  for (const r of rows) { const k = `${r.regime} ${r.theme} ${r.subject}`; const s = (summary[k] ??= { worst: [] as number[], median: [] as number[], f3: [] as number[] }) as { worst: number[]; median: number[]; f3: number[] };
    s.worst.push(r.worst as number); s.median.push(r.median as number); s.f3.push(r.fracUnder3 as number); }
  for (const [k, s] of Object.entries(summary) as [string, { worst: number[]; median: number[]; f3: number[] }][]) {
    const w = s.worst.filter((x) => x !== null); console.log(`SPREAD ${engine} ${k}: worst ${Math.min(...w)}–${Math.max(...w)} (${w.join(", ")}) · median ${s.median.join(", ")} · f<3 ${s.f3.join(", ")}`); }
  bank(`spread-${engine}`, { base: BASE, payload9: mintSudoku(3), rows });
});
