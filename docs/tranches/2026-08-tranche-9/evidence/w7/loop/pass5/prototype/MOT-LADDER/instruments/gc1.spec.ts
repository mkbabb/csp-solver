import { test } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
import { PINNED_URL, PAYLOAD } from "./board";

const OUT =
  "/Users/mkbabb/Programming/csc411/CSC411_HW2_ProgrammingQuestion/docs/tranches/2026-08-tranche-9/evidence/w7/loop/pass5/prototype/MOT-LADDER/readings";
mkdirSync(OUT, { recursive: true });
const ARMS = [
  ["tree", process.env.PW_AFTER ?? "http://127.0.0.1:4246"],
  ["control-74a2b5d9", process.env.PW_CONTROL ?? "http://127.0.0.1:4237"],
  ...(process.env.PW_MAIN ? [["main-1e6cfbbf", process.env.PW_MAIN]] : []),
] as const;

/**
 * GC1's ablation (INTAKE row 42): on a DECLARING host (the live face's mount, which App writes
 * `--live-fit` onto inline), strip the inline fit and read what the face paints. Registered at
 * `initial-value: 0`, the board is scaled to nothing — a visible failure a gate can see. With the
 * `var(--live-fit, 1)` fallback (the control, main) the full board spills out of the face.
 * `elementFromPoint` at the face's centre + the painted board box, not a computed value alone.
 */
test("gc1 · strip the inline fit on the declaring host", async ({ browser, browserName }) => {
  test.setTimeout(240000);
  const rows: unknown[] = [];
  for (const [arm, base] of ARMS) {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const p = await ctx.newPage();
    await p.goto(base + PINNED_URL);
    await p.locator(".board-cells").first().waitFor();
    await p.waitForTimeout(1500);
    await p.locator("button.logo-trigger").first().click();
    await p.locator(".live-face-fit").first().waitFor();
    await p.waitForTimeout(2200);
    const read = () =>
      p.evaluate(() => {
        const fit = document.querySelector(".live-face-fit") as HTMLElement;
        const slot = fit.parentElement!.getBoundingClientRect();
        const b = (document.querySelector(".board-peek-host") as HTMLElement).getBoundingClientRect();
        const hit = document.elementFromPoint(slot.left + slot.width / 2, slot.top + slot.height / 2);
        return {
          inline: fit.style.getPropertyValue("--live-fit"),
          computed: getComputedStyle(fit).getPropertyValue("--live-fit").trim(),
          transform: getComputedStyle(fit).transform,
          board: { w: +b.width.toFixed(1), h: +b.height.toFixed(1) },
          slot: { w: +slot.width.toFixed(1), h: +slot.height.toFixed(1) },
          boardPaintsAtCentre: !!hit?.closest(".board-peek-host"),
        };
      });
    const before = await read();
    await p.evaluate(() => (document.querySelector(".live-face-fit") as HTMLElement).style.removeProperty("--live-fit"));
    await p.waitForTimeout(300);
    const ablated = await read();
    rows.push({ browserName, arm, payload: PAYLOAD, before, ablated });
    console.log(`gc1 ${browserName} ${arm}: before board ${before.board.w}x${before.board.h} in slot ${before.slot.w} (fit ${before.inline}) | ablated computed '${ablated.computed}' board ${ablated.board.w}x${ablated.board.h} paintsAtCentre ${ablated.boardPaintsAtCentre}`);
    await ctx.close();
  }
  writeFileSync(`${OUT}/gc1-${browserName}.json`, JSON.stringify(rows, null, 1) + "\n");
});
